# Diário do projeto — SeteVidas

> Este arquivo é o "resumo de continuidade" do projeto.
> Se o trabalho parar e voltar em outra conversa (ou com outra IA), leia este
> arquivo primeiro: ele conta o que já foi feito, o que foi decidido e qual é o
> próximo passo. Atualize a data no topo sempre que mexer nele.

**Última atualização:** 05/11/2026
**Versão da interface:** v1.1.1
**Etapa atual:** 3 — galeria com mídias reais (concluída)

---

## 0. Histórico rápido

| Data | Mudança |
| --- | --- |
| 29/10/2026 | Primeira versão da interface (contador, grid, menu Baixar, PWA claro) |
| 29/10/2026 | Tema escuro, milissegundos no contador e novo ícone (gato de cauda curvada) |
| 29/10/2026 | Milissegundos passaram a contar de verdade (atualização por quadro) |
| 01/11/2026 | **Tela de senha removida** (`LockScreen` apagado; o app abre direto na galeria) |
| 01/11/2026 | **Carta responsiva no PC**: ganha largura total e fonte maior só quando o container passa de 700px (mesmo gatilho do grid); no celular nada muda |
| 02/11/2026 | **Merge com o GitHub**: repositório remoto e local reconciliados em `f1f2b7d`, mantendo a versão responsiva da carta |
| 02/11/2026 | **Revisão do README**: corrigidos o gatilho de PC (janela 900px × container 700px), a árvore de pastas e a frequência de atualização do contador |
| 02/11/2026 | **Data inicial corrigida**: era 25/06/2026, na verdade é **25/05/2026 20:23** (o mês 5 = junho, mas o correto é maio = 4) em `src/config/startDate.ts`, README e diário |
| 02/11/2026 | **Tela de início + senha**: gato preto (PNG transparente) em fundo branco na abertura, seguido da tela de senha numérica `777`; fluxo `start → lock → home` em `src/App.tsx` |
| 02/11/2026 | **Galeria preenchida**: 50 mídias reais em `public/midias/` (48 fotos + 2 vídeos) declaradas em `src/data/media.ts`; cache do service worker atualizado para `setevidas-v4` |
| 02/11/2026 | **Versão 1.1.0**: rodapé, `package.json`, README e diário atualizados; cache do service worker para `setevidas-v5` |
| 04/11/2026 | **Fotos sem recorte**: cada card passou a usar a proporção natural da mídia (lida no carregamento) e a galeria virou colunas; o padrão bento ficou só no estado vazio |
| 04/11/2026 | **Tela cheia**: tocar na mídia abre um visualizador na proporção original, com fundo transparente e embaçado (`MediaViewer`); fecha ao tocar fora, no X ou com Esc |
| 04/11/2026 | **Música de fundo**: `public/audio/musica.m4a` toca uma vez ao desbloquear (volume 0.03); ao abrir um vídeo o volume cai para 0.01 e volta ao fechar (`src/lib/backgroundMusic.ts`) |
| 04/11/2026 | **Sons leves**: toque no gato e nas teclas da senha, e dois tons discretos na senha errada, gerados via Web Audio (`src/lib/soundEffects.ts`) |
| 04/11/2026 | **Galeria ampliada**: 69 mídias reais (57 fotos + 12 vídeos), com duração dos vídeos extraída do próprio MP4; corrigido o item 46, que apontava para `46.jfif` (arquivo inexistente) e agora usa `46.jpg` |
| 04/11/2026 | **Cache do service worker** para `setevidas-v6`, para que as mídias novas não fiquem presas no cache antigo |
| 05/11/2026 | **Capas dos vídeos no iPhone**: o Safari iOS não desenha o primeiro quadro de um `<video>` só com `preload="metadata"`, então os cards de vídeo ficavam pretos. Foram gerados posters (primeiro quadro) em `public/midias/posters/`, o tipo `MediaItem` ganhou `poster?`, e `MediaCard`/`MediaViewer` passaram a usar `poster`. Cache do service worker para `setevidas-v7` |

---

## 1. O que é o app

SeteVidas é um app privado para duas pessoas, instalado na tela inicial do
celular (PWA). Ao abrir, o app mostra:

