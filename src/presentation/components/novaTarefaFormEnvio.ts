import type { PrioridadeTarefa, TipoLembretePrazo } from '@/domain/entities/Tarefa';

export type SubmitNovaTarefa = (
  titulo: string,
  prazo: string,
  categoriaId: string,
  prioridade: PrioridadeTarefa,
  lembretes: TipoLembretePrazo[],
) => Promise<boolean>;

export function botaoNovaTarefaDesabilitado(
  enviando: boolean,
  titulo: string,
  categoriaId: string,
): boolean {
  return enviando || !titulo.trim() || !categoriaId;
}

/** Contrato: limpa campos somente quando `onSubmit` confirma sucesso (`true`). */
export async function processarEnvioNovaTarefa(
  onSubmit: SubmitNovaTarefa,
  titulo: string,
  prazo: string,
  categoriaId: string,
  prioridade: PrioridadeTarefa,
  lembretes: TipoLembretePrazo[],
  limparCampos: () => void,
): Promise<boolean> {
  const sucesso = await onSubmit(titulo, prazo, categoriaId, prioridade, lembretes);
  if (sucesso) {
    limparCampos();
  }
  return sucesso;
}
