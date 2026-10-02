import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  podeAlterarPrazo,
  podeArquivar,
  podeConcluir,
  podeExcluir,
  podeRestaurar,
  type Tarefa,
} from '@/domain/entities/Tarefa';

type Props = {
  tarefa: Tarefa;
  categoriaNome: string;
  onConcluir?: (id: string) => void;
  onArquivar?: (id: string) => void;
  onExcluir?: (id: string) => void;
  onRestaurar?: (id: string) => void;
  onAlterarPrazo?: (id: string) => void;
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
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) {
    return iso;
  }
  return `${dia}/${mes}/${ano}`;
}

export function TarefaItem({
  tarefa,
  categoriaNome,
  onConcluir,
  onArquivar,
  onExcluir,
  onRestaurar,
  onAlterarPrazo,
}: Props) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.titulo}>
          {tarefa.titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {rotuloStatus[tarefa.status]}
        </ThemedText>
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
        {onArquivar && podeArquivar(tarefa) && (
          <Pressable onPress={() => onArquivar(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Arquivar</ThemedText>
          </Pressable>
        )}
        {onAlterarPrazo && podeAlterarPrazo(tarefa) && (
          <Pressable onPress={() => onAlterarPrazo(tarefa.id)} style={styles.button}>
            <ThemedText type="smallBold">Alterar prazo</ThemedText>
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
    gap: Spacing.two,
  },
  titulo: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  button: {
    paddingVertical: Spacing.one,
  },
});
