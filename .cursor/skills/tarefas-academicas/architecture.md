# Arquitetura — TODO LIST V1

## Clean Architecture + MVVM

| Camada | Pasta | Papel |
|--------|--------|--------|
| Rotas | `src/app/` | Expo Router; JSX fino → `presentation/views` |
| View | `presentation/views/` | UI; sem use case direto |
| ViewModel | `presentation/viewmodels/` | Estado React; instancia Impl + use cases |
| Application | `application/usecases/` | Orquestração |
| Domain | `domain/` | Entidades, regras, ports |
| Data | `data/` | `StorageDataSource` + entity datasources + *RepositoryImpl |

```text
View → ViewModel → UseCase → TarefaRepository (port) → TarefaRepositoryImpl
  → TarefaLocalDataSource → StorageDataSource → LocalStorageDataSource (web) ou AsyncStorageDataSource (native)
```

```text
src/data/
  datasources/
    StorageDataSource.ts          # porta KV (getItem / setItem / removeItem)
    LocalStorageDataSource.ts     # web
    AsyncStorageDataSource.ts     # iOS / Android
    createDefaultStorage.*        # factory por plataforma (.web / .native)
    TarefaLocalDataSource.ts      # chave gta:tarefas + migração JSON
    CategoriaLocalDataSource.ts   # chave gta:categorias
    FiltrosTarefasLocalDataSource.ts  # gta:filtros
    TemaAppLocalDataSource.ts         # gta:tema
  repositories/
    TarefaRepositoryImpl.ts
    CategoriaRepositoryImpl.ts
  notificacoes/
    ExpoNotificacaoTarefaAdapter.native.ts
    ExpoNotificacaoTarefaAdapter.web.ts
```

## Rotas V1

| Rota | View | Conteúdo |
|------|------|----------|
| `/` (`(tabs)/index.tsx`) | `TarefaView` | Form nova tarefa + lista **ativas** |
| `/resumo` | `ResumoView` | Totais por status, prioridade e categoria (`ResumoTarefasCard`) |
| `/arquivadas` | `ArquivadasView` | Lista arquivadas + excluir definitivamente |
| `/categorias` | `CategoriasView` | Incluir e excluir categorias (mín. 4; menu ☰, sem tab) |
| `/filtros` | `FiltrosView` | Rascunho + **Aplicar filtros**; **Limpar tudo** no header |
| `/tema` | `TemaView` | Preferência de aparência (aplicação imediata) |

Tabs: Home → Resumo → Arquivadas. Menu **AppMenuHeader** (canto superior direito): **Filtros** → `/filtros`, **Gerenciar categorias** → `/categorias`, **Tema** → `/tema`, **Exportar dados** → modal **WhatsApp** (texto) / **E-mail** (HTML, tarefas **ativas**); **Sobre** → `/sobre`. **`TemaAppProvider`** + `gta:tema` (padrão **Grafite escuro**; opções Automático / Claro / Escuro / Grafite claro / Grafite escuro); `useAppColorScheme` → tokens em `Colors`. Home usa `FiltrosTarefasProvider` + `ListarTarefasFiltradas`; se filtros ≠ padrão, **`FiltrosAtivosBar`** (entre form e lista) com **Limpar filtros**.

## Persistência v1 (Web)

| Chave | Conteúdo |
|-------|----------|
| `gta:tarefas` | JSON array de `Tarefa` |
| `gta:categorias` | JSON array; seed se vazio |
| `gta:filtros` | JSON `FiltrosTarefa` aplicados na Home |
| `gta:tema` | JSON `{ preferencia }` (`PreferenciaTema`) |

Composition root: **ViewModels** (`useMemo`).

Componentes de prioridade: `SeletorPrioridade` (form/modal), `PrioridadeBadge` (card); cores em `presentation/constants/prioridadeTarefa.ts`.

`SeletorCategoria` (Nova tarefa / Editar): **padrão** — grade fixa **4 colunas** por linha (`flex: 1`, ellipsis em 1 linha). **Android + `PixelRatio.getFontScale() > 1`**: `flexWrap`, até 4/linha, nomes multilinha; Home com form no `ListHeaderComponent`; modal editar com `ScrollView` (`useFonteGrandeFormulario`).

Sync entre abas Home / Arquivadas / Resumo: `useFocusEffect` nas views + [`TarefaRefreshContext`](primeiro-app-react/src/presentation/context/TarefaRefreshContext.tsx) (`notifyTarefasChanged` após mutações).

Exportação (menu): use case `ExportarDados` → `domain/exportacao/DadosExportacao.ts` (texto WhatsApp + HTML e-mail; só tarefas **ativas**); `presentation/services/compartilharExportacao.ts` + `expo-sharing`.

Notificações locais (iOS/Android): `domain/lembrete/LembretesTarefa.ts` + `NotificacaoTarefa.listarAgendamentosNotificacao` (ids `gta-tarefa-{id}-{tipo}`); adapter Expo; `SincronizarNotificacoesTarefas`. UI: ícone lembrete + `ModalLembretesPrazo` em `CampoPrazo`. **Web** / **Expo Go** (notif. off): ver README.

## v2+

- API, backend
