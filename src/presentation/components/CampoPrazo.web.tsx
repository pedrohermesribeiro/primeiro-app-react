import { createElement, type CSSProperties } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  value: string;
  onChange: (iso: string) => void;
};

export function CampoPrazo({ value, onChange }: Props) {
  const theme = useTheme();

  const inputStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
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

  return (
    <View style={styles.wrapper}>
      {createElement('input', {
        type: 'date',
        value: value || '',
        'aria-label': 'Prazo opcional',
        onChange: (event: Event) => {
          const target = event.target as HTMLInputElement;
          onChange(target.value);
        },
        style: inputStyle,
      })}
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <ThemedText type="small" themeColor="textSecondary">
            Limpar prazo
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
    width: '100%',
  },
});
