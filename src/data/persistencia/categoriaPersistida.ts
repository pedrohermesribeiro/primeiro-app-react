import { type Categoria, validarNomeCategoria } from '@/domain/entities/Categoria';
import { validarCategoriaId } from '@/domain/entities/Tarefa';

import { isRegistro } from '@/data/persistencia/jsonSeguro';

export function extrairCategoriaPersistida(item: unknown): Categoria | null {
  if (!isRegistro(item)) {
    return null;
  }
  if (typeof item.id !== 'string' || typeof item.nome !== 'string') {
    return null;
  }
  try {
    const id = validarCategoriaId(item.id);
    const nome = validarNomeCategoria(item.nome);
    return { id, nome };
  } catch {
    return null;
  }
}

export function validarCategoriaParaSubstituicao(categoria: Categoria): Categoria {
  return {
    id: validarCategoriaId(categoria.id),
    nome: validarNomeCategoria(categoria.nome),
  };
}

export function validarCategoriasParaSubstituicao(categorias: Categoria[]): Categoria[] {
  return categorias.map((c) => validarCategoriaParaSubstituicao(c));
}
