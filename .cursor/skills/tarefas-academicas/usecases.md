# Casos de uso V1

Todos em `src/application/usecases/`, classe com `constructor(repository)` e `executar(...)`.

## CriarTarefa

- **Entrada:** `{ titulo, categoriaId, prazo?, prioridade? }` (`prioridade` omitida → `baixa`)
- **Saída:** `Tarefa` com `status: 'pendente'`
- **Erros:** título vazio, categoriaId vazio

## ListarTarefas

- **Entrada:** —
- **Saída:** `Tarefa[]` com `status !== 'arquivada'`

## ListarTarefasFiltradas

- **Entrada:** `FiltrosTarefa`
- **Saída:** `Tarefa[]` após `aplicarFiltrosTarefas` sobre `repository.listar()`
- **Nota:** usado na **Home** via `FiltrosTarefasContext`; padrão = ativas (pendente + concluída)

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
- **Nota:** use case mantido; na **Home** o prazo é editado via `EditarTarefa` (modal)

## EditarTarefa

- **Entrada:** `{ id, titulo, categoriaId, prazo, prioridade }` (`prazo` vazio remove)
- **Saída:** `Tarefa` atualizada (status inalterado)
- **Erros:** não encontrada; `podeEditarTarefa` falso; validações de título, categoria, prioridade e prazo

## GerarResumo

- **Entrada:** —
- **Saída:** `ResumoTarefas` (via `listar` completo no repo + `calcularResumoTarefas`)

## IncluirCategoria

- **Entrada:** `{ nome }`
- **Saída:** `Categoria` criada
- **Erros:** nome vazio ou > 40 chars; limite **12** categorias; nome duplicado (case-insensitive)
- **Nota:** persiste lista completa via `CategoriaRepository.substituirTodas`; após incluir, `notifyTarefasChanged()`

## ExcluirCategoria

- **Entrada:** `categoriaId`
- **Saída:** `void`
- **Erros:** categoria não encontrada; menos de 5 categorias (mínimo **4**); falha de realocação
- **Nota:** tarefas com o id excluído passam para `outros`; se excluir `outros`, realoca para a primeira categoria restante; `TarefaRepository.substituirTodas` + `notifyTarefasChanged()`

## ExportarDados

- **Entrada:** —
- **Saída:** `{ textoWhatsApp: string; htmlEmail: string }` (tarefas ativas + categorias)
- **Nota:** orquestra repositórios; formatação em `domain/exportacao/`; UI dispara WhatsApp (`Linking`) ou share de `.html` (`expo-file-system` + `expo-sharing`)

## ViewModels

| ViewModel | Use cases |
|-----------|-----------|
| `TarefaViewModel` | criar, listarFiltradas, concluir, arquivar, excluir, editar + categorias |
| `ResumoViewModel` | gerarResumo + categorias (nomes no card) |
| `ArquivadasViewModel` | listarArquivadas, excluirDefinitivamente, restaurar |
| `CategoriasViewModel` | incluirCategoria, excluirCategoria + listar categorias |
