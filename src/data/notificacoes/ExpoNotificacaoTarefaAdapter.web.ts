import type {
  AgendarNotificacaoTarefaInput,
  NotificacaoTarefaPort,
} from '@/domain/ports/NotificacaoTarefaPort';

/** Web: notificações locais de prazo não são suportadas (no-op). */
export class ExpoNotificacaoTarefaAdapter implements NotificacaoTarefaPort {
  async permissoesConcedidas(): Promise<boolean> {
    return false;
  }

  async solicitarPermissao(): Promise<boolean> {
    return false;
  }

  async listarIdsComPrefixo(_prefixo: string): Promise<string[]> {
    return [];
  }

  async cancelarPorIdentificador(_id: string): Promise<void> {}

  async agendar(_input: AgendarNotificacaoTarefaInput): Promise<void> {}
}
