import {
  formatarPrazoExibicao,
  horaPadraoParaData,
  instanteComparacaoAtraso,
  normalizarPrazoComHorario,
  parsePrazoLocal,
  validarPrazoArmazenado,
  validarPrazoOpcionalArmazenado,
} from '@/domain/prazo/PrazoTarefa';

describe('PrazoTarefa', () => {
  it('parse e valida so data', () => {
    expect(parsePrazoLocal('2026-03-17')?.temHora).toBe(false);
    expect(validarPrazoArmazenado('2026-03-17')).toBe('2026-03-17');
    expect(validarPrazoOpcionalArmazenado('')).toBeUndefined();
  });

  it('parse e valida data com hora', () => {
    const parsed = parsePrazoLocal('2026-03-17T14:30');
    expect(parsed?.temHora).toBe(true);
    expect(validarPrazoArmazenado('2026-03-17T14:30')).toBe('2026-03-17T14:30');
  });

  it('horaPadraoParaData hoje +1h e amanha 08:00', () => {
    const agora = new Date(2026, 2, 17, 10, 15, 0);
    expect(horaPadraoParaData('2026-03-17', agora)).toBe('11:15');
    expect(horaPadraoParaData('2026-03-18', agora)).toBe('08:00');
    expect(horaPadraoParaData('2026-03-20', agora)).toBe('08:00');
  });

  it('normalizarPrazoComHorario aplica regra em legado so-data', () => {
    const agora = new Date(2026, 2, 17, 9, 0, 0);
    expect(normalizarPrazoComHorario('2026-03-18', agora)).toBe('2026-03-18T08:00');
  });

  it('instante atraso usa hora inferida em legado so-data', () => {
    const agora = new Date(2026, 2, 17, 12, 0, 0);
    const inst = instanteComparacaoAtraso('2026-03-17', agora);
    expect(inst?.getHours()).toBe(13);
  });

  it('instante atraso: datetime usa hora exata', () => {
    const inst = instanteComparacaoAtraso('2026-03-17T14:30');
    expect(inst?.getHours()).toBe(14);
    expect(inst?.getMinutes()).toBe(30);
  });

  it('formatar exibicao com e sem hora', () => {
    expect(formatarPrazoExibicao('2026-03-17')).toMatch(/17/);
    expect(formatarPrazoExibicao('2026-03-17T14:30')).toMatch(/14:30/);
  });

  it('rejeita prazo invalido', () => {
    expect(() => validarPrazoArmazenado('2026-02-30')).toThrow();
    expect(() => validarPrazoArmazenado('invalido')).toThrow();
  });
});
