import { normalizarTextoEntrada } from '@/domain/validacao/textoEntrada';

const MAX_ID = 128;

/** Identificador persistido (tarefa): texto não vazio, sem caracteres de controle. */
export function validarIdArmazenamento(id: string): string {
  const normalizado = normalizarTextoEntrada(id);
  if (!normalizado) {
    throw new Error('Identificador inválido.');
  }
  if (normalizado.length > MAX_ID) {
    throw new Error('Identificador inválido.');
  }
  return normalizado;
}
