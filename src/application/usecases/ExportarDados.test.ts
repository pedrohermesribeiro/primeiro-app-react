import { ExportarDados } from '@/application/usecases/ExportarDados';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

describe('ExportarDados', () => {
  it('retorna texto e html apenas com tarefas ativas', async () => {
    const tarefaRepo: TarefaRepository = {
      listar: async () => [
        {
          id: '1',
          titulo: 'Ativa',
          categoriaId: 'c1',
          status: 'pendente',
          prioridade: 'baixa',
        },
        {
          id: '2',
          titulo: 'Arquivada',
          categoriaId: 'c1',
          status: 'arquivada',
          prioridade: 'baixa',
        },
      ],
      buscarPorId: async () => null,
      salvar: async () => {},
      substituirTodas: async () => {},
      excluir: async () => {},
    };
    const categoriaRepo: CategoriaRepository = {
      listar: async () => [{ id: 'c1', nome: 'Geral' }],
      substituirTodas: async () => {},
    };

    const resultado = await new ExportarDados(tarefaRepo, categoriaRepo).executar();
    expect(resultado.textoWhatsApp).toContain('Ativa');
    expect(resultado.textoWhatsApp).not.toContain('Arquivada');
    expect(resultado.htmlEmail).toContain('Ativa');
    expect(resultado.htmlEmail).not.toContain('Arquivada');
  });
});
