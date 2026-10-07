import { ListarCategorias } from '@/application/usecases/ListarCategorias';
import type { Categoria } from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';

describe('ListarCategorias', () => {
  it('delega listagem ao repositório de categorias', async () => {
    const categorias: Categoria[] = [{ id: 'estudos', nome: 'Estudos' }];
    const repo: CategoriaRepository = {
      listar: async () => categorias,
      substituirTodas: async () => {},
    };

    await expect(new ListarCategorias(repo).executar()).resolves.toEqual(categorias);
  });
});
