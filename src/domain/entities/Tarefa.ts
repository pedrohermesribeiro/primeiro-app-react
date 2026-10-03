import { normalizarTextoEntrada } from '@/domain/validacao/textoEntrada';

export type StatusTarefa = 'pendente' | 'concluida' | 'arquivada';

export const MAX_TITULO_TAREFA = 60;

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

export function podeEditarTarefa(tarefa: Tarefa): boolean {
  return isTarefaAtiva(tarefa);
}

const PRAZO_ISO = /^\d{4}-\d{2}-\d{2}$/;

function isDataIsoValida(iso: string): boolean {
  const [anoStr, mesStr, diaStr] = iso.split('-');
  const ano = Number(anoStr);
  const mes = Number(mesStr);
  const dia = Number(diaStr);
  if (!Number.isInteger(ano) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
    return false;
  }
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

export function validarTituloTarefa(titulo: string): string {
  const normalizado = normalizarTextoEntrada(titulo);
  if (!normalizado) {
    throw new Error('O título é obrigatório.');
  }
  if (normalizado.length > MAX_TITULO_TAREFA) {
    throw new Error(`O título deve ter no máximo ${MAX_TITULO_TAREFA} caracteres.`);
  }
  return normalizado;
}

export function validarCategoriaId(categoriaId: string): string {
  const id = normalizarTextoEntrada(categoriaId);
  if (!id) {
    throw new Error('A categoria é obrigatória.');
  }
  if (id.length > 64 || !/^[a-z0-9-]+$/i.test(id)) {
    throw new Error('Categoria inválida.');
  }
  return id.toLowerCase();
}

/** Prazo vazio → `undefined`; caso contrário ISO `AAAA-MM-DD` com data real. */
export function validarPrazoOpcional(prazo?: string): string | undefined {
  if (prazo === undefined || prazo === null) {
    return undefined;
  }
  const trimmed = prazo.trim();
  if (!trimmed) {
    return undefined;
  }
  return validarPrazoIso(trimmed);
}

export function validarPrazoIso(prazo: string): string {
  const trimmed = prazo.trim();
  if (!PRAZO_ISO.test(trimmed)) {
    throw new Error('Prazo inválido. Use AAAA-MM-DD.');
  }
  if (!isDataIsoValida(trimmed)) {
    throw new Error('Prazo inválido. Data inexistente.');
  }
  return trimmed;
}

export function aplicarPrazoEntrada(tarefa: Tarefa, prazo: string): Tarefa {
  const trimmed = prazo.trim();
  if (!trimmed) {
    const { prazo: _removido, ...semPrazo } = tarefa;
    return semPrazo;
  }
  const iso = validarPrazoIso(trimmed);
  return { ...tarefa, prazo: iso };
}
