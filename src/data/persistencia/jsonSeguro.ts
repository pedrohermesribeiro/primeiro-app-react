/** Parse JSON de storage; retorna `undefined` se a string for inválida. */
export function parseJsonSeguro(bruto: string): unknown | undefined {
  try {
    return JSON.parse(bruto) as unknown;
  } catch {
    return undefined;
  }
}

export function valorComoArray(valor: unknown): unknown[] {
  if (!Array.isArray(valor)) {
    return [];
  }
  return valor;
}

export function isRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}
