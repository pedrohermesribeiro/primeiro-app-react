import { useCallback, useState } from 'react';

import type { Categoria } from '@/domain/entities/Categoria';
import type { ResumoTarefas } from '@/domain/entities/ResumoTarefas';
import { useAppContainer } from '@/composition/AppContainerContext';

export function useResumoViewModel() {
  const { resumo: useCases } = useAppContainer();

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
        useCases.listarCategorias.executar(),
      ]);
      setResumo(res);
      setCategorias(cats);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar resumo.');
    } finally {
      setCarregando(false);
    }
  }, [useCases.gerarResumo, useCases.listarCategorias]);

  return {
    resumo,
    categorias,
    carregando,
    erro,
    carregar,
  };
}
