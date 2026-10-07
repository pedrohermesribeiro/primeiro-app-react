import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { solicitarPermissaoParaLembretes } from '@/application/notificacoes/permissoesLembretes';
import { useAppContainer } from '@/composition/AppContainerContext';
import type { TipoLembretePrazo } from '@/domain/lembrete/LembretesTarefa';

import { IconeBotaoLembrete } from '@/presentation/components/IconeBotaoLembrete';
import { ModalLembretesPrazo } from '@/presentation/components/ModalLembretesPrazo';

type Props = {
  lembretes: TipoLembretePrazo[];
  onChange: (lembretes: TipoLembretePrazo[]) => void;
  disabled?: boolean;
};

export function SeletorLembretes({ lembretes, onChange, disabled }: Props) {
  const { notificacaoPort } = useAppContainer();
  const [modalAberto, setModalAberto] = useState(false);
  const solicitandoPermissao = useRef(false);
  const ativo = lembretes.length > 0;

  const abrirModal = () => {
    if (disabled) {
      return;
    }
    setModalAberto(true);
  };

  const confirmarLembretes = useCallback(
    async (novos: TipoLembretePrazo[]) => {
      if (Platform.OS !== 'web' && novos.length > 0 && !solicitandoPermissao.current) {
        solicitandoPermissao.current = true;
        try {
          await solicitarPermissaoParaLembretes(notificacaoPort, novos);
        } finally {
          solicitandoPermissao.current = false;
        }
      }
      onChange(novos);
      setModalAberto(false);
    },
    [notificacaoPort, onChange],
  );

  return (
    <>
      <IconeBotaoLembrete ativo={ativo} disabled={disabled} onPress={abrirModal} />
      <ModalLembretesPrazo
        visible={modalAberto}
        lembretes={lembretes}
        onCancel={() => setModalAberto(false)}
        onConfirm={(novos) => {
          void confirmarLembretes(novos);
        }}
      />
    </>
  );
}
