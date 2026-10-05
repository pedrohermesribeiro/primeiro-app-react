import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { APP_MENU_ITEMS, type AppMenuItemId } from '@/presentation/constants/appMenuItems';
import { useExportarDados } from '@/presentation/hooks/useExportarDados';

export function AppMenuHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { exportarPara, exportando } = useExportarDados();
  const [open, setOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const handleItemPress = useCallback(
    (id: AppMenuItemId) => {
      close();
      if (id === 'filtros') {
        router.push('/filtros');
      } else if (id === 'categorias') {
        router.push('/categorias');
      } else if (id === 'tema') {
        router.push('/tema');
      } else if (id === 'exportar') {
        setExportOpen(true);
      }
    },
    [close, router],
  );

  const closeExport = useCallback(() => {
    setExportOpen(false);
  }, []);

  const handleExportWhatsApp = useCallback(() => {
    closeExport();
    void exportarPara('whatsapp');
  }, [closeExport, exportarPara]);

  const handleExportEmail = useCallback(() => {
    closeExport();
    void exportarPara('email');
  }, [closeExport, exportarPara]);

  const items = useMemo(
    () =>
      APP_MENU_ITEMS.map((item) => ({
        ...item,
        onPress: () => handleItemPress(item.id),
      })),
    [handleItemPress],
  );

  const toggle = useCallback(() => {
    setOpen((value) => !value);
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
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <SymbolView tintColor={theme.text} size={20} name={item.icon} />
                  <ThemedText type="small" style={styles.menuItemLabel}>
                    {item.label}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={exportOpen} transparent animationType="fade" onRequestClose={closeExport}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={closeExport}
          accessibilityLabel="Fechar exportação">
          <View style={[styles.modalMenuAnchor, { paddingTop: insets.top + Spacing.two + 40 }]}>
            <ThemedView type="backgroundElement" style={styles.dropdown}>
              <ThemedText type="smallBold" style={styles.exportTitle}>
                Exportar dados
              </ThemedText>
              <Pressable
                disabled={exportando}
                onPress={handleExportWhatsApp}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: theme.backgroundSelected },
                  exportando && styles.disabled,
                ]}>
                <SymbolView
                  tintColor={theme.text}
                  size={20}
                  name={{ ios: 'message', android: 'chat', web: 'chat' }}
                />
                <ThemedText type="small" style={styles.menuItemLabel}>
                  WhatsApp
                </ThemedText>
              </Pressable>
              <Pressable
                disabled={exportando}
                onPress={handleExportEmail}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: theme.backgroundSelected },
                  exportando && styles.disabled,
                ]}>
                <SymbolView
                  tintColor={theme.text}
                  size={20}
                  name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
                />
                <ThemedText type="small" style={styles.menuItemLabel}>
                  E-mail
                </ThemedText>
              </Pressable>
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
    minWidth: 228,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.one,
    elevation: 4,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Spacing.two,
    marginHorizontal: Spacing.one,
  },
  menuItemLabel: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  exportTitle: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
  },
  disabled: {
    opacity: 0.5,
  },
});
