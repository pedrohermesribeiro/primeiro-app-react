/** Remove caracteres de controle (sem executar HTML/código). */
export function normalizarTextoEntrada(texto: string): string {
  return texto.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}
