import { useCallback, useEffect, useState } from 'react';

import {
  MAX_CATEGORIAS,
  MIN_CATEGORIAS,
  podeExcluirCategoria,
  podeIncluirCategoria,
  type Categoria,
} from '@/domain/entities/Categoria';
import { useAppContainer } from '@/composition/AppContainerContext';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

export function useCategoriasViewModel() {
  const { notifyTarefasChanged } = useTarefaRefresh();
  const { categorias: useCases } = useAppContainer();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const podeIncluir = podeIncluirCategoria(categorias.length);
  const podeExcluir = podeExcluirCategoria(categorias.length);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const lista = await useCases.listarCategorias.executar();
      setCategorias(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar categorias.');
    } finally {
      setCarregando(false);
    }
  }, [useCases.listarCategorias]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const incluir = useCallback(
    async (nome: string) => {
      setEnviando(true);
      setErro(null);
      try {
        await useCases.incluirCategoria.executar({ nome });
        await carregar();
        notifyTarefasChanged();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao incluir categoria.');
        throw e;
      } finally {
        setEnviando(false);
      }
    },
    [carregar, notifyTarefasChanged, useCases.incluirCategoria],
  );

  const excluir = useCallback(
    async (categoriaId: string) => {
      setEnviando(true);
      setErro(null);
      try {
        await useCases.excluirCategoria.executar(categoriaId);
        await carregar();
        notifyTarefasChanged();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir categoria.');
        throw e;
      } finally {
        setEnviando(false);
      }
    },
    [carregar, notifyTarefasChanged, useCases.excluirCategoria],
  );

  return {
    categorias,
    carregando,
    erro,
    enviando,
    podeIncluir,
    podeExcluir,
    maxCategorias: MAX_CATEGORIAS,
    minCategorias: MIN_CATEGORIAS,
    incluir,
    excluir,
    carregar,
  };
}
