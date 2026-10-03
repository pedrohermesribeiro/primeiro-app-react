import { AsyncStorageDataSource } from '@/data/datasources/AsyncStorageDataSource';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

export function createDefaultStorage(): StorageDataSource {
  return new AsyncStorageDataSource();
}
