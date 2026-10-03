import { LocalStorageDataSource } from '@/data/datasources/LocalStorageDataSource';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';

export function createDefaultStorage(): StorageDataSource {
  return new LocalStorageDataSource();
}
