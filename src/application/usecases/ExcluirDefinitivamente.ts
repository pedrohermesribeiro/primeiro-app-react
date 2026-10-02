import { podeExcluir } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ExcluirDefinitivamente {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(id: string): Promise<void> {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeExcluir(tarefa)) {
      throw new Error('Não é possível excluir esta tarefa.');
    }
    await this.repository.excluir(id);
  }
}
