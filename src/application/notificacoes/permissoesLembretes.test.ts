import {
  deveSolicitarPermissaoAoConfirmarLembretes,
  solicitarPermissaoParaLembretes,
} from '@/application/notificacoes/permissoesLembretes';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';

describe('permissoesLembretes', () => {
  it('tarefa sem lembrete não provoca solicitação de permissão', async () => {
    const solicitarPermissao = jest.fn(async () => true);
    const port: NotificacaoTarefaPort = {
      permissoesConcedidas: async () => false,
      solicitarPermissao,
      listarIdsComPrefixo: async () => [],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
    };

    expect(deveSolicitarPermissaoAoConfirmarLembretes([])).toBe(false);
    await expect(solicitarPermissaoParaLembretes(port, [])).resolves.toBe(false);
    expect(solicitarPermissao).not.toHaveBeenCalled();
  });

  it('permissão já concedida não chama solicitarPermissao', async () => {
    const solicitarPermissao = jest.fn();
    const port: NotificacaoTarefaPort = {
      permissoesConcedidas: async () => true,
      solicitarPermissao,
      listarIdsComPrefixo: async () => [],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
    };

    await expect(solicitarPermissaoParaLembretes(port, ['no_horario'])).resolves.toBe(true);
    expect(solicitarPermissao).not.toHaveBeenCalled();
  });

  it('solicitação contextual quando há lembretes e permissão ainda não concedida', async () => {
    const solicitarPermissao = jest.fn(async () => true);
    const port: NotificacaoTarefaPort = {
      permissoesConcedidas: async () => false,
      solicitarPermissao,
      listarIdsComPrefixo: async () => [],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
    };

    await expect(solicitarPermissaoParaLembretes(port, ['1h_antes'])).resolves.toBe(true);
    expect(solicitarPermissao).toHaveBeenCalledTimes(1);
  });

  it('permissão negada retorna false sem lançar', async () => {
    const port: NotificacaoTarefaPort = {
      permissoesConcedidas: async () => false,
      solicitarPermissao: async () => false,
      listarIdsComPrefixo: async () => [],
      cancelarPorIdentificador: async () => {},
      agendar: async () => {},
    };

    await expect(solicitarPermissaoParaLembretes(port, ['no_horario'])).resolves.toBe(false);
  });
});
