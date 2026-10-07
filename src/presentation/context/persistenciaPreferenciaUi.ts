/** Persist-first: só aplica estado da UI após gravação bem-sucedida. */
export async function persistirPreferenciaUi<T>(
  persistir: (valor: T) => Promise<void>,
  aplicarEstado: (valor: T) => void,
  valor: T,
): Promise<void> {
  await persistir(valor);
  aplicarEstado(valor);
}
