# Casos de uso V1

Todos em `src/application/usecases/`, classe com `constructor(repository)` e `executar(...)`.

## CriarTarefa

- **Entrada:** `{ titulo, categoriaId, prazo? }`
- **Saída:** `Tarefa` com `status: 'pendente'`
- **Erros:** título vazio, categoriaId vazio

## ListarTarefas

- **Entrada:** —
- **Saída:** `Tarefa[]` com `status !== 'arquivada'`

## ConcluirTarefa

- **Entrada:** `id`
- **Saída:** `Tarefa` atualizada
- **Erros:** não encontrada; status não é `pendente`

## ArquivarTarefa

- **Entrada:** `id`
- **Saída:** `Tarefa` com `status: 'arquivada'`
- **Erros:** não encontrada; `podeArquivar` falso

## ExcluirDefinitivamente

- **Entrada:** `id`
- **Saída:** `void`
- **Erros:** não encontrada; `podeExcluir` falso
- **Nota:** remove do repositório em qualquer status V1; UI confirma com `Alert` (Home e Arquivadas)

## ListarTarefasArquivadas

- **Entrada:** —
- **Saída:** `Tarefa[]` com `status === 'arquivada'`

## RestaurarTarefa

- **Entrada:** `{ id, prazo }` (`prazo` string; vazio remove)
- **Saída:** `Tarefa` com `status: 'pendente'` e prazo aplicado
- **Erros:** não encontrada; `podeRestaurar` falso; prazo inválido

## AlterarPrazoTarefa

- **Entrada:** `{ id, prazo }`
- **Saída:** `Tarefa` (mesmo status)
- **Erros:** não encontrada; `podeAlterarPrazo` falso; prazo inválido

## GerarResumo

- **Entrada:** —
- **Saída:** `ResumoTarefas` (via `listar` completo no repo + `calcularResumoTarefas`)

## IncluirCategoria

- **Entrada:** `{ nome }`
- **Saída:** `Categoria` criada
- **Erros:** nome vazio ou > 40 chars; limite **12** categorias; nome duplicado (case-insensitive)
- **Nota:** persiste lista completa via `CategoriaRepository.substituirTodas`; após incluir, `notifyTarefasChanged()`

## ViewModels

| ViewModel | Use cases |
|-----------|-----------|
| `TarefaViewModel` | criar, listar, concluir, arquivar, excluir, alterarPrazo + categorias |
| `ResumoViewModel` | gerarResumo + categorias (nomes no card) |
| `ArquivadasViewModel` | listarArquivadas, excluirDefinitivamente, restaurar |
| `CategoriasViewModel` | incluirCategoria + listar categorias |
