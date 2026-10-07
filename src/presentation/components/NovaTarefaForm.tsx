import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormTypography, Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import {
  MAX_TITULO_TAREFA,
  PRIORIDADE_PADRAO,
  type PrioridadeTarefa,
  type TipoLembretePrazo,
} from '@/domain/entities/Tarefa';
import { lembretesPadrao } from '@/domain/lembrete/LembretesTarefa';
import { useTheme } from '@/hooks/use-theme';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';

import { CampoPrazo } from '@/presentation/components/CampoPrazo';
import { SeletorCategoria } from '@/presentation/components/SeletorCategoria';
import { SeletorPrioridade } from '@/presentation/components/SeletorPrioridade';
import {
  botaoNovaTarefaDesabilitado,
  processarEnvioNovaTarefa,
  type SubmitNovaTarefa,
} from '@/presentation/components/novaTarefaFormEnvio';

type Props = {
  categorias: Categoria[];
  onSubmit: SubmitNovaTarefa;
  erro?: string | null;
};

export function NovaTarefaForm({ categorias, onSubmit, erro }: Props) {
  const theme = useTheme();
  const fonteGrande = useFonteGrandeFormulario();
  const [titulo, setTitulo] = useState('');
  const [prazo, setPrazo] = useState('');
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? 'estudos');
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>(PRIORIDADE_PADRAO);
  const [lembretes, setLembretes] = useState<TipoLembretePrazo[]>(lembretesPadrao());
  const [enviando, setEnviando] = useState(false);

  const limparCampos = useCallback(() => {
    setTitulo('');
    setPrazo('');
    setPrioridade(PRIORIDADE_PADRAO);
    setLembretes(lembretesPadrao());
  }, []);

  const handleCriar = useCallback(async () => {
    setEnviando(true);
    try {
      await processarEnvioNovaTarefa(
        onSubmit,
        titulo,
        prazo,
        categoriaId,
        prioridade,
        lembretes,
        limparCampos,
      );
    } finally {
      setEnviando(false);
    }
  }, [categoriaId, lembretes, limparCampos, onSubmit, prazo, prioridade, titulo]);

  return (
    <>
      <ThemedText type="subtitle" style={styles.heading}>
        Lista de tarefas
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.form}>
        <ThemedText type="smallBold">Nova tarefa</ThemedText>
        {fonteGrande ? <ThemedText type="smallBold">Título</ThemedText> : null}
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          maxLength={MAX_TITULO_TAREFA}
          placeholderTextColor={theme.textSecondary}
          allowFontScaling
          accessibilityLabel="Título da tarefa"
          style={[
            styles.input,
            fonteGrande && styles.inputAcessivel,
            FormTypography.input,
            { color: theme.text, borderColor: theme.backgroundSelected },
          ]}
        />
        <SeletorCategoria
          categorias={categorias}
          selecionadaId={categoriaId}
          onSelecionar={setCategoriaId}
        />
        <SeletorPrioridade selecionada={prioridade} onSelecionar={setPrioridade} />
        <CampoPrazo
          value={prazo}
          onChange={setPrazo}
          lembretes={lembretes}
          onLembretesChange={setLembretes}
        />
        <Pressable
          onPress={() => void handleCriar()}
          disabled={botaoNovaTarefaDesabilitado(enviando, titulo, categoriaId)}
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
  },
  inputAcessivel: {
    minHeight: 44,
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
