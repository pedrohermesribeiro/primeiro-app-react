import type { Categoria } from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';

export class ListarCategorias {
  constructor(private readonly repository: CategoriaRepository) {}

  async executar(): Promise<Categoria[]> {
    return this.repository.listar();
  }
}
