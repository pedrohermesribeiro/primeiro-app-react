import {
  aplicarLembretesEntrada,
  aplicarPrazoEntrada,
  podeEditarTarefa,
  type TipoLembretePrazo,
  validarCategoriaId,
  validarPrioridade,
  validarTituloTarefa,
  type PrioridadeTarefa,
  type Tarefa,
} from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type EditarTarefaEntrada = {
  id: string;
  titulo: string;
  categoriaId: string;
  prazo: string;
  prioridade: PrioridadeTarefa | string;
  lembretes?: TipoLembretePrazo[];
};

export class EditarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: EditarTarefaEntrada): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(entrada.id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada.');
    }
    if (!podeEditarTarefa(tarefa)) {
      throw new Error('Só é possível editar tarefas ativas.');
    }

    const comDados: Tarefa = {
      ...tarefa,
      titulo: validarTituloTarefa(entrada.titulo),
      categoriaId: validarCategoriaId(entrada.categoriaId),
      prioridade: validarPrioridade(String(entrada.prioridade)),
    };

    const comPrazo = aplicarPrazoEntrada(comDados, entrada.prazo);
    const atualizada = aplicarLembretesEntrada(comPrazo, entrada.lembretes ?? []);
    await this.repository.salvar(atualizada);
    return atualizada;
  }
}
