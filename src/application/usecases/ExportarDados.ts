import {
  filtrarTarefasAtivas,
  gerarFormatosExportacao,
  montarPacoteExportacao,
  type ResultadoFormatosExportacao,
} from '@/domain/exportacao/DadosExportacao';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

export class ExportarDados {
  constructor(
    private readonly tarefaRepository: TarefaRepository,
    private readonly categoriaRepository: CategoriaRepository,
  ) {}

  async executar(): Promise<ResultadoFormatosExportacao> {
    const [tarefas, categorias] = await Promise.all([
      this.tarefaRepository.listar(),
      this.categoriaRepository.listar(),
    ]);
    const ativas = filtrarTarefasAtivas(tarefas);
    const pacote = montarPacoteExportacao(ativas, categorias);
    return gerarFormatosExportacao(pacote);
  }
}
