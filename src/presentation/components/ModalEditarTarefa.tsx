import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import { MAX_TITULO_TAREFA } from '@/domain/entities/Tarefa';
import { useTheme } from '@/hooks/use-theme';

import { CampoPrazo } from '@/presentation/components/CampoPrazo';
import { SeletorCategoria } from '@/presentation/components/SeletorCategoria';

type Props = {
  visible: boolean;
  categorias: Categoria[];
  tituloInicial: string;
  categoriaIdInicial: string;
  prazoInicial: string;
  erro?: string | null;
  onCancel: () => void;
  onConfirm: (titulo: string, prazo: string, categoriaId: string) => void;
};

export function ModalEditarTarefa({
  visible,
  categorias,
  tituloInicial,
  categoriaIdInicial,
  prazoInicial,
  erro,
  onCancel,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const [titulo, setTitulo] = useState(tituloInicial);
  const [categoriaId, setCategoriaId] = useState(categoriaIdInicial);
  const [prazo, setPrazo] = useState(prazoInicial);

  useEffect(() => {
    if (visible) {
      setTitulo(tituloInicial);
      setCategoriaId(categoriaIdInicial);
      setPrazo(prazoInicial);
    }
  }, [visible, tituloInicial, categoriaIdInicial, prazoInicial]);

  const categoriaValida =
    categorias.some((c) => c.id === categoriaId) || categorias.length === 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Fechar" />
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">Editar tarefa</ThemedText>
          <ThemedText type="smallBold">Título</ThemedText>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            maxLength={MAX_TITULO_TAREFA}
            placeholder="Título"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
          />
          <SeletorCategoria
            categorias={categorias}
            selecionadaId={categoriaValida ? categoriaId : (categorias[0]?.id ?? categoriaId)}
            onSelecionar={setCategoriaId}
          />
          <CampoPrazo value={prazo} onChange={setPrazo} />
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
