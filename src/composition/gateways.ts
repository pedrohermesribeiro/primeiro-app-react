import type { FiltrosTarefa } from '@/domain/entities/FiltrosTarefa';
import type { PreferenciaTema } from '@/domain/theme/PreferenciaTema';

/** Persistência de filtros (porta consumida pela Presentation). */
export interface FiltrosTarefasGateway {
  get(): Promise<FiltrosTarefa>;
  set(filtros: FiltrosTarefa): Promise<void>;
}

/** Persistência de preferência de tema (porta consumida pela Presentation). */
export interface TemaAppGateway {
  get(): Promise<PreferenciaTema>;
  set(preferencia: PreferenciaTema): Promise<void>;
}
