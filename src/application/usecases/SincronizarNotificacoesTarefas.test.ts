import { SincronizarNotificacoesTarefas } from '@/application/usecases/SincronizarNotificacoesTarefas';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('SincronizarNotificacoesTarefas', () => {
  const agora = new Date(2026, 5, 1, 10, 0, 0, 0);

  function criarPort(overrides: Partial<NotificacaoTarefaPort> = {}): NotificacaoTarefaPort {
    return {
      permissoesConcedidas: async () => true,
      solicitarPermissao: async () => true,
      listarIdsComPrefixo: async () => ['gta-tarefa-antiga', 'gta-tarefa-futura-no_horario'],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
      ...overrides,
    };
  }

  it('não faz nada se permissão negada', async () => {
    const agendar = jest.fn();
    const port = criarPort({
      permissoesConcedidas: async () => false,
      agendar,
    });
    const repo: TarefaRepository = {
      listar: async () => [],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    await new SincronizarNotificacoesTarefas(repo, port).executar(agora);
    expect(agendar).not.toHaveBeenCalled();
  });

  it('agenda lembretes marcados, cancela órfãos e ignora sem lembrete', async () => {
    const agendar = jest.fn();
    const cancelar = jest.fn();
    const port = criarPort({ agendar, cancelarPorIdentificador: cancelar });

    const repo: TarefaRepository = {
      listar: async () => [
        {
          id: 'futura',
          titulo: 'Ok',
          categoriaId: 'c1',
          status: 'pendente',
          prioridade: 'media',
          prazo: '2030-01-01T12:00',
          lembretes: ['no_horario', '1h_antes'],
        },
        {
          id: 'sem-lembrete',
          titulo: 'Não',
          categoriaId: 'c1',
          status: 'pendente',
          prioridade: 'baixa',
          prazo: '2030-01-01T12:00',
        },
        {
          id: 'concluida',
          titulo: 'Não',
          categoriaId: 'c1',
          status: 'concluida',
          prioridade: 'baixa',
          prazo: '2030-01-01T12:00',
          lembretes: ['no_horario'],
        },
      ],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    await new SincronizarNotificacoesTarefas(repo, port).executar(agora);

    expect(agendar).toHaveBeenCalledTimes(2);
    expect(agendar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'gta-tarefa-futura-no_horario',
        triggerDate: new Date(2030, 0, 1, 12, 0, 0, 0),
      }),
    );
    expect(agendar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'gta-tarefa-futura-1h_antes',
        triggerDate: new Date(2030, 0, 1, 11, 0, 0, 0),
      }),
    );
    expect(cancelar).toHaveBeenCalledWith('gta-tarefa-antiga');
    expect(cancelar).not.toHaveBeenCalledWith('gta-tarefa-futura-no_horario');
  });
});
