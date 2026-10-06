---
name: tarefas-academicas
description: >-
  TODO LIST V1 (Expo Web): Clean Architecture + MVVM, Tarefa, Categoria (até 12),
  quatorze casos de uso (criar, listar, listar filtradas, concluir, arquivar, excluir, listar arquivadas,
  restaurar, alterar prazo, editar, gerar resumo, incluir categoria, excluir categoria, exportar dados), localStorage, testes Jest
  em domain e use cases. Use ao editar este app,
  entidades, repositórios, ViewModels, rotas Expo Router ou pastas em src/.
---

# TODO LIST — V1

App **React Native / Expo**, navegação **Expo Router**, persistência **localStorage**, execução **V1 = Web**.

**Clean Architecture** + **MVVM**: View → ViewModel → Use Case → Repository (port) → *RepositoryImpl → *LocalDataSource → `StorageDataSource`.

Persistência nativa: `@react-native-async-storage/async-storage` via `AsyncStorageDataSource`. Não implemente API ou backend sem pedido explícito.

## Escopo V1

| Item | V1 |
|------|-----|
| Entidade principal | `Tarefa` (+ `Categoria` seed) |
| Categorias | 6 seed + incluir até **12**; excluir até mín. **4** (`IncluirCategoria` / `ExcluirCategoria`) |
| Ciclo de vida | `pendente` → `concluida` → `arquivada` |
| Use cases | 14 arquivos em `application/usecases/` (ver [usecases.md](usecases.md)) |
| Menu ☰ | Filtros, categorias, tema (grafite claro/escuro), exportar (WhatsApp / e-mail), Sobre (`/sobre`) |
| Testes | Domain + Use Cases ([testing.md](testing.md)) |

## Árvore

```text
src/
  app/                    # Stack + (tabs) + categorias, filtros, tema (menu ☰)
  domain/entities/        # Tarefa, Categoria, ResumoTarefas, FiltrosTarefa
  domain/exportacao/      # pacote exportação (texto + HTML)
  domain/theme/           # PreferenciaTema, resolverPaleta
  domain/repositories/
  application/usecases/   # PascalCase, um arquivo por caso de uso
  data/datasources/ + data/repositories/
  presentation/
    viewmodels/           # MVVM (hooks)
    views/
    components/
```

Legado Expo (`src/components/` template): só tema; lógica nova em `presentation/`.

## Dependências

```text
app → presentation/views → viewmodels → application → domain
data → domain
viewmodels → data (composition root: Impl + use cases)
```

## Use cases oficiais (V1)

1. `CriarTarefa.ts`
2. `ListarTarefas.ts` — ativas (não arquivadas)
3. `ListarTarefasFiltradas.ts` — Home com `FiltrosTarefa`
4. `ConcluirTarefa.ts`
5. `ArquivarTarefa.ts`
6. `ExcluirDefinitivamente.ts`
7. `ListarTarefasArquivadas.ts`
8. `RestaurarTarefa.ts`
9. `AlterarPrazoTarefa.ts`
10. `EditarTarefa.ts`
11. `GerarResumo.ts`
12. `IncluirCategoria.ts`
13. `ExcluirCategoria.ts`
14. `ExportarDados.ts`

## Novo use case

```
- [ ] Regra de domínio em domain/ (se aplicável)
- [ ] Classe em application/usecases/
- [ ] Teste em *.test.ts ao lado ou espelhado
- [ ] ViewModel expõe ação; View só bind
- [ ] Atualizar usecases.md se contrato mudar
```

## Recursos

- [domain.md](domain.md) — linguagem ubíqua
- [architecture.md](architecture.md) — camadas, rotas, localStorage
- [usecases.md](usecases.md) — contratos dos casos de uso V1
- [testing.md](testing.md) — Jest domain/application
- [examples.md](examples.md) — esqueletos
