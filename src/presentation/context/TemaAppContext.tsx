import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAppContainer } from '@/composition/AppContainerContext';
import type { TemaAppGateway } from '@/composition/gateways';
import {
  preferenciaTemaPadrao,
  type PreferenciaTema,
} from '@/domain/theme/PreferenciaTema';
import { persistirPreferenciaUi } from '@/presentation/context/persistenciaPreferenciaUi';

type TemaAppContextValue = {
  preferencia: PreferenciaTema;
  setPreferencia: (preferencia: PreferenciaTema) => Promise<void>;
};

const TemaAppContext = createContext<TemaAppContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  gateway?: TemaAppGateway;
};

export function TemaAppProvider({ children, gateway }: ProviderProps) {
  const { temaAppGateway: gatewayPadrao } = useAppContainer();
  const storage = gateway ?? gatewayPadrao;
  const [preferencia, setPreferenciaState] = useState<PreferenciaTema>(preferenciaTemaPadrao());

  useEffect(() => {
    let ativo = true;
    void (async () => {
      const salva = await storage.get();
      if (ativo) {
        setPreferenciaState(salva);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [storage]);

  const setPreferencia = useCallback(
    async (nova: PreferenciaTema) => {
      await persistirPreferenciaUi(
        (valor) => storage.set(valor),
        setPreferenciaState,
        nova,
      );
    },
    [storage],
  );

  const value = useMemo(
    () => ({
      preferencia,
      setPreferencia,
    }),
    [preferencia, setPreferencia],
  );

  return <TemaAppContext.Provider value={value}>{children}</TemaAppContext.Provider>;
}

export function useTemaApp() {
  const ctx = useContext(TemaAppContext);
  if (!ctx) {
    throw new Error('useTemaApp deve ser usado dentro de TemaAppProvider');
  }
  return ctx;
}
