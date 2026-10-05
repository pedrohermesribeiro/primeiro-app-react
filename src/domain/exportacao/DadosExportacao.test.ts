import {
  filtrarTarefasAtivas,
  gerarFormatosExportacao,
  gerarHtmlExportacao,
  gerarTextoAmigavelExportacao,
  mapaNomesCategoria,
  montarPacoteExportacao,
  VERSAO_EXPORTACAO,
} from '@/domain/exportacao/DadosExportacao';

describe('DadosExportacao', () => {
  const categorias = [{ id: 'cat1', nome: 'Faculdade' }];
  const nomes = mapaNomesCategoria(categorias);

  it('filtra apenas tarefas ativas', () => {
    const lista = filtrarTarefasAtivas([
      {
        id: '1',
        titulo: 'A',
        categoriaId: 'cat1',
        status: 'pendente',
        prioridade: 'baixa',
      },
      {
        id: '2',
        titulo: 'B',
        categoriaId: 'cat1',
        status: 'arquivada',
        prioridade: 'baixa',
      },
      {
        id: '3',
        titulo: 'C',
        categoriaId: 'cat1',
        status: 'concluida',
        prioridade: 'media',
      },
    ]);
    expect(lista.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('gera texto amigavel com secoes pendentes e concluidas', () => {
    const pacote = montarPacoteExportacao(
      [
        {
          id: '1',
          titulo: 'Estudar',
          categoriaId: 'cat1',
          status: 'pendente',
          prioridade: 'alta',
          prazo: '2026-04-10',
        },
      ],
      categorias,
      '2026-04-05T12:00:00.000Z',
    );
    const texto = gerarTextoAmigavelExportacao(pacote, nomes);
    expect(texto).toContain('Tarefas ativas');
    expect(texto).toContain('▸ Estudar');
    expect(texto).toContain('Faculdade');
    expect(texto).toContain('10/04/2026');
    expect(texto).not.toContain('arquivada');
  });

  it('gera HTML com estrutura de lista', () => {
    const pacote = montarPacoteExportacao(
      [
        {
          id: '1',
          titulo: 'Estudar',
          categoriaId: 'cat1',
          status: 'pendente',
          prioridade: 'media',
        },
      ],
      categorias,
      '2026-04-05T12:00:00.000Z',
    );
    const html = gerarHtmlExportacao(pacote, nomes);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Estudar');
    expect(html).toContain('Pendentes');
    expect(html).toContain('Média');
  });

  it('gerarFormatosExportacao retorna texto e html', () => {
    const pacote = montarPacoteExportacao([], categorias);
    expect(pacote.versao).toBe(VERSAO_EXPORTACAO);
    const formatos = gerarFormatosExportacao(pacote);
    expect(formatos.textoWhatsApp).toContain('Nenhuma tarefa ativa');
    expect(formatos.htmlEmail).toContain('<!DOCTYPE html>');
  });
});
