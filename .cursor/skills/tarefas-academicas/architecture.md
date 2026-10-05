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

Tabs: Home → Resumo → Arquivadas. Menu **AppMenuHeader** (canto superior direito): **Filtros** → `/filtros`, **Gerenciar categorias** → `/categorias`, **Tema** → `/tema`, **Exportar dados** → modal **WhatsApp** (texto) / **E-mail** (HTML, tarefas **ativas**); Sobre fecha o menu (futuro). **`TemaAppProvider`** + `gta:tema` (Automático / Claro / Escuro / Grafite claro / Grafite escuro); `useAppColorScheme` → tokens em `Colors`. Home usa `FiltrosTarefasProvider` + `ListarTarefasFiltradas`; se filtros ≠ padrão, **`FiltrosAtivosBar`** (entre form e lista) com **Limpar filtros**.

## Persistência v1 (Web)

| Chave | Conteúdo |
|-------|----------|
| `gta:tarefas` | JSON array de `Tarefa` |
| `gta:categorias` | JSON array; seed se vazio |
| `gta:filtros` | JSON `FiltrosTarefa` aplicados na Home |
| `gta:tema` | JSON `{ preferencia }` (`PreferenciaTema`) |

Composition root: **ViewModels** (`useMemo`).

Componentes de prioridade: `SeletorPrioridade` (form/modal), `PrioridadeBadge` (card); cores em `presentation/constants/prioridadeTarefa.ts`.

`SeletorCategoria` (Nova tarefa / Editar): grade fixa de **4 colunas** por linha, chips com largura igual (`flex: 1`).

Sync entre abas Home / Arquivadas / Resumo: `useFocusEffect` nas views + [`TarefaRefreshContext`](primeiro-app-react/src/presentation/context/TarefaRefreshContext.tsx) (`notifyTarefasChanged` após mutações).

Exportação (menu): use case `ExportarDados` → `domain/exportacao/DadosExportacao.ts` (texto WhatsApp + HTML e-mail; só tarefas **ativas**); `presentation/services/compartilharExportacao.ts` + `expo-sharing`.

## v2+

- API, backend
