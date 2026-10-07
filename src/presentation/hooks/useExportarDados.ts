import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { useAppContainer } from '@/composition/AppContainerContext';
import {
  abrirEmailComHtml,
  abrirWhatsAppComTexto,
} from '@/presentation/services/compartilharExportacao';

export type DestinoExportacao = 'whatsapp' | 'email';

export function useExportarDados() {
  const { exportarDados } = useAppContainer();
  const [exportando, setExportando] = useState(false);

  const exportarPara = useCallback(
    async (destino: DestinoExportacao) => {
      if (exportando) {
        return;
      }
      setExportando(true);
      try {
        const { textoWhatsApp, htmlEmail } = await exportarDados.executar();
        if (destino === 'whatsapp') {
          await abrirWhatsAppComTexto(textoWhatsApp);
        } else {
          await abrirEmailComHtml(htmlEmail, textoWhatsApp);
        }
      } catch {
        Alert.alert('Exportação falhou', 'Não foi possível preparar os dados para exportação.');
      } finally {
        setExportando(false);
      }
    },
    [exportando, exportarDados],
  );

  return { exportarPara, exportando };
}
