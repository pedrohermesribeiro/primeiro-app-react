import type { TipoLembretePrazo } from '@/domain/lembrete/LembretesTarefa';

/** Tipos para TS; Metro resolve `CampoPrazo.native` / `CampoPrazo.web` por plataforma. */
export type CampoPrazoProps = {
  value: string;
  onChange: (iso: string) => void;
  lembretes?: TipoLembretePrazo[];
  onLembretesChange?: (lembretes: TipoLembretePrazo[]) => void;
  exibirLembretes?: boolean;
};

export { CampoPrazo } from './CampoPrazo.native';
