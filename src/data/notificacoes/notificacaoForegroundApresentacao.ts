/** Comportamento de apresentação para notificações recebidas com o app em foreground (Expo SDK 57). */
export type ComportamentoApresentacaoForeground = {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
  shouldShowBanner: boolean;
  shouldShowList: boolean;
};

export async function resolverApresentacaoNotificacaoForeground(): Promise<ComportamentoApresentacaoForeground> {
  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  };
}

export function criarHandlerApresentacaoForeground(): {
  handleNotification: () => Promise<ComportamentoApresentacaoForeground>;
} {
  return {
    handleNotification: resolverApresentacaoNotificacaoForeground,
  };
}
