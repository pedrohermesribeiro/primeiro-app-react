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
import type { FiltrosTarefasGateway } from '@/composition/gateways';
import { filtrosPadrao, type FiltrosTarefa } from '@/domain/entities/FiltrosTarefa';
import { persistirPreferenciaUi } from '@/presentation/context/persistenciaPreferenciaUi';

type FiltrosTarefasContextValue = {
  filtrosAplicados: FiltrosTarefa;
  carregando: boolean;
  aplicarFiltros: (filtros: FiltrosTarefa) => Promise<void>;
  limparFiltros: () => Promise<void>;
};

const FiltrosTarefasContext = createContext<FiltrosTarefasContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  gateway?: FiltrosTarefasGateway;
};

export function FiltrosTarefasProvider({ children, gateway }: ProviderProps) {
  const { filtrosTarefasGateway: gatewayPadrao } = useAppContainer();
  const storage = gateway ?? gatewayPadrao;
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosTarefa>(filtrosPadrao());
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    void (async () => {
      try {
        const salvos = await storage.get();
        if (ativo) {
          setFiltrosAplicados(salvos);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, [storage]);

  const aplicarFiltros = useCallback(
    async (filtros: FiltrosTarefa) => {
      await persistirPreferenciaUi(
        (valor) => storage.set(valor),
        setFiltrosAplicados,
        filtros,
      );
    },
    [storage],
  );

  const limparFiltros = useCallback(async () => {
    const padrao = filtrosPadrao();
    await persistirPreferenciaUi(
      (valor) => storage.set(valor),
      setFiltrosAplicados,
      padrao,
    );
  }, [storage]);

  const value = useMemo(
    () => ({ filtrosAplicados, carregando, aplicarFiltros, limparFiltros }),
    [aplicarFiltros, carregando, filtrosAplicados, limparFiltros],
  );

  return <FiltrosTarefasContext.Provider value={value}>{children}</FiltrosTarefasContext.Provider>;
}

export function useFiltrosTarefas(): FiltrosTarefasContextValue {
  const context = useContext(FiltrosTarefasContext);
  if (!context) {
    throw new Error('useFiltrosTarefas deve ser usado dentro de FiltrosTarefasProvider.');
  }
  return context;
}
