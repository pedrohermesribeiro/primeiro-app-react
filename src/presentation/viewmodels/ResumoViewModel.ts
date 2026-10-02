import { useCallback, useMemo, useState } from 'react';

import { GerarResumo } from '@/application/usecases/GerarResumo';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import type { Categoria } from '@/domain/entities/Categoria';
import type { ResumoTarefas } from '@/domain/entities/ResumoTarefas';

export function useResumoViewModel() {
  const { categoriaRepo, useCases } = useMemo(() => {
    const tarefaRepo = new TarefaRepositoryImpl();
    const categoriaRepo = new CategoriaRepositoryImpl();
    return {
      categoriaRepo,
      useCases: {
        gerarResumo: new GerarResumo(tarefaRepo),
      },
    };
  }, []);

  const [resumo, setResumo] = useState<ResumoTarefas | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [res, cats] = await Promise.all([
        useCases.gerarResumo.executar(),
        categoriaRepo.listar(),
      ]);
      setResumo(res);
      setCategorias(cats);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar resumo.');
    } finally {
      setCarregando(false);
    }
  }, [categoriaRepo, useCases.gerarResumo]);

  return {
    resumo,
    categorias,
    carregando,
    erro,
    carregar,
  };
}
