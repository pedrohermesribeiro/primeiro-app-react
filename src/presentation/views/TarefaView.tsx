import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { PrioridadeTarefa, Tarefa, TipoLembretePrazo } from '@/domain/entities/Tarefa';

import { FiltrosAtivosBar } from '@/presentation/components/FiltrosAtivosBar';
import { ModalEditarTarefa } from '@/presentation/components/ModalEditarTarefa';
import { NovaTarefaForm } from '@/presentation/components/NovaTarefaForm';
import { TarefaItem } from '@/presentation/components/TarefaItem';
import { confirmarExclusaoTarefa } from '@/presentation/utils/confirmarExclusaoTarefa';
import { useFiltrosTarefas } from '@/presentation/context/FiltrosTarefasContext';
import { useTarefaViewModel } from '@/presentation/viewmodels/TarefaViewModel';
import { filtrosDiferentesDoPadrao } from '@/domain/entities/FiltrosTarefa';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';

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
  const { filtrosAplicados, limparFiltros } = useFiltrosTarefas();
  const fonteGrande = useFonteGrandeFormulario();
  const [editarId, setEditarId] = useState<string | null>(null);

  const listaFiltrada = filtrosDiferentesDoPadrao(filtrosAplicados);

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
    (
      titulo: string,
      prazo: string,
      categoriaId: string,
      prioridade: PrioridadeTarefa,
      lembretes: TipoLembretePrazo[],
    ) => criar(titulo, prazo, categoriaId, prioridade, lembretes),
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
    async (
      titulo: string,
      prazo: string,
      categoriaId: string,
      prioridade: PrioridadeTarefa,
      lembretes: TipoLembretePrazo[],
    ) => {
      if (!editarId) {
        return;
      }
      const id = editarId;
      const ok = await editar(id, titulo, prazo, categoriaId, prioridade, lembretes);
      if (ok) {
        setEditarId(null);
      }
    },
    [editar, editarId],
  );

  const handleFecharEditar = useCallback(() => {
    setEditarId(null);
  }, []);

  const listHeader = useMemo(
    () => (
      <View style={[styles.listHeader, { paddingTop, paddingHorizontal }]}>
        <NovaTarefaForm
          categorias={categorias}
          onSubmit={handleSubmit}
          erro={editarId ? null : erro}
        />
        <FiltrosAtivosBar />
      </View>
    ),
    [categorias, editarId, erro, handleSubmit, paddingHorizontal, paddingTop],
  );

  const listEmpty = carregando ? (
    <ActivityIndicator style={styles.loader} />
  ) : listaFiltrada ? (
    <View style={styles.vazioComFiltro}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.vazio}>
        Nenhuma tarefa com estes filtros.
      </ThemedText>
      <Pressable onPress={() => void limparFiltros()}>
        <ThemedText type="linkPrimary">Limpar filtros</ThemedText>
      </Pressable>
    </View>
  ) : (
    <ThemedText type="small" themeColor="textSecondary" style={styles.vazio}>
      Nenhuma tarefa ativa.
    </ThemedText>
  );

  return (
    <ThemedView style={styles.container}>
      {!fonteGrande ? (
        <View style={[styles.topSection, { paddingTop, paddingHorizontal }]}>
          <NovaTarefaForm
            categorias={categorias}
            onSubmit={handleSubmit}
            erro={editarId ? null : erro}
          />
          <FiltrosAtivosBar />
        </View>
      ) : null}
      <View style={styles.listArea}>
        {fonteGrande ? (
          <FlatList
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom, paddingHorizontal },
            ]}
            data={tarefas}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={listEmpty}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
          />
        ) : carregando && tarefas.length === 0 ? (
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
            ListEmptyComponent={listEmpty}
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
        prioridadeInicial={tarefaEditar?.prioridade ?? 'baixa'}
        prazoInicial={tarefaEditar?.prazo ?? ''}
        lembretesInicial={tarefaEditar?.lembretes}
        erro={editarId !== null ? erro : null}
        onCancel={handleFecharEditar}
        onConfirm={(titulo, prazo, categoriaId, prioridade, lembretes) =>
          void handleConfirmarEditar(titulo, prazo, categoriaId, prioridade, lembretes)
        }
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
  listHeader: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.two,
    paddingBottom: Spacing.two,
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
  vazioComFiltro: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
});
