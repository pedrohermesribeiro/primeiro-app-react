import {
  PREFIXO_ID_NOTIFICACAO_TAREFA,
  listarAgendamentosNotificacao,
  montarConteudoNotificacao,
} from '@/domain/notificacao/NotificacaoTarefa';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type ResultadoSincronizacaoNotificacoes = {
  agendadosOk: number;
  falhasAgendamento: number;
  canceladosOk: number;
  falhasCancelamento: number;
};

export class SincronizarNotificacoesTarefas {
  constructor(
    private readonly tarefaRepository: TarefaRepository,
    private readonly notificacaoPort: NotificacaoTarefaPort,
  ) {}

  async executar(agora: Date = new Date()): Promise<ResultadoSincronizacaoNotificacoes> {
    const resultado: ResultadoSincronizacaoNotificacoes = {
      agendadosOk: 0,
      falhasAgendamento: 0,
      canceladosOk: 0,
      falhasCancelamento: 0,
    };

    const concedida = await this.notificacaoPort.permissoesConcedidas();
    if (!concedida) {
      return resultado;
    }

    const tarefas = await this.tarefaRepository.listar();
    const idsDesejados = new Set<string>();

    for (const tarefa of tarefas) {
      const agendamentos = listarAgendamentosNotificacao(tarefa, agora);
      for (const item of agendamentos) {
        idsDesejados.add(item.id);
        const { title, body, data } = montarConteudoNotificacao(tarefa, item.tipo, agora);
        try {
          await this.notificacaoPort.agendar({
            id: item.id,
            title,
            body,
            data,
            triggerDate: item.triggerDate,
            prioridade: tarefa.prioridade,
          });
          resultado.agendadosOk += 1;
        } catch {
          resultado.falhasAgendamento += 1;
          // Mantém id em idsDesejados: não cancelar agendamento válido anterior por falha ao reagendar.
        }
      }
    }

    const agendados = await this.notificacaoPort.listarIdsComPrefixo(PREFIXO_ID_NOTIFICACAO_TAREFA);
    for (const id of agendados) {
      if (!idsDesejados.has(id)) {
        try {
          await this.notificacaoPort.cancelarPorIdentificador(id);
          resultado.canceladosOk += 1;
        } catch {
          resultado.falhasCancelamento += 1;
        }
      }
    }

    return resultado;
  }
}
