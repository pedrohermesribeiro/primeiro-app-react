import {
  CATEGORIA_REALOCACAO_PADRAO,
  podeExcluirCategoria,
  type Categoria,
} from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

function destinoRealocacao(categoriaId: string, restantes: Categoria[]): string {
  if (categoriaId === CATEGORIA_REALOCACAO_PADRAO) {
    const destino = restantes[0]?.id;
    if (!destino) {
      throw new Error('Não foi possível realocar tarefas.');
    }
    return destino;
  }
  const destino = restantes.find((c) => c.id === CATEGORIA_REALOCACAO_PADRAO)?.id;
  if (!destino) {
    throw new Error('Categoria de realocação não encontrada.');
  }
  return destino;
}

export class ExcluirCategoria {
  constructor(
    private readonly categoriaRepository: CategoriaRepository,
    private readonly tarefaRepository: TarefaRepository,
  ) {}

  async executar(categoriaId: string): Promise<void> {
    const id = categoriaId.trim();
    if (!id) {
      throw new Error('Categoria inválida.');
    }

    const existentes = await this.categoriaRepository.listar();
    const indice = existentes.findIndex((c) => c.id === id);
    if (indice < 0) {
      throw new Error('Categoria não encontrada.');
    }

    if (!podeExcluirCategoria(existentes.length)) {
      throw new Error('É necessário manter pelo menos 4 categorias.');
    }

    const restantes = existentes.filter((c) => c.id !== id);
    const destino = destinoRealocacao(id, restantes);

    const tarefas = await this.tarefaRepository.listar();
    const atualizadas = tarefas.map((t) =>
      t.categoriaId === id ? { ...t, categoriaId: destino } : t,
    );
    await this.tarefaRepository.substituirTodas(atualizadas);
    await this.categoriaRepository.substituirTodas(restantes);
  }
}
