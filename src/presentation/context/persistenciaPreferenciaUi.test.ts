import { persistirPreferenciaUi } from '@/presentation/context/persistenciaPreferenciaUi';

describe('persistirPreferenciaUi (persist-first)', () => {
  it('aplica estado somente após persistência bem-sucedida', async () => {
    let storage = 'antigo';
    let ui = 'antigo';
    await persistirPreferenciaUi(
      async (valor) => {
        storage = valor;
      },
      (valor) => {
        ui = valor;
      },
      'novo',
    );
    expect(storage).toBe('novo');
    expect(ui).toBe('novo');
  });

  it('falha na persistência não altera estado da UI', async () => {
    let ui = 'mantido';
    await expect(
      persistirPreferenciaUi(
        async () => {
          throw new Error('falha storage');
        },
        (valor) => {
          ui = valor;
        },
        'novo',
      ),
    ).rejects.toThrow('falha storage');
    expect(ui).toBe('mantido');
  });
});
