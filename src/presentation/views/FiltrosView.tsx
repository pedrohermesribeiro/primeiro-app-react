import { useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  STATUS_TODOS_FILTRO,
  statusesIguaisTodos,
  type FiltrosTarefa,
  type TipoFiltroPrazo,
} from '@/domain/entities/FiltrosTarefa';
import type { StatusTarefa } from '@/domain/entities/Tarefa';
import { useTheme } from '@/hooks/use-theme';
import { FiltroCheckboxLinha } from '@/presentation/components/FiltroCheckboxLinha';
import { FiltroPrioridadeChips } from '@/presentation/components/FiltroPrioridadeChips';
import { useFiltrosTarefas } from '@/presentation/context/FiltrosTarefasContext';

const OPCOES_PRAZO: { id: TipoFiltroPrazo; label: string }[] = [
  { id: 'atrasadas', label: 'Atrasadas' },
  { id: 'hoje', label: 'Hoje' },
  { id: 'esta_semana', label: 'Esta semana' },
  { id: 'este_mes', label: 'Este mês' },
];

function cloneFiltros(f: FiltrosTarefa): FiltrosTarefa {
  return {
    prioridades: [...f.prioridades],
    statuses: [...f.statuses],
    prazos: [...f.prazos],
  };
}

export function FiltrosView() {
  const theme = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { filtrosAplicados, aplicarFiltros, limparFiltros } = useFiltrosTarefas();
  const [rascunho, setRascunho] = useState<FiltrosTarefa>(() => cloneFiltros(filtrosAplicados));

  useEffect(() => {
    setRascunho(cloneFiltros(filtrosAplicados));
  }, [filtrosAplicados]);

  const handleLimparTudo = useCallback(async () => {
    await limparFiltros();
  }, [limparFiltros]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => void handleLimparTudo()} hitSlop={8} style={styles.headerAction}>
          <ThemedText type="linkPrimary">Limpar tudo</ThemedText>
        </Pressable>
      ),
    });
  }, [handleLimparTudo, navigation]);

  const todasSituation = statusesIguaisTodos(rascunho.statuses);
  const todasDatas = rascunho.prazos.length === 0;

  const setStatus = useCallback((status: StatusTarefa, marcado: boolean) => {
    setRascunho((prev) => {
      const next = cloneFiltros(prev);
      if (marcado) {
        if (!next.statuses.includes(status)) {
          next.statuses.push(status);
        }
      } else {
        next.statuses = next.statuses.filter((s) => s !== status);
      }
      if (next.statuses.length === 0) {
        next.statuses = ['pendente'];
      }
      return next;
    });
  }, []);

  const toggleTodasSituation = useCallback(() => {
    setRascunho((prev) => ({
      ...prev,
      statuses: todasSituation ? ['pendente', 'concluida'] : [...STATUS_TODOS_FILTRO],
    }));
  }, [todasSituation]);

  const togglePrazo = useCallback((tipo: TipoFiltroPrazo, marcado: boolean) => {
    setRascunho((prev) => {
      const next = cloneFiltros(prev);
      if (marcado) {
        if (!next.prazos.includes(tipo)) {
          next.prazos.push(tipo);
        }
      } else {
        next.prazos = next.prazos.filter((p) => p !== tipo);
      }
      return next;
    });
  }, []);

  const toggleTodasDatas = useCallback(() => {
    setRascunho((prev) => ({ ...prev, prazos: [] }));
  }, []);

  const handleAplicar = useCallback(async () => {
    await aplicarFiltros(rascunho);
    router.back();
  }, [aplicarFiltros, rascunho, router]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.four + 56 },
        ]}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <FiltroPrioridadeChips
            selecionadas={rascunho.prioridades}
            onAlterar={(prioridades) => setRascunho((p) => ({ ...p, prioridades }))}
          />

          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Situação
          </ThemedText>
          <FiltroCheckboxLinha label="Todas" marcado={todasSituation} onToggle={toggleTodasSituation} />
          <FiltroCheckboxLinha
            label="Pendentes"
            marcado={rascunho.statuses.includes('pendente')}
            onToggle={() => setStatus('pendente', !rascunho.statuses.includes('pendente'))}
          />
          <FiltroCheckboxLinha
            label="Concluídas"
            marcado={rascunho.statuses.includes('concluida')}
            onToggle={() => setStatus('concluida', !rascunho.statuses.includes('concluida'))}
          />
          <FiltroCheckboxLinha
            label="Arquivadas"
            marcado={rascunho.statuses.includes('arquivada')}
            onToggle={() => setStatus('arquivada', !rascunho.statuses.includes('arquivada'))}
          />

          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Datas
          </ThemedText>
          <FiltroCheckboxLinha label="Todas" marcado={todasDatas} onToggle={toggleTodasDatas} />
          <FiltroCheckboxLinha
            label="Atrasadas"
            marcado={rascunho.prazos.includes('atrasadas')}
            onToggle={() => togglePrazo('atrasadas', !rascunho.prazos.includes('atrasadas'))}
            icon={
              <SymbolView
                name={{ ios: 'calendar.badge.exclamationmark', android: 'event_busy', web: 'event_busy' }}
                size={18}
                tintColor="#dc2626"
              />
            }
          />
          <FiltroCheckboxLinha
            label="Hoje"
            marcado={rascunho.prazos.includes('hoje')}
            onToggle={() => togglePrazo('hoje', !rascunho.prazos.includes('hoje'))}
            icon={
              <SymbolView
                name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
                size={18}
                tintColor={theme.text}
              />
            }
          />
          {OPCOES_PRAZO.filter((o) => o.id !== 'atrasadas' && o.id !== 'hoje').map((opcao) => (
            <FiltroCheckboxLinha
              key={opcao.id}
              label={opcao.label}
              marcado={rascunho.prazos.includes(opcao.id)}
              onToggle={() => togglePrazo(opcao.id, !rascunho.prazos.includes(opcao.id))}
            />
          ))}
        </ThemedView>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.two }]}>
        <Pressable
          onPress={() => void handleAplicar()}
          style={[styles.applyButton, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="smallBold">Aplicar filtros</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  sectionTitle: {
    marginTop: Spacing.one,
  },
  headerAction: {
    paddingHorizontal: Spacing.two,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  applyButton: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
});
