import { AlterarPrazoTarefa } from '@/application/usecases/AlterarPrazoTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('AlterarPrazoTarefa', () => {
  it('altera prazo de tarefa ativa', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'pendente',
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

    const result = await new AlterarPrazoTarefa(repo).executar({
      id: 'p1',
      prazo: '2026-06-15',
    });

    expect(result.prazo).toBe('2026-06-15');
    expect(result.status).toBe('pendente');
    expect(salva?.prazo).toBe('2026-06-15');
  });

  it('rejeita tarefa arquivada', async () => {
    const tarefa: Tarefa = {
      id: 'a1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'arquivada',
    };
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      excluir: async () => {},
    };

    await expect(
      new AlterarPrazoTarefa(repo).executar({ id: 'a1', prazo: '2026-01-01' }),
    ).rejects.toThrow('ativas');
  });
});
