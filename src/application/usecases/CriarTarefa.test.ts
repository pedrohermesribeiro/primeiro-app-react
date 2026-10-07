import { CriarTarefa } from '@/application/usecases/CriarTarefa';
import type { Tarefa } from '@/domain/entities/Tarefa';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('CriarTarefa', () => {
  it('criação bem-sucedida persiste tarefa pendente', async () => {
    let salva: Tarefa | null = null;
    const repo: TarefaRepository = {
      listar: async () => [],
      buscarPorId: async () => null,
      salvar: async (t) => {
        salva = t;
      },
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    const criada = await new CriarTarefa(repo).executar({
      titulo: '  Nova tarefa  ',
      categoriaId: 'estudos',
      prioridade: 'media',
    });

    expect(criada.titulo).toBe('Nova tarefa');
    expect(criada.status).toBe('pendente');
    expect(criada.categoriaId).toBe('estudos');
    expect(salva?.titulo).toBe('Nova tarefa');
  });

  it('falha de validação propaga erro para o ViewModel', async () => {
    const repo: TarefaRepository = {
      listar: async () => [],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };

    await expect(
      new CriarTarefa(repo).executar({
        titulo: '   ',
        categoriaId: 'estudos',
      }),
    ).rejects.toThrow('obrigatório');
  });
});
