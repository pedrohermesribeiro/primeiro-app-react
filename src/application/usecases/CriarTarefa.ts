import { criarTarefaId, type Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type CriarTarefaEntrada = {
  titulo: string;
  categoriaId: string;
  prazo?: string;
};

export class CriarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: CriarTarefaEntrada): Promise<Tarefa> {
    const titulo = entrada.titulo.trim();
    if (!titulo) {
      throw new Error('O título é obrigatório.');
    }
    if (!entrada.categoriaId.trim()) {
      throw new Error('A categoria é obrigatória.');
    }

    const tarefa: Tarefa = {
      id: criarTarefaId(),
      titulo,
      categoriaId: entrada.categoriaId,
      status: 'pendente',
    };

    if (entrada.prazo?.trim()) {
      tarefa.prazo = entrada.prazo.trim();
    }

    await this.repository.salvar(tarefa);
    return tarefa;
  }
}
