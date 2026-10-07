/* eslint-disable import/first -- mock hoisted antes do módulo sob teste */
jest.mock('@/data/datasources/createDefaultStorage', () => ({
  createDefaultStorage: () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }),
}));

import { TarefaLocalDataSource } from '@/data/datasources/TarefaLocalDataSource';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

function criarStorage(initial: string | null): {
  storage: StorageDataSource;
  setItem: jest.Mock;
  getSalvo: () => string | undefined;
} {
  let salvo = initial;
  const setItem = jest.fn(async (_key: string, value: string) => {
    salvo = value;
  });
  const storage: StorageDataSource = {
    getItem: async () => salvo,
    setItem,
    removeItem: async () => {
      salvo = null;
    },
  };
  return {
    storage,
    setItem,
    getSalvo: () => salvo ?? undefined,
  };
}

const tarefaValida = {
  id: 'a1b2c3d4-e5f6-4789-a012-3456789abcde',
  titulo: 'Estudar',
  categoriaId: 'estudos',
  status: 'pendente',
  prioridade: 'media',
  prazo: '2026-12-01T09:00',
  lembretes: ['1h_antes'],
};

describe('TarefaLocalDataSource leitura segura', () => {
  it('1. JSON válido retorna tarefas normalizadas', async () => {
    const { storage } = criarStorage(JSON.stringify([tarefaValida]));
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({
      id: tarefaValida.id,
      titulo: 'Estudar',
      categoriaId: 'estudos',
      status: 'pendente',
      prioridade: 'media',
      prazo: '2026-12-01T09:00',
      lembretes: ['1h_antes'],
    });
  });

  it('2. JSON corrompido retorna array vazio', async () => {
    const { storage } = criarStorage('{nao-json');
    await expect(new TarefaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('3. storage null retorna array vazio', async () => {
    const { storage } = criarStorage(null);
    await expect(new TarefaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('4. objeto {} onde deveria ser array retorna vazio', async () => {
    const { storage } = criarStorage(JSON.stringify({}));
    await expect(new TarefaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('5. array vazio retorna vazio', async () => {
    const { storage } = criarStorage(JSON.stringify([]));
    await expect(new TarefaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('6. array contendo null ignora entrada', async () => {
    const { storage } = criarStorage(JSON.stringify([null, tarefaValida]));
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.titulo).toBe('Estudar');
  });

  it('7. array contendo string/número ignora entradas inválidas', async () => {
    const { storage } = criarStorage(JSON.stringify(['x', 42, tarefaValida]));
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
  });

  it('8. tarefa sem título válido é descartada', async () => {
    const { storage } = criarStorage(
      JSON.stringify([{ ...tarefaValida, titulo: '   ' }, tarefaValida]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.titulo).toBe('Estudar');
  });

  it('9. tarefa com categoria inválida é descartada', async () => {
    const { storage } = criarStorage(
      JSON.stringify([
        { ...tarefaValida, categoriaId: 'id inválido!' },
        tarefaValida,
      ]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.categoriaId).toBe('estudos');
  });

  it('10. status inválido normaliza para pendente e mantém registro', async () => {
    const { storage } = criarStorage(
      JSON.stringify([{ ...tarefaValida, status: 'cancelada', prazo: undefined, lembretes: undefined }]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.status).toBe('pendente');
  });

  it('11. prioridade inválida normaliza para baixa e mantém registro', async () => {
    const { storage } = criarStorage(
      JSON.stringify([
        { ...tarefaValida, prioridade: 'urgente', prazo: undefined, lembretes: undefined },
      ]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.prioridade).toBe('baixa');
  });

  it('12. prazo inválido descarta o registro', async () => {
    const { storage } = criarStorage(
      JSON.stringify([
        { ...tarefaValida, prazo: '03/01/2026' },
        { ...tarefaValida, id: 'outra-id-aaaaaaaa-bbbb-cccc-dddddddddddd', prazo: undefined, lembretes: undefined },
      ]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.id).toBe('outra-id-aaaaaaaa-bbbb-cccc-dddddddddddd');
  });

  it('13. lembrete inválido mantém tarefa sem lembretes', async () => {
    const { storage } = criarStorage(
      JSON.stringify([
        {
          ...tarefaValida,
          prazo: '2026-12-01T09:00',
          lembretes: ['tipo_inexistente', 42, null],
        },
      ]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(resultado[0]!.lembretes).toBeUndefined();
  });

  it('16. mistura de registros válidos e inválidos preserva só os válidos e regrava', async () => {
    const { storage, setItem } = criarStorage(
      JSON.stringify([
        null,
        { id: 'x', titulo: '' },
        tarefaValida,
        { id: 'y', titulo: 'Ok', categoriaId: '!!!' },
      ]),
    );
    const resultado = await new TarefaLocalDataSource(storage).getAll();
    expect(resultado).toHaveLength(1);
    expect(setItem).toHaveBeenCalled();
  });
});

describe('TarefaLocalDataSource gravação', () => {
  it('setAll rejeita tarefa inválida na substituição', async () => {
    const { storage } = criarStorage(JSON.stringify([]));
    const ds = new TarefaLocalDataSource(storage);
    await expect(
      ds.setAll([
        {
          id: 'id-ok',
          titulo: '',
          categoriaId: 'estudos',
          status: 'pendente',
          prioridade: 'baixa',
        },
      ]),
    ).rejects.toThrow('obrigatório');
  });
});
