import { Directory, File, Paths } from 'expo-file-system';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

const ASSUNTO_EMAIL = 'Tarefas ativas — SimpleTaskFlow';
const NOME_ARQUIVO_HTML = 'tarefas-ativas-simpletaskflow.html';

export async function abrirWhatsAppComTexto(texto: string): Promise<void> {
  const encoded = encodeURIComponent(texto);
  const candidatos =
    Platform.OS === 'android'
      ? [`whatsapp://send?text=${encoded}`, `https://api.whatsapp.com/send?text=${encoded}`]
      : [`whatsapp://send?text=${encoded}`, `https://wa.me/?text=${encoded}`];

  for (const url of candidatos) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // tenta próximo esquema / fallback web
    }
  }

  Alert.alert(
    'WhatsApp indisponível',
    'Não foi possível abrir o WhatsApp. Instale o app ou use a opção E-mail.',
  );
}

export async function abrirEmailComHtml(html: string, resumoTexto: string): Promise<void> {
  try {
    // Cache: sobrescreve a cada exportação; sem cleanup imediato pós-share (risco em algumas plataformas).
    const dir = new Directory(Paths.cache, 'exportacao-simpletaskflow');
    if (!dir.exists) {
      dir.create();
    }
    const arquivo = new File(dir, NOME_ARQUIVO_HTML);
    if (!arquivo.exists) {
      arquivo.create();
    }
    arquivo.write(html);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(arquivo.uri, {
        mimeType: 'text/html',
        dialogTitle: ASSUNTO_EMAIL,
        UTI: 'public.html',
      });
      return;
    }
  } catch {
    // fallback mailto abaixo
  }

  const corpoResumo = resumoTexto.slice(0, 2000);
  const url = `mailto:?subject=${encodeURIComponent(ASSUNTO_EMAIL)}&body=${encodeURIComponent(
    `${corpoResumo}\n\n(Abra o anexo HTML pelo compartilhamento quando disponível.)`,
  )}`;

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'E-mail indisponível',
      'Não foi possível compartilhar o HTML. Tente novamente ou use outro dispositivo.',
    );
  }
}
