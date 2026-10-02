# Arquitetura — TODO LIST V1

## Clean Architecture + MVVM

| Camada | Pasta | Papel |
|--------|--------|--------|
| Rotas | `src/app/` | Expo Router; JSX fino → `presentation/views` |
| View | `presentation/views/` | UI; sem use case direto |
| ViewModel | `presentation/viewmodels/` | Estado React; instancia Impl + use cases |
| Application | `application/usecases/` | Orquestração |
| Domain | `domain/` | Entidades, regras, ports |
| Data | `data/` | localStorage via DataSource + *Impl |

```text
View → ViewModel → UseCase → TarefaRepository (port) → TarefaRepositoryImpl → localStorage
```

## Rotas V1

| Rota | View | Conteúdo |
|------|------|----------|
| `/` (`(tabs)/index.tsx`) | `TarefaView` | Form nova tarefa + lista **ativas** |
| `/resumo` | `ResumoView` | Totais por status e categoria (`ResumoTarefasCard`) |
| `/arquivadas` | `ArquivadasView` | Lista arquivadas + excluir definitivamente |
| `/categorias` | `CategoriasView` | Incluir categorias (menu ☰, sem tab) |

Tabs: Home → Resumo → Arquivadas. Menu **AppMenuHeader** (canto superior direito) → Categorias.

## Persistência v1 (Web)

| Chave | Conteúdo |
|-------|----------|
| `gta:tarefas` | JSON array de `Tarefa` |
| `gta:categorias` | JSON array; seed se vazio |

Composition root: **ViewModels** (`useMemo`).

Sync entre abas Home / Arquivadas / Resumo: `useFocusEffect` nas views + [`TarefaRefreshContext`](primeiro-app-react/src/presentation/context/TarefaRefreshContext.tsx) (`notifyTarefasChanged` após mutações).

## v2+

AsyncStorage, API, backend — não V1.
