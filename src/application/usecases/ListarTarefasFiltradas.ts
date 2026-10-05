import { aplicarFiltrosTarefas, type FiltrosTarefa } from '@/domain/entities/FiltrosTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ListarTarefasFiltradas {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(filtros: FiltrosTarefa): Promise<Tarefa[]> {
    const tarefas = await this.repository.listar();
    return aplicarFiltrosTarefas(tarefas, filtros);
  }
}
