import {
  aplicarFiltrosTarefas,
  filtrosDiferentesDoPadrao,
  filtrosIguais,
  filtrosPadrao,
  isTarefaAtrasada,
  prazoCaiEmFiltro,
  STATUS_TODOS_FILTRO,
} from '@/domain/entities/FiltrosTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';

const ref = new Date(2026, 2, 17);

function tarefa(partial: Partial<Tarefa> & Pick<Tarefa, 'id'>): Tarefa {
  return {
    titulo: 'T',
    categoriaId: 'estudos',
    status: 'pendente',
    prioridade: 'baixa',
    ...partial,
  };
}

describe('FiltrosTarefa', () => {
  it('filtrosPadrao inclui ativas e nao filtra prioridade ou prazo', () => {
    const lista = [
      tarefa({ id: '1', status: 'pendente' }),
      tarefa({ id: '2', status: 'concluida' }),
      tarefa({ id: '3', status: 'arquivada' }),
      tarefa({ id: '4', status: 'pendente', prioridade: 'alta', prazo: '2026-03-20' }),
    ];
    const result = aplicarFiltrosTarefas(lista, filtrosPadrao(), ref);
    expect(result.map((t) => t.id)).toEqual(['1', '2', '4']);
  });

  it('filtra por prioridade e status', () => {
    const lista = [
      tarefa({ id: '1', status: 'pendente', prioridade: 'alta' }),
      tarefa({ id: '2', status: 'pendente', prioridade: 'baixa' }),
    ];
    const result = aplicarFiltrosTarefas(
      lista,
      { prioridades: ['alta'], statuses: ['pendente'], prazos: [] },
      ref,
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('1');
  });

  it('isTarefaAtrasada so pendente com prazo anterior', () => {
    expect(isTarefaAtrasada(tarefa({ id: '1', prazo: '2026-03-01' }), ref)).toBe(true);
    expect(isTarefaAtrasada(tarefa({ id: '2', prazo: '2026-03-17' }), ref)).toBe(false);
    expect(isTarefaAtrasada(tarefa({ id: '3', status: 'concluida', prazo: '2026-03-01' }), ref)).toBe(
      false,
    );
    expect(isTarefaAtrasada(tarefa({ id: '4' }), ref)).toBe(false);
  });

  it('prazoCaiEmFiltro hoje e exclui sem prazo quando filtro de data ativo', () => {
    expect(prazoCaiEmFiltro(tarefa({ id: '1', prazo: '2026-03-17' }), 'hoje', ref)).toBe(true);
    const lista = [
      tarefa({ id: '1', prazo: '2026-03-17' }),
      tarefa({ id: '2' }),
    ];
    const result = aplicarFiltrosTarefas(
      lista,
      { prioridades: [], statuses: ['pendente'], prazos: ['hoje'] },
      ref,
    );
    expect(result.map((t) => t.id)).toEqual(['1']);
  });

  it('filtrosIguais e filtrosDiferentesDoPadrao', () => {
    const padrao = filtrosPadrao();
    expect(filtrosDiferentesDoPadrao(padrao)).toBe(false);
    expect(filtrosIguais(padrao, { ...padrao, statuses: ['concluida', 'pendente'] })).toBe(true);

    expect(filtrosDiferentesDoPadrao({ ...padrao, prioridades: ['alta'] })).toBe(true);
    expect(filtrosDiferentesDoPadrao({ ...padrao, prazos: ['hoje'] })).toBe(true);
    expect(filtrosDiferentesDoPadrao({ ...padrao, statuses: ['pendente'] })).toBe(true);
    expect(filtrosDiferentesDoPadrao({ ...padrao, statuses: ['pendente', 'arquivada'] })).toBe(true);
    expect(
      filtrosDiferentesDoPadrao({ ...padrao, statuses: [...STATUS_TODOS_FILTRO] }),
    ).toBe(true);
  });
});
