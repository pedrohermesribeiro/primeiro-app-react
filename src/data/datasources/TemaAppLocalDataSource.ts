import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import { isRegistro, parseJsonSeguro } from '@/data/persistencia/jsonSeguro';
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
    const parsed = parseJsonSeguro(bruto);
    if (!isRegistro(parsed)) {
      return preferenciaTemaPadrao();
    }
    const normalizada = normalizarPreferenciaTema(parsed.preferencia);
    const efetiva = migrarPreferenciaTemaSalva(normalizada);
    if (efetiva !== normalizada) {
      await this.set(efetiva);
    }
    return efetiva;
  }

  async set(preferencia: PreferenciaTema): Promise<void> {
    const payload: TemaPersistido = { preferencia };
    await this.storage.setItem(CHAVE, JSON.stringify(payload));
  }
}
