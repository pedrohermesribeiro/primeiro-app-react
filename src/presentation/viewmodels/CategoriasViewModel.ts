import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExcluirCategoria } from '@/application/usecases/ExcluirCategoria';
import { IncluirCategoria } from '@/application/usecases/IncluirCategoria';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import {
  MAX_CATEGORIAS,
  MIN_CATEGORIAS,
  podeExcluirCategoria,
  podeIncluirCategoria,
  type Categoria,
} from '@/domain/entities/Categoria';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

export function useCategoriasViewModel() {
  const { notifyTarefasChanged } = useTarefaRefresh();
  const { repo, incluirCategoria, excluirCategoria } = useMemo(() => {
    const repo = new CategoriaRepositoryImpl();
    const tarefaRepo = new TarefaRepositoryImpl();
    return {
      repo,
      incluirCategoria: new IncluirCategoria(repo),
      excluirCategoria: new ExcluirCategoria(repo, tarefaRepo),
    };
  }, []);

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
      const lista = await repo.listar();
      setCategorias(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar categorias.');
    } finally {
      setCarregando(false);
    }
  }, [repo]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const incluir = useCallback(
    async (nome: string) => {
      setEnviando(true);
      setErro(null);
      try {
        await incluirCategoria.executar({ nome });
        await carregar();
        notifyTarefasChanged();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao incluir categoria.');
        throw e;
      } finally {
        setEnviando(false);
      }
    },
    [carregar, incluirCategoria, notifyTarefasChanged],
  );

  const excluir = useCallback(
    async (categoriaId: string) => {
      setEnviando(true);
      setErro(null);
      try {
        await excluirCategoria.executar(categoriaId);
        await carregar();
        notifyTarefasChanged();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir categoria.');
        throw e;
      } finally {
        setEnviando(false);
      }
    },
    [carregar, excluirCategoria, notifyTarefasChanged],
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
