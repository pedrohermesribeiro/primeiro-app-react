import { RestaurarTarefa } from '@/application/usecases/RestaurarTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('RestaurarTarefa', () => {
  it('restaura arquivada como pendente e atualiza prazo', async () => {
    const tarefa: Tarefa = {
      id: 'a1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'arquivada',
      prazo: '2026-01-01',
    };
    let salva: Tarefa | null = null;
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async (t) => {
        salva = t;
      },
      excluir: async () => {},
    };

    const result = await new RestaurarTarefa(repo).executar({
      id: 'a1',
      prazo: '2026-12-31',
    });

    expect(result.status).toBe('pendente');
    expect(result.prazo).toBe('2026-12-31');
    expect(salva?.status).toBe('pendente');
  });

  it('rejeita tarefa pendente', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'pendente',
    };
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      excluir: async () => {},
    };

    await expect(
      new RestaurarTarefa(repo).executar({ id: 'p1', prazo: '' }),
    ).rejects.toThrow('arquivadas');
  });
});
