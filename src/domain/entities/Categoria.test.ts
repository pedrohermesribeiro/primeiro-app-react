import {
  MIN_CATEGORIAS,
  podeExcluirCategoria,
  podeIncluirCategoria,
  validarNomeCategoria,
} from '@/domain/entities/Categoria';

describe('regras de Categoria', () => {
  it('podeIncluirCategoria respeita limite 12', () => {
    expect(podeIncluirCategoria(11)).toBe(true);
    expect(podeIncluirCategoria(12)).toBe(false);
  });

  it('podeExcluirCategoria respeita mínimo 4', () => {
    expect(podeExcluirCategoria(MIN_CATEGORIAS + 1)).toBe(true);
    expect(podeExcluirCategoria(MIN_CATEGORIAS)).toBe(false);
    expect(podeExcluirCategoria(MIN_CATEGORIAS - 1)).toBe(false);
  });

  it('validarNomeCategoria rejeita vazio', () => {
    expect(() => validarNomeCategoria('   ')).toThrow('obrigatório');
  });
});
