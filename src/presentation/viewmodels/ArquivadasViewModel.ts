import { useCallback, useEffect, useMemo, useState } from 'react';

import { ExcluirDefinitivamente } from '@/application/usecases/ExcluirDefinitivamente';
import { ListarTarefasArquivadas } from '@/application/usecases/ListarTarefasArquivadas';
import { RestaurarTarefa } from '@/application/usecases/RestaurarTarefa';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import type { Categoria } from '@/domain/entities/Categoria';
import type { Tarefa } from '@/domain/entities/Tarefa';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

export function useArquivadasViewModel() {
  const { revision, notifyTarefasChanged } = useTarefaRefresh();
  const { categoriaRepo, useCases } = useMemo(() => {
    const tarefaRepo = new TarefaRepositoryImpl();
    const categoriaRepo = new CategoriaRepositoryImpl();
    return {
      categoriaRepo,
      useCases: {
        listarArquivadas: new ListarTarefasArquivadas(tarefaRepo),
        excluirDefinitivamente: new ExcluirDefinitivamente(tarefaRepo),
        restaurar: new RestaurarTarefa(tarefaRepo),
      },
    };
  }, []);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const categoriasPorId = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const categoria of categorias) {
      mapa.set(categoria.id, categoria.nome);
    }
    return mapa;
  }, [categorias]);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [lista, cats] = await Promise.all([
        useCases.listarArquivadas.executar(),
        categoriaRepo.listar(),
      ]);
      setTarefas(lista);
      setCategorias(cats);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar arquivadas.');
    } finally {
      setCarregando(false);
    }
  }, [categoriaRepo, useCases.listarArquivadas]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  useEffect(() => {
    if (revision === 0) {
      return;
    }
    void carregar();
  }, [revision, carregar]);

  const sincronizarListas = useCallback(async () => {
    await carregar();
    notifyTarefasChanged();
  }, [carregar, notifyTarefasChanged]);

  const excluirDefinitivamente = useCallback(
    async (id: string) => {
      setErro(null);
      try {
        await useCases.excluirDefinitivamente.executar(id);
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir tarefa.');
      }
    },
    [useCases.excluirDefinitivamente, sincronizarListas],
  );

  const restaurar = useCallback(
    async (id: string, prazo: string) => {
      setErro(null);
      try {
        await useCases.restaurar.executar({ id, prazo });
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao restaurar tarefa.');
      }
    },
    [useCases.restaurar, sincronizarListas],
  );

  const nomeCategoria = useCallback(
    (categoriaId: string) => categoriasPorId.get(categoriaId) ?? categoriaId,
    [categoriasPorId],
  );

  return {
    tarefas,
    carregando,
    erro,
    carregar,
    excluirDefinitivamente,
    restaurar,
    nomeCategoria,
  };
}
