export type PreferenciaTema =
  | 'system'
  | 'light'
  | 'dark'
  | 'grafiteClaro'
  | 'grafiteEscuro';

export type ChavePaletaCores = 'light' | 'dark' | 'grafiteClaro' | 'grafiteEscuro';

export type SystemColorScheme = 'light' | 'dark' | 'unspecified' | null | undefined;

const PREFERENCIAS_VALIDAS = new Set<PreferenciaTema>([
  'system',
  'light',
  'dark',
  'grafiteClaro',
  'grafiteEscuro',
]);

export function preferenciaTemaPadrao(): PreferenciaTema {
  return 'system';
}

export function normalizarPreferenciaTema(valor: unknown): PreferenciaTema {
  if (typeof valor === 'string' && PREFERENCIAS_VALIDAS.has(valor as PreferenciaTema)) {
    return valor as PreferenciaTema;
  }
  return preferenciaTemaPadrao();
}

function normalizarSystemScheme(scheme: SystemColorScheme): 'light' | 'dark' {
  if (scheme === 'dark') {
    return 'dark';
  }
  return 'light';
}

export function resolverPaleta(
  preferencia: PreferenciaTema,
  systemScheme: SystemColorScheme,
): ChavePaletaCores {
  switch (preferencia) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'grafiteClaro':
      return 'grafiteClaro';
    case 'grafiteEscuro':
      return 'grafiteEscuro';
    case 'system':
    default:
      return normalizarSystemScheme(systemScheme);
  }
}

export function paletaUsaChromeClaro(paleta: ChavePaletaCores): boolean {
  return paleta === 'light' || paleta === 'grafiteClaro';
}
