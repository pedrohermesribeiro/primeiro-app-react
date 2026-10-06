import {
  idNotificacaoAgendada,
  listarAgendamentosNotificacao,
  montarConteudoNotificacao,
  prazoTemHorarioExplicito,
} from '@/domain/notificacao/NotificacaoTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';

const tarefaBase = (overrides: Partial<Tarefa> = {}): Tarefa => ({
  id: 'abc-123',
  titulo: 'Entregar trabalho',
  categoriaId: 'c1',
  status: 'pendente',
  prioridade: 'alta',
  prazo: '2030-06-15T14:30',
  lembretes: ['no_horario'],
  ...overrides,
});

describe('NotificacaoTarefa', () => {
  const agora = new Date(2026, 5, 1, 10, 0, 0, 0);

  it('prazoTemHorarioExplicito exige T no armazenamento', () => {
    expect(prazoTemHorarioExplicito('2026-10-08')).toBe(false);
    expect(prazoTemHorarioExplicito('2026-10-08T09:00')).toBe(true);
  });

  it('listarAgendamentosNotificacao: lembretes futuros; ignora sem lembrete ou inválidos', () => {
    expect(listarAgendamentosNotificacao(tarefaBase(), agora)).toEqual([
      {
        id: 'gta-tarefa-abc-123-no_horario',
        triggerDate: new Date(2030, 5, 15, 14, 30, 0, 0),
        tipo: 'no_horario',
      },
    ]);
    expect(listarAgendamentosNotificacao(tarefaBase({ lembretes: [] }), agora)).toEqual([]);
    expect(listarAgendamentosNotificacao(tarefaBase({ status: 'concluida' }), agora)).toEqual([]);
    expect(
      listarAgendamentosNotificacao(tarefaBase({ prazo: '2026-01-01T08:00' }), agora),
    ).toEqual([]);
    expect(
      listarAgendamentosNotificacao(
        tarefaBase({
          lembretes: ['no_horario', '1h_antes', '1_dia_antes'],
          prazo: '2030-06-15T14:30',
        }),
        agora,
      ).length,
    ).toBe(3);
  });

  it('idNotificacaoAgendada inclui tipo', () => {
    expect(idNotificacaoAgendada('x', '1h_antes')).toBe('gta-tarefa-x-1h_antes');
  });

  it('montarConteudoNotificacao inclui lembrete e prazo', () => {
    const conteudo = montarConteudoNotificacao(tarefaBase(), '1h_antes', agora);
    expect(conteudo.title).toBe('Entregar trabalho');
    expect(conteudo.body).toContain('Lembrete (1h antes)');
    expect(conteudo.body).toContain('Alta');
    expect(conteudo.data.lembrete).toBe('1h_antes');
  });
});
