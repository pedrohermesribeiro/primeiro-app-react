import { aplicarPrazoEntrada, podeRestaurar, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type RestaurarTarefaEntrada = {
  id: string;
  prazo: string;
};

export class RestaurarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: RestaurarTarefaEntrada): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(entrada.id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeRestaurar(tarefa)) {
      throw new Error('Só é possível restaurar tarefas arquivadas.');
    }

    const restaurada = aplicarPrazoEntrada({ ...tarefa, status: 'pendente' }, entrada.prazo);
    await this.repository.salvar(restaurada);
    return restaurada;
  }
}
