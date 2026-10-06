import {
  migrarPreferenciaTemaSalva,
  normalizarPreferenciaTema,
  preferenciaTemaPadrao,
  resolverPaleta,
} from '@/domain/theme/PreferenciaTema';

describe('PreferenciaTema', () => {
  it('preferenciaTemaPadrao e normalizar invalido', () => {
    expect(preferenciaTemaPadrao()).toBe('grafiteEscuro');
    expect(normalizarPreferenciaTema(null)).toBe('grafiteEscuro');
    expect(normalizarPreferenciaTema('invalido')).toBe('grafiteEscuro');
    expect(normalizarPreferenciaTema('grafiteClaro')).toBe('grafiteClaro');
    expect(normalizarPreferenciaTema('system')).toBe('system');
  });

  it('migrarPreferenciaTemaSalva converte system salvo legado', () => {
    expect(migrarPreferenciaTemaSalva('system')).toBe('grafiteEscuro');
    expect(migrarPreferenciaTemaSalva('light')).toBe('light');
    expect(migrarPreferenciaTemaSalva('grafiteEscuro')).toBe('grafiteEscuro');
  });

  it('resolverPaleta com preferencias fixas', () => {
    expect(resolverPaleta('grafiteClaro', 'dark')).toBe('grafiteClaro');
    expect(resolverPaleta('grafiteEscuro', 'light')).toBe('grafiteEscuro');
    expect(resolverPaleta('light', 'dark')).toBe('light');
    expect(resolverPaleta('dark', 'light')).toBe('dark');
  });

  it('resolverPaleta system segue esquema do sistema', () => {
    expect(resolverPaleta('system', 'dark')).toBe('dark');
    expect(resolverPaleta('system', 'light')).toBe('light');
    expect(resolverPaleta('system', null)).toBe('light');
    expect(resolverPaleta('system', undefined)).toBe('light');
  });
});
