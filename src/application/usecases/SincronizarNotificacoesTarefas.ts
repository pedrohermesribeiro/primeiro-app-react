import {
  PREFIXO_ID_NOTIFICACAO_TAREFA,
  listarAgendamentosNotificacao,
  montarConteudoNotificacao,
} from '@/domain/notificacao/NotificacaoTarefa';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class SincronizarNotificacoesTarefas {
  constructor(
    private readonly tarefaRepository: TarefaRepository,
    private readonly notificacaoPort: NotificacaoTarefaPort,
  ) {}

  async executar(agora: Date = new Date()): Promise<void> {
    const concedida = await this.notificacaoPort.permissoesConcedidas();
    if (!concedida) {
      return;
    }

    const tarefas = await this.tarefaRepository.listar();
    const idsDesejados = new Set<string>();

    for (const tarefa of tarefas) {
      const agendamentos = listarAgendamentosNotificacao(tarefa, agora);
      for (const item of agendamentos) {
        idsDesejados.add(item.id);
        const { title, body, data } = montarConteudoNotificacao(tarefa, item.tipo, agora);
        await this.notificacaoPort.agendar({
          id: item.id,
          title,
          body,
          data,
          triggerDate: item.triggerDate,
          prioridade: tarefa.prioridade,
        });
      }
    }

    const agendados = await this.notificacaoPort.listarIdsComPrefixo(PREFIXO_ID_NOTIFICACAO_TAREFA);
    for (const id of agendados) {
      if (!idsDesejados.has(id)) {
        await this.notificacaoPort.cancelarPorIdentificador(id);
      }
    }
  }
}
