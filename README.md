# TODO LIST — Tarefas acadêmicas (V1)

Aplicativo **Expo 57** (React Native + **Web**) com **Clean Architecture**, **MVVM** e persistência em **localStorage**.

## Funcionalidades V1

- Tarefas: criar, concluir, arquivar, restaurar, alterar prazo, excluir
- Abas: Home, Resumo, Arquivadas
- Categorias (até 12) via menu ☰
- Testes Jest (domínio e casos de uso)

## Como rodar

```bash
npm install
npm run web
```

## Testes

```bash
npm test
```

## Estrutura

- `src/domain` — entidades e regras
- `src/application/usecases` — casos de uso
- `src/data` — localStorage
- `src/presentation` — views, view models e componentes
- `src/app` — rotas (Expo Router)
