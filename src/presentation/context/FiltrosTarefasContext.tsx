import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { FiltrosTarefasLocalDataSource } from '@/data/datasources/FiltrosTarefasLocalDataSource';
import { filtrosPadrao, type FiltrosTarefa } from '@/domain/entities/FiltrosTarefa';
import { persistirPreferenciaUi } from '@/presentation/context/persistenciaPreferenciaUi';

type FiltrosTarefasContextValue = {
  filtrosAplicados: FiltrosTarefa;
  carregando: boolean;
  aplicarFiltros: (filtros: FiltrosTarefa) => Promise<void>;
  limparFiltros: () => Promise<void>;
};

const FiltrosTarefasContext = createContext<FiltrosTarefasContextValue | null>(null);

export function FiltrosTarefasProvider({ children }: { children: ReactNode }) {
  const dataSource = useMemo(() => new FiltrosTarefasLocalDataSource(), []);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosTarefa>(filtrosPadrao());
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    void (async () => {
      try {
        const salvos = await dataSource.get();
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
  }, [dataSource]);

  const aplicarFiltros = useCallback(
    async (filtros: FiltrosTarefa) => {
      await persistirPreferenciaUi(
        (valor) => dataSource.set(valor),
        setFiltrosAplicados,
        filtros,
      );
    },
    [dataSource],
  );

  const limparFiltros = useCallback(async () => {
    const padrao = filtrosPadrao();
    await persistirPreferenciaUi(
      (valor) => dataSource.set(valor),
      setFiltrosAplicados,
      padrao,
    );
  }, [dataSource]);

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
