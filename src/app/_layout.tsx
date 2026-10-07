import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppContainerProvider } from '@/composition/AppContainerContext';
import { paletaUsaChromeClaro } from '@/domain/theme/PreferenciaTema';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { FiltrosTarefasProvider } from '@/presentation/context/FiltrosTarefasContext';
import { NotificacoesTarefasSync } from '@/presentation/components/NotificacoesTarefasSync';
import { TarefaRefreshProvider } from '@/presentation/context/TarefaRefreshContext';
import { TemaAppProvider } from '@/presentation/context/TemaAppContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const paleta = useAppColorScheme();
  const navigationTheme = paletaUsaChromeClaro(paleta) ? DefaultTheme : DarkTheme;

  return (
    <ThemeProvider value={navigationTheme}>
      <View style={styles.root}>
        <AnimatedSplashOverlay />
        <FiltrosTarefasProvider>
          <TarefaRefreshProvider>
            <NotificacoesTarefasSync />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="categorias"
                options={{
                  title: 'Gerenciar categorias',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="filtros"
                options={{
                  title: 'Filtros',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="tema"
                options={{
                  title: 'Tema',
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="sobre"
                options={{
                  title: 'Sobre',
                  presentation: 'card',
                }}
              />
            </Stack>
          </TarefaRefreshProvider>
        </FiltrosTarefasProvider>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppContainerProvider>
        <TemaAppProvider>
          <RootLayoutNav />
        </TemaAppProvider>
      </AppContainerProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
  },
});
