/* eslint-disable import/first -- mock hoisted antes do módulo sob teste */
jest.mock('@/data/datasources/createDefaultStorage', () => ({
  createDefaultStorage: () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }),
}));

import { TemaAppLocalDataSource } from '@/data/datasources/TemaAppLocalDataSource';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

describe('TemaAppLocalDataSource', () => {
  it('retorna grafiteEscuro quando storage vazio', async () => {
    const storage: StorageDataSource = {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
    await expect(new TemaAppLocalDataSource(storage).get()).resolves.toBe('grafiteEscuro');
  });

  it('migra system salvo para grafiteEscuro e persiste', async () => {
    let salvo = JSON.stringify({ preferencia: 'system' });
    const setItem = jest.fn(async (_key: string, value: string) => {
      salvo = value;
    });
    const storage: StorageDataSource = {
      getItem: async () => salvo,
      setItem,
      removeItem: async () => {},
    };

    const resultado = await new TemaAppLocalDataSource(storage).get();
    expect(resultado).toBe('grafiteEscuro');
    expect(setItem).toHaveBeenCalledWith('gta:tema', JSON.stringify({ preferencia: 'grafiteEscuro' }));
  });

  it('retorna padrao quando JSON corrompido', async () => {
    const storage: StorageDataSource = {
      getItem: async () => 'nao-json',
      setItem: async () => {},
      removeItem: async () => {},
    };
    await expect(new TemaAppLocalDataSource(storage).get()).resolves.toBe('grafiteEscuro');
  });

  it('mantem preferencia explicita light', async () => {
    const setItem = jest.fn();
    const storage: StorageDataSource = {
      getItem: async () => JSON.stringify({ preferencia: 'light' }),
      setItem,
      removeItem: async () => {},
    };

    await expect(new TemaAppLocalDataSource(storage).get()).resolves.toBe('light');
    expect(setItem).not.toHaveBeenCalled();
  });
});
