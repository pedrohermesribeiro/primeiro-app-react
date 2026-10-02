import { calcularResumoTarefas, type ResumoTarefas } from '@/domain/entities/ResumoTarefas';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class GerarResumo {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(): Promise<ResumoTarefas> {
    const tarefas = await this.repository.listar();
    return calcularResumoTarefas(tarefas);
  }
}
