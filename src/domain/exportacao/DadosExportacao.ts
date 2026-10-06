import type { Categoria } from '@/domain/entities/Categoria';
import {
  rotuloPrioridade,
  type PrioridadeTarefa,
  type StatusTarefa,
  type Tarefa,
} from '@/domain/entities/Tarefa';
import { formatarPrazoExibicao } from '@/domain/prazo/PrazoTarefa';

export const VERSAO_EXPORTACAO = 1 as const;

export type PacoteExportacao = {
  versao: typeof VERSAO_EXPORTACAO;
  exportadoEm: string;
  tarefas: Tarefa[];
  categorias: Categoria[];
};

export type ResultadoFormatosExportacao = {
  textoWhatsApp: string;
  htmlEmail: string;
};

const ROTULO_STATUS: Record<StatusTarefa, string> = {
  pendente: 'Pendente',
  concluida: 'Concluída',
  arquivada: 'Arquivada',
};

const CORES_PRIORIDADE_HTML: Record<
  PrioridadeTarefa,
  { fundo: string; texto: string; borda: string }
> = {
  baixa: { fundo: '#ecfdf3', texto: '#166534', borda: '#16a34a' },
  media: { fundo: '#fefce8', texto: '#854d0e', borda: '#ca8a04' },
  alta: { fundo: '#fef2f2', texto: '#991b1b', borda: '#dc2626' },
};

export function isTarefaAtiva(tarefa: Tarefa): boolean {
  return tarefa.status === 'pendente' || tarefa.status === 'concluida';
}

export function filtrarTarefasAtivas(tarefas: Tarefa[]): Tarefa[] {
  return tarefas.filter(isTarefaAtiva);
}

export function montarPacoteExportacao(
  tarefas: Tarefa[],
  categorias: Categoria[],
  exportadoEm: string = new Date().toISOString(),
): PacoteExportacao {
  return {
    versao: VERSAO_EXPORTACAO,
    exportadoEm,
    tarefas,
    categorias,
  };
}

export function mapaNomesCategoria(categorias: Categoria[]): Map<string, string> {
  return new Map(categorias.map((c) => [c.id, c.nome]));
}

function formatarPrazo(iso?: string): string {
  if (!iso) {
    return '—';
  }
  return formatarPrazoExibicao(iso);
}

function formatarDataHoraExportacao(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) {
    return iso;
  }
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ordenarTarefasExportacao(a: Tarefa, b: Tarefa): number {
  const ordemStatus: Record<StatusTarefa, number> = {
    pendente: 0,
    concluida: 1,
    arquivada: 2,
  };
  const diff = ordemStatus[a.status] - ordemStatus[b.status];
  if (diff !== 0) {
    return diff;
  }
  return a.titulo.localeCompare(b.titulo, 'pt-BR');
}

function linhaTarefaTexto(tarefa: Tarefa, categoriaNome: string): string {
  return [
    `▸ ${tarefa.titulo}`,
    `  Prioridade: ${rotuloPrioridade(tarefa.prioridade)} · Status: ${ROTULO_STATUS[tarefa.status]} · Categoria: ${categoriaNome} · Prazo: ${formatarPrazo(tarefa.prazo)}`,
  ].join('\n');
}

export function gerarTextoAmigavelExportacao(
  pacote: PacoteExportacao,
  nomesCategoria: Map<string, string>,
): string {
  const tarefas = [...pacote.tarefas].sort(ordenarTarefasExportacao);
  const pendentes = tarefas.filter((t) => t.status === 'pendente');
  const concluidas = tarefas.filter((t) => t.status === 'concluida');

  const linhas: string[] = [
    '📋 Tarefas ativas — GTA',
    `Exportado em: ${formatarDataHoraExportacao(pacote.exportadoEm)}`,
    '',
  ];

  if (tarefas.length === 0) {
    linhas.push('Nenhuma tarefa ativa no momento.');
    return linhas.join('\n');
  }

  linhas.push(`— Pendentes (${pendentes.length}) —`, '');
  if (pendentes.length === 0) {
    linhas.push('(nenhuma)', '');
  } else {
    for (const t of pendentes) {
      linhas.push(linhaTarefaTexto(t, nomesCategoria.get(t.categoriaId) ?? t.categoriaId), '');
    }
  }

  linhas.push(`— Concluídas (${concluidas.length}) —`, '');
  if (concluidas.length === 0) {
    linhas.push('(nenhuma)', '');
  } else {
    for (const t of concluidas) {
      linhas.push(linhaTarefaTexto(t, nomesCategoria.get(t.categoriaId) ?? t.categoriaId), '');
    }
  }

  return linhas.join('\n').trimEnd();
}

