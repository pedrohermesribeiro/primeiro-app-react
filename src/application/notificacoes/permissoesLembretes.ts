import type { TipoLembretePrazo } from '@/domain/lembrete/LembretesTarefa';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';

export function deveSolicitarPermissaoAoConfirmarLembretes(lembretes: TipoLembretePrazo[]): boolean {
  return lembretes.length > 0;
}

/**
 * Solicita permissão somente quando o usuário opta por lembretes.
 * Não relança erro; retorna false se negada ou indisponível.
 */
export async function solicitarPermissaoParaLembretes(
  port: NotificacaoTarefaPort,
  lembretes: TipoLembretePrazo[],
): Promise<boolean> {
  if (!deveSolicitarPermissaoAoConfirmarLembretes(lembretes)) {
    return false;
  }
  if (await port.permissoesConcedidas()) {
    return true;
  }
  try {
    return await port.solicitarPermissao();
  } catch {
    return false;
  }
}
