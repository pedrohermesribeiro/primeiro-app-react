import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { CampoPrazo } from '@/presentation/components/CampoPrazo';

type Props = {
  visible: boolean;
  tituloTarefa: string;
  prazoInicial: string;
  rotuloConfirmar: string;
  onCancel: () => void;
  onConfirm: (prazo: string) => void;
};

export function ModalEditarPrazo({
  visible,
  tituloTarefa,
  prazoInicial,
  rotuloConfirmar,
  onCancel,
  onConfirm,
}: Props) {
  const theme = useTheme();
  const [prazo, setPrazo] = useState(prazoInicial);

  useEffect(() => {
    if (visible) {
      setPrazo(prazoInicial);
    }
  }, [visible, prazoInicial]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Fechar" />
        <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">{tituloTarefa}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Prazo
            </ThemedText>
            <CampoPrazo value={prazo} onChange={setPrazo} />
            <View style={styles.actions}>
              <Pressable onPress={onCancel} style={styles.button}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  Cancelar
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => onConfirm(prazo)}
                style={[styles.button, styles.confirm, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="smallBold">{rotuloConfirmar}</ThemedText>
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
