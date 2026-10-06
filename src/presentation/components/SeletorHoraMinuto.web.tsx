import { createElement, type CSSProperties } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

type Props = {
  hora: string;
  disabled?: boolean;
  onChange: (hora: string) => void;
};

function parseHora(hora: string): { h: number; m: number } {
  const match = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!match) {
    return { h: 8, m: 0 };
  }
  return { h: Number(match[1]), m: Number(match[2]) };
}

export function SeletorHoraMinuto({ hora, disabled, onChange }: Props) {
  const theme = useTheme();
  const { h, m } = parseHora(hora);

  const selectStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    padding: Spacing.two,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.backgroundSelected,
    borderRadius: Spacing.one,
    color: theme.text,
    backgroundColor: theme.background,
    fontFamily: 'inherit',
  };

  const setHora = (novaH: number) => {
    onChange(`${String(novaH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };
  const setMinuto = (novaM: number) => {
    onChange(`${String(h).padStart(2, '0')}:${String(novaM).padStart(2, '0')}`);
  };

  return (
    <View style={styles.row}>
      {createElement(
        'select',
        {
          value: h,
          disabled,
          'aria-label': 'Hora',
          onChange: (e: Event) => setHora(Number((e.target as HTMLSelectElement).value)),
          style: selectStyle,
        },
        HOURS.map((hour) =>
          createElement('option', { key: hour, value: hour }, String(hour).padStart(2, '0')),
        ),
      )}
      {createElement(
        'select',
        {
          value: m,
          disabled,
          'aria-label': 'Minutos',
          onChange: (e: Event) => setMinuto(Number((e.target as HTMLSelectElement).value)),
          style: selectStyle,
        },
        MINUTES.map((min) =>
          createElement('option', { key: min, value: min }, String(min).padStart(2, '0')),
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minWidth: 0,
  },
});
