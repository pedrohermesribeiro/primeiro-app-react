import { mensagemErroOperacao } from '@/presentation/viewmodels/mensagemErroOperacao';

describe('mensagemErroOperacao', () => {
  it('preserva mensagem de domínio curta', () => {
    expect(mensagemErroOperacao(new Error('O título é obrigatório.'), 'Padrão')).toBe(
      'O título é obrigatório.',
    );
  });

  it('substitui erro técnico por mensagem padrão', () => {
    expect(
      mensagemErroOperacao(new Error('TypeError: Cannot read property x'), 'Erro ao criar tarefa.'),
    ).toBe('Erro ao criar tarefa.');
  });
});
