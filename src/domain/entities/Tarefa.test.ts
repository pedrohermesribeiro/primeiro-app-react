import {
  aplicarPrazoEntrada,
  criarTarefaId,
  MAX_TITULO_TAREFA,
  podeAlterarPrazo,
  validarPrazoIso,
  validarPrazoOpcional,
  normalizarPrioridade,
  validarPrioridade,
  validarTituloTarefa,
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
  prioridade: 'baixa',
};

describe('regras de Tarefa V1', () => {
  it('criarTarefaId gera uuid v4', () => {
    expect(criarTarefaId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('validarTituloTarefa rejeita vazio, longo e normaliza controle', () => {
    expect(validarTituloTarefa('  Estudar  ')).toBe('Estudar');
    expect(validarTituloTarefa('a\u0001b')).toBe('ab');
    expect(() => validarTituloTarefa('   ')).toThrow('obrigatório');
    expect(() => validarTituloTarefa('x'.repeat(MAX_TITULO_TAREFA + 1))).toThrow('60');
  });

  it('validarPrioridade e normalizarPrioridade', () => {
    expect(validarPrioridade('  ALTA  ')).toBe('alta');
    expect(normalizarPrioridade(undefined)).toBe('baixa');
    expect(normalizarPrioridade('urgente')).toBe('baixa');
    expect(() => validarPrioridade('urgente')).toThrow('inválida');
  });

  it('validarPrazoOpcional e validarPrazoIso', () => {
    expect(validarPrazoOpcional('')).toBeUndefined();
    expect(validarPrazoOpcional('  2026-03-01  ')).toBe('2026-03-01T08:00');
    expect(() => validarPrazoIso('2026-02-30')).toThrow('Prazo inválido');
    expect(() => validarPrazoIso('03/01/2026')).toThrow('Prazo inválido');
    expect(validarPrazoIso('2026-03-01T09:00')).toBe('2026-03-01T09:00');
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
    expect(comPrazo.prazo).toBe('2026-03-01T08:00');
    const semPrazo = aplicarPrazoEntrada(comPrazo, '');
    expect(semPrazo.prazo).toBeUndefined();
  });
});
