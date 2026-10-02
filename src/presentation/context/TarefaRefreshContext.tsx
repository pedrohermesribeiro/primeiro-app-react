import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type TarefaRefreshContextValue = {
  revision: number;
  notifyTarefasChanged: () => void;
};

const TarefaRefreshContext = createContext<TarefaRefreshContextValue | null>(null);

export function TarefaRefreshProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);

  const notifyTarefasChanged = useCallback(() => {
    setRevision((value) => value + 1);
  }, []);

  const value = useMemo(
    () => ({ revision, notifyTarefasChanged }),
    [revision, notifyTarefasChanged],
  );

  return (
    <TarefaRefreshContext.Provider value={value}>{children}</TarefaRefreshContext.Provider>
  );
}

export function useTarefaRefresh(): TarefaRefreshContextValue {
  const context = useContext(TarefaRefreshContext);
  if (!context) {
    throw new Error('useTarefaRefresh deve ser usado dentro de TarefaRefreshProvider.');
  }
  return context;
}
