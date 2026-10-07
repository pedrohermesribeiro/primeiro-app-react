jest.mock('@/data/datasources/createDefaultStorage', () => ({
  createDefaultStorage: () => ({
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }),
}));

import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import type { TarefaLocalDataSource } from '@/data/datasources/TarefaLocalDataSource';
import type { Tarefa } from '@/domain/entities/Tarefa';

describe('TarefaRepositoryImpl substituirTodas', () => {
  it('valida antes de gravar e repassa lista normalizada', async () => {
    const setAll = jest.fn(async () => {});
    const dataSource = { setAll, getAll: async () => [] } as unknown as TarefaLocalDataSource;
    const tarefa: Tarefa = {
      id: 't1',
      titulo: 'Ok',
      categoriaId: 'estudos',
      status: 'pendente',
      prioridade: 'baixa',
    };
    await new TarefaRepositoryImpl(dataSource).substituirTodas([tarefa]);
    expect(setAll).toHaveBeenCalledWith([tarefa]);
  });

  it('rejeita substituição com título inválido', async () => {
    const setAll = jest.fn(async () => {});
    const dataSource = { setAll, getAll: async () => [] } as unknown as TarefaLocalDataSource;
    await expect(
      new TarefaRepositoryImpl(dataSource).substituirTodas([
        {
          id: 't1',
          titulo: '  ',
          categoriaId: 'estudos',
          status: 'pendente',
          prioridade: 'baixa',
        },
      ]),
    ).rejects.toThrow('obrigatório');
    expect(setAll).not.toHaveBeenCalled();
  });
});
