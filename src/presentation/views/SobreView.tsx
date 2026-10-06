import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const RECURSOS = [
  'Criar, editar, concluir, arquivar, restaurar e excluir tarefas',
  'Prioridades (baixa, média, alta) e categorias (até 12)',
  'Filtros por prioridade, status e prazo; barra de filtros ativos na Home',
  'Abas Home, Resumo e Arquivadas',
  'Prazo com data e hora; lembretes opcionais e notificações locais (build nativo)',
  'Temas: automático, claro, escuro, grafite claro e grafite escuro',
  'Exportar tarefas ativas por WhatsApp (texto) ou e-mail (HTML)',
  'Persistência local no dispositivo',
] as const;

function versaoApp(): string {
  return Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '—';
}

function nomeApp(): string {
  return Constants.expoConfig?.name ?? 'SimpleTaskFlow';
}

function ItemRecurso({ texto }: { texto: string }) {
  return (
    <View style={styles.itemRecurso}>
      <ThemedText type="small" themeColor="textSecondary">
        •
      </ThemedText>
      <ThemedText type="small" style={styles.itemRecursoTexto}>
        {texto}
      </ThemedText>
    </View>
  );
}

export function SobreView() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const versao = versaoApp();
  const nome = nomeApp();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}>
        <ThemedView type="backgroundElement" style={styles.cardHero}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.iconeApp}
            accessibilityLabel="Ícone do aplicativo"
          />
          <ThemedText type="subtitle" style={styles.nomeApp}>
            {nome}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.slogan}>
            Organize. Priorize. Conclua.
          </ThemedText>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Versão {versao}
          </ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionHeading}>
          Sobre o aplicativo
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.paragrafo}>
          O SimpleTaskFlow ajuda você a organizar tarefas acadêmicas e do dia a dia com prazos,
          prioridades e categorias. Foi pensado para uso offline, com interface clara e foco em
          concluir o que importa.
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Recursos
          </ThemedText>
          {RECURSOS.map((texto) => (
            <ItemRecurso key={texto} texto={texto} />
          ))}
        </ThemedView>

        <ThemedView
          type="backgroundSelected"
          style={[styles.card, styles.cardDestaque, { borderColor: theme.textSecondary }]}>
          <ThemedText type="smallBold" style={styles.cardTitle}>
            Privacidade
          </ThemedText>
          <ThemedText type="small" style={styles.paragrafoCard}>
            Seus dados permanecem no dispositivo. Não é necessário cadastro ou login. As tarefas
            não são enviadas para nenhum servidor externo.
          </ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionHeading}>
          Desenvolvimento
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.paragrafo}>
          Desenvolvido por Pedro Hermes Ribeiro.
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.paragrafo}>
          Projeto de estudo em desenvolvimento mobile e arquitetura de software (Clean
          Architecture, MVVM e persistência local).
        </ThemedText>

        <ThemedText type="small" themeColor="textSecondary" style={styles.rodape}>
          © 2026 SimpleTaskFlow
        </ThemedText>
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
    gap: Spacing.two,
  },
  cardHero: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderRadius: Spacing.two,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
  iconeApp: {
    width: 88,
    height: 88,
    borderRadius: Spacing.two,
  },
  nomeApp: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
  },
  slogan: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionHeading: {
    width: '100%',
    maxWidth: MaxContentWidth,
    marginTop: Spacing.one,
  },
  paragrafo: {
    width: '100%',
    maxWidth: MaxContentWidth,
    lineHeight: 22,
  },
  card: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardDestaque: {
    borderWidth: 1,
  },
  cardTitle: {
    marginBottom: Spacing.one,
  },
  paragrafoCard: {
    lineHeight: 22,
  },
  itemRecurso: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  itemRecursoTexto: {
    flex: 1,
    lineHeight: 20,
  },
  rodape: {
    width: '100%',
    maxWidth: MaxContentWidth,
    textAlign: 'center',
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
  },
});
