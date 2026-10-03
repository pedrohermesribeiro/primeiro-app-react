import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

import { TarefaLocalDataSource } from '@/data/datasources/TarefaLocalDataSource';

export class TarefaRepositoryImpl implements TarefaRepository {
  constructor(private readonly dataSource: TarefaLocalDataSource = new TarefaLocalDataSource()) {}

  async listar(): Promise<Tarefa[]> {
    return this.dataSource.getAll();
  }

  async buscarPorId(id: string): Promise<Tarefa | null> {
    const tarefas = await this.listar();
    return tarefas.find((t) => t.id === id) ?? null;
  }

  async salvar(tarefa: Tarefa): Promise<void> {
    const tarefas = await this.listar();
    const indice = tarefas.findIndex((t) => t.id === tarefa.id);
    if (indice >= 0) {
      tarefas[indice] = tarefa;
    } else {
      tarefas.push(tarefa);
    }
    await this.dataSource.setAll(tarefas);
  }

  async excluir(id: string): Promise<void> {
    const tarefas = await this.listar();
    await this.dataSource.setAll(tarefas.filter((t) => t.id !== id));
  }
}
