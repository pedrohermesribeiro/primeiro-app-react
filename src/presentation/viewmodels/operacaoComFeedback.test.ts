import { executarComFeedbackUsuario } from '@/presentation/viewmodels/operacaoComFeedback';

describe('executarComFeedbackUsuario', () => {
  it('retorna true e não registra erro em sucesso', async () => {
    let erro: string | null = 'anterior';
    const ok = await executarComFeedbackUsuario(
      () => {
        erro = null;
      },
      (mensagem) => {
        erro = mensagem;
      },
      'Falha',
      async () => {},
    );
    expect(ok).toBe(true);
    expect(erro).toBeNull();
  });

  it('retorna false e expõe erro de domínio em falha (editar/criar)', async () => {
    let erro: string | null = null;
    const ok = await executarComFeedbackUsuario(
      () => {
        erro = null;
      },
      (mensagem) => {
        erro = mensagem;
      },
      'Erro ao editar tarefa.',
      async () => {
        throw new Error('Prioridade inválida.');
      },
    );
    expect(ok).toBe(false);
    expect(erro).toBe('Prioridade inválida.');
  });
});
