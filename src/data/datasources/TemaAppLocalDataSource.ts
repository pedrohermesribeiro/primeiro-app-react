import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import {
  migrarPreferenciaTemaSalva,
  normalizarPreferenciaTema,
  preferenciaTemaPadrao,
  type PreferenciaTema,
} from '@/domain/theme/PreferenciaTema';

const CHAVE = 'gta:tema';

type TemaPersistido = {
  preferencia: PreferenciaTema;
};

export class TemaAppLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async get(): Promise<PreferenciaTema> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return preferenciaTemaPadrao();
    }
    try {
      const obj = JSON.parse(bruto) as Partial<TemaPersistido>;
      const normalizada = normalizarPreferenciaTema(obj.preferencia);
      const efetiva = migrarPreferenciaTemaSalva(normalizada);
      if (efetiva !== normalizada) {
        await this.set(efetiva);
      }
      return efetiva;
    } catch {
      return preferenciaTemaPadrao();
    }
  }

  async set(preferencia: PreferenciaTema): Promise<void> {
    const payload: TemaPersistido = { preferencia };
    await this.storage.setItem(CHAVE, JSON.stringify(payload));
  }
}
