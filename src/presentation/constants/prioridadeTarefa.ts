import type { PrioridadeTarefa } from '@/domain/entities/Tarefa';

export type EstiloPrioridade = {
  dot: string;
  chipBackground: string;
  badgeBackground: string;
};

export const ESTILO_PRIORIDADE: Record<PrioridadeTarefa, EstiloPrioridade> = {
  baixa: {
    dot: '#16a34a',
    chipBackground: '#dcfce7',
    badgeBackground: '#ecfdf3',
  },
  media: {
    dot: '#ca8a04',
    chipBackground: '#fef9c3',
    badgeBackground: '#fefce8',
  },
  alta: {
    dot: '#dc2626',
    chipBackground: '#fee2e2',
    badgeBackground: '#fef2f2',
  },
};
