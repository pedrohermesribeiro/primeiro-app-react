import type { DadosNotificacaoTarefa } from '@/domain/notificacao/NotificacaoTarefa';
import type { PrioridadeTarefa } from '@/domain/entities/Tarefa';

export type AgendarNotificacaoTarefaInput = {
  id: string;
  title: string;
  body: string;
  data: DadosNotificacaoTarefa;
  triggerDate: Date;
  prioridade: PrioridadeTarefa;
};

export interface NotificacaoTarefaPort {
  /** Apenas consulta; não exibe diálogo de permissão. */
  permissoesConcedidas(): Promise<boolean>;
  solicitarPermissao(): Promise<boolean>;
  listarIdsComPrefixo(prefixo: string): Promise<string[]>;
  cancelarPorIdentificador(id: string): Promise<void>;
  agendar(input: AgendarNotificacaoTarefaInput): Promise<void>;
}
