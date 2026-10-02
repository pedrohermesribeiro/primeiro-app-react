# Esqueletos V1

## Domain

`Tarefa.ts` — status `pendente | concluida | arquivada`, helpers `podeArquivar`, etc.

`ResumoTarefas.ts` — tipo + `calcularResumoTarefas(tarefas: Tarefa[])`.

## Use case

```ts
export class ArquivarTarefa {
  constructor(private readonly repository: TarefaRepository) {}
  async executar(id: string): Promise<Tarefa> {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa || !podeArquivar(tarefa)) throw new Error('...');
    const atualizada = { ...tarefa, status: 'arquivada' as const };
    await this.repository.salvar(atualizada);
    return atualizada;
  }
}
```

## ViewModel

`useMemo` → `TarefaRepositoryImpl` + instâncias dos use cases.

## Rota

```tsx
// src/app/arquivadas.tsx
import { ArquivadasView } from '@/presentation/views/ArquivadasView';
export default function ArquivadasScreen() {
  return <ArquivadasView />;
}
```
