import type { Categoria } from '@/domain/entities/Categoria';

const CHAVE = 'gta:categorias';

function assertLocalStorage(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error(
      'Persistência v1 requer Expo Web (localStorage). Use npm run web ou migre para AsyncStorage (v2).',
    );
  }
  return localStorage;
}

export class CategoriaLocalDataSource {
  getAll(): Categoria[] {
    const storage = assertLocalStorage();
    const bruto = storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }
    return JSON.parse(bruto) as Categoria[];
  }

  setAll(categorias: Categoria[]): void {
    const storage = assertLocalStorage();
    storage.setItem(CHAVE, JSON.stringify(categorias));
  }
}
