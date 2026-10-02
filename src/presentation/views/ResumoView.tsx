import { useCallback } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

import { ResumoTarefasCard } from '@/presentation/components/ResumoTarefasCard';
import { useResumoViewModel } from '@/presentation/viewmodels/ResumoViewModel';

export function ResumoView() {
  const insets = useSafeAreaInsets();
  const { resumo, categorias, carregando, erro, carregar } = useResumoViewModel();

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const paddingTop = Platform.select({
    web: Spacing.four,
    default: insets.top + Spacing.two,
  });
  const paddingBottom = insets.bottom + BottomTabInset + Spacing.four;
  const paddingHorizontal = Platform.select({ web: Spacing.three, default: Spacing.four });

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop, paddingBottom, paddingHorizontal },
        ]}>
        <ThemedText type="subtitle" style={styles.heading}>
          Resumo
        </ThemedText>
        {erro ? (
          <ThemedText type="small" style={styles.erro}>
            {erro}
          </ThemedText>
        ) : null}
        {carregando && !resumo ? (
          <ActivityIndicator style={styles.loader} />
        ) : resumo ? (
          <ResumoTarefasCard resumo={resumo} categorias={categorias} />
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heading: {
    marginBottom: Spacing.two,
  },
  loader: {
    marginTop: Spacing.four,
  },
  erro: {
    color: '#c62828',
    marginBottom: Spacing.two,
  },
});
