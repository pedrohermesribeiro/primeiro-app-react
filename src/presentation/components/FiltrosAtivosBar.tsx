import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { filtrosDiferentesDoPadrao } from '@/domain/entities/FiltrosTarefa';
import { useFiltrosTarefas } from '@/presentation/context/FiltrosTarefasContext';

export function FiltrosAtivosBar() {
  const { filtrosAplicados, limparFiltros } = useFiltrosTarefas();

  if (!filtrosDiferentesDoPadrao(filtrosAplicados)) {
    return null;
  }

  return (
    <View style={styles.bar}>
      <ThemedText type="small" themeColor="textSecondary">
        Filtros ativos
      </ThemedText>
      <Pressable onPress={() => void limparFiltros()} hitSlop={8}>
        <ThemedText type="linkPrimary">Limpar filtros</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
