import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { MAX_NOME_CATEGORIA, type Categoria } from '@/domain/entities/Categoria';
import { useTheme } from '@/hooks/use-theme';
import { confirmarExclusaoCategoria } from '@/presentation/utils/confirmarExclusaoCategoria';
import { useCategoriasViewModel } from '@/presentation/viewmodels/CategoriasViewModel';

export function CategoriasView() {
  const theme = useTheme();
  const {
    categorias,
    carregando,
    erro,
    enviando,
    podeIncluir,
    podeExcluir,
    maxCategorias,
    minCategorias,
    incluir,
    excluir,
  } = useCategoriasViewModel();
  const [nome, setNome] = useState('');

  const handleIncluir = useCallback(async () => {
    if (!nome.trim() || !podeIncluir) {
      return;
    }
    try {
      await incluir(nome);
      setNome('');
    } catch {
      // erro já definido no ViewModel
    }
  }, [incluir, nome, podeIncluir]);

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.contador}>
        {categorias.length} de {maxCategorias} categorias · mínimo {minCategorias}
      </ThemedText>
      {!podeExcluir ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.avisoMinimo}>
          Mínimo de {minCategorias} categorias — não é possível excluir mais.
        </ThemedText>
      ) : null}

      <ThemedView type="backgroundElement" style={styles.form}>
        <ThemedText type="smallBold">Nova categoria</ThemedText>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome"
          maxLength={MAX_NOME_CATEGORIA}
          editable={podeIncluir && !enviando}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <Pressable
          onPress={() => void handleIncluir()}
          disabled={!podeIncluir || enviando || !nome.trim()}
          style={[
            styles.button,
            { backgroundColor: theme.backgroundSelected },
            (!podeIncluir || !nome.trim()) && styles.buttonDisabled,
          ]}>
          <ThemedText type="smallBold">
            {enviando ? 'Salvando…' : podeIncluir ? 'Incluir' : 'Limite atingido'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      {erro ? (
        <ThemedText type="small" style={styles.erro}>
          {erro}
        </ThemedText>
      ) : null}

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: Categoria }) => (
          <ThemedView type="backgroundElement" style={styles.listItem}>
            <ThemedText style={styles.listItemNome}>{item.nome}</ThemedText>
            <Pressable
              onPress={() =>
                confirmarExclusaoCategoria(item.nome, () => {
                  void excluir(item.id);
                })
              }
              disabled={!podeExcluir || enviando}
              style={[styles.excluirButton, (!podeExcluir || enviando) && styles.buttonDisabled]}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Excluir
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contador: {
    textAlign: 'right',
  },
  avisoMinimo: {
    textAlign: 'center',
  },
  form: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  erro: {
    color: '#c62828',
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  listItemNome: {
    flex: 1,
  },
  excluirButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
