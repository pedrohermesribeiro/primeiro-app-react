import { resolverPaleta } from '@/domain/theme/PreferenciaTema';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTemaApp } from '@/presentation/context/TemaAppContext';

export function useAppColorScheme() {
  const { preferencia } = useTemaApp();
  const systemScheme = useColorScheme();

  return resolverPaleta(preferencia, systemScheme);
}
