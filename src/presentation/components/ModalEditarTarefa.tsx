import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormTypography, MaxContentWidth, Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { MAX_TITULO_TAREFA, type PrioridadeTarefa, type TipoLembretePrazo } from '@/domain/entities/Tarefa';
import { normalizarLembretes } from '@/domain/lembrete/LembretesTarefa';
import { normalizarPrazoComHorario } from '@/domain/prazo/PrazoTarefa';
import { useTheme } from '@/hooks/use-theme';

import { CampoPrazo } from '@/presentation/components/CampoPrazo';
import { SeletorCategoria } from '@/presentation/components/SeletorCategoria';
import { SeletorPrioridade } from '@/presentation/components/SeletorPrioridade';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';

type Props = {
  visible: boolean;
  categorias: Categoria[];
  tituloInicial: string;
  categoriaIdInicial: string;
  prioridadeInicial: PrioridadeTarefa;
  prazoInicial: string;
  lembretesInicial?: TipoLembretePrazo[];
  erro?: string | null;
  onCancel: () => void;
  onConfirm: (
    titulo: string,
    prazo: string,
    categoriaId: string,
    prioridade: PrioridadeTarefa,
    lembretes: TipoLembretePrazo[],
  ) => void;
};

export function ModalEditarTarefa({
  visible,
  categorias,
  tituloInicial,
  categoriaIdInicial,
  prioridadeInicial,
  prazoInicial,
  lembretesInicial,
  erro,
  onCancel,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const fonteGrande = useFonteGrandeFormulario();
  const [titulo, setTitulo] = useState(tituloInicial);
  const [categoriaId, setCategoriaId] = useState(categoriaIdInicial);
  const [prazo, setPrazo] = useState(prazoInicial);
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>(prioridadeInicial);
  const [lembretes, setLembretes] = useState<TipoLembretePrazo[]>(normalizarLembretes(lembretesInicial));

  useEffect(() => {
    if (visible) {
      setTitulo(tituloInicial);
      setCategoriaId(categoriaIdInicial);
      setPrazo(prazoInicial.trim() ? normalizarPrazoComHorario(prazoInicial) : '');
      setPrioridade(prioridadeInicial);
      setLembretes(normalizarLembretes(lembretesInicial));
    }
  }, [visible, tituloInicial, categoriaIdInicial, prazoInicial, prioridadeInicial, lembretesInicial]);

  const categoriaValida =
    categorias.some((c) => c.id === categoriaId) || categorias.length === 0;

  const campos = (
    <>
      <ThemedText type="subtitle">Editar tarefa</ThemedText>
      <ThemedText type="smallBold">Título</ThemedText>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        maxLength={MAX_TITULO_TAREFA}
        placeholder="Título"
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
        selecionadaId={categoriaValida ? categoriaId : (categorias[0]?.id ?? categoriaId)}
        onSelecionar={setCategoriaId}
      />
      <SeletorPrioridade selecionada={prioridade} onSelecionar={setPrioridade} />
      <CampoPrazo
        value={prazo}
        onChange={setPrazo}
        lembretes={lembretes}
        onLembretesChange={setLembretes}
      />
      {erro ? (
        <ThemedText type="small" style={styles.erro}>
          {erro}
        </ThemedText>
      ) : null}
      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.button}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Cancelar
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() =>
            onConfirm(
              titulo,
              prazo,
              categoriaValida ? categoriaId : (categorias[0]?.id ?? categoriaId),
              prioridade,
              lembretes,
            )
          }
          disabled={!titulo.trim() || categorias.length === 0}
          style={[
            styles.button,
            styles.confirm,
            { backgroundColor: theme.backgroundSelected },
            (!titulo.trim() || categorias.length === 0) && styles.buttonDisabled,
          ]}>
          <ThemedText type="smallBold">Salvar</ThemedText>
        </Pressable>
      </View>
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Fechar" />
        <ThemedView
          type="backgroundElement"
          style={[styles.card, fonteGrande && styles.cardAcessivel]}>
          {fonteGrande ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {campos}
            </ScrollView>
          ) : (
            <View style={styles.cardPadrao}>{campos}</View>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  card: {
    width: '100%',
    maxWidth: MaxContentWidth,
    zIndex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  cardAcessivel: {
    maxHeight: '90%',
  },
  cardPadrao: {
    gap: Spacing.two,
  },
  scrollContent: {
    gap: Spacing.two,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  inputAcessivel: {
    minHeight: 44,
  },
  erro: {
    color: '#c62828',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  button: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
  },
  confirm: {},
  buttonDisabled: {
    opacity: 0.5,
  },
});
