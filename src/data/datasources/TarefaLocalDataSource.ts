import { createDefaultStorage } from '@/data/datasources/createDefaultStorage';
import type { StorageDataSource } from '@/data/datasources/StorageDataSource';
import { parseJsonSeguro, valorComoArray } from '@/data/persistencia/jsonSeguro';
import {
  extrairTarefaLegada,
  normalizarTarefaPersistida,
  precisaPersistirMigracaoTarefas,
  type TarefaLegada,
  validarTarefasParaSubstituicao,
} from '@/data/persistencia/tarefaPersistida';
import type { Tarefa } from '@/domain/entities/Tarefa';

const CHAVE = 'gta:tarefas';

export class TarefaLocalDataSource {
  constructor(private readonly storage: StorageDataSource = createDefaultStorage()) {}

  async getAll(): Promise<Tarefa[]> {
    const bruto = await this.storage.getItem(CHAVE);
    if (!bruto) {
      return [];
    }

    const parsed = parseJsonSeguro(bruto);
    if (parsed === undefined) {
      return [];
    }

    const itens = valorComoArray(parsed);
    const brutoLegado: TarefaLegada[] = [];
    const migradas: Tarefa[] = [];

    for (const item of itens) {
      const legada = extrairTarefaLegada(item);
      if (!legada) {
        continue;
      }
      const tarefa = normalizarTarefaPersistida(legada);
      if (!tarefa) {
        continue;
      }
      brutoLegado.push(legada);
      migradas.push(tarefa);
    }

    const descartouRegistros = itens.length !== migradas.length;
    if (descartouRegistros || precisaPersistirMigracaoTarefas(brutoLegado, migradas)) {
      await this.setAll(migradas);
    }

    return migradas;
  }

  async setAll(tarefas: Tarefa[]): Promise<void> {
    const validadas = validarTarefasParaSubstituicao(tarefas);
    await this.storage.setItem(CHAVE, JSON.stringify(validadas));
  }
}
