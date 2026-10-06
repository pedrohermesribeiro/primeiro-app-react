import { useState } from 'react';

import type { TipoLembretePrazo } from '@/domain/lembrete/LembretesTarefa';

import { IconeBotaoLembrete } from '@/presentation/components/IconeBotaoLembrete';
import { ModalLembretesPrazo } from '@/presentation/components/ModalLembretesPrazo';

type Props = {
  lembretes: TipoLembretePrazo[];
  onChange: (lembretes: TipoLembretePrazo[]) => void;
  disabled?: boolean;
};

export function SeletorLembretes({ lembretes, onChange, disabled }: Props) {
  const [modalAberto, setModalAberto] = useState(false);
  const ativo = lembretes.length > 0;

  const abrirModal = () => {
    if (disabled) {
      return;
    }
    setModalAberto(true);
  };

  return (
    <>
      <IconeBotaoLembrete ativo={ativo} disabled={disabled} onPress={abrirModal} />
      <ModalLembretesPrazo
        visible={modalAberto}
        lembretes={lembretes}
        onCancel={() => setModalAberto(false)}
        onConfirm={(novos) => {
          onChange(novos);
          setModalAberto(false);
        }}
      />
    </>
  );
}
