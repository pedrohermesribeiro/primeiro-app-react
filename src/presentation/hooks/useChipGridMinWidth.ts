import { useMemo } from 'react';
import { PixelRatio } from 'react-native';

/** Largura mínima de chip para forçar quebra de linha antes de espremer o texto (escala de fonte Android). */
export function useChipGridMinWidth(_maxColumns: number): number {
  const fontScale = PixelRatio.getFontScale();

  return useMemo(() => Math.max(96, 72 * fontScale), [fontScale]);
}