function cardTarefaHtml(tarefa: Tarefa, categoriaNome: string): string {
  const cores = CORES_PRIORIDADE_HTML[tarefa.prioridade];
  const titulo = escaparHtml(tarefa.titulo);
  const categoria = escaparHtml(categoriaNome);
  const status = escaparHtml(ROTULO_STATUS[tarefa.status]);
  const prioridade = escaparHtml(rotuloPrioridade(tarefa.prioridade));
  const prazo = escaparHtml(formatarPrazo(tarefa.prazo));

  return `<article style="background:#F0F0F3;border-radius:8px;padding:16px;margin-bottom:12px;">
  <header style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:8px;">
    <h2 style="margin:0;font-size:17px;line-height:1.3;color:#000;flex:1;min-width:120px;">${titulo}</h2>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
      <span style="font-size:12px;font-weight:600;padding:4px 8px;border-radius:6px;background:${cores.fundo};color:${cores.texto};border:1px solid ${cores.borda};">${prioridade}</span>
      <span style="font-size:14px;color:#60646C;">${status}</span>
    </div>
  </header>
  <p style="margin:0 0 4px;font-size:14px;color:#60646C;">Categoria: ${categoria}</p>
  <p style="margin:0;font-size:14px;color:#60646C;">Prazo: ${prazo}</p>
</article>`;
}

function secaoHtml(titulo: string, tarefas: Tarefa[], nomesCategoria: Map<string, string>): string {
  if (tarefas.length === 0) {
    return `<h3 style="font-size:15px;margin:24px 0 8px;color:#000;">${escaparHtml(titulo)} (0)</h3><p style="color:#60646C;font-size:14px;">Nenhuma tarefa.</p>`;
  }
  const cards = tarefas
    .map((t) => cardTarefaHtml(t, nomesCategoria.get(t.categoriaId) ?? t.categoriaId))
    .join('');
  return `<h3 style="font-size:15px;margin:24px 0 12px;color:#000;">${escaparHtml(titulo)} (${tarefas.length})</h3>${cards}`;
}

export function gerarHtmlExportacao(
  pacote: PacoteExportacao,
  nomesCategoria: Map<string, string>,
): string {
  const tarefas = [...pacote.tarefas].sort(ordenarTarefasExportacao);
  const pendentes = tarefas.filter((t) => t.status === 'pendente');
  const concluidas = tarefas.filter((t) => t.status === 'concluida');
  const exportado = escaparHtml(formatarDataHoraExportacao(pacote.exportadoEm));

  const corpo =
    tarefas.length === 0
      ? '<p style="color:#60646C;font-size:14px;">Nenhuma tarefa ativa no momento.</p>'
      : secaoHtml('Pendentes', pendentes, nomesCategoria) +
        secaoHtml('Concluídas', concluidas, nomesCategoria);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tarefas ativas — GTA</title>
</head>
<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#ffffff;color:#000;">
  <main style="max-width:800px;margin:0 auto;">
    <h1 style="font-size:28px;margin:0 0 8px;">Lista de tarefas</h1>
    <p style="margin:0 0 8px;font-size:14px;color:#60646C;">Tarefas ativas (pendentes e concluídas)</p>
    <p style="margin:0 0 16px;font-size:14px;color:#60646C;">Exportado em: ${exportado}</p>
    <section style="background:#F0F0F3;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#000;">Resumo da exportação</p>
      <p style="margin:8px 0 0;font-size:14px;color:#60646C;">Total: ${tarefas.length} · Pendentes: ${pendentes.length} · Concluídas: ${concluidas.length}</p>
    </section>
    ${corpo}
  </main>
</body>
</html>`;
}

export function gerarFormatosExportacao(pacote: PacoteExportacao): ResultadoFormatosExportacao {
  const nomesCategoria = mapaNomesCategoria(pacote.categorias);
  return {
    textoWhatsApp: gerarTextoAmigavelExportacao(pacote, nomesCategoria),
    htmlEmail: gerarHtmlExportacao(pacote, nomesCategoria),
  };
}
