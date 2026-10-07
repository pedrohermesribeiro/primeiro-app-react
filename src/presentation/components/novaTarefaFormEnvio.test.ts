import {
  botaoNovaTarefaDesabilitado,
  processarEnvioNovaTarefa,
} from '@/presentation/components/novaTarefaFormEnvio';

describe('processarEnvioNovaTarefa', () => {
  const args = {
    titulo: 'Estudar',
    prazo: '2026-06-01T09:00',
    categoriaId: 'estudos',
    prioridade: 'alta' as const,
    lembretes: ['1h_antes'] as const,
  };

  it('sucesso limpa campos', async () => {
    let limpo = false;
    const ok = await processarEnvioNovaTarefa(
      async () => true,
      args.titulo,
      args.prazo,
      args.categoriaId,
      args.prioridade,
      [...args.lembretes],
      () => {
        limpo = true;
      },
    );
    expect(ok).toBe(true);
    expect(limpo).toBe(true);
  });

  it('falha preserva campos (não chama limpar)', async () => {
    let limpo = false;
    const ok = await processarEnvioNovaTarefa(
      async () => false,
      args.titulo,
      args.prazo,
      args.categoriaId,
      args.prioridade,
      [...args.lembretes],
      () => {
        limpo = true;
      },
    );
    expect(ok).toBe(false);
    expect(limpo).toBe(false);
  });

  it('falha após rejeição do submit não limpa', async () => {
    let limpo = false;
    await expect(
      processarEnvioNovaTarefa(
        async () => {
          throw new Error('O título é obrigatório.');
        },
        args.titulo,
        args.prazo,
        args.categoriaId,
        args.prioridade,
        [...args.lembretes],
        () => {
          limpo = true;
        },
      ),
    ).rejects.toThrow('O título é obrigatório.');
    expect(limpo).toBe(false);
  });
});

describe('botaoNovaTarefaDesabilitado', () => {
  it('bloqueia dupla submissão enquanto enviando', () => {
    expect(botaoNovaTarefaDesabilitado(true, 'Título', 'estudos')).toBe(true);
  });

  it('permite enviar quando não está enviando e há título', () => {
    expect(botaoNovaTarefaDesabilitado(false, 'Título', 'estudos')).toBe(false);
  });
});
