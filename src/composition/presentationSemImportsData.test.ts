import fs from 'node:fs';
import path from 'node:path';

const PRESENTATION_ROOT = path.join(__dirname, '..', 'presentation');
const PROIBIDOS = ['@/data/repositories/', '@/data/datasources/', '@/data/notificacoes/'];

function listarArquivosFonte(dir: string): string[] {
  const entradas = fs.readdirSync(dir, { withFileTypes: true });
  const arquivos: string[] = [];
  for (const entrada of entradas) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      arquivos.push(...listarArquivosFonte(completo));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entrada.name) && !/\.test\.(ts|tsx)$/.test(entrada.name)) {
      arquivos.push(completo);
    }
  }
  return arquivos;
}

describe('Presentation não importa implementações concretas de Data', () => {
  it('não referencia repositories, datasources ou adapters de @/data/', () => {
    const violacoes: string[] = [];
    for (const arquivo of listarArquivosFonte(PRESENTATION_ROOT)) {
      const conteudo = fs.readFileSync(arquivo, 'utf8');
      for (const padrao of PROIBIDOS) {
        if (conteudo.includes(padrao)) {
          violacoes.push(`${path.relative(PRESENTATION_ROOT, arquivo)} → ${padrao}`);
        }
      }
    }
    expect(violacoes).toEqual([]);
  });
});
