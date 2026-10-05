import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { PRIORIDADES_TAREFA, rotuloPrioridade, type PrioridadeTarefa } from '@/domain/entities/Tarefa';
import { useTheme } from '@/hooks/use-theme';
import { ESTILO_PRIORIDADE } from '@/presentation/constants/prioridadeTarefa';

type Props = {
  selecionada: PrioridadeTarefa;
  onSelecionar: (prioridade: PrioridadeTarefa) => void;
};

export function SeletorPrioridade({ selecionada, onSelecionar }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Prioridade</ThemedText>
      <View style={styles.chips}>
        {PRIORIDADES_TAREFA.map((prioridade) => {
          const ativa = prioridade === selecionada;
          const estilo = ESTILO_PRIORIDADE[prioridade];
          return (
            <Pressable
              key={prioridade}
              onPress={() => onSelecionar(prioridade)}
              style={styles.chipPressable}>
              <ThemedView
                type={ativa ? 'backgroundSelected' : 'backgroundElement'}
                style={[
                  styles.chip,
                  { backgroundColor: ativa ? theme.backgroundSelected : estilo.chipBackground },
                  ativa && { borderColor: theme.text, borderWidth: 1 },
                ]}>
                <View style={[styles.dot, { backgroundColor: estilo.dot }]} />
                <ThemedText type="small" themeColor={ativa ? 'text' : 'textSecondary'}>
                  {rotuloPrioridade(prioridade)}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chipPressable: {
    flex: 1,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
