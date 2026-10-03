import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

function assertLocalStorage(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error(
      'localStorage indisponível neste ambiente. Use npm run web ou um build nativo (AsyncStorage).',
    );
  }
  return localStorage;
}

export class LocalStorageDataSource implements StorageDataSource {
  async getItem(key: string): Promise<string | null> {
    return assertLocalStorage().getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    assertLocalStorage().setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    assertLocalStorage().removeItem(key);
  }
}
