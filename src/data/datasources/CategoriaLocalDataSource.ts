import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import type { Categoria } from '@/domain/entities/Categoria';

const CHAVE = 'gta:categorias';

export class CategoriaLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async getAll(): Promise<Categoria[]> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }
    return JSON.parse(bruto) as Categoria[];
  }

  async setAll(categorias: Categoria[]): Promise<void> {
    await this.storage.setItem(CHAVE, JSON.stringify(categorias));
  }
}
