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
| `prazo` | string `YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm` (local) | não (opcional; `domain/prazo/PrazoTarefa.ts`) |
| `lembretes` | `TipoLembretePrazo[]` (`no_horario` \| `1h_antes` \| `1_dia_antes`) | não (padrão `[]` = Não; `domain/lembrete/LembretesTarefa.ts`) |

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

## Prazo (data + hora)

- Ao escolher **data**, hora padrão: **hoje** → agora + 1 h; **amanhã** → `08:00`; outros dias → `08:00` (ajustável).
- Legado `YYYY-MM-DD` ganha hora pelas mesmas regras na exibição/atraso/salvamento.
- Atraso: compara **instante** (`isTarefaAtrasada` + `PrazoTarefa.ts`).
- Filtros **Hoje / semana / mês** usam só a **data** do prazo.
- UI: `CampoPrazo` — data \| hora \| **sininho** (`SeletorLembretes` → `ModalLembretesPrazo`: Não / No horário / 1h antes / 1 dia antes, multi-select exceto Não); habilitado só com prazo **`T` explícito** no valor do form.
- Toggle: **Não** limpa; demais opções acumulam; limpar prazo zera lembretes.

## Filtros (Home)

`FiltrosTarefa` (`domain/entities/FiltrosTarefa.ts`): prioridades (vazio = todas), statuses (padrão ativas), prazos (`atrasadas` | `hoje` | `esta_semana` | `este_mes`; vazio = ignora data). `isTarefaAtrasada`: pendente com prazo ISO anterior ao dia de referência. Helpers: `filtrosPadrao`, `filtrosIguais`, `filtrosDiferentesDoPadrao`. Persistência aplicada: `gta:filtros`. UI: `FiltrosAtivosBar` na Home quando filtros ≠ padrão.

## Tema (aparência)

`PreferenciaTema` (`domain/theme/PreferenciaTema.ts`): `system` | `light` | `dark` | `grafiteClaro` | `grafiteEscuro`. **Padrão:** `grafiteEscuro` (storage vazio ou inválido); leitura migra `system` salvo legado → `grafiteEscuro`. `resolverPaleta` + tokens em `constants/theme.ts`. Persistência: `gta:tema`. Hook: `useAppColorScheme` → `useTheme`.

## Exportação

`domain/exportacao/DadosExportacao.ts`: pacote V1 com tarefas **ativas** (`pendente` + `concluida`), categorias; saídas `gerarTextoAmigavelExportacao` (WhatsApp) e `gerarHtmlExportacao` (e-mail via arquivo HTML compartilhado).

## Notificações de prazo (native)

`domain/notificacao/NotificacaoTarefa.ts` + `lembretes` na tarefa:

- **Elegível:** `pendente`, prazo com **`T` explícito**, `lembretes.length > 0`, cada instante (prazo, −1 h, −24 h) **> agora**.
- **Id OS:** `gta-tarefa-{tarefaId}-{tipo}` (vários por tarefa).
- **Conteúdo:** título da tarefa; corpo com rótulo do lembrete + prioridade/status/prazo.

Porta: `NotificacaoTarefaPort`. Reconcile: `SincronizarNotificacoesTarefas` após mutações (`TarefaRefreshContext`).

## Fora do V1

`em_andamento`, `statusEfetivo`, Disciplina, tipos acadêmicos.
