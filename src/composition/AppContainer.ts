import { ArquivarTarefa } from '@/application/usecases/ArquivarTarefa';
import { ConcluirTarefa } from '@/application/usecases/ConcluirTarefa';
import { CriarTarefa } from '@/application/usecases/CriarTarefa';
import { EditarTarefa } from '@/application/usecases/EditarTarefa';
import { ExcluirCategoria } from '@/application/usecases/ExcluirCategoria';
import { ExcluirDefinitivamente } from '@/application/usecases/ExcluirDefinitivamente';
import { ExportarDados } from '@/application/usecases/ExportarDados';
import { GerarResumo } from '@/application/usecases/GerarResumo';
import { IncluirCategoria } from '@/application/usecases/IncluirCategoria';
import { ListarCategorias } from '@/application/usecases/ListarCategorias';
import { ListarTarefasArquivadas } from '@/application/usecases/ListarTarefasArquivadas';
import { ListarTarefasFiltradas } from '@/application/usecases/ListarTarefasFiltradas';
import { RestaurarTarefa } from '@/application/usecases/RestaurarTarefa';
import { SincronizarNotificacoesTarefas } from '@/application/usecases/SincronizarNotificacoesTarefas';
import { FiltrosTarefasLocalDataSource } from '@/data/datasources/FiltrosTarefasLocalDataSource';
import { TemaAppLocalDataSource } from '@/data/datasources/TemaAppLocalDataSource';
import { ExpoNotificacaoTarefaAdapter } from '@/data/notificacoes/ExpoNotificacaoTarefaAdapter';
import { CategoriaRepositoryImpl } from '@/data/repositories/CategoriaRepositoryImpl';
import { TarefaRepositoryImpl } from '@/data/repositories/TarefaRepositoryImpl';
import type { NotificacaoTarefaPort } from '@/domain/ports/NotificacaoTarefaPort';
import type { CategoriaRepository } from '@/domain/repositories/CategoriaRepository';
import type { TarefaRepository } from '@/domain/repositories/TarefaRepository';

import type { FiltrosTarefasGateway, TemaAppGateway } from '@/composition/gateways';

export type TarefaHomeUseCases = {
  listarFiltradas: ListarTarefasFiltradas;
  listarCategorias: ListarCategorias;
  criar: CriarTarefa;
  concluir: ConcluirTarefa;
  arquivar: ArquivarTarefa;
  excluir: ExcluirDefinitivamente;
  editar: EditarTarefa;
};

export type CategoriasUseCases = {
  listarCategorias: ListarCategorias;
  incluirCategoria: IncluirCategoria;
  excluirCategoria: ExcluirCategoria;
};

export type ArquivadasUseCases = {
  listarArquivadas: ListarTarefasArquivadas;
  listarCategorias: ListarCategorias;
  excluirDefinitivamente: ExcluirDefinitivamente;
  restaurar: RestaurarTarefa;
};

export type ResumoUseCases = {
  gerarResumo: GerarResumo;
  listarCategorias: ListarCategorias;
};

export type AppContainer = {
  tarefaRepository: TarefaRepository;
  categoriaRepository: CategoriaRepository;
  filtrosTarefasGateway: FiltrosTarefasGateway;
  temaAppGateway: TemaAppGateway;
  notificacaoPort: NotificacaoTarefaPort;
  exportarDados: ExportarDados;
  sincronizarNotificacoes: SincronizarNotificacoesTarefas;
  tarefaHome: TarefaHomeUseCases;
  categorias: CategoriasUseCases;
  arquivadas: ArquivadasUseCases;
  resumo: ResumoUseCases;
};

export function createAppContainer(): AppContainer {
  const tarefaRepository = new TarefaRepositoryImpl();
  const categoriaRepository = new CategoriaRepositoryImpl();
  const filtrosTarefasGateway: FiltrosTarefasGateway = new FiltrosTarefasLocalDataSource();
  const temaAppGateway: TemaAppGateway = new TemaAppLocalDataSource();
  const notificacaoPort: NotificacaoTarefaPort = new ExpoNotificacaoTarefaAdapter();
  const listarCategorias = new ListarCategorias(categoriaRepository);

  return {
    tarefaRepository,
    categoriaRepository,
    filtrosTarefasGateway,
    temaAppGateway,
    notificacaoPort,
    exportarDados: new ExportarDados(tarefaRepository, categoriaRepository),
    sincronizarNotificacoes: new SincronizarNotificacoesTarefas(tarefaRepository, notificacaoPort),
    tarefaHome: {
      listarFiltradas: new ListarTarefasFiltradas(tarefaRepository),
      listarCategorias,
      criar: new CriarTarefa(tarefaRepository),
      concluir: new ConcluirTarefa(tarefaRepository),
      arquivar: new ArquivarTarefa(tarefaRepository),
      excluir: new ExcluirDefinitivamente(tarefaRepository),
      editar: new EditarTarefa(tarefaRepository),
    },
    categorias: {
      listarCategorias,
      incluirCategoria: new IncluirCategoria(categoriaRepository),
      excluirCategoria: new ExcluirCategoria(categoriaRepository, tarefaRepository),
    },
    arquivadas: {
      listarArquivadas: new ListarTarefasArquivadas(tarefaRepository),
      listarCategorias,
      excluirDefinitivamente: new ExcluirDefinitivamente(tarefaRepository),
      restaurar: new RestaurarTarefa(tarefaRepository),
    },
    resumo: {
      gerarResumo: new GerarResumo(tarefaRepository),
      listarCategorias,
    },
  };
}
