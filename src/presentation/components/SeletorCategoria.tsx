import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { useTheme } from '@/hooks/use-theme';
import { useChipGridMinWidth } from '@/presentation/hooks/useChipGridMinWidth';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';

const COLUNAS_PADRAO = 4;

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

type ChipProps = {
  categoria: Categoria;
  selecionada: boolean;
  multilinha: boolean;
};

function ChipCategoria({ categoria, selecionada, multilinha }: ChipProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type={selecionada ? 'backgroundSelected' : 'backgroundElement'}
      style={[styles.chip, selecionada && { borderColor: theme.text, borderWidth: 1 }]}>
      <ThemedText
        type="small"
        themeColor={selecionada ? 'text' : 'textSecondary'}
        numberOfLines={multilinha ? undefined : 1}
        ellipsizeMode={multilinha ? undefined : 'tail'}
        style={styles.chipTexto}>
        {categoria.nome}
      </ThemedText>
    </ThemedView>
  );
}

export function SeletorCategoria({ categorias, selecionadaId, onSelecionar }: Props) {
  const fonteGrande = useFonteGrandeFormulario();
  const minWidthChip = useChipGridMinWidth(COLUNAS_PADRAO);

  const linhas = useMemo(
    () => chunkCategorias(categorias, COLUNAS_PADRAO),
    [categorias],
  );

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">Categoria</ThemedText>
      {fonteGrande ? (
        <View style={styles.gridAcessivel}>
          {categorias.map((categoria) => (
            <Pressable
              key={categoria.id}
              onPress={() => onSelecionar(categoria.id)}
              style={[styles.celulaAcessivel, { minWidth: minWidthChip }]}>
              <ChipCategoria
                categoria={categoria}
                selecionada={categoria.id === selecionadaId}
                multilinha
              />
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.gridPadrao}>
          {linhas.map((linha, indiceLinha) => {
            const placeholders = COLUNAS_PADRAO - linha.length;
            return (
              <View key={`linha-${indiceLinha}`} style={styles.linha}>
                {linha.map((categoria) => (
                  <Pressable
                    key={categoria.id}
                    onPress={() => onSelecionar(categoria.id)}
                    style={styles.celulaPadrao}>
                    <ChipCategoria
                      categoria={categoria}
                      selecionada={categoria.id === selecionadaId}
                      multilinha={false}
                    />
                  </Pressable>
                ))}
                {Array.from({ length: placeholders }, (_, i) => (
                  <View key={`spacer-${indiceLinha}-${i}`} style={styles.celulaPadrao} />
                ))}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  gridPadrao: {
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  celulaPadrao: {
    flex: 1,
    minWidth: 0,
  },
  gridAcessivel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  celulaAcessivel: {
    flexGrow: 1,
    flexBasis: `${100 / COLUNAS_PADRAO}%`,
    maxWidth: `${100 / COLUNAS_PADRAO}%`,
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
    flexShrink: 1,
  },
});
