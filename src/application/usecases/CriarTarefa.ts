import {
  criarTarefaId,
  validarCategoriaId,
  validarPrazoOpcional,
  validarTituloTarefa,
  type Tarefa,
} from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type CriarTarefaEntrada = {
  titulo: string;
  categoriaId: string;
  prazo?: string;
};

export class CriarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: CriarTarefaEntrada): Promise<Tarefa> {
    const titulo = validarTituloTarefa(entrada.titulo);
    const categoriaId = validarCategoriaId(entrada.categoriaId);
    const prazo = validarPrazoOpcional(entrada.prazo);

    const tarefa: Tarefa = {
      id: criarTarefaId(),
      titulo,
      categoriaId,
      status: 'pendente',
    };

    if (prazo) {
      tarefa.prazo = prazo;
    }

    await this.repository.salvar(tarefa);
    return tarefa;
  }
}
