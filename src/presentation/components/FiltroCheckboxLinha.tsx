import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  marcado: boolean;
  onToggle: () => void;
  icon?: ReactNode;
};

export function FiltroCheckboxLinha({ label, marcado, onToggle, icon }: Props) {
  const theme = useTheme();

  return (
    <Pressable onPress={onToggle} style={styles.row} accessibilityRole="checkbox" accessibilityState={{ checked: marcado }}>
      <View
        style={[
          styles.box,
          { borderColor: theme.textSecondary },
          marcado && { backgroundColor: theme.text, borderColor: theme.text },
        ]}>
        {marcado ? <ThemedText style={styles.check}>✓</ThemedText> : null}
      </View>
      {icon}
      <ThemedText type="small">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
});
