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

export function validarNomeCategoria(nome: string): string {
  const trimmed = nome.trim();
  if (!trimmed) {
    throw new Error('O nome da categoria é obrigatório.');
  }
  if (trimmed.length > 40) {
    throw new Error('O nome da categoria deve ter no máximo 40 caracteres.');
  }
  return trimmed;
}
