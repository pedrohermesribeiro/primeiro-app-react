import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import { filtrosPadrao, normalizarFiltrosTarefa, type FiltrosTarefa } from '@/domain/entities/FiltrosTarefa';

const CHAVE = 'gta:filtros';

export class FiltrosTarefasLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async get(): Promise<FiltrosTarefa> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return filtrosPadrao();
    }
    try {
      return normalizarFiltrosTarefa(JSON.parse(bruto));
    } catch {
      return filtrosPadrao();
    }
  }

  async set(filtros: FiltrosTarefa): Promise<void> {
    await this.storage.setItem(CHAVE, JSON.stringify(filtros));
  }
}
