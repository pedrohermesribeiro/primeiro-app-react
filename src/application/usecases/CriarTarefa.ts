import {
  criarTarefaId,
  PRIORIDADE_PADRAO,
  validarCategoriaId,
  validarPrazoOpcional,
  validarPrioridade,
  aplicarLembretesEntrada,
  validarTituloTarefa,
  type PrioridadeTarefa,
  type Tarefa,
  type TipoLembretePrazo,
} from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export type CriarTarefaEntrada = {
  titulo: string;
  categoriaId: string;
  prazo?: string;
  prioridade?: PrioridadeTarefa | string;
  lembretes?: TipoLembretePrazo[];
};

export class CriarTarefa {
  constructor(private readonly repository: TarefaRepository) {}

  async executar(entrada: CriarTarefaEntrada): Promise<Tarefa> {
    const titulo = validarTituloTarefa(entrada.titulo);
    const categoriaId = validarCategoriaId(entrada.categoriaId);
    const prazo = validarPrazoOpcional(entrada.prazo);
    const prioridade =
      entrada.prioridade === undefined || entrada.prioridade === ''
        ? PRIORIDADE_PADRAO
        : validarPrioridade(String(entrada.prioridade));

    const tarefa: Tarefa = {
      id: criarTarefaId(),
      titulo,
      categoriaId,
      status: 'pendente',
      prioridade,
    };

    if (prazo) {
      tarefa.prazo = prazo;
    }

    const comLembretes = aplicarLembretesEntrada(tarefa, entrada.lembretes ?? []);

    await this.repository.salvar(comLembretes);
    return comLembretes;
  }
}
