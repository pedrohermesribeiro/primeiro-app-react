import { parsePrazoLocal, prazoTemHorario } from '@/domain/prazo/PrazoTarefa';

export type TipoLembretePrazo = 'no_horario' | '1h_antes' | '1_dia_antes';

export const ORDEM_LEMBRETES: TipoLembretePrazo[] = ['no_horario', '1h_antes', '1_dia_antes'];

const LEMBRETES_VALIDOS = new Set<TipoLembretePrazo>(ORDEM_LEMBRETES);

const ROTULOS: Record<TipoLembretePrazo, string> = {
  no_horario: 'No horário',
  '1h_antes': '1h antes',
  '1_dia_antes': '1 dia antes',
};

export function lembretesPadrao(): TipoLembretePrazo[] {
  return [];
}

export function normalizarLembretes(valor: unknown): TipoLembretePrazo[] {
  if (!Array.isArray(valor)) {
    return [];
  }
  const vistos = new Set<TipoLembretePrazo>();
  const resultado: TipoLembretePrazo[] = [];
  for (const item of valor) {
    if (typeof item !== 'string' || !LEMBRETES_VALIDOS.has(item as TipoLembretePrazo)) {
      continue;
    }
    const tipo = item as TipoLembretePrazo;
    if (!vistos.has(tipo)) {
      vistos.add(tipo);
      resultado.push(tipo);
    }
  }
  return ORDEM_LEMBRETES.filter((tipo) => vistos.has(tipo));
}

export function alternarLembrete(
  selecionados: TipoLembretePrazo[],
  opcao: 'nao' | TipoLembretePrazo,
): TipoLembretePrazo[] {
  if (opcao === 'nao') {
    return [];
  }
  const atual = normalizarLembretes(selecionados);
  if (atual.includes(opcao)) {
    return atual.filter((item) => item !== opcao);
  }
  return normalizarLembretes([...atual, opcao]);
}

export function rotuloLembrete(tipo: TipoLembretePrazo): string {
  return ROTULOS[tipo];
}

export function rotuloResumoLembretes(selecionados: TipoLembretePrazo[]): string {
  const lista = normalizarLembretes(selecionados);
  if (lista.length === 0) {
    return 'Não';
  }
  if (lista.length === 1) {
    return rotuloLembrete(lista[0]!);
  }
  const primeiro = rotuloLembrete(lista[0]!);
  return `${primeiro}, +${lista.length - 1}`;
}

export function lembretesPermitidosParaPrazo(prazo?: string): boolean {
  if (!prazo?.trim()) {
    return false;
  }
  return prazoTemHorario(prazo);
}

export function calcularInstanteLembrete(
  prazo: string,
  tipo: TipoLembretePrazo,
): Date | undefined {
  const parsed = parsePrazoLocal(prazo);
  if (!parsed?.temHora) {
    return undefined;
  }
  const base = parsed.date.getTime();
  switch (tipo) {
    case 'no_horario':
      return new Date(base);
    case '1h_antes':
      return new Date(base - 60 * 60 * 1000);
    case '1_dia_antes':
      return new Date(base - 24 * 60 * 60 * 1000);
    default:
      return undefined;
  }
}
