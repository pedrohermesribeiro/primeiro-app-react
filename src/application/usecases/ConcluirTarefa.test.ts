import { ConcluirTarefa } from '@/application/usecases/ConcluirTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

function criarRepo(tarefa: Tarefa | null): TarefaRepository {
  return {
    listar: async () => (tarefa ? [tarefa] : []),
    buscarPorId: async () => tarefa,
    salvar: async () => {},
    substituirTodas: async () => {},
    excluir: async () => {},
  };
}

describe('ConcluirTarefa', () => {
  it('conclui tarefa pendente', async () => {
    const tarefa: Tarefa = {
      id: 'x',
      titulo: 'T',
      categoriaId: 'estudos',
      status: 'pendente',
      prioridade: 'alta',
    };
    let salva: Tarefa | undefined;
    const repo: TarefaRepository = {
      ...criarRepo(tarefa),
      salvar: async (t) => {
        salva = t;
      },
    };

    const resultado = await new ConcluirTarefa(repo).executar('x');

    expect(resultado.status).toBe('concluida');
    expect(salva?.status).toBe('concluida');
    expect(salva?.prioridade).toBe('alta');
  });

  it('rejeita se ja concluida', async () => {
    const tarefa: Tarefa = {
      id: 'x',
      titulo: 'T',
      categoriaId: 'estudos',
      status: 'concluida',
      prioridade: 'baixa',
    };
    await expect(new ConcluirTarefa(criarRepo(tarefa)).executar('x')).rejects.toThrow(
      'pendentes',
    );
  });
});
