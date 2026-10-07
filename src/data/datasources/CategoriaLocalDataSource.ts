import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import {
  extrairCategoriaPersistida,
  validarCategoriasParaSubstituicao,
} from '@/data/persistencia/categoriaPersistida';
import { parseJsonSeguro, valorComoArray } from '@/data/persistencia/jsonSeguro';
import type { Categoria } from '@/domain/entities/Categoria';

const CHAVE = 'gta:categorias';

export class CategoriaLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async getAll(): Promise<Categoria[]> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }

    const parsed = parseJsonSeguro(bruto);
    if (parsed === undefined) {
      return [];
    }

    const itens = valorComoArray(parsed);
    const categorias: Categoria[] = [];
    for (const item of itens) {
      const categoria = extrairCategoriaPersistida(item);
      if (categoria) {
        categorias.push(categoria);
      }
    }

    if (itens.length !== categorias.length) {
      await this.setAll(categorias);
    }

    return categorias;
  }

  async setAll(categorias: Categoria[]): Promise<void> {
    const validadas = validarCategoriasParaSubstituicao(categorias);
    await this.storage.setItem(CHAVE, JSON.stringify(validadas));
  }
}
