import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { Tarefa } from '@/domain/entities/Tarefa';

import { ModalEditarTarefa } from '@/presentation/components/ModalEditarTarefa';
import { NovaTarefaForm } from '@/presentation/components/NovaTarefaForm';
import { TarefaItem } from '@/presentation/components/TarefaItem';
import { confirmarExclusaoTarefa } from '@/presentation/utils/confirmarExclusaoTarefa';
import { useTarefaViewModel } from '@/presentation/viewmodels/TarefaViewModel';

export function TarefaView() {
  const insets = useSafeAreaInsets();
  const {
    tarefas,
    categorias,
    carregando,
    erro,
    criar,
    concluir,
    arquivar,
    excluir,
    editar,
    carregar,
    nomeCategoria,
  } = useTarefaViewModel();
  const [editarId, setEditarId] = useState<string | null>(null);

  const tarefaEditar = useMemo(
    () => tarefas.find((t) => t.id === editarId) ?? null,
    [editarId, tarefas],
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

  const handleSubmit = useCallback(
    async (titulo: string, prazo: string, categoriaId: string) => {
      await criar(titulo, prazo, categoriaId);
    },
    [criar],
  );

  const handleExcluir = useCallback(
    (id: string) => {
      confirmarExclusaoTarefa(() => {
        void excluir(id);
      });
    },
    [excluir],
  );

  const renderItem = useCallback(
    ({ item }: { item: Tarefa }) => (
      <TarefaItem
        tarefa={item}
        categoriaNome={nomeCategoria(item.categoriaId)}
        onConcluir={(id) => void concluir(id)}
        onEditar={setEditarId}
        onArquivar={(id) => void arquivar(id)}
        onExcluir={handleExcluir}
      />
    ),
    [arquivar, concluir, handleExcluir, nomeCategoria],
  );

  const handleConfirmarEditar = useCallback(
    async (titulo: string, prazo: string, categoriaId: string) => {
      if (!editarId) {
        return;
      }
      const id = editarId;
      const ok = await editar(id, titulo, prazo, categoriaId);
      if (ok) {
        setEditarId(null);
      }
    },
    [editar, editarId],
  );

  const handleFecharEditar = useCallback(() => {
    setEditarId(null);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.topSection, { paddingTop, paddingHorizontal }]}>
        <NovaTarefaForm
          categorias={categorias}
          onSubmit={handleSubmit}
          erro={editarId ? null : erro}
        />
      </View>

      <View style={styles.listArea}>
        {carregando && tarefas.length === 0 ? (
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
                Nenhuma tarefa ativa.
              </ThemedText>
            }
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
      <ModalEditarTarefa
        visible={editarId !== null}
        categorias={categorias}
        tituloInicial={tarefaEditar?.titulo ?? ''}
        categoriaIdInicial={tarefaEditar?.categoriaId ?? 'estudos'}
        prazoInicial={tarefaEditar?.prazo ?? ''}
        erro={editarId !== null ? erro : null}
        onCancel={handleFecharEditar}
        onConfirm={(titulo, prazo, categoriaId) => void handleConfirmarEditar(titulo, prazo, categoriaId)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
  topSection: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  listArea: {
    flex: 1,
    width: '100%',
  },
  list: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  listContent: {
    flexGrow: 1,
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  loader: {
    marginTop: Spacing.four,
  },
  vazio: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },
});
