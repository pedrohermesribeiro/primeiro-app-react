import { podeArquivar, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ArquivarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeArquivar(tarefa)) {
      throw new Error('Só é possível arquivar tarefas pendentes ou concluídas.');
    }

    const atualizada: Tarefa = { ...tarefa, status: 'arquivada' };
    await this.repository.salvar(atualizada);
    return atualizada;
  }
}
