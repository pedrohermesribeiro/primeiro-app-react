import { ExcluirDefinitivamente } from '@/application/usecases/ExcluirDefinitivamente';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('ExcluirDefinitivamente', () => {
  it('exclui tarefa arquivada', async () => {
    const tarefa: Tarefa = {
      id: 'a1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'arquivada',
    };
    let excluido = false;
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      excluir: async () => {
        excluido = true;
      },
    };

    await new ExcluirDefinitivamente(repo).executar('a1');
    expect(excluido).toBe(true);
  });

  it('exclui tarefa pendente', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'pendente',
    };
    let excluido = false;
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      excluir: async () => {
        excluido = true;
      },
    };

    await new ExcluirDefinitivamente(repo).executar('p1');
    expect(excluido).toBe(true);
  });

  it('rejeita quando tarefa nao existe', async () => {
    const repo: TarefaRepository = {
      listar: async () => [],
      buscarPorId: async () => null,
      salvar: async () => {},
      excluir: async () => {},
    };

    await expect(new ExcluirDefinitivamente(repo).executar('x')).rejects.toThrow(
      'não encontrada',
    );
  });
});
