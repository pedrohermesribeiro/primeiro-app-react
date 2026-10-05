import { ExcluirCategoria } from '@/application/usecases/ExcluirCategoria';
import { CATEGORIAS_PADRAO, type Categoria } from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

function repos(categorias: Categoria[], tarefas: Tarefa[] = []) {
  const state = {
    categorias: [...categorias],
    tarefas: [...tarefas],
  };
  const cat: CategoriaRepository = {
    listar: async () => state.categorias,
    substituirTodas: async (lista) => {
      state.categorias = lista;
    },
  };
  const tar: TarefaRepository = {
    listar: async () => state.tarefas,
    buscarPorId: async (id) => state.tarefas.find((t) => t.id === id) ?? null,
    salvar: async () => {},
    substituirTodas: async (lista) => {
      state.tarefas = lista;
    },
    excluir: async () => {},
  };
  return { cat, tar, state };
}

describe('ExcluirCategoria', () => {
  it('exclui categoria e realoca tarefas para outros', async () => {
    const categorias = [...CATEGORIAS_PADRAO];
    const tarefas: Tarefa[] = [
      {
        id: '1',
        titulo: 'T',
        categoriaId: 'estudos',
        status: 'pendente',
        prioridade: 'baixa',
      },
    ];
    const { cat, tar, state } = repos(categorias, tarefas);

    await new ExcluirCategoria(cat, tar).executar('estudos');

    expect(state.categorias.some((c) => c.id === 'estudos')).toBe(false);
    expect(state.tarefas[0]?.categoriaId).toBe('outros');
  });

  it('bloqueia exclusão no mínimo de 4 categorias', async () => {
    const categorias: Categoria[] = CATEGORIAS_PADRAO.slice(0, 4);
    const { cat, tar } = repos(categorias);

    await expect(new ExcluirCategoria(cat, tar).executar('estudos')).rejects.toThrow(
      'pelo menos 4',
    );
  });

  it('exclui outros e realoca para primeira categoria restante', async () => {
    const categorias = [...CATEGORIAS_PADRAO];
    const tarefas: Tarefa[] = [
      {
        id: '1',
        titulo: 'T',
        categoriaId: 'outros',
        status: 'pendente',
        prioridade: 'baixa',
      },
    ];
    const { cat, tar, state } = repos(categorias, tarefas);

    await new ExcluirCategoria(cat, tar).executar('outros');

    expect(state.categorias.some((c) => c.id === 'outros')).toBe(false);
    expect(state.tarefas[0]?.categoriaId).toBe('estudos');
  });

  it('rejeita categoria inexistente', async () => {
    const { cat, tar } = repos([...CATEGORIAS_PADRAO]);

    await expect(new ExcluirCategoria(cat, tar).executar('inexistente')).rejects.toThrow(
      'não encontrada',
    );
  });
});