1. uma **tela de início** branca com apenas o gato preto centralizado;
2. ao tocar no gato, a **tela de senha** numérica (senha única `777`);
3. depois do desbloqueio, a tela principal.

A tela principal tem:

1. um contador de tempo desde a data de início (anos, meses, semanas, dias /
   horas, minutos, segundos), atualizado a cada segundo;
2. um grid de fotos e vídeos (estilo bento/Pinterest) com **69 mídias reais**
   (57 fotos e 12 vídeos);
3. o menu de três pontinhos em cada mídia, com a opção **Baixar**;
4. a versão (`v1.1.1`) no rodapé.

Sem busca, sem abas, sem menu inferior, sem botão de adicionar mídia.

---

## 2. Decisões tomadas (e por quê)

| Assunto | Decisão |
| --- | --- |
| Tecnologia | React + TypeScript + Vite, empacotado como PWA (a especificação pedia isso; o PDF de referência citava React Native) |
| Data inicial | Fica em **um único arquivo** (`src/config/startDate.ts`); o valor atual é o definido pelo proprietário (25/05/2026 20:23) |
| Grid | 3 colunas com padrão de alturas que se repete sem deixar buracos (`src/components/BentoGrid`) |
| Mídias | Lista manual em `src/data/media.ts`; o administrador edita o arquivo. Nenhum upload na interface |
| Menu da mídia | Somente "Baixar" + "Cancelar" (não existe excluir nesta versão) |
| Ícone | Gerado a partir de `assets/icon-source.png` (gato de cauda curvada) em 192, 512, maskable e apple-touch |
| Tema | Escuro fixo: fundo `#0b0b0d`, cards `#17171a`, texto `#f4f4f5` |
| Milissegundos | Contam de verdade (0–999). A tela é atualizada a cada quadro (`requestAnimationFrame`), que o navegador pausa sozinho em segundo plano |
| Botão flutuante do gato | **Não implementado**: a especificação proíbe botão de adicionar nesta etapa. O ícone foi usado como ícone do app e o motivo "download" virou a ação Baixar |
| Fonte | Fonte do sistema (Inter/SF Pro quando existirem), sem baixar fontes da internet |
| Tela de início | Fundo branco liso + gato preto com PNG transparente (`src/assets/cat-splash.png`); largura `min(34vw, 150px)`; sem texto nem botões visíveis |
| Senha | Única e local (`PASSCODE = '777'` em `src/config/app.ts`); sem usuário, cadastro ou backend; três círculos, teclado numérico e apagar |
| Animação | Só o fade-in do gato e a leve redução ao tocar; nenhuma animação extra no fluxo |
| Dependências | Só React, React DOM, Vite, TypeScript e o plugin do React — nada além disso |

---

## 3. O que já funciona

- [x] Contador em duas linhas, atualizando a cada segundo
- [x] Milissegundos contando de verdade (0–999), sem tremida no layout
- [x] Tema escuro em toda a interface (contador, grid, menu, rodapé, barra do sistema)
- [x] Ícones do app a partir da nova arte do gato
- [x] Tela de início branca com o gato centralizado (fade-in + redução ao tocar)
- [x] Tela de senha numérica com três círculos, teclado e botão de apagar
- [x] Senha `777` é a única válida; desbloqueia automaticamente
- [x] Senha errada mostra "Senha incorreta" e limpa os dígitos
- [x] Fluxo completo start → lock → home, sem login/usuário/backend
- [x] Vídeo de demonstração em `demo-tela-inicio.mp4`
- [x] Cálculo em calendário (anos/meses) e semanas a partir dos dias restantes
- [x] Recalcula ao voltar do segundo plano (visibilidade da aba)
- [x] Grid responsivo de 3 colunas com cards 1x1, 1x2 e 2x1
- [x] Galeria preenchida com 69 mídias reais (57 fotos + 12 vídeos)
- [x] Selos de duração dos vídeos conferidos no MP4 (`mvhd`)
- [x] Estado vazio com cards cinza-claro
- [x] Card de vídeo com selo de duração (mm:ss)
- [x] Mídia em tela cheia na proporção original (`MediaViewer`), com vídeo tocando
- [x] Música de fundo abaixando enquanto um vídeo está aberto
- [x] Menu de três pontinhos em bottom sheet com "Baixar"
- [x] Rodapé com versão
- [x] Manifest, ícones e service worker (cache do esqueleto do app)
- [x] Layout full-screen com `safe-area` (notch/barra de gestos)
- [x] `npm run build` sem erros de TypeScript
- [x] Fluxo de abertura conferido: gato → senha → desbloqueio com `777`
- [x] Senha errada conferida (aviso + limpeza dos dígitos)
- [x] No PC o grid ganha colunas e a carta preenche a tela (container ≥ 700px)

