import { useCallback, useEffect, useMemo, useState } from 'react';

import { IncluirCategoria } from '@/application/usecases/IncluirCategoria';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { MAX_CATEGORIAS, podeIncluirCategoria, type Categoria } from '@/domain/entities/Categoria';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

export function useCategoriasViewModel() {
  const { notifyTarefasChanged } = useTarefaRefresh();
  const { repo, incluirCategoria } = useMemo(() => {
    const repo = new CategoriaRepositoryImpl();
    return {
      repo,
      incluirCategoria: new IncluirCategoria(repo),
    };
  }, []);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const podeIncluir = podeIncluirCategoria(categorias.length);

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

  return {
    categorias,
    carregando,
    erro,
    enviando,
    podeIncluir,
    maxCategorias: MAX_CATEGORIAS,
    incluir,
    carregar,
  };
}
