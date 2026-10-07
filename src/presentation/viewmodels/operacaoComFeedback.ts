import { mensagemErroOperacao } from '@/presentation/viewmodels/mensagemErroOperacao';

/** Executa operação assíncrona e indica sucesso para a View decidir estado local. */
export async function executarComFeedbackUsuario(
  limparErro: () => void,
  registrarErro: (mensagem: string) => void,
  mensagemPadrao: string,
  operacao: () => Promise<void>,
): Promise<boolean> {
  limparErro();
  try {
    await operacao();
    return true;
  } catch (erro) {
    registrarErro(mensagemErroOperacao(erro, mensagemPadrao));
    return false;
  }
}
