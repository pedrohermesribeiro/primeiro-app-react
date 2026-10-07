import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { createAppContainer, type AppContainer } from '@/composition/AppContainer';

const AppContainerContext = createContext<AppContainer | null>(null);

type Props = {
  children: ReactNode;
  container?: AppContainer;
};

export function AppContainerProvider({ children, container }: Props) {
  const value = useMemo(() => container ?? createAppContainer(), [container]);
  return <AppContainerContext.Provider value={value}>{children}</AppContainerContext.Provider>;
}

export function useAppContainer(): AppContainer {
  const ctx = useContext(AppContainerContext);
  if (!ctx) {
    throw new Error('useAppContainer deve ser usado dentro de AppContainerProvider.');
  }
  return ctx;
}
