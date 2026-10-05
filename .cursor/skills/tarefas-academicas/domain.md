# Linguagem ubíqua — TODO LIST V1

## Categoria

Seed inicial em `CATEGORIAS_PADRAO` (6): Estudos, Trabalho, Pessoal, Compras, Saúde, Outros.

V1 permite **incluir** novas categorias até `MAX_CATEGORIAS` (12) via `IncluirCategoria` e **excluir** via `ExcluirCategoria` enquanto `podeExcluirCategoria` (mínimo `MIN_CATEGORIAS` = **4**). Regras: `validarNomeCategoria` (máx. **40** caracteres, sem controle), `criarCategoriaId`, `CATEGORIA_REALOCACAO_PADRAO` (`outros`) para tarefas ao excluir (`domain/entities/Categoria.ts`). Sem renomear categoria na UI V1.

Validação de texto compartilhada: `domain/validacao/textoEntrada.ts` (`normalizarTextoEntrada`). Tarefa: `validarTituloTarefa`, `validarCategoriaId`, `validarPrazoOpcional`, `validarPrioridade`.

## Tarefa

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | sim |
| `titulo` | string | sim (máx. **60**; sem caracteres de controle) |
| `categoriaId` | string | sim |
| `status` | `StatusTarefa` | sim |
| `prioridade` | `PrioridadeTarefa` (`baixa` \| `media` \| `alta`) | sim (padrão `baixa` na criação e em JSON legado) |
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
- Editar → tarefas **ativas**; título, categoria, prioridade e prazo (`podeEditarTarefa`, `EditarTarefa`)
- Excluir → remove registro (`pendente`, `concluida` ou `arquivada`; na UI, confirmar antes)

Regras puras: `podeArquivar`, `podeConcluir`, `podeRestaurar`, `podeAlterarPrazo`, `podeExcluir`, `aplicarPrazoEntrada` em `Tarefa.ts`.

## Resumo

`ResumoTarefas`: totais ativas/arquivadas, contagem por status, por `categoriaId` e por `prioridade` (ativas). Ver `GerarResumo` e `calcularResumoTarefas`.

## Filtros (Home)

`FiltrosTarefa` (`domain/entities/FiltrosTarefa.ts`): prioridades (vazio = todas), statuses (padrão ativas), prazos (`atrasadas` | `hoje` | `esta_semana` | `este_mes`; vazio = ignora data). `isTarefaAtrasada`: pendente com prazo ISO anterior ao dia de referência. Helpers: `filtrosPadrao`, `filtrosIguais`, `filtrosDiferentesDoPadrao`. Persistência aplicada: `gta:filtros`. UI: `FiltrosAtivosBar` na Home quando filtros ≠ padrão.

## Tema (aparência)

`PreferenciaTema` (`domain/theme/PreferenciaTema.ts`): `system` | `light` | `dark` | `grafiteClaro` | `grafiteEscuro`. `resolverPaleta` + tokens extras em `constants/theme.ts` (`Colors.grafiteClaro`, `Colors.grafiteEscuro`). Persistência: `gta:tema`. Hook: `useAppColorScheme` → `useTheme`.

## Exportação

`domain/exportacao/DadosExportacao.ts`: pacote V1 com tarefas **ativas** (`pendente` + `concluida`), categorias; saídas `gerarTextoAmigavelExportacao` (WhatsApp) e `gerarHtmlExportacao` (e-mail via arquivo HTML compartilhado).

## Fora do V1

`em_andamento`, `statusEfetivo`, Disciplina, tipos acadêmicos.
