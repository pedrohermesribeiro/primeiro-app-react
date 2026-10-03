import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import type { StatusTarefa, Tarefa } from '@/domain/entities/Tarefa';

const CHAVE = 'gta:tarefas';

type TarefaLegada = {
  id: string;
  titulo: string;
  prazo?: string;
  status?: string;
  categoriaId?: string;
  disciplinaId?: string;
  descricao?: string;
  tipo?: string;
};

function normalizarStatus(status?: string): StatusTarefa {
  if (status === 'concluida' || status === 'arquivada' || status === 'pendente') {
    return status;
  }
  return 'pendente';
}

function migrarTarefa(item: TarefaLegada): Tarefa {
  const categoriaId =
    item.categoriaId ??
    (item.disciplinaId && item.disciplinaId !== 'geral' ? item.disciplinaId : 'outros');

  const tarefa: Tarefa = {
    id: item.id,
    titulo: item.titulo,
    categoriaId,
    status: normalizarStatus(item.status),
  };

  if (item.prazo) {
    tarefa.prazo = item.prazo;
  }

  return tarefa;
}

function precisaPersistirMigracao(bruto: TarefaLegada[], migradas: Tarefa[]): boolean {
  if (bruto.length !== migradas.length) {
    return true;
  }
  return bruto.some((item, index) => {
    const m = migradas[index];
    return (
      item.categoriaId !== m.categoriaId ||
      normalizarStatus(item.status) !== m.status ||
      item.disciplinaId !== undefined
    );
  });
}

export class TarefaLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async getAll(): Promise<Tarefa[]> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }

    const brutoParsed = JSON.parse(bruto) as TarefaLegada[];
    const migradas = brutoParsed.map(migrarTarefa);
    if (precisaPersistirMigracao(brutoParsed, migradas)) {
      await this.setAll(migradas);
    }
    return migradas;
  }

  async setAll(tarefas: Tarefa[]): Promise<void> {
    await this.storage.setItem(CHAVE, JSON.stringify(tarefas));
  }
}
