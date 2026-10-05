# Testes V1

Comando: `npm test` (Jest + `jest-expo`).

## Onde

| Alvo | Padrão de arquivo |
|------|-------------------|
| Domain | `src/domain/**/*.test.ts` |
| Use cases | `src/application/usecases/**/*.test.ts` |

## Domain

- `Tarefa`, `Categoria`, `FiltrosTarefa` (`aplicarFiltrosTarefas`, `filtrosDiferentesDoPadrao`)
- `ResumoTarefas` / `calcularResumoTarefas`
- `PreferenciaTema` / `resolverPaleta`
- `DadosExportacao` (texto + HTML, filtro de ativas)

## Application

- Mock de `TarefaRepository` (objeto com jest.fn)
- Ex.: `ConcluirTarefa` só aceita `pendente`; `ListarTarefasFiltradas`, `ExcluirCategoria`, `ExportarDados`

## Fora do V1

Testes de View, ViewModel, E2E, DataSource com `localStorage` real.

Quando testar a camada `data/`, preferir mock de `StorageDataSource` (Map in-memory) injetado em `TarefaLocalDataSource` / `CategoriaLocalDataSource` — sem browser.
