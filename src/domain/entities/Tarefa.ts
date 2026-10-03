export type StatusTarefa = 'pendente' | 'concluida' | 'arquivada';

export type Tarefa = {
  id: string;
  titulo: string;
  categoriaId: string;
  status: StatusTarefa;
  prazo?: string;
};

function randomUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function criarTarefaId(): string {
  const webCrypto = globalThis.crypto;
  if (webCrypto && typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  return randomUuidV4();
}

export function podeConcluir(tarefa: Tarefa): boolean {
  return tarefa.status === 'pendente';
}

export function podeArquivar(tarefa: Tarefa): boolean {
  return tarefa.status === 'pendente' || tarefa.status === 'concluida';
}

export function podeExcluir(tarefa: Tarefa): boolean {
  return (
    tarefa.status === 'pendente' ||
    tarefa.status === 'concluida' ||
    tarefa.status === 'arquivada'
  );
}

/** @deprecated Preferir `podeExcluir` — mantido por compatibilidade. */
export function podeExcluirDefinitivamente(tarefa: Tarefa): boolean {
  return podeExcluir(tarefa);
}

export function isTarefaAtiva(tarefa: Tarefa): boolean {
  return tarefa.status !== 'arquivada';
}

export function podeExcluirAtiva(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

export function podeRestaurar(tarefa: Tarefa): boolean {
  return tarefa.status === 'arquivada';
}

export function podeAlterarPrazo(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

const PRAZO_ISO = /^\d{4}-\d{2}-\d{2}$/;

export function aplicarPrazoEntrada(tarefa: Tarefa, prazo: string): Tarefa {
  const trimmed = prazo.trim();
  if (!trimmed) {
    const { prazo: _removido, ...semPrazo } = tarefa;
    return semPrazo;
  }
  if (!PRAZO_ISO.test(trimmed)) {
    throw new Error('Prazo inválido. Use AAAA-MM-DD.');
  }
  return { ...tarefa, prazo: trimmed };
}
