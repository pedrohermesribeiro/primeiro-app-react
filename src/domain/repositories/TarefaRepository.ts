import type { Tarefa } from '@/domain/entities/Tarefa';

export interface TarefaRepository {
  listar(): Promise<Tarefa[]>;
  buscarPorId(id: string): Promise<Tarefa | null>;
  salvar(tarefa: Tarefa): Promise<void>;
  substituirTodas(tarefas: Tarefa[]): Promise<void>;
  excluir(id: string): Promise<void>;
}
