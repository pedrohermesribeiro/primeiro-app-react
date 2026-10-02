export function dateToIsoLocal(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function isoToDateLocal(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return undefined;
  }
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarPrazoExibicao(iso: string): string {
  const date = isoToDateLocal(iso);
  if (!date) {
    return iso;
  }
  return date.toLocaleDateString('pt-BR');
}
