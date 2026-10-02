# Testes V1

Comando: `npm test` (Jest + `jest-expo`).

## Onde

| Alvo | Padrão de arquivo |
|------|-------------------|
| Domain | `src/domain/**/*.test.ts` |
| Use cases | `src/application/usecases/**/*.test.ts` |

## Domain

- `podeArquivar`, `podeConcluir`, `podeExcluirDefinitivamente`
- `calcularResumoTarefas` (totais e por categoria/status)

## Application

- Mock de `TarefaRepository` (objeto com jest.fn)
- Ex.: `ConcluirTarefa` só aceita `pendente`; `ExcluirDefinitivamente` só `arquivada`

## Fora do V1

Testes de View, ViewModel, E2E, DataSource com localStorage real.
