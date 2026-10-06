const PRAZO_SO_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;
const PRAZO_DATA_HORA = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

export type PrazoParseado = {
  date: Date;
  temHora: boolean;
  iso: string;
};

export const HORA_PADRAO_AMANHA = '08:00';
export const HORA_PADRAO_OUTROS_DIAS = '08:00';

function inicioDoDiaLocal(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function formatarHoraMinuto(hora: number, minuto: number): string {
  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
}

/** Hoje: agora + 1h; amanhã: 08:00; demais dias: 08:00. */
export function horaPadraoParaData(dataIso: string, agora: Date = new Date()): string {
  const parsed = parsePrazoLocal(dataIso);
  if (!parsed) {
    return HORA_PADRAO_OUTROS_DIAS;
  }
  const diaPrazo = inicioDoDiaLocal(parsed.date);
  const hoje = inicioDoDiaLocal(agora);
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  if (diaPrazo.getTime() === hoje.getTime()) {
    const plus = new Date(agora.getTime() + 60 * 60 * 1000);
    if (inicioDoDiaLocal(plus).getTime() !== hoje.getTime()) {
      return '23:59';
    }
    return formatarHoraMinuto(plus.getHours(), plus.getMinutes());
  }
  if (diaPrazo.getTime() === amanha.getTime()) {
    return HORA_PADRAO_AMANHA;
  }
  return HORA_PADRAO_OUTROS_DIAS;
}

/** Garante datetime; legado só-data recebe hora pelas regras de calendário. */
export function normalizarPrazoComHorario(prazo: string, agora: Date = new Date()): string {
  const trimmed = prazo.trim();
  if (!trimmed) {
    return '';
  }
  const parsed = parsePrazoLocal(trimmed);
  if (!parsed) {
    return trimmed;
  }
  if (parsed.temHora) {
    return parsed.iso;
  }
  return combinarDataHora(parsed.iso, horaPadraoParaData(parsed.iso, agora));
}

function isDataValida(ano: number, mes: number, dia: number): boolean {
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function montarIsoData(ano: number, mes: number, dia: number): string {
  return `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

export function parsePrazoLocal(prazo: string): PrazoParseado | undefined {
  const trimmed = prazo.trim();
  const matchHora = PRAZO_DATA_HORA.exec(trimmed);
  if (matchHora) {
    const ano = Number(matchHora[1]);
    const mes = Number(matchHora[2]);
    const dia = Number(matchHora[3]);
    const hora = Number(matchHora[4]);
    const minuto = Number(matchHora[5]);
    if (
      !isDataValida(ano, mes, dia) ||
      hora < 0 ||
      hora > 23 ||
      minuto < 0 ||
      minuto > 59
    ) {
      return undefined;
    }
    return {
      date: new Date(ano, mes - 1, dia, hora, minuto, 0, 0),
      temHora: true,
      iso: `${montarIsoData(ano, mes, dia)}T${matchHora[4]}:${matchHora[5]}`,
    };
  }

  const matchData = PRAZO_SO_DATA.exec(trimmed);
  if (matchData) {
    const ano = Number(matchData[1]);
    const mes = Number(matchData[2]);
    const dia = Number(matchData[3]);
    if (!isDataValida(ano, mes, dia)) {
      return undefined;
    }
    return {
      date: new Date(ano, mes - 1, dia),
      temHora: false,
      iso: montarIsoData(ano, mes, dia),
    };
  }

  return undefined;
}

/** Instantâneo para atraso; legado só-data usa hora inferida pelas regras. */
export function instanteComparacaoAtraso(prazo: string, agora: Date = new Date()): Date | undefined {
  const normalizado = normalizarPrazoComHorario(prazo, agora);
  const parsed = parsePrazoLocal(normalizado);
  if (!parsed?.temHora) {
    return undefined;
  }
  return parsed.date;
}

export function parteDataCalendario(prazo: string): Date | undefined {
  const parsed = parsePrazoLocal(prazo);
  if (!parsed) {
    return undefined;
  }
  return new Date(parsed.date.getFullYear(), parsed.date.getMonth(), parsed.date.getDate());
}

export function validarPrazoArmazenado(prazo: string): string {
  const parsed = parsePrazoLocal(prazo);
  if (!parsed) {
    throw new Error('Prazo inválido. Use AAAA-MM-DD ou AAAA-MM-DDTHH:mm.');
  }
  return parsed.iso;
}

export function validarPrazoOpcionalArmazenado(prazo?: string | null): string | undefined {
  if (prazo === undefined || prazo === null) {
    return undefined;
  }
  const trimmed = prazo.trim();
  if (!trimmed) {
    return undefined;
  }
  return validarPrazoArmazenado(trimmed);
}

export function formatarPrazoExibicao(prazo: string, locale = 'pt-BR', agora: Date = new Date()): string {
  const efetivo = normalizarPrazoComHorario(prazo, agora);
  const parsed = parsePrazoLocal(efetivo);
  if (!parsed) {
    return prazo;
  }
  const dataStr = parsed.date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  if (!parsed.temHora) {
    return dataStr;
  }
  const horaStr = parsed.date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${dataStr} ${horaStr}`;
}

export function extrairParteDataIso(prazo: string): string {
  const parsed = parsePrazoLocal(prazo);
  if (!parsed) {
    return prazo.slice(0, 10);
  }
  return parsed.iso.slice(0, 10);
}

export function extrairParteHora(prazo: string, agora: Date = new Date()): string | undefined {
  const parsed = parsePrazoLocal(prazo);
  if (!parsed) {
    return undefined;
  }
  if (parsed.temHora) {
    return formatarHoraMinuto(parsed.date.getHours(), parsed.date.getMinutes());
  }
  return horaPadraoParaData(parsed.iso, agora);
}

export function combinarDataHora(dataIso: string, hora: string): string {
  const dataOk = validarPrazoArmazenado(dataIso);
  const match = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!match) {
    throw new Error('Hora inválida.');
  }
  return `${dataOk}T${match[1]}:${match[2]}`;
}

export function prazoTemHorario(prazo: string): boolean {
  return parsePrazoLocal(prazo)?.temHora ?? false;
}
