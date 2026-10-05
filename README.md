# TODO LIST — Tarefas acadêmicas (V1)

Aplicativo **Expo 57** (React Native + **Web**) com **Clean Architecture**, **MVVM** e persistência local (`localStorage` / AsyncStorage).

## Funcionalidades V1

- **Tarefas:** criar, editar, concluir, arquivar, restaurar, excluir; **prioridade** (baixa / média / alta)
- **Abas:** Home (lista filtrada), Resumo, Arquivadas
- **Menu ☰:** Filtros (prioridade, status, prazo), gerenciar categorias (4–12), tema (automático, claro, escuro, grafite claro/escuro), exportar dados (WhatsApp em texto / e-mail em HTML), Sobre (futuro)
- **Home:** barra *Filtros ativos* + limpar filtros quando aplicável
- **Categorias:** grade 4 colunas no seletor; exclusão com realocação para `outros`
- **Testes Jest** (domínio e casos de uso)

Documentação detalhada: [.cursor/skills/tarefas-academicas/](.cursor/skills/tarefas-academicas/) (`architecture.md`, `domain.md`, `usecases.md`).

## Como rodar

```bash
npm install
npm run web          # navegador
npx expo start       # dev server (LAN / emulador)
```

## Testes e tipos

```bash
npm test
npx tsc --noEmit
```

## Estrutura

- `src/domain` — entidades, filtros, tema, exportação
- `src/application/usecases` — casos de uso
- `src/data` — storage (`gta:tarefas`, `gta:categorias`, `gta:filtros`, `gta:tema`)
- `src/presentation` — views, view models, contextos (filtros, tema, refresh)
- `src/app` — rotas Expo Router (`(tabs)`, `categorias`, `filtros`, `tema`)
