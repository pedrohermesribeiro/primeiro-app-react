import type { PrioridadeTarefa, StatusTarefa, Tarefa } from '@/domain/entities/Tarefa';

export type TipoFiltroPrazo = 'atrasadas' | 'hoje' | 'esta_semana' | 'este_mes';

export type FiltrosTarefa = {
  prioridades: PrioridadeTarefa[];
  statuses: StatusTarefa[];
  prazos: TipoFiltroPrazo[];
};

export const STATUS_TODOS_FILTRO: StatusTarefa[] = ['pendente', 'concluida', 'arquivada'];

const PRIORIDADES_VALIDAS = new Set<PrioridadeTarefa>(['baixa', 'media', 'alta']);
const STATUS_VALIDOS = new Set<StatusTarefa>(['pendente', 'concluida', 'arquivada']);
const PRAZOS_VALIDOS = new Set<TipoFiltroPrazo>(['atrasadas', 'hoje', 'esta_semana', 'este_mes']);

export function filtrosPadrao(): FiltrosTarefa {
  return {
    prioridades: [],
    statuses: ['pendente', 'concluida'],
    prazos: [],
  };
}

export function normalizarFiltrosTarefa(raw: unknown): FiltrosTarefa {
  if (!raw || typeof raw !== 'object') {
    return filtrosPadrao();
  }
  const obj = raw as Record<string, unknown>;
  const prioridades = Array.isArray(obj.prioridades)
    ? obj.prioridades.filter((p): p is PrioridadeTarefa => PRIORIDADES_VALIDAS.has(p as PrioridadeTarefa))
    : [];
  const statuses = Array.isArray(obj.statuses)
    ? obj.statuses.filter((s): s is StatusTarefa => STATUS_VALIDOS.has(s as StatusTarefa))
    : filtrosPadrao().statuses;
  const prazos = Array.isArray(obj.prazos)
    ? obj.prazos.filter((p): p is TipoFiltroPrazo => PRAZOS_VALIDOS.has(p as TipoFiltroPrazo))
    : [];

  if (statuses.length === 0) {
    return filtrosPadrao();
  }

  return { prioridades, statuses, prazos };
}

export function statusesIguaisTodos(statuses: StatusTarefa[]): boolean {
  if (statuses.length !== STATUS_TODOS_FILTRO.length) {
    return false;
  }
  const set = new Set(statuses);
  return STATUS_TODOS_FILTRO.every((s) => set.has(s));
}

function ordenarCopia<T extends string>(valores: T[]): T[] {
  return [...valores].sort();
}

export function normalizarOrdemFiltros(filtros: FiltrosTarefa): FiltrosTarefa {
  return {
    prioridades: ordenarCopia(filtros.prioridades),
    statuses: ordenarCopia(filtros.statuses),
    prazos: ordenarCopia(filtros.prazos),
  };
}

function arraysIguais<T extends string>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((valor, index) => valor === b[index]);
}

export function filtrosIguais(a: FiltrosTarefa, b: FiltrosTarefa): boolean {
  const na = normalizarOrdemFiltros(a);
  const nb = normalizarOrdemFiltros(b);
  return (
    arraysIguais(na.prioridades, nb.prioridades) &&
    arraysIguais(na.statuses, nb.statuses) &&
    arraysIguais(na.prazos, nb.prazos)
  );
}

export function filtrosDiferentesDoPadrao(filtros: FiltrosTarefa): boolean {
  return !filtrosIguais(filtros, filtrosPadrao());
}

function parseIsoParaDataLocal(iso: string): Date {
  const [anoStr, mesStr, diaStr] = iso.split('-');
  return new Date(Number(anoStr), Number(mesStr) - 1, Number(diaStr));
}

function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

/** Semana começa na segunda-feira (calendário local). */
function intervaloSemana(ref: Date): { inicio: Date; fim: Date } {
  const dia = inicioDoDia(ref);
  const dow = dia.getDay();
  const diffSegunda = dow === 0 ? -6 : 1 - dow;
  const inicio = new Date(dia);
  inicio.setDate(dia.getDate() + diffSegunda);
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  return { inicio, fim };
}

export function isTarefaAtrasada(tarefa: Tarefa, refDate: Date = new Date()): boolean {
  if (tarefa.status !== 'pendente' || !tarefa.prazo) {
    return false;
  }
  return parseIsoParaDataLocal(tarefa.prazo) < inicioDoDia(refDate);
}

export function prazoCaiEmFiltro(
  tarefa: Tarefa,
  tipo: TipoFiltroPrazo,
  refDate: Date = new Date(),
): boolean {
  if (!tarefa.prazo) {
    return false;
  }
  const prazo = parseIsoParaDataLocal(tarefa.prazo);
  const ref = inicioDoDia(refDate);

  switch (tipo) {
    case 'atrasadas':
      return isTarefaAtrasada(tarefa, refDate);
    case 'hoje':
      return (
        prazo.getFullYear() === ref.getFullYear() &&
        prazo.getMonth() === ref.getMonth() &&
        prazo.getDate() === ref.getDate()
      );
    case 'esta_semana': {
      const { inicio, fim } = intervaloSemana(refDate);
      return prazo >= inicio && prazo <= fim;
    }
    case 'este_mes':
      return prazo.getFullYear() === ref.getFullYear() && prazo.getMonth() === ref.getMonth();
    default:
      return false;
  }
}

function passaFiltroPrazo(tarefa: Tarefa, prazos: TipoFiltroPrazo[], refDate: Date): boolean {
  if (prazos.length === 0) {
    return true;
  }
  return prazos.some((tipo) => prazoCaiEmFiltro(tarefa, tipo, refDate));
}

export function aplicarFiltrosTarefas(
  tarefas: Tarefa[],
  filtros: FiltrosTarefa,
  refDate: Date = new Date(),
): Tarefa[] {
  return tarefas.filter((tarefa) => {
    if (filtros.statuses.length > 0 && !filtros.statuses.includes(tarefa.status)) {
      return false;
    }
    if (filtros.prioridades.length > 0 && !filtros.prioridades.includes(tarefa.prioridade)) {
      return false;
    }
    if (!passaFiltroPrazo(tarefa, filtros.prazos, refDate)) {
      return false;
    }
    return true;
  });
}
