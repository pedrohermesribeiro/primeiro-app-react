import {
  normalizarPrioridade,
  type PrioridadeTarefa,
  type StatusTarefa,
  type Tarefa,
  validarCategoriaId,
  validarLembretesOpcional,
  validarPrazoOpcional,
  validarPrioridade,
  validarTituloTarefa,
} from '@/domain/entities/Tarefa';
import { normalizarLembretes } from '@/domain/lembrete/LembretesTarefa';

import { isRegistro } from '@/data/persistencia/jsonSeguro';
import { validarIdArmazenamento } from '@/data/persistencia/idArmazenamento';

export type TarefaLegada = {
  id: string;
  titulo: string;
  prazo?: string;
  status?: string;
  categoriaId?: string;
  disciplinaId?: string;
  descricao?: string;
  tipo?: string;
  prioridade?: string;
  lembretes?: unknown;
};

function prioridadeLegadaValida(valor?: string): valor is PrioridadeTarefa {
  return valor === 'baixa' || valor === 'media' || valor === 'alta';
}

export function normalizarStatusPersistido(status?: string): StatusTarefa {
  if (status === 'concluida' || status === 'arquivada' || status === 'pendente') {
    return status;
  }
  return 'pendente';
}

export function migrarTarefaLegada(item: TarefaLegada): Tarefa {
  const categoriaId =
    item.categoriaId ??
    (item.disciplinaId && item.disciplinaId !== 'geral' ? item.disciplinaId : 'outros');

  const tarefa: Tarefa = {
    id: item.id,
    titulo: item.titulo,
    categoriaId,
    status: normalizarStatusPersistido(item.status),
    prioridade: normalizarPrioridade(item.prioridade),
  };

  if (item.prazo) {
    tarefa.prazo = item.prazo;
  }

  const lembretes = normalizarLembretes(item.lembretes);
  if (lembretes.length > 0) {
    tarefa.lembretes = lembretes;
  }

  return tarefa;
}

export function extrairTarefaLegada(item: unknown): TarefaLegada | null {
  if (!isRegistro(item)) {
    return null;
  }
  if (typeof item.id !== 'string' || typeof item.titulo !== 'string') {
    return null;
  }

  const legada: TarefaLegada = {
    id: item.id,
    titulo: item.titulo,
  };

  if (typeof item.prazo === 'string') {
    legada.prazo = item.prazo;
  }
  if (typeof item.status === 'string') {
    legada.status = item.status;
  }
  if (typeof item.categoriaId === 'string') {
    legada.categoriaId = item.categoriaId;
  }
  if (typeof item.disciplinaId === 'string') {
    legada.disciplinaId = item.disciplinaId;
  }
  if (typeof item.prioridade === 'string') {
    legada.prioridade = item.prioridade;
  }
  if (item.lembretes !== undefined) {
    legada.lembretes = item.lembretes;
  }

  return legada;
}

/**
 * Valida e normaliza um registro persistido (após extração/migração legada).
 * Registros inválidos retornam `null` (descartados na leitura, sem derrubar o lote).
 */
export function normalizarTarefaPersistida(legada: TarefaLegada): Tarefa | null {
  try {
    validarIdArmazenamento(legada.id);
  } catch {
    return null;
  }

  const migrada = migrarTarefaLegada(legada);

  try {
    const id = validarIdArmazenamento(migrada.id);
    const titulo = validarTituloTarefa(migrada.titulo);
    const categoriaId = validarCategoriaId(migrada.categoriaId);

    const tarefa: Tarefa = {
      id,
      titulo,
      categoriaId,
      status: migrada.status,
      prioridade: migrada.prioridade,
    };

    if (legada.prazo !== undefined && legada.prazo !== null && String(legada.prazo).trim() !== '') {
      try {
        const prazo = validarPrazoOpcional(String(legada.prazo));
        if (!prazo) {
          return null;
        }
        tarefa.prazo = prazo;
      } catch {
        return null;
      }
    }

    const lembretesBrutos = normalizarLembretes(legada.lembretes);
    if (lembretesBrutos.length > 0) {
      try {
        const lembretes = validarLembretesOpcional(lembretesBrutos, tarefa.prazo);
        if (lembretes.length > 0) {
          tarefa.lembretes = lembretes;
        }
      } catch {
        // lembrete inválido ou sem prazo com horário: mantém tarefa sem lembretes
      }
    }

    return tarefa;
  } catch {
    return null;
  }
}

export function precisaPersistirMigracaoTarefas(bruto: TarefaLegada[], migradas: Tarefa[]): boolean {
  if (bruto.length !== migradas.length) {
    return true;
  }
  return bruto.some((item, index) => {
    const m = migradas[index];
    return (
      item.categoriaId !== m.categoriaId ||
      normalizarStatusPersistido(item.status) !== m.status ||
      item.disciplinaId !== undefined ||
      !prioridadeLegadaValida(item.prioridade)
    );
  });
}

/** Validação estrita antes de gravar substituição em lote (entrada já tipada como Tarefa). */
export function validarTarefaParaSubstituicao(tarefa: Tarefa): Tarefa {
  const id = validarIdArmazenamento(tarefa.id);
  const titulo = validarTituloTarefa(tarefa.titulo);
  const categoriaId = validarCategoriaId(tarefa.categoriaId);
  const prioridade = validarPrioridade(tarefa.prioridade);
  const status = tarefa.status;
  if (status !== 'pendente' && status !== 'concluida' && status !== 'arquivada') {
    throw new Error('Status inválido.');
  }

  let resultado: Tarefa = { id, titulo, categoriaId, status, prioridade };

  if (tarefa.prazo !== undefined) {
    const prazo = validarPrazoOpcional(tarefa.prazo);
    if (!prazo) {
      throw new Error('Prazo inválido.');
    }
    resultado = { ...resultado, prazo };
  }

  if (tarefa.lembretes !== undefined && tarefa.lembretes.length > 0) {
    const lembretes = validarLembretesOpcional(tarefa.lembretes, resultado.prazo);
    if (lembretes.length > 0) {
      resultado = { ...resultado, lembretes };
    }
  }

  return resultado;
}

export function validarTarefasParaSubstituicao(tarefas: Tarefa[]): Tarefa[] {
  return tarefas.map((t) => validarTarefaParaSubstituicao(t));
}
