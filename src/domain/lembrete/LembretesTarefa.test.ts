import {
  alternarLembrete,
  calcularInstanteLembrete,
  lembretesPadrao,
  normalizarLembretes,
  rotuloResumoLembretes,
} from '@/domain/lembrete/LembretesTarefa';

describe('LembretesTarefa', () => {
  it('lembretesPadrao e normalizar', () => {
    expect(lembretesPadrao()).toEqual([]);
    expect(normalizarLembretes(['1h_antes', 'no_horario', '1h_antes'])).toEqual([
      'no_horario',
      '1h_antes',
    ]);
    expect(normalizarLembretes('x')).toEqual([]);
  });

  it('alternarLembrete: nao limpa; toggle multi', () => {
    expect(alternarLembrete(['no_horario'], 'nao')).toEqual([]);
    expect(alternarLembrete([], 'no_horario')).toEqual(['no_horario']);
    expect(alternarLembrete(['no_horario'], '1h_antes')).toEqual(['no_horario', '1h_antes']);
    expect(alternarLembrete(['no_horario', '1h_antes'], 'no_horario')).toEqual(['1h_antes']);
  });

  it('rotuloResumoLembretes', () => {
    expect(rotuloResumoLembretes([])).toBe('Não');
    expect(rotuloResumoLembretes(['1h_antes'])).toBe('1h antes');
    expect(rotuloResumoLembretes(['no_horario', '1_dia_antes'])).toBe('No horário, +1');
  });

  it('calcularInstanteLembrete exige T no prazo', () => {
    expect(calcularInstanteLembrete('2026-06-01', 'no_horario')).toBeUndefined();
    expect(calcularInstanteLembrete('2026-06-01T14:00', 'no_horario')).toEqual(
      new Date(2026, 5, 1, 14, 0, 0, 0),
    );
    expect(calcularInstanteLembrete('2026-06-01T14:00', '1h_antes')).toEqual(
      new Date(2026, 5, 1, 13, 0, 0, 0),
    );
    expect(calcularInstanteLembrete('2026-06-01T14:00', '1_dia_antes')).toEqual(
      new Date(2026, 4, 31, 14, 0, 0, 0),
    );
  });
});
