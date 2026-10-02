import { podeConcluir, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ConcluirTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeConcluir(tarefa)) {
      throw new Error('Só é possível concluir tarefas pendentes.');
    }

    const atualizada: Tarefa = { ...tarefa, status: 'concluida' };
    await this.repository.salvar(atualizada);
    return atualizada;
  }
}
