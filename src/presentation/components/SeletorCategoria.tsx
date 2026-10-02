import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  categorias: Categoria[];
  selecionadaId: string;
  onSelecionar: (categoriaId: string) => void;
};

export function SeletorCategoria({ categorias, selecionadaId, onSelecionar }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Categoria</ThemedText>
      <View style={styles.chips}>
        {categorias.map((categoria) => {
          const selecionada = categoria.id === selecionadaId;
          return (
            <Pressable key={categoria.id} onPress={() => onSelecionar(categoria.id)}>
              <ThemedView
                type={selecionada ? 'backgroundSelected' : 'backgroundElement'}
                style={[
                  styles.chip,
                  selecionada && { borderColor: theme.text, borderWidth: 1 },
                ]}>
                <ThemedText type="small" themeColor={selecionada ? 'text' : 'textSecondary'}>
                  {categoria.nome}
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
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
});
