import {
  criarHandlerApresentacaoForeground,
  resolverApresentacaoNotificacaoForeground,
} from '@/data/notificacoes/notificacaoForegroundApresentacao';

describe('notificacaoForegroundApresentacao', () => {
  it('resolve apresentação com banner, lista e som (SDK 57 foreground)', async () => {
    const comportamento = await resolverApresentacaoNotificacaoForeground();
    expect(comportamento).toEqual({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    });
  });

  it('criarHandlerApresentacaoForeground expõe handleNotification', async () => {
    const handler = criarHandlerApresentacaoForeground();
    await expect(handler.handleNotification()).resolves.toMatchObject({
      shouldShowBanner: true,
      shouldPlaySound: true,
    });
  });
});