---

## 4. Como foi conferido

- Build de produção gerado em `dist/`
- Testado em viewport de celular (390 x 844) e desktop (1280 x 800)
- Grid conferido com as 69 mídias reais em viewport de celular (390 x 844) e
  desktop (1280 x 800): todos os caminhos do `media.ts` conferidos contra a
  pasta `public/midias/` (0 referências quebradas) e `tsc --noEmit` sem erros
- Fluxo gato → senha `777` → galeria percorrido no Chrome, sem erros no console
- Menu "Baixar" aberto e conferido (foco de teclado e fechamento por Esc/clique
  fora)
- `npm run build` sem erros de TypeScript; `dist/midias/` com os 69 arquivos

---

## 5. Pendências conhecidas

1. **Data real do início** — já ajustada pelo proprietário
   (25/05/2026 20:23, em `src/config/startDate.ts`). Conferir se é exatamente
   essa a data/hora oficial.
2. **Fuso horário** — a data é lida no fuso do aparelho. Se os dois celulares
   estiverem em fusos diferentes, a contagem pode variar em horas.
3. **Publicação** — ✅ resolvido em 04/11/2026: app no ar em
   https://diegoafmotta2006.github.io/SeteVidas/ (GitHub Pages, deploy
   automático por GitHub Actions a cada push na `main`).
4. **Privacidade** — o repositório é público, então as mídias podem ser
   abertas por link direto. A senha `777` não protege os arquivos. Se isso
   virar problema, migrar para hospedagem privada ou tornar o repo privado.
4. **Aparência final** — cores, tipografia e espaçamentos serão ajustados com
   as referências visuais definitivas do proprietário.
5. **Vídeos** — o card mostra o primeiro quadro com selo de duração; tocar
   abre o `MediaViewer`, onde o vídeo toca com controles e a música de fundo
   abaixa. Não há pré-carregamento do vídeo completo no grid (só metadados).
6. **Consumo** — o contador redesenha junto com a tela (~60x por segundo)
   enquanto o app está aberto para os milissegundos andarem. Em celular antigo,
   se o consumo incomodar, dá para trocar por uma atualização a cada 50 ms
   (`setInterval`) e os milissegundos continuam contando, só que em passos.
7. **Descrições das mídias** — os `alt` ainda são genéricos ("Foto 1",
   "Vídeo 36"); personalizar em `src/data/media.ts` se quiser descrições reais
   para leitores de tela.

---

## 6. Próximo passo sugerido

1. Confirmar a data/hora real e trocar em `src/config/startDate.ts`.
2. Receber as referências visuais finais e ajustar cores/tipografia.
3. Decidir a hospedagem (ex.: Netlify, Vercel ou GitHub Pages) para o app
   poder ser instalado nos dois celulares.
4. Só depois pensar em sincronização e administração de mídias
   (etapas futuras, fora do escopo da v1.1.0).

---

## 7. Mapa rápido dos arquivos

```
src/config/startDate.ts   → data inicial (único lugar)
src/config/app.ts         → nome, versão e senha (PASSCODE)
src/assets/cat-splash.png → gato preto com fundo transparente (abertura)
src/data/media.ts         → lista de mídias (administrador)
src/components/StartScreen/    → tela branca com o gato
src/components/PasscodeScreen/ → tela de senha numérica
src/components/...        → demais partes visuais da tela
src/lib/...               → cálculos, formatação e download
public/                   → manifest, service worker e ícones
demo-tela-inicio.mp4      → vídeo com o fluxo completo
```
| 04/11/2026 | **Publicado**: site no ar no GitHub Pages (`diegoafmotta2006.github.io/SeteVidas`) via GitHub Actions; histórico do Git reescrito para remover as versões antigas das mídias |
