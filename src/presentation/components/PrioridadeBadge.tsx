import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { rotuloPrioridade, type PrioridadeTarefa } from '@/domain/entities/Tarefa';
import { ESTILO_PRIORIDADE } from '@/presentation/constants/prioridadeTarefa';

type Props = {
  prioridade: PrioridadeTarefa;
};

export function PrioridadeBadge({ prioridade }: Props) {
  const estilo = ESTILO_PRIORIDADE[prioridade];

  return (
    <View style={[styles.badge, { backgroundColor: estilo.badgeBackground }]}>
      <View style={[styles.dot, { backgroundColor: estilo.dot }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {rotuloPrioridade(prioridade)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
