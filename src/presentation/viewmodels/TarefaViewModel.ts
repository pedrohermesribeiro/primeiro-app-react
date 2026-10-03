import { useCallback, useEffect, useMemo, useState } from 'react';

import { ArquivarTarefa } from '@/application/usecases/ArquivarTarefa';
import { EditarTarefa } from '@/application/usecases/EditarTarefa';
import { ConcluirTarefa } from '@/application/usecases/ConcluirTarefa';
import { CriarTarefa } from '@/application/usecases/CriarTarefa';
import { ExcluirDefinitivamente } from '@/application/usecases/ExcluirDefinitivamente';
import { ListarTarefas } from '@/application/usecases/ListarTarefas';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import type { Categoria } from '@/domain/entities/Categoria';
import type { Tarefa } from '@/domain/entities/Tarefa';
import { useTarefaRefresh } from '@/presentation/context/TarefaRefreshContext';

export function useTarefaViewModel() {
  const { revision, notifyTarefasChanged } = useTarefaRefresh();
  const { categoriaRepo, useCases } = useMemo(() => {
    const tarefaRepo = new TarefaRepositoryImpl();
    const categoriaRepo = new CategoriaRepositoryImpl();
    return {
      categoriaRepo,
      useCases: {
        listar: new ListarTarefas(tarefaRepo),
        criar: new CriarTarefa(tarefaRepo),
        concluir: new ConcluirTarefa(tarefaRepo),
        arquivar: new ArquivarTarefa(tarefaRepo),
        excluir: new ExcluirDefinitivamente(tarefaRepo),
        editar: new EditarTarefa(tarefaRepo),
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
        useCases.listar.executar(),
        categoriaRepo.listar(),
      ]);
      setTarefas(lista);
      setCategorias(cats);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar tarefas.');
    } finally {
      setCarregando(false);
    }
  }, [categoriaRepo, useCases.listar]);

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

  const criar = useCallback(
    async (titulo: string, prazo: string, categoriaId: string) => {
      setErro(null);
      try {
        await useCases.criar.executar({
          titulo,
          categoriaId,
          prazo: prazo.trim() || undefined,
        });
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao criar tarefa.');
      }
    },
    [useCases.criar, sincronizarListas],
  );

  const concluir = useCallback(
    async (id: string) => {
      setErro(null);
      try {
        await useCases.concluir.executar(id);
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao concluir tarefa.');
      }
    },
    [useCases.concluir, sincronizarListas],
  );

  const arquivar = useCallback(
    async (id: string) => {
      setErro(null);
      try {
        await useCases.arquivar.executar(id);
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao arquivar tarefa.');
      }
    },
    [useCases.arquivar, sincronizarListas],
  );

  const excluir = useCallback(
    async (id: string) => {
      setErro(null);
      try {
        await useCases.excluir.executar(id);
        await sincronizarListas();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao excluir tarefa.');
      }
    },
    [useCases.excluir, sincronizarListas],
  );

  const editar = useCallback(
    async (id: string, titulo: string, prazo: string, categoriaId: string) => {
      setErro(null);
      try {
        await useCases.editar.executar({ id, titulo, categoriaId, prazo });
        await sincronizarListas();
        return true;
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao editar tarefa.');
        return false;
      }
    },
    [useCases.editar, sincronizarListas],
  );

  const nomeCategoria = useCallback(
    (categoriaId: string) => categoriasPorId.get(categoriaId) ?? categoriaId,
    [categoriasPorId],
  );

  return {
    tarefas,
    categorias,
    carregando,
    erro,
    carregar,
    criar,
    concluir,
    arquivar,
    excluir,
    editar,
    nomeCategoria,
  };
}
