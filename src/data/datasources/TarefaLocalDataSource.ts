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

function assertLocalStorage(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error(
      'Persistência v1 requer Expo Web (localStorage). Use npm run web ou migre para AsyncStorage (v2).',
    );
  }
  return localStorage;
}

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
  getAll(): Tarefa[] {
    const storage = assertLocalStorage();
    const bruto = storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }

    const brutoParsed = JSON.parse(bruto) as TarefaLegada[];
    const migradas = brutoParsed.map(migrarTarefa);
    if (precisaPersistirMigracao(brutoParsed, migradas)) {
      this.setAll(migradas);
    }
    return migradas;
  }

  setAll(tarefas: Tarefa[]): void {
    const storage = assertLocalStorage();
    storage.setItem(CHAVE, JSON.stringify(tarefas));
  }
}
