import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { useTheme } from '@/hooks/use-theme';

import { CampoPrazo } from '@/presentation/components/CampoPrazo';
import { SeletorCategoria } from '@/presentation/components/SeletorCategoria';

type Props = {
  categorias: Categoria[];
  onSubmit: (titulo: string, prazo: string, categoriaId: string) => Promise<void>;
  erro?: string | null;
};

export function NovaTarefaForm({ categorias, onSubmit, erro }: Props) {
  const theme = useTheme();
  const [titulo, setTitulo] = useState('');
  const [prazo, setPrazo] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? 'estudos');
  const [enviando, setEnviando] = useState(false);

  const handleCriar = useCallback(async () => {
    setEnviando(true);
    try {
      await onSubmit(titulo, prazo, categoriaId);
      setTitulo('');
      setPrazo('');
    } finally {
      setEnviando(false);
    }
  }, [categoriaId, onSubmit, prazo, titulo]);

  return (
    <>
      <ThemedText type="subtitle" style={styles.heading}>
        Lista de tarefas
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.form}>
        <ThemedText type="smallBold">Nova tarefa</ThemedText>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
        <SeletorCategoria
          categorias={categorias}
          selecionadaId={categoriaId}
          onSelecionar={setCategoriaId}
        />
        <CampoPrazo value={prazo} onChange={setPrazo} />
        <Pressable
          onPress={() => void handleCriar()}
          disabled={enviando || !titulo.trim() || !categoriaId}
          style={[styles.criarButton, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">{enviando ? 'Salvando…' : 'Adicionar'}</ThemedText>
        </Pressable>
      </ThemedView>

      {erro ? (
        <ThemedText type="small" style={styles.erro}>
          {erro}
        </ThemedText>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: Spacing.two,
  },
  form: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    width: '100%',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  criarButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
  },
  erro: {
    color: '#c62828',
    marginTop: Spacing.two,
  },
});
