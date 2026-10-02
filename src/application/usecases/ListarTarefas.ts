import { isTarefaAtiva, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ListarTarefas {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(): Promise<Tarefa[]> {
    const tarefas = await this.repository.listar();
    return tarefas.filter(isTarefaAtiva);
  }
}
