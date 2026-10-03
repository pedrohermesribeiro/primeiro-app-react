import {
  aplicarPrazoEntrada,
  criarTarefaId,
  podeAlterarPrazo,
  podeArquivar,
  podeConcluir,
  podeExcluir,
  podeExcluirAtiva,
  podeRestaurar,
  type Tarefa,
} from '@/domain/entities/Tarefa';

const base: Tarefa = {
  id: '1',
  titulo: 'Teste',
  categoriaId: 'estudos',
  status: 'pendente',
};

describe('regras de Tarefa V1', () => {
  it('criarTarefaId gera uuid v4', () => {
    expect(criarTarefaId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('pendente pode concluir, arquivar e excluir', () => {
    expect(podeConcluir(base)).toBe(true);
    expect(podeArquivar(base)).toBe(true);
    expect(podeExcluir(base)).toBe(true);
    expect(podeExcluirAtiva(base)).toBe(true);
  });

  it('concluida pode arquivar e excluir mas nao concluir de novo', () => {
    const t: Tarefa = { ...base, status: 'concluida' };
    expect(podeConcluir(t)).toBe(false);
    expect(podeArquivar(t)).toBe(true);
    expect(podeExcluir(t)).toBe(true);
    expect(podeExcluirAtiva(t)).toBe(true);
  });

  it('arquivada pode excluir e restaurar mas nao arquivar de novo', () => {
    const t: Tarefa = { ...base, status: 'arquivada' };
    expect(podeArquivar(t)).toBe(false);
    expect(podeExcluir(t)).toBe(true);
    expect(podeExcluirAtiva(t)).toBe(false);
    expect(podeRestaurar(t)).toBe(true);
    expect(podeAlterarPrazo(t)).toBe(false);
  });

  it('pendente pode alterar prazo', () => {
    expect(podeAlterarPrazo(base)).toBe(true);
    expect(podeRestaurar(base)).toBe(false);
  });

  it('aplicarPrazoEntrada limpa ou define prazo', () => {
    const comPrazo = aplicarPrazoEntrada(base, '2026-03-01');
    expect(comPrazo.prazo).toBe('2026-03-01');
    const semPrazo = aplicarPrazoEntrada(comPrazo, '');
    expect(semPrazo.prazo).toBeUndefined();
  });
});
