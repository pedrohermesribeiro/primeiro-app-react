import { EditarTarefa } from '@/application/usecases/EditarTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('EditarTarefa', () => {
  it('edita titulo, categoria e prazo de tarefa ativa', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'Antiga',
      categoriaId: 'outros',
      status: 'pendente',
      prioridade: 'baixa',
    };
    let salva: Tarefa | null = null;
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async (t) => {
        salva = t;
      },
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const result = await new EditarTarefa(repo).executar({
      id: 'p1',
      titulo: '  Nova  ',
      categoriaId: 'estudos',
      prazo: '2026-06-15',
      prioridade: 'alta',
    });

    expect(result.titulo).toBe('Nova');
    expect(result.categoriaId).toBe('estudos');
    expect(result.prazo).toBe('2026-06-15T08:00');
    expect(result.prioridade).toBe('alta');
    expect(salva?.titulo).toBe('Nova');
  });

  it('persiste lembretes com prazo datetime', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'pendente',
      prioridade: 'baixa',
    };
    let salva: Tarefa | null = null;
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async (t) => {
        salva = t;
      },
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const result = await new EditarTarefa(repo).executar({
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      prazo: '2030-01-01T10:00',
      prioridade: 'baixa',
      lembretes: ['no_horario', '1h_antes'],
    });

    expect(result.lembretes).toEqual(['no_horario', '1h_antes']);
    expect(salva?.lembretes).toEqual(['no_horario', '1h_antes']);
  });

  it('rejeita lembretes sem prazo', async () => {
    const tarefa: Tarefa = {
      id: 'p1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'pendente',
      prioridade: 'baixa',
    };
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    await expect(
      new EditarTarefa(repo).executar({
        id: 'p1',
        titulo: 'T',
        categoriaId: 'outros',
        prazo: '',
        prioridade: 'baixa',
        lembretes: ['no_horario'],
      }),
    ).rejects.toThrow('Lembretes exigem prazo com horário definido.');
  });

  it('rejeita tarefa arquivada', async () => {
    const tarefa: Tarefa = {
      id: 'a1',
      titulo: 'T',
      categoriaId: 'outros',
      status: 'arquivada',
      prioridade: 'baixa',
    };
    const repo: TarefaRepository = {
      listar: async () => [tarefa],
      buscarPorId: async () => tarefa,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    await expect(
      new EditarTarefa(repo).executar({
        id: 'a1',
        titulo: 'X',
        categoriaId: 'outros',
        prazo: '',
        prioridade: 'baixa',
      }),
    ).rejects.toThrow('ativas');
  });
});
