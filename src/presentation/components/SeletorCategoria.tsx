import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { useTheme } from '@/hooks/use-theme';

const COLUNAS_CATEGORIA = 4;

type Props = {
  categorias: Categoria[];
  selecionadaId: string;
  onSelecionar: (categoriaId: string) => void;
};

function chunkCategorias(lista: Categoria[], tamanho: number): Categoria[][] {
  const linhas: Categoria[][] = [];
  for (let i = 0; i < lista.length; i += tamanho) {
    linhas.push(lista.slice(i, i + tamanho));
  }
  return linhas;
}

export function SeletorCategoria({ categorias, selecionadaId, onSelecionar }: Props) {
  const theme = useTheme();

  const linhas = useMemo(
    () => chunkCategorias(categorias, COLUNAS_CATEGORIA),
    [categorias],
  );

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Categoria</ThemedText>
      <View style={styles.grid}>
        {linhas.map((linha, indiceLinha) => {
          const placeholders = COLUNAS_CATEGORIA - linha.length;
          return (
            <View key={`linha-${indiceLinha}`} style={styles.linha}>
              {linha.map((categoria) => {
                const selecionada = categoria.id === selecionadaId;
                return (
                  <Pressable
                    key={categoria.id}
                    onPress={() => onSelecionar(categoria.id)}
                    style={styles.celula}>
                    <ThemedView
                      type={selecionada ? 'backgroundSelected' : 'backgroundElement'}
                      style={[
                        styles.chip,
                        selecionada && { borderColor: theme.text, borderWidth: 1 },
                      ]}>
                      <ThemedText
                        type="small"
                        themeColor={selecionada ? 'text' : 'textSecondary'}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.chipTexto}>
                        {categoria.nome}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                );
              })}
              {Array.from({ length: placeholders }, (_, i) => (
                <View key={`spacer-${indiceLinha}-${i}`} style={styles.celula} />
              ))}
            </View>
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
  grid: {
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  celula: {
    flex: 1,
    minWidth: 0,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  chipTexto: {
    textAlign: 'center',
  },
});
