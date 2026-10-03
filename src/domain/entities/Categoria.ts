import { normalizarTextoEntrada } from '@/domain/validacao/textoEntrada';

export type Categoria = {
  id: string;
  nome: string;
};

export const MAX_CATEGORIAS = 12;

export const CATEGORIAS_PADRAO: Categoria[] = [
  { id: 'estudos', nome: 'Estudos' },
  { id: 'trabalho', nome: 'Trabalho' },
  { id: 'pessoal', nome: 'Pessoal' },
  { id: 'compras', nome: 'Compras' },
  { id: 'saude', nome: 'Saúde' },
  { id: 'outros', nome: 'Outros' },
];

export function podeIncluirCategoria(quantidade: number): boolean {
  return quantidade < MAX_CATEGORIAS;
}

function slugBase(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function criarCategoriaId(nome: string, idsExistentes: Set<string>): string {
  const base = slugBase(nome) || 'categoria';
  if (!idsExistentes.has(base)) {
    return base;
  }
  let suffix = 2;
  while (idsExistentes.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}

export const MAX_NOME_CATEGORIA = 40;

export function validarNomeCategoria(nome: string): string {
  const normalizado = normalizarTextoEntrada(nome);
  if (!normalizado) {
    throw new Error('O nome da categoria é obrigatório.');
  }
  if (normalizado.length > MAX_NOME_CATEGORIA) {
    throw new Error(`O nome da categoria deve ter no máximo ${MAX_NOME_CATEGORIA} caracteres.`);
  }
  return normalizado;
}
