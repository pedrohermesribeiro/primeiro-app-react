import {
  criarCategoriaId,
  podeIncluirCategoria,
  validarNomeCategoria,
  type Categoria,
} from '@/domain/entities/Categoria';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';

export type IncluirCategoriaEntrada = {
  nome: string;
};

export class IncluirCategoria {
  constructor(private readonly repository: CategoriaRepository) {}

  async executar(entrada: IncluirCategoriaEntrada): Promise<Categoria> {
    const nome = validarNomeCategoria(entrada.nome);
    const existentes = await this.repository.listar();

    if (!podeIncluirCategoria(existentes.length)) {
      throw new Error('Limite de 12 categorias atingido.');
    }

    const nomeNormalizado = nome.toLocaleLowerCase('pt-BR');
    if (
      existentes.some((c) => c.nome.toLocaleLowerCase('pt-BR') === nomeNormalizado)
    ) {
      throw new Error('Já existe uma categoria com este nome.');
    }

    const ids = new Set(existentes.map((c) => c.id));
    const nova: Categoria = {
      id: criarCategoriaId(nome, ids),
      nome,
    };

    await this.repository.substituirTodas([...existentes, nova]);
    return nova;
  }
}
