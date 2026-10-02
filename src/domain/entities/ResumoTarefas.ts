import type { Tarefa } from '@/domain/entities/Tarefa';

export type ResumoTarefas = {
  totalAtivas: number;
  totalArquivadas: number;
  porCategoria: Record<string, number>;
  porStatus: {
    pendente: number;
    concluida: number;
    arquivada: number;
  };
};

export function calcularResumoTarefas(tarefas: Tarefa[]): ResumoTarefas {
  const porCategoria: Record<string, number> = {};
  const porStatus = { pendente: 0, concluida: 0, arquivada: 0 };

  for (const tarefa of tarefas) {
    porStatus[tarefa.status] += 1;
    if (tarefa.status !== 'arquivada') {
      porCategoria[tarefa.categoriaId] = (porCategoria[tarefa.categoriaId] ?? 0) + 1;
    }
  }

  return {
    totalAtivas: porStatus.pendente + porStatus.concluida,
    totalArquivadas: porStatus.arquivada,
    porCategoria,
    porStatus,
  };
}
