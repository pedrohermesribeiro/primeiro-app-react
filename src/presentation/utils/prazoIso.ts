import {
  combinarDataHora,
  extrairParteDataIso,
  extrairParteHora,
  formatarPrazoExibicao,
  horaPadraoParaData,
  parsePrazoLocal,
} from '@/domain/prazo/PrazoTarefa';

export function dateToIsoLocal(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function isoToDateLocal(iso: string): Date | undefined {
  return parsePrazoLocal(iso)?.date;
}

export { formatarPrazoExibicao };

export function obterDataIsoDoValor(value: string): string {
  if (!value.trim()) {
    return '';
  }
  return extrairParteDataIso(value);
}

export function obterHoraDoValor(value: string, agora: Date = new Date()): string {
  return extrairParteHora(value, agora) ?? horaPadraoParaData(obterDataIsoDoValor(value), agora);
}

export function aplicarDataAoValor(value: string, dataIso: string, agora: Date = new Date()): string {
  if (!dataIso) {
    return '';
  }
  const horaAtual = value.includes('T') ? extrairParteHora(value, agora) : undefined;
  const hora = horaAtual ?? horaPadraoParaData(dataIso, agora);
  return combinarDataHora(dataIso, hora);
}

export function aplicarHoraAoValor(value: string, hora: string): string {
  const dataIso = obterDataIsoDoValor(value);
  if (!dataIso) {
    return '';
  }
  return combinarDataHora(dataIso, hora);
}

export function formatarHoraExibicao(value: string, agora: Date = new Date()): string {
  return obterHoraDoValor(value, agora);
}

export function formatarDataExibicao(value: string): string {
  const data = obterDataIsoDoValor(value);
  if (!data) {
    return 'Data opcional';
  }
  return formatarPrazoExibicao(data);
}
