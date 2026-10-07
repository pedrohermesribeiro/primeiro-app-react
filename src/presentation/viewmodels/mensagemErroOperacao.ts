const PADROES_TECNICOS = /^(TypeError|ReferenceError|RangeError|SyntaxError|Error):/i;

/** Mensagem segura para UI; preserva erros de domínio curtos e legíveis. */
export function mensagemErroOperacao(erro: unknown, mensagemPadrao: string): string {
  if (!(erro instanceof Error)) {
    return mensagemPadrao;
  }
  const texto = erro.message.trim();
  if (!texto) {
    return mensagemPadrao;
  }
  if (texto.includes('\n') || PADROES_TECNICOS.test(texto) || texto.length > 200) {
    return mensagemPadrao;
  }
  return texto;
}
