import {
  normalizarPreferenciaTema,
  preferenciaTemaPadrao,
  resolverPaleta,
} from '@/domain/theme/PreferenciaTema';

describe('PreferenciaTema', () => {
  it('preferenciaTemaPadrao e normalizar invalido', () => {
    expect(preferenciaTemaPadrao()).toBe('system');
    expect(normalizarPreferenciaTema(null)).toBe('system');
    expect(normalizarPreferenciaTema('invalido')).toBe('system');
    expect(normalizarPreferenciaTema('grafiteClaro')).toBe('grafiteClaro');
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
