# TODO LIST — Tarefas acadêmicas (V1)

Aplicativo **Expo 57** (React Native + **Web**) com **Clean Architecture**, **MVVM** e persistência local (`localStorage` / AsyncStorage).

## Funcionalidades V1

- **Tarefas:** criar, editar, concluir, arquivar, restaurar, excluir; **prioridade** (baixa / média / alta)
- **Abas:** Home (lista filtrada), Resumo, Arquivadas
- **Menu ☰:** Filtros (prioridade, status, prazo), gerenciar categorias (4–12), tema (padrão **grafite escuro**; também automático, claro, escuro, grafite claro), exportar dados (WhatsApp em texto / e-mail em HTML), **Sobre** (`/sobre`)
- **Home:** barra *Filtros ativos* + limpar filtros quando aplicável
- **Categorias:** seletor 4 colunas (layout acessível com fonte grande no Android); exclusão com realocação para `outros`
- **Lembretes de prazo** (opcional): Não (padrão), No horário, 1h antes, 1 dia antes — multi-seleção; notificações locais no dev build
- **Testes Jest** (domínio e casos de uso)

Documentação detalhada: [.cursor/skills/tarefas-academicas/](.cursor/skills/tarefas-academicas/) (`architecture.md`, `domain.md`, `usecases.md`).

## Como rodar

```bash
npm install
npm run web          # navegador (notificações de prazo desligadas na web)
npx expo start       # dev server (LAN / emulador)
```

**Notificações no dispositivo:** no **Expo Go** o app abre normalmente, mas notificações ficam desligadas; para alarmes de prazo use **development build**. Exemplos:

```bash
npx expo run:android
npx expo run:ios
```

Conceda permissão de notificação quando o app pedir; tarefas só-data legadas não disparam alarme até terem hora salva.

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
