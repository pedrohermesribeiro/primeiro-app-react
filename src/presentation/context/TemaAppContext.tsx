import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { TemaAppLocalDataSource } from '@/data/datasources/TemaAppLocalDataSource';
import {
  preferenciaTemaPadrao,
  type PreferenciaTema,
} from '@/domain/theme/PreferenciaTema';

type TemaAppContextValue = {
  preferencia: PreferenciaTema;
  setPreferencia: (preferencia: PreferenciaTema) => Promise<void>;
};

const TemaAppContext = createContext<TemaAppContextValue | null>(null);

export function TemaAppProvider({ children }: { children: ReactNode }) {
  const dataSource = useMemo(() => new TemaAppLocalDataSource(), []);
  const [preferencia, setPreferenciaState] = useState<PreferenciaTema>(preferenciaTemaPadrao());

  useEffect(() => {
    let ativo = true;
    void (async () => {
      const salva = await dataSource.get();
      if (ativo) {
        setPreferenciaState(salva);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [dataSource]);

  const setPreferencia = useCallback(
    async (nova: PreferenciaTema) => {
      setPreferenciaState(nova);
      await dataSource.set(nova);
    },
    [dataSource],
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
