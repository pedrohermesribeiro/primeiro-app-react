import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useAppContainer } from '@/composition/AppContainerContext';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

const DEBOUNCE_MS = 300;

/** iOS/Android: reconcile quando há permissão; sem solicitar permissão aqui. Web: no-op. */
export function NotificacoesTarefasSync() {
  const { revision } = useTarefaRefresh();
  const { sincronizarNotificacoes } = useAppContainer();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    void sincronizarNotificacoes.executar();
  }, [sincronizarNotificacoes]);

  useEffect(() => {
    if (Platform.OS === 'web' || revision === 0) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      void sincronizarNotificacoes.executar();
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [revision, sincronizarNotificacoes]);

  return null;
}
