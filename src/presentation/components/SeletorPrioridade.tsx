import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { PRIORIDADES_TAREFA, rotuloPrioridade, type PrioridadeTarefa } from '@/domain/entities/Tarefa';
import { useTheme } from '@/hooks/use-theme';
import { ESTILO_PRIORIDADE } from '@/presentation/constants/prioridadeTarefa';
import { useChipGridMinWidth } from '@/presentation/hooks/useChipGridMinWidth';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';

const MAX_COLUNAS_ACESSIVEL = 3;

type Props = {
  selecionada: PrioridadeTarefa;
  onSelecionar: (prioridade: PrioridadeTarefa) => void;
};

export function SeletorPrioridade({ selecionada, onSelecionar }: Props) {
  const theme = useTheme();
  const fonteGrande = useFonteGrandeFormulario();
  const minWidthChip = useChipGridMinWidth(MAX_COLUNAS_ACESSIVEL);

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Prioridade</ThemedText>
      <View style={fonteGrande ? styles.chipsAcessivel : styles.chipsPadrao}>
        {PRIORIDADES_TAREFA.map((prioridade) => {
          const ativa = prioridade === selecionada;
          const estilo = ESTILO_PRIORIDADE[prioridade];
          return (
            <Pressable
              key={prioridade}
              onPress={() => onSelecionar(prioridade)}
              style={
                fonteGrande
                  ? [styles.chipPressAcessivel, { minWidth: minWidthChip }]
                  : styles.chipPressPadrao
              }>
              <ThemedView
                type={ativa ? 'backgroundSelected' : 'backgroundElement'}
                style={[
                  styles.chip,
                  { backgroundColor: ativa ? theme.backgroundSelected : estilo.chipBackground },
                  ativa && { borderColor: theme.text, borderWidth: 1 },
                  fonteGrande && styles.chipAcessivel,
                ]}>
                <View style={[styles.dot, { backgroundColor: estilo.dot }]} />
                <ThemedText
                  type="small"
                  themeColor={ativa ? 'text' : 'textSecondary'}
                  style={fonteGrande ? styles.chipLabelAcessivel : undefined}>
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
  chipsPadrao: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chipsAcessivel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chipPressPadrao: {
    flex: 1,
  },
  chipPressAcessivel: {
    flexGrow: 1,
    flexBasis: `${100 / MAX_COLUNAS_ACESSIVEL}%`,
    maxWidth: `${100 / MAX_COLUNAS_ACESSIVEL}%`,
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
  chipAcessivel: {
    flexWrap: 'wrap',
    minHeight: 44,
  },
  chipLabelAcessivel: {
    textAlign: 'center',
    flexShrink: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
