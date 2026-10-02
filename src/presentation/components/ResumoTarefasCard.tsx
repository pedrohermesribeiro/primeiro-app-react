import { useMemo } from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Categoria } from '@/domain/entities/Categoria';
import type { ResumoTarefas } from '@/domain/entities/ResumoTarefas';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  resumo: ResumoTarefas;
  categorias: Categoria[];
};

function ResumoMetricCard({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.metricCard}>
      <ThemedText type="title" style={styles.metricValue}>
        {valor}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.metricLabel}>
        {rotulo}
      </ThemedText>
    </ThemedView>
  );
}

function ResumoCategoriaRow({
  nome,
  count,
  maxCount,
}: {
  nome: string;
  count: number;
  maxCount: number;
}) {
  const theme = useTheme();
  const fillWidth: DimensionValue =
    maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%';

  return (
    <View style={styles.categoriaRow}>
      <View style={styles.categoriaHeader}>
        <ThemedText type="smallBold">{nome}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {count}
        </ThemedText>
      </View>
      <ThemedView type="backgroundElement" style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: fillWidth,
              backgroundColor: theme.text,
            },
          ]}
        />
      </ThemedView>
    </View>
  );
}

export function ResumoTarefasCard({ resumo, categorias }: Props) {
  const categoriasOrdenadas = useMemo(
    () => [...categorias].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [categorias],
  );

  const maxCount = useMemo(() => {
    let max = 0;
    for (const categoria of categoriasOrdenadas) {
      const count = resumo.porCategoria[categoria.id] ?? 0;
      if (count > max) max = count;
    }
    return Math.max(1, max);
  }, [categoriasOrdenadas, resumo.porCategoria]);

  return (
    <View style={styles.container}>
      <View style={styles.metricRow}>
        <ResumoMetricCard valor={resumo.totalAtivas} rotulo="Ativas" />
        <ResumoMetricCard valor={resumo.totalArquivadas} rotulo="Arquivadas" />
      </View>

      <ThemedText type="smallBold" style={styles.sectionTitle}>
        Status
      </ThemedText>
      <View style={styles.metricRow}>
        <ResumoMetricCard valor={resumo.porStatus.pendente} rotulo="Pendentes" />
        <ResumoMetricCard valor={resumo.porStatus.concluida} rotulo="Concluídas" />
      </View>

      <ThemedText
        type="smallBold"
        style={styles.sectionTitle}
        accessibilityRole="header">
        Por categoria (ativas)
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.sectionHint}>
        Pendentes e concluídas; arquivadas não entram.
      </ThemedText>
      <View
        style={styles.categoriaList}
        accessibilityLabel="Tarefas ativas por categoria">
        {categoriasOrdenadas.map((categoria) => (
          <ResumoCategoriaRow
            key={categoria.id}
            nome={categoria.nome}
            count={resumo.porCategoria[categoria.id] ?? 0}
            maxCount={maxCount}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    width: '100%',
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.one,
  },
  metricValue: {
    textAlign: 'center',
  },
  metricLabel: {
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: Spacing.one,
  },
  sectionHint: {
    marginBottom: Spacing.one,
  },
  categoriaList: {
    gap: Spacing.three,
  },
  categoriaRow: {
    gap: Spacing.one,
  },
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 0,
  },
});
