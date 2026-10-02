import type { Categoria } from '@/domain/entities/Categoria';

export interface CategoriaRepository {
  listar(): Promise<Categoria[]>;
  substituirTodas(categorias: Categoria[]): Promise<void>;
}
