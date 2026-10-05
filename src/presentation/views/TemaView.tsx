import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import type { PreferenciaTema } from '@/domain/theme/PreferenciaTema';
import { FiltroCheckboxLinha } from '@/presentation/components/FiltroCheckboxLinha';
import { useTemaApp } from '@/presentation/context/TemaAppContext';

const OPCOES: { id: PreferenciaTema; label: string }[] = [
  { id: 'system', label: 'Automático (sistema)' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
  { id: 'grafiteClaro', label: 'Grafite claro' },
  { id: 'grafiteEscuro', label: 'Grafite escuro' },
];

export function TemaView() {
  const insets = useSafeAreaInsets();
  const { preferencia, setPreferencia } = useTemaApp();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Aparência
          </ThemedText>
          {OPCOES.map((opcao) => (
            <FiltroCheckboxLinha
              key={opcao.id}
              label={opcao.label}
              marcado={preferencia === opcao.id}
              onToggle={() => void setPreferencia(opcao.id)}
            />
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  sectionTitle: {
    marginBottom: Spacing.two,
  },
});
