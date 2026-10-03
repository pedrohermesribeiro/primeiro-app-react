import { CATEGORIAS_PADRAO, type Categoria } from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';

import { CategoriaLocalDataSource } from '@/data/datasources/CategoriaLocalDataSource';

export class CategoriaRepositoryImpl implements CategoriaRepository {
  constructor(
    private readonly dataSource: CategoriaLocalDataSource = new CategoriaLocalDataSource(),
  ) {}

  async listar(): Promise<Categoria[]> {
    let categorias = await this.dataSource.getAll();
    if (categorias.length === 0) {
      categorias = [...CATEGORIAS_PADRAO];
      await this.dataSource.setAll(categorias);
    }
    return categorias;
  }

  async substituirTodas(categorias: Categoria[]): Promise<void> {
    await this.dataSource.setAll(categorias);
  }
}
