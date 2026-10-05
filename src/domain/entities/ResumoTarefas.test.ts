import { calcularResumoTarefas } from '@/domain/entities/ResumoTarefas';
import type { Tarefa } from '@/domain/entities/Tarefa';

describe('calcularResumoTarefas', () => {
  it('agrega por status e categoria nas ativas', () => {
    const tarefas: Tarefa[] = [
      { id: '1', titulo: 'a', categoriaId: 'estudos', status: 'pendente', prioridade: 'alta' },
      { id: '2', titulo: 'b', categoriaId: 'estudos', status: 'concluida', prioridade: 'media' },
      { id: '3', titulo: 'c', categoriaId: 'pessoal', status: 'arquivada', prioridade: 'baixa' },
    ];

    const resumo = calcularResumoTarefas(tarefas);

    expect(resumo.totalAtivas).toBe(2);
    expect(resumo.totalArquivadas).toBe(1);
    expect(resumo.porCategoria.estudos).toBe(2);
    expect(resumo.porCategoria.pessoal).toBeUndefined();
    expect(resumo.porStatus.arquivada).toBe(1);
    expect(resumo.porPrioridade).toEqual({ baixa: 0, media: 1, alta: 1 });
  });
});
