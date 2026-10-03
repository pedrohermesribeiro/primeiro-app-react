# Linguagem ubíqua — TODO LIST V1

## Categoria

Seed inicial em `CATEGORIAS_PADRAO` (6): Estudos, Trabalho, Pessoal, Compras, Saúde, Outros.

V1 permite **incluir** novas categorias até `MAX_CATEGORIAS` (12) via `IncluirCategoria`. Regras: `podeIncluirCategoria`, `validarNomeCategoria` (máx. **40** caracteres, sem controle), `criarCategoriaId` (`domain/entities/Categoria.ts`). Sem editar/excluir categoria na UI V1.

Validação de texto compartilhada: `domain/validacao/textoEntrada.ts` (`normalizarTextoEntrada`). Tarefa: `validarTituloTarefa`, `validarCategoriaId`, `validarPrazoOpcional`.

## Tarefa

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | sim |
| `titulo` | string | sim (máx. **60**; sem caracteres de controle) |
| `categoriaId` | string | sim |
| `status` | `StatusTarefa` | sim |
| `prazo` | string ISO `YYYY-MM-DD` | não (opcional; data real; `validarPrazoIso`) |

### StatusTarefa (ciclo de vida V1)

```ts
type StatusTarefa = 'pendente' | 'concluida' | 'arquivada';
```

Transições:

- Criar → `pendente`
- Concluir → `pendente` → `concluida`
- Arquivar → `pendente` ou `concluida` → `arquivada`
- Restaurar → `arquivada` → `pendente` (prazo pode ser ajustado no fluxo)
- Alterar prazo → tarefas **ativas**; `prazo` ISO ou removido (Home: fluxo **Editar**)
- Editar → tarefas **ativas**; título, categoria e prazo (`podeEditarTarefa`, `EditarTarefa`)
- Excluir → remove registro (`pendente`, `concluida` ou `arquivada`; na UI, confirmar antes)

Regras puras: `podeArquivar`, `podeConcluir`, `podeRestaurar`, `podeAlterarPrazo`, `podeExcluir`, `aplicarPrazoEntrada` em `Tarefa.ts`.

## Resumo

`ResumoTarefas`: totais ativas/arquivadas, contagem por status e por `categoriaId` (ativas). Ver `GerarResumo` e `calcularResumoTarefas`.

## Fora do V1

`em_andamento`, `atrasada`, `statusEfetivo`, Disciplina, tipos acadêmicos.
