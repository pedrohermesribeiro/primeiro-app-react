import { ListarTarefasFiltradas } from '@/application/usecases/ListarTarefasFiltradas';
import { filtrosPadrao } from '@/domain/entities/FiltrosTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('ListarTarefasFiltradas', () => {
  it('aplica filtros sobre lista completa do repositorio', async () => {
    const tarefas: Tarefa[] = [
      {
        id: '1',
        titulo: 'A',
        categoriaId: 'estudos',
        status: 'pendente',
        prioridade: 'alta',
      },
      {
        id: '2',
        titulo: 'B',
        categoriaId: 'estudos',
        status: 'arquivada',
        prioridade: 'baixa',
      },
    ];
    const repo: TarefaRepository = {
      listar: async () => tarefas,
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const padrao = await new ListarTarefasFiltradas(repo).executar(filtrosPadrao());
    expect(padrao.map((t) => t.id)).toEqual(['1']);

    const soAlta = await new ListarTarefasFiltradas(repo).executar({
      prioridades: ['alta'],
      statuses: ['pendente', 'concluida', 'arquivada'],
      prazos: [],
    });
    expect(soAlta.map((t) => t.id)).toEqual(['1']);
  });
});
