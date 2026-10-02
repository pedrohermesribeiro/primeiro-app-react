import { aplicarPrazoEntrada, podeAlterarPrazo, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type AlterarPrazoTarefaEntrada = {
  id: string;
  prazo: string;
};

export class AlterarPrazoTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: AlterarPrazoTarefaEntrada): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(entrada.id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeAlterarPrazo(tarefa)) {
      throw new Error('Só é possível alterar o prazo de tarefas ativas.');
    }

    const atualizada = aplicarPrazoEntrada(tarefa, entrada.prazo);
    await this.repository.salvar(atualizada);
    return atualizada;
  }
}
