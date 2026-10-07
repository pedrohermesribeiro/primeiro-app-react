import {
  lembretesPermitidosParaPrazo,
  normalizarLembretes,
  type TipoLembretePrazo,
} from '@/domain/lembrete/LembretesTarefa';
import {
  normalizarPrazoComHorario,
  validarPrazoArmazenado,
  validarPrazoOpcionalArmazenado,
} from '@/domain/prazo/PrazoTarefa';
import { normalizarTextoEntrada } from '@/domain/validacao/textoEntrada';

export type { TipoLembretePrazo };

export type StatusTarefa = 'pendente' | 'concluida' | 'arquivada';

export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export const PRIORIDADE_PADRAO: PrioridadeTarefa = 'baixa';

export const PRIORIDADES_TAREFA: PrioridadeTarefa[] = ['baixa', 'media', 'alta'];

export const MAX_TITULO_TAREFA = 60;

export type Tarefa = {
  id: string;
  titulo: string;
  categoriaId: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  prazo?: string;
  lembretes?: TipoLembretePrazo[];
};

export function normalizarPrioridade(valor?: string): PrioridadeTarefa {
  if (valor === 'baixa' || valor === 'media' || valor === 'alta') {
    return valor;
  }
  return PRIORIDADE_PADRAO;
}

export function validarPrioridade(valor: string): PrioridadeTarefa {
  const normalizado = valor.trim().toLowerCase();
  if (normalizado === 'baixa' || normalizado === 'media' || normalizado === 'alta') {
    return normalizado;
  }
  throw new Error('Prioridade inválida.');
}

export function rotuloPrioridade(prioridade: PrioridadeTarefa): string {
  const rotulos: Record<PrioridadeTarefa, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
  };
  return rotulos[prioridade];
}

/** Fallback local quando `crypto.randomUUID` não existe (não é segredo nem token). */
function randomUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function criarTarefaId(): string {
  const webCrypto = globalThis.crypto;
  if (webCrypto && typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  return randomUuidV4();
}

export function podeConcluir(tarefa: Tarefa): boolean {
  return tarefa.status === 'pendente';
}

export function podeArquivar(tarefa: Tarefa): boolean {
  return tarefa.status === 'pendente' || tarefa.status === 'concluida';
}

export function podeExcluir(tarefa: Tarefa): boolean {
  return (
    tarefa.status === 'pendente' ||
    tarefa.status === 'concluida' ||
    tarefa.status === 'arquivada'
  );
}

/** @deprecated Preferir `podeExcluir` — mantido por compatibilidade. */
export function podeExcluirDefinitivamente(tarefa: Tarefa): boolean {
  return podeExcluir(tarefa);
}

export function isTarefaAtiva(tarefa: Tarefa): boolean {
  return tarefa.status !== 'arquivada';
}

export function podeExcluirAtiva(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

export function podeRestaurar(tarefa: Tarefa): boolean {
  return tarefa.status === 'arquivada';
}

export function podeAlterarPrazo(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

export function podeEditarTarefa(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

export function validarTituloTarefa(titulo: string): string {
  const normalizado = normalizarTextoEntrada(titulo);
  if (!normalizado) {
    throw new Error('O título é obrigatório.');
  }
  if (normalizado.length > MAX_TITULO_TAREFA) {
    throw new Error(`O título deve ter no máximo ${MAX_TITULO_TAREFA} caracteres.`);
  }
  return normalizado;
}

export function validarCategoriaId(categoriaId: string): string {
  const id = normalizarTextoEntrada(categoriaId);
  if (!id) {
    throw new Error('A categoria é obrigatória.');
  }
  if (id.length > 64 || !/^[a-z0-9-]+$/i.test(id)) {
    throw new Error('Categoria inválida.');
  }
  return id.toLowerCase();
}

/** Prazo vazio → `undefined`; caso contrário `AAAA-MM-DD` ou `AAAA-MM-DDTHH:mm` (local). */
export function validarPrazoOpcional(prazo?: string): string | undefined {
  const base = validarPrazoOpcionalArmazenado(prazo);
  if (!base) {
    return undefined;
  }
  return normalizarPrazoComHorario(base);
}

export function validarPrazoIso(prazo: string): string {
  return validarPrazoArmazenado(prazo.trim());
}

export function validarLembretesOpcional(
  lembretes: unknown,
  prazo?: string,
): TipoLembretePrazo[] {
  const normalizados = normalizarLembretes(lembretes);
  if (normalizados.length === 0) {
    return [];
  }
  if (!lembretesPermitidosParaPrazo(prazo)) {
    throw new Error('Lembretes exigem prazo com horário definido.');
  }
  return normalizados;
}

export function aplicarLembretesEntrada(
  tarefa: Tarefa,
  lembretes: TipoLembretePrazo[],
): Tarefa {
  const validos = validarLembretesOpcional(lembretes, tarefa.prazo);
  if (validos.length === 0) {
    const { lembretes: _removido, ...semLembretes } = tarefa;
    return semLembretes;
  }
  return { ...tarefa, lembretes: validos };
}

export function aplicarPrazoEntrada(tarefa: Tarefa, prazo: string): Tarefa {
  const trimmed = prazo.trim();
  if (!trimmed) {
    const { prazo: _removido, lembretes: _lembretes, ...semPrazo } = tarefa;
    return semPrazo;
  }
  const iso = validarPrazoOpcional(trimmed);
  if (!iso) {
    const { prazo: _removido, lembretes: _lembretes, ...semPrazo } = tarefa;
    return semPrazo;
  }
  const comPrazo = { ...tarefa, prazo: iso };
  if (comPrazo.lembretes?.length && !lembretesPermitidosParaPrazo(iso)) {
    const { lembretes: _l, ...semLembretes } = comPrazo;
    return semLembretes;
  }
  return comPrazo;
}
