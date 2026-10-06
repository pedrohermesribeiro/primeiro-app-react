import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  podeArquivar,
  podeConcluir,
  podeEditarTarefa,
  podeExcluir,
  podeRestaurar,
  type Tarefa,
} from '@/domain/entities/Tarefa';
import { formatarPrazoExibicao } from '@/domain/prazo/PrazoTarefa';
import { PrioridadeBadge } from '@/presentation/components/PrioridadeBadge';

type Props = {
  tarefa: Tarefa;
  categoriaNome: string;
  onConcluir?: (id: string) => void;
  onArquivar?: (id: string) => void;
  onExcluir?: (id: string) => void;
  onRestaurar?: (id: string) => void;
  onEditar?: (id: string) => void;
};

const rotuloStatus: Record<Tarefa['status'], string> = {
  pendente: 'Pendente',
  concluida: 'Concluída',
  arquivada: 'Arquivada',
};

function formatarPrazo(iso?: string): string {
  if (!iso) {
    return '—';
  }
  return formatarPrazoExibicao(iso);
}

export function TarefaItem({
  tarefa,
  categoriaNome,
  onConcluir,
  onArquivar,
  onExcluir,
  onRestaurar,
  onEditar,
}: Props) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.titulo}>
          {tarefa.titulo}
        </ThemedText>
        <View style={styles.headerMeta}>
          <PrioridadeBadge prioridade={tarefa.prioridade} />
          <ThemedText type="small" themeColor="textSecondary">
            {rotuloStatus[tarefa.status]}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Categoria: {categoriaNome}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Prazo: {formatarPrazo(tarefa.prazo)}
      </ThemedText>
      <View style={styles.actions}>
        {onConcluir && podeConcluir(tarefa) && (
          <Pressable onPress={() => onConcluir(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Concluir</ThemedText>
          </Pressable>
        )}
        {onEditar && podeEditarTarefa(tarefa) && (
          <Pressable onPress={() => onEditar(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Editar</ThemedText>
          </Pressable>
        )}
        {onArquivar && podeArquivar(tarefa) && (
          <Pressable onPress={() => onArquivar(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Arquivar</ThemedText>
          </Pressable>
        )}
        {onRestaurar && podeRestaurar(tarefa) && (
          <Pressable onPress={() => onRestaurar(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Restaurar</ThemedText>
          </Pressable>
        )}
        {onExcluir && podeExcluir(tarefa) && (
          <Pressable onPress={() => onExcluir(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Excluir
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  titulo: {
    flex: 1,
    minWidth: 120,
    fontSize: 17,
    lineHeight: 22,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: Spacing.one,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
});
