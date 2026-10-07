import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useAppContainer } from '@/composition/AppContainerContext';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

const DEBOUNCE_MS = 300;

/** iOS/Android: permissão na abertura + reconcile após mutações (debounce). Web: no-op. */
export function NotificacoesTarefasSync() {
  const { revision } = useTarefaRefresh();
  const { sincronizarNotificacoes, notificacaoPort } = useAppContainer();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    void (async () => {
      await notificacaoPort.solicitarPermissao();
      await sincronizarNotificacoes.executar();
    })();
  }, [notificacaoPort, sincronizarNotificacoes]);

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
