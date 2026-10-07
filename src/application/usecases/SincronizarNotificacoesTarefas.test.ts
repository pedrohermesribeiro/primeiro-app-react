import { SincronizarNotificacoesTarefas } from '@/application/usecases/SincronizarNotificacoesTarefas';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('SincronizarNotificacoesTarefas', () => {
  const agora = new Date(2026, 5, 1, 10, 0, 0, 0);

  function criarPort(overrides: Partial<NotificacaoTarefaPort> = {}): NotificacaoTarefaPort {
    return {
      prepararApresentacaoForeground: async () => {},
      permissoesConcedidas: async () => true,
      solicitarPermissao: async () => true,
      listarIdsComPrefixo: async () => ['gta-tarefa-antiga', 'gta-tarefa-futura-no_horario'],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
      ...overrides,
    };
  }

  it('não agenda se permissão negada', async () => {
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

    const resultado = await new SincronizarNotificacoesTarefas(repo, port).executar(agora);
    expect(agendar).not.toHaveBeenCalled();
    expect(resultado).toEqual({
      agendadosOk: 0,
      falhasAgendamento: 0,
      canceladosOk: 0,
      falhasCancelamento: 0,
    });
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

    const resultado = await new SincronizarNotificacoesTarefas(repo, port).executar(agora);

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
    expect(resultado.agendadosOk).toBe(2);
    expect(resultado.canceladosOk).toBe(1);
  });

  it('falha em um agendamento não impede os demais nem cancela válido por falha de reagendar', async () => {
    const agendar = jest.fn(async (input) => {
      if (input.id.endsWith('1h_antes')) {
        throw new Error('falha simulada');
      }
    });
    const cancelar = jest.fn();
    const port = criarPort({
      agendar,
      cancelarPorIdentificador: cancelar,
      listarIdsComPrefixo: async () => ['gta-tarefa-futura-no_horario', 'gta-tarefa-futura-1h_antes'],
    });

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
      ],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const resultado = await new SincronizarNotificacoesTarefas(repo, port).executar(agora);

    expect(agendar).toHaveBeenCalledTimes(2);
    expect(resultado.agendadosOk).toBe(1);
    expect(resultado.falhasAgendamento).toBe(1);
    expect(cancelar).not.toHaveBeenCalledWith('gta-tarefa-futura-1h_antes');
  });

  it('continua cancelando órfãos mesmo se um cancelamento falhar', async () => {
    const cancelar = jest.fn(async (id: string) => {
      if (id === 'gta-tarefa-orfa-1') {
        throw new Error('cancel fail');
      }
    });
    const port = criarPort({
      listarIdsComPrefixo: async () => ['gta-tarefa-orfa-1', 'gta-tarefa-orfa-2'],
      cancelarPorIdentificador: cancelar,
    });
    const repo: TarefaRepository = {
      listar: async () => [],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const resultado = await new SincronizarNotificacoesTarefas(repo, port).executar(agora);
    expect(cancelar).toHaveBeenCalledTimes(2);
    expect(resultado.falhasCancelamento).toBe(1);
    expect(resultado.canceladosOk).toBe(1);
  });
});
