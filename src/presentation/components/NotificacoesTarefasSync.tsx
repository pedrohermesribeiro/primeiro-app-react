import { useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';

import { SincronizarNotificacoesTarefas } from '@/application/usecases/SincronizarNotificacoesTarefas';
import { ExpoNotificacaoTarefaAdapter } from '@/data/notificacoes/ExpoNotificacaoTarefaAdapter';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

const DEBOUNCE_MS = 300;

/** iOS/Android: permissão na abertura + reconcile após mutações (debounce). Web: no-op. */
export function NotificacoesTarefasSync() {
  const { revision } = useTarefaRefresh();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sincronizar = useMemo(
    () =>
      new SincronizarNotificacoesTarefas(
        new TarefaRepositoryImpl(),
        new ExpoNotificacaoTarefaAdapter(),
      ),
    [],
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    void (async () => {
      const adapter = new ExpoNotificacaoTarefaAdapter();
      await adapter.solicitarPermissao();
      await sincronizar.executar();
    })();
  }, [sincronizar]);

  useEffect(() => {
    if (Platform.OS === 'web' || revision === 0) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      void sincronizar.executar();
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [revision, sincronizar]);

  return null;
}
