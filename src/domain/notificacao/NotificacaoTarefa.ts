import {
  rotuloPrioridade,
  type PrioridadeTarefa,
  type StatusTarefa,
  type Tarefa,
} from '@/domain/entities/Tarefa';
import {
  calcularInstanteLembrete,
  normalizarLembretes,
  rotuloLembrete,
  type TipoLembretePrazo,
} from '@/domain/lembrete/LembretesTarefa';
import { formatarPrazoExibicao, parsePrazoLocal } from '@/domain/prazo/PrazoTarefa';

export const PREFIXO_ID_NOTIFICACAO_TAREFA = 'gta-tarefa-';

const ROTULO_STATUS: Record<StatusTarefa, string> = {
  pendente: 'Pendente',
  concluida: 'Concluída',
  arquivada: 'Arquivada',
};

export type DadosNotificacaoTarefa = {
  tarefaId: string;
  prioridade: PrioridadeTarefa;
  status: StatusTarefa;
  prazo: string;
  lembrete: TipoLembretePrazo;
};

export type ConteudoNotificacaoTarefa = {
  title: string;
  body: string;
  data: DadosNotificacaoTarefa;
};

export type AgendamentoNotificacaoTarefa = {
  id: string;
  triggerDate: Date;
  tipo: TipoLembretePrazo;
};

export function prazoTemHorarioExplicito(prazo?: string): boolean {
  if (!prazo?.trim()) {
    return false;
  }
  return parsePrazoLocal(prazo)?.temHora ?? false;
}

export function idNotificacaoAgendada(tarefaId: string, tipo: TipoLembretePrazo): string {
  return `${PREFIXO_ID_NOTIFICACAO_TAREFA}${tarefaId}-${tipo}`;
}

/** Título genérico na notificação (evita expor título da tarefa na tela bloqueada). */
export const TITULO_NOTIFICACAO_LEMBRETE = 'Lembrete — SimpleTaskFlow';

export function montarConteudoNotificacao(
  tarefa: Tarefa,
  tipoLembrete: TipoLembretePrazo,
  agora: Date = new Date(),
): ConteudoNotificacaoTarefa {
  const prazo = tarefa.prazo ?? '';
  const detalhe = `Prioridade: ${rotuloPrioridade(tarefa.prioridade)} · ${ROTULO_STATUS[tarefa.status]} · ${formatarPrazoExibicao(prazo, 'pt-BR', agora)}`;
  const body = `${rotuloLembrete(tipoLembrete)} · ${detalhe}`;

  return {
    title: TITULO_NOTIFICACAO_LEMBRETE,
    body,
    data: {
      tarefaId: tarefa.id,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      prazo,
      lembrete: tipoLembrete,
    },
  };
}

export function listarAgendamentosNotificacao(
  tarefa: Tarefa,
  agora: Date = new Date(),
): AgendamentoNotificacaoTarefa[] {
  if (tarefa.status !== 'pendente' || !tarefa.prazo?.trim()) {
    return [];
  }
  const lembretes = normalizarLembretes(tarefa.lembretes);
  if (lembretes.length === 0) {
    return [];
  }
  if (!prazoTemHorarioExplicito(tarefa.prazo)) {
    return [];
  }

  const agendamentos: AgendamentoNotificacaoTarefa[] = [];
  for (const tipo of lembretes) {
    const triggerDate = calcularInstanteLembrete(tarefa.prazo, tipo);
    if (!triggerDate || triggerDate.getTime() <= agora.getTime()) {
      continue;
    }
    agendamentos.push({
      id: idNotificacaoAgendada(tarefa.id, tipo),
      triggerDate,
      tipo,
    });
  }
  return agendamentos;
}
