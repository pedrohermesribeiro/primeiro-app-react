import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { Tarefa } from '@/domain/entities/Tarefa';

import { ModalEditarPrazo } from '@/presentation/components/ModalEditarPrazo';
import { TarefaItem } from '@/presentation/components/TarefaItem';
import { confirmarExclusaoTarefa } from '@/presentation/utils/confirmarExclusaoTarefa';
import { useArquivadasViewModel } from '@/presentation/viewmodels/ArquivadasViewModel';

export function ArquivadasView() {
  const insets = useSafeAreaInsets();
  const { tarefas, carregando, erro, excluirDefinitivamente, restaurar, carregar, nomeCategoria } =
    useArquivadasViewModel();
  const [restaurarId, setRestaurarId] = useState<string | null>(null);

  const tarefaRestaurar = useMemo(
    () => tarefas.find((t) => t.id === restaurarId) ?? null,
    [restaurarId, tarefas],
  );

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const paddingTop = Platform.select({
    web: Spacing.four,
    default: insets.top + Spacing.two,
  });
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;
  const paddingHorizontal = Platform.select({ web: Spacing.three, default: Spacing.four });

  const handleExcluir = useCallback(
    (id: string) => {
      confirmarExclusaoTarefa(() => {
        void excluirDefinitivamente(id);
      });
    },
    [excluirDefinitivamente],
  );

  const renderItem = useCallback(
    ({ item }: { item: Tarefa }) => (
      <TarefaItem
        tarefa={item}
        categoriaNome={nomeCategoria(item.categoriaId)}
        onExcluir={handleExcluir}
        onRestaurar={setRestaurarId}
      />
    ),
    [handleExcluir, nomeCategoria],
  );

  const handleConfirmarRestaurar = useCallback(
    (prazo: string) => {
      if (!restaurarId) {
        return;
      }
      const id = restaurarId;
      setRestaurarId(null);
      void restaurar(id, prazo);
    },
    [restaurar, restaurarId],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={[styles.heading, { paddingTop, paddingHorizontal }]}>
        Tarefas arquivadas
      </ThemedText>
      {erro ? (
        <ThemedText type="small" style={[styles.erro, { paddingHorizontal }]}>
          {erro}
        </ThemedText>
      ) : null}
      {carregando ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom, paddingHorizontal },
          ]}
          data={tarefas}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary" style={styles.vazio}>
              Nenhuma tarefa arquivada.
            </ThemedText>
          }
          renderItem={renderItem}
        />
      )}
      <ModalEditarPrazo
        visible={restaurarId !== null}
        tituloTarefa={tarefaRestaurar?.titulo ?? ''}
        prazoInicial={tarefaRestaurar?.prazo ?? ''}
        rotuloConfirmar="Restaurar"
        onCancel={() => setRestaurarId(null)}
        onConfirm={handleConfirmarRestaurar}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  heading: {
    marginBottom: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  list: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  listContent: {
    gap: Spacing.two,
    flexGrow: 1,
  },
  loader: {
    marginTop: Spacing.four,
  },
  vazio: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  erro: {
    color: '#c62828',
    marginBottom: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
});
