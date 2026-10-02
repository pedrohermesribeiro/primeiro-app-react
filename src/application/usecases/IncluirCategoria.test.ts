import { IncluirCategoria } from '@/application/usecases/IncluirCategoria';
import { CATEGORIAS_PADRAO, MAX_CATEGORIAS, type Categoria } from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';

function repoCom(categorias: Categoria[]): CategoriaRepository {
  let atual = [...categorias];
  return {
    listar: async () => atual,
    substituirTodas: async (lista) => {
      atual = lista;
    },
  };
}

describe('IncluirCategoria', () => {
  it('inclui nova categoria', async () => {
    const repo = repoCom(CATEGORIAS_PADRAO);
    const nova = await new IncluirCategoria(repo).executar({ nome: 'Viagem' });
    expect(nova.nome).toBe('Viagem');
    expect(nova.id).toBe('viagem');
    const lista = await repo.listar();
    expect(lista).toHaveLength(CATEGORIAS_PADRAO.length + 1);
  });

  it('rejeita acima do limite', async () => {
    const base: Categoria[] = Array.from({ length: MAX_CATEGORIAS }, (_, i) => ({
      id: `cat-${i}`,
      nome: `Cat ${i}`,
    }));
    const repo = repoCom(base);
    await expect(new IncluirCategoria(repo).executar({ nome: 'Extra' })).rejects.toThrow(
      '12 categorias',
    );
  });
});
