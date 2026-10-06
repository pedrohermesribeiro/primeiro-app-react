import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { normalizarLembretes, type TipoLembretePrazo } from '@/domain/lembrete/LembretesTarefa';
import { useTheme } from '@/hooks/use-theme';

import { ListaOpcoesLembretes } from '@/presentation/components/ListaOpcoesLembretes';

type Props = {
  visible: boolean;
  lembretes: TipoLembretePrazo[];
  onCancel: () => void;
  onConfirm: (lembretes: TipoLembretePrazo[]) => void;
};

export function ModalLembretesPrazo({ visible, lembretes, onCancel, onConfirm }: Props) {
  const theme = useTheme();
  const [rascunho, setRascunho] = useState<TipoLembretePrazo[]>(() => normalizarLembretes(lembretes));

  useEffect(() => {
    if (visible) {
      setRascunho(normalizarLembretes(lembretes));
    }
  }, [visible, lembretes]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Fechar" />
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">Lembrete</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Quando avisar sobre o prazo
          </ThemedText>
          <ListaOpcoesLembretes lembretes={rascunho} onChange={setRascunho} />
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.button}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Cancelar
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(rascunho)}
              style={[styles.button, styles.confirm, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">Concluído</ThemedText>
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
});
