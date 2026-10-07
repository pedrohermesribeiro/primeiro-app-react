/* eslint-disable import/first -- mock hoisted antes do módulo sob teste */
jest.mock('@/data/datasources/createDefaultStorage', () => ({
  createDefaultStorage: () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }),
}));

import { CategoriaLocalDataSource } from '@/data/datasources/CategoriaLocalDataSource';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

function criarStorage(initial: string | null): {
  storage: StorageDataSource;
  setItem: jest.Mock;
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
  return { storage, setItem };
}

const categoriaValida = { id: 'estudos', nome: 'Estudos' };

describe('CategoriaLocalDataSource leitura segura', () => {
  it('JSON válido', async () => {
    const { storage } = criarStorage(JSON.stringify([categoriaValida]));
    await expect(new CategoriaLocalDataSource(storage).getAll()).resolves.toEqual([categoriaValida]);
  });

  it('JSON corrompido retorna vazio', async () => {
    const { storage } = criarStorage('{{{');
    await expect(new CategoriaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('storage null retorna vazio', async () => {
    const { storage } = criarStorage(null);
    await expect(new CategoriaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('objeto no lugar de array retorna vazio', async () => {
    const { storage } = criarStorage(JSON.stringify({ id: 'x' }));
    await expect(new CategoriaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('array vazio', async () => {
    const { storage } = criarStorage(JSON.stringify([]));
    await expect(new CategoriaLocalDataSource(storage).getAll()).resolves.toEqual([]);
  });

  it('array com null ignora', async () => {
    const { storage } = criarStorage(JSON.stringify([null, categoriaValida]));
    const lista = await new CategoriaLocalDataSource(storage).getAll();
    expect(lista).toEqual([categoriaValida]);
  });

  it('array com string/número ignora', async () => {
    const { storage } = criarStorage(JSON.stringify(['a', 1, categoriaValida]));
    expect(await new CategoriaLocalDataSource(storage).getAll()).toEqual([categoriaValida]);
  });

  it('14. categoria sem id descartada', async () => {
    const { storage } = criarStorage(
      JSON.stringify([{ nome: 'Sem id' }, categoriaValida]),
    );
    expect(await new CategoriaLocalDataSource(storage).getAll()).toEqual([categoriaValida]);
  });

  it('15. categoria sem nome descartada', async () => {
    const { storage } = criarStorage(
      JSON.stringify([{ id: 'estudos' }, categoriaValida]),
    );
    expect(await new CategoriaLocalDataSource(storage).getAll()).toEqual([categoriaValida]);
  });

  it('16. mistura válida/inválida preserva válidas e regrava', async () => {
    const { storage, setItem } = criarStorage(
      JSON.stringify([
        { id: '   ', nome: 'X' },
        categoriaValida,
        { id: 'trabalho', nome: '   ' },
      ]),
    );
    const lista = await new CategoriaLocalDataSource(storage).getAll();
    expect(lista).toEqual([categoriaValida]);
    expect(setItem).toHaveBeenCalled();
  });
});

describe('CategoriaLocalDataSource gravação', () => {
  it('setAll rejeita categoria inválida', async () => {
    const { storage } = criarStorage('[]');
    await expect(
      new CategoriaLocalDataSource(storage).setAll([{ id: 'ok', nome: '   ' }]),
    ).rejects.toThrow('obrigatório');
  });
});
