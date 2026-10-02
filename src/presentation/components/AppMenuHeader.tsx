import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MenuItem = {
  id: string;
  label: string;
  onPress: () => void;
};

export function AppMenuHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const items: MenuItem[] = useMemo(
    () => [
      {
        id: 'categorias',
        label: 'Categorias',
        onPress: () => {
          setOpen(false);
          router.push('/categorias');
        },
      },
    ],
    [router],
  );

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { paddingTop: insets.top + Spacing.two }]}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
        style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
        <SymbolView
          tintColor={theme.text}
          size={22}
          name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
        />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.modalBackdrop} onPress={close} accessibilityLabel="Fechar menu">
          <View style={[styles.modalMenuAnchor, { paddingTop: insets.top + Spacing.two + 40 }]}>
            <ThemedView type="backgroundElement" style={styles.dropdown}>
              {items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
                  <ThemedText type="small">{item.label}</ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: Spacing.three,
    zIndex: 300,
    alignItems: 'flex-end',
  },
  menuButton: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalMenuAnchor: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: Spacing.three,
  },
  dropdown: {
    minWidth: 160,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.one,
    elevation: 4,
  },
  menuItem: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
