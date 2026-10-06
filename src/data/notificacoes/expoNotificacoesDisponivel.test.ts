import Constants, { ExecutionEnvironment } from 'expo-constants';

import { expoNotificacoesDisponivel } from '@/data/notificacoes/expoNotificacoesDisponivel';

describe('expoNotificacoesDisponivel', () => {
  const envOriginal = Constants.executionEnvironment;

  afterEach(() => {
    Object.defineProperty(Constants, 'executionEnvironment', {
      value: envOriginal,
      configurable: true,
    });
  });

  it('retorna false no Expo Go (storeClient)', () => {
    Object.defineProperty(Constants, 'executionEnvironment', {
      value: ExecutionEnvironment.StoreClient,
      configurable: true,
    });
    expect(expoNotificacoesDisponivel()).toBe(false);
  });

  it('retorna true em development build (bare)', () => {
    Object.defineProperty(Constants, 'executionEnvironment', {
      value: ExecutionEnvironment.Bare,
      configurable: true,
    });
    expect(expoNotificacoesDisponivel()).toBe(true);
  });
});
