---
name: tarefas-academicas
description: >-
  TODO LIST V1 (Expo Web): Clean Architecture + MVVM, Tarefa, Categoria (até 12),
  onze casos de uso (criar, listar, concluir, arquivar, excluir, listar arquivadas,
  restaurar, alterar prazo, editar, gerar resumo, incluir categoria), localStorage, testes Jest
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
| Categorias | 6 seed + incluir até **12** (`IncluirCategoria`) |
| Ciclo de vida | `pendente` → `concluida` → `arquivada` |
| Use cases | 11 arquivos em `application/usecases/` (ver [usecases.md](usecases.md)) |
| Testes | Domain + Use Cases ([testing.md](testing.md)) |

## Árvore

```text
src/
  app/                    # Stack + (tabs) + categorias (menu hambúrguer)
  domain/entities/        # Tarefa, Categoria, ResumoTarefas
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
3. `ConcluirTarefa.ts`
4. `ArquivarTarefa.ts`
5. `ExcluirDefinitivamente.ts`
6. `ListarTarefasArquivadas.ts`
7. `RestaurarTarefa.ts`
8. `AlterarPrazoTarefa.ts`
9. `EditarTarefa.ts`
10. `GerarResumo.ts`
11. `IncluirCategoria.ts`

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
- [usecases.md](usecases.md) — contratos dos 11 use cases
- [testing.md](testing.md) — Jest domain/application
- [examples.md](examples.md) — esqueletos
