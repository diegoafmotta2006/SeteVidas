# SeteVidas - Interface principal v1.1.1

**App no ar:** https://diegoafmotta2006.github.io/SeteVidas/

Publicado automaticamente pelo GitHub Pages a cada `push` na branch `main`
(workflow em `.github/workflows/deploy.yml`). Por ser HTTPS, o app pode ser
instalado na tela inicial do celular.

> ⚠️ **Privacidade:** o repositório é público e as mídias ficam acessíveis por
> link direto (`.../midias/1.jpg`). A senha `777` protege apenas a interface,
> não os arquivos. Não divulgue o endereço do site nem do repositório.

PWA privado (React + TypeScript + Vite) com:

- **tela de início** branca, com apenas o gato preto centralizado;
- **tela de senha numérica** no estilo do desbloqueio do iPhone (senha única: `777`);
- contador de tempo ao vivo no topo (anos, meses, semanas, dias / horas, minutos, segundos e milissegundos);
- galeria em colunas (3 no celular, mais no PC) em que cada card mantém a proporção natural da foto ou do vídeo — sem recorte;
- música de fundo (`public/audio/musica.m4a`) toca uma única vez ao desbloquear, em volume baixo; ao abrir um vídeo o volume é reduzido;
- sons leves gerados no navegador: toque no gato, teclas da senha e aviso de senha incorreta;
- toque na mídia abre em tela cheia na proporção original, sobre fundo transparente e embaçado;
- menu de três pontinhos em cada mídia, com a opção **Baixar** (não existe excluir);
- carta de amor no final da galeria (texto em `src/data/letter.ts`);
- rodapé com a versão (`v1.1.1`);
- tema escuro fixo;
- estrutura de PWA: manifest, ícones e service worker.

**Fluxo de abertura:** tela branca com o gato → tocar no gato → tela de senha
→ digitar `777` → tela principal. A senha é local e única: não existe usuário,
cadastro nem backend.

> **Etapa 1:** somente a estrutura e a interface inicial. Ainda não há banco de dados,
> contas de usuário, sincronização, upload de mídia nem publicação.

---

## 1. Como rodar no computador

Pré-requisito: **Node.js** instalado (versão 20 ou mais nova).
Para conferir, abra o Prompt de Comando e digite `node --version`.

Dentro da pasta do projeto (`SeteVidas`):

```bash
npm install     # baixa as bibliotecas (só na primeira vez)
npm run dev     # abre o app em modo desenvolvimento
```

O terminal vai mostrar um endereço parecido com `http://localhost:5173`.
Abra esse endereço no navegador.

Para ver como o app fica em um celular, abra as ferramentas do desenvolvedor
(`F12`) e ative o **modo dispositivo** (ícone de celular).

### Ver a versão de produção (com PWA ativo)

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve a pasta dist/ localmente
```

O service worker só é registrado nesse modo (em `npm run dev` ele fica desligado
de propósito, para não guardar versões antigas durante o desenvolvimento).

### Testar no celular (Android/iPhone) na mesma rede Wi-Fi

```bash
npm run dev
```

O terminal mostra também um endereço `Network: http://192.168.x.x:5173`.
Digite esse endereço no navegador do celular. Como o servidor de desenvolvimento
aceita conexões da rede, **qualquer alteração feita no computador aparece no
celular na hora**, sem recarregar (basta manter a aba aberta).

Para **instalar** o app de fato (ícone na tela inicial), o PWA precisa estar em
`https` ou em `localhost`; isso será resolvido na etapa de publicação/hospedagem.

---

## 2. Comportamento no PC e no celular

O app é pensado para o celular, mas se ajusta sozinho quando a tela é larga.
O gatilho é o **container de 700px**: o `container-type: inline-size` fica em
`src/App.css` (`.app__content`) e as consultas `@container (min-width: 700px)`
ficam em `src/components/BentoGrid/BentoGrid.css` e
`src/components/LoveLetter/LoveLetter.css` — assim o que vale é a largura
realmente disponível para o conteúdo, não a da janela.

| | Celular | PC |
| --- | --- | --- |
| Largura da tela | coluna centralizada de até 560px (`max-width` em `src/App.css`) | ocupa a tela inteira (gatilho: janela ≥ 900px, `@media` em `src/App.css`) |
| Galeria de fotos | 3 colunas; card com a proporção natural da mídia | ganha colunas sozinho (`column-width`, container ≥ 700px) |
| Carta | coluna de leitura de 620px, fonte 15px | preenche a tela, fonte 17px (container ≥ 700px) |
| Contador e rodapé | iguais | iguais |

No celular **nada muda**: os estilos de grid e carta do PC só existem dentro
do bloco `@container (min-width: 700px)`; a largura total da tela é a única
exceção e vem de um `@media` de janela (900px).

---

## 3. Estrutura de pastas

```
SeteVidas/
├─ index.html                  Página única: título, ícones, manifest, viewport
├─ package.json                Scripts (dev/build/preview) e dependências
├─ tsconfig.json               Regras do TypeScript
├─ vite.config.ts              Configuração do Vite (base "./", porta 5173)
├─ assets/
│  └─ icon-source.png          Arte original do ícone (gato)
├─ public/                     Arquivos copiados "como estão" para o build
│  ├─ manifest.webmanifest     Nome, cores, ícones e modo do PWA
│  ├─ sw.js                    Service worker (cache offline)
│  └─ icons/                   Ícones gerados a partir do gato com a seta
├─ src/
│  ├─ main.tsx                 Ponto de entrada: monta o React e registra o SW
│  ├─ App.tsx                  Junta contador + grid + carta + rodapé
│  ├─ App.css                  Layout geral + container de consulta (PC)
│  ├─ index.css                Reset, cores e fontes (variáveis globais)
│  ├─ config/
│  │  ├─ startDate.ts          ⚠️ ÚNICO lugar com a data/hora inicial
│  │  └─ app.ts                Nome do app e versão do rodapé
│  ├─ components/
│  │  ├─ StartScreen/          Tela branca com o gato (abertura do app)
│  │  ├─ PasscodeScreen/       Tela de senha numérica (777)
│  │  ├─ TimeCounter/          Contador (2 linhas, atualiza a cada quadro)
│  │  ├─ BentoGrid/            Grade responsiva + desenho dos cards
│  │  ├─ MediaCard/            Um card (imagem, vídeo com duração, ou vazio)
│  │  ├─ MediaViewer/          Mídia em tela cheia (proporção original)
│  │  ├─ MediaMenu/            Bottom sheet com a opção "Baixar"
│  │  ├─ LoveLetter/           Carta exibida no final da galeria
│  │  └─ VersionFooter/        "v1.1.1" no canto inferior esquerdo
│  ├─ data/
│  │  ├─ media.ts              Lista de mídias (adicionada pelo administrador)
│  │  └─ letter.ts             Texto da carta, um parágrafo por item
│  ├─ assets/
│  │  └─ cat-splash.png        Gato preto com fundo transparente (tela inicial)
│  ├─ hooks/
│  │  ├─ useElapsedTime.ts     Relógio por requestAnimationFrame
│  │  └─ useGridMetrics.ts     Mede colunas/linhas (estado vazio no PC)
│  ├─ lib/
│  │  ├─ elapsedTime.ts        Conta anos/meses/semanas/dias/horas/min/seg
│  │  ├─ formatElapsed.ts      Escreve o texto em português
│  │  ├─ downloadMedia.ts      Faz o download da mídia escolhida
│  │  ├─ backgroundMusic.ts    Música de fundo (toca 1x; abaixa em vídeos)
│  │  ├─ soundEffects.ts       Sons do gato, das teclas e da senha errada
│  │  └─ registerServiceWorker.ts
│  └─ types/media.ts           Formato de uma mídia (id, tipo, caminho…)
├─ DIARIO_DO_PROJETO.md        Registro do andamento (para retomar depois)
└─ README.md                   Este arquivo
```

---

## 4. Onde mudar a data do contador

Um único arquivo: **`src/config/startDate.ts`**

```ts
export const START_DATE = new Date(2026, 4, 25, 20, 23, 0);
```

A ordem é `(ano, mês, dia, hora, minuto, segundo)` e **o mês começa em 0**
(0 = janeiro, 4 = maio, 5 = junho, 11 = dezembro). No valor acima, o `4`
é **maio** — por isso a data exibida é 25/05/2026.

O valor atual foi definido pelo proprietário: **25 de maio de 2026, às 20:23**.
Confirme se é exatamente essa a data/hora oficial antes de publicar — trocar
apenas essa linha muda todo o app, nenhum outro arquivo precisa ser alterado.

### Milissegundos

A segunda linha mostra `...s 123ms` e os milissegundos **contam de verdade**
(0 a 999, reiniciando quando o segundo vira).

Para isso o contador é atualizado a cada quadro da tela
(`requestAnimationFrame` em `src/hooks/useElapsedTime.ts`). O navegador pausa
esses quadros sozinho quando o app vai para o segundo plano, e ao voltar o
horário já aparece correto.

Se um dia quiser deixá-los novamente parados em `000`, troque em
`src/lib/elapsedTime.ts` o trecho `milliseconds: Math.floor(rest)` por
`milliseconds: 0`.

---

## 4.1 Ícone do app e gato da tela inicial

A arte original fica guardada em `assets/icon-source.png` (gato preto sobre
fundo branco). A partir dela foram gerados os arquivos de `public/icons/`:
`icon-192`, `icon-512`, `icon-maskable-512`, `apple-touch-icon` e `favicon-32`.

Para trocar o ícone no futuro: substitua `assets/icon-source.png` por uma imagem
quadrada (ideal: 1024×1024) e gere de novo os arquivos da pasta `public/icons/`.

⚠️ Celulares com o app **já instalado** podem continuar mostrando o ícone
antigo por causa do cache do sistema. Desinstalar e instalar de novo resolve.

### Gato da tela de início

A tela de abertura usa `src/assets/cat-splash.png`: o mesmo gato, mas recortado
e com **fundo transparente**. Ele aparece com `min(34vw, 150px)` de largura
(≈34% da tela, no máximo 150px), com fade-in suave e leve redução ao tocar.

---

## 4.2 Tela de início e senha

O fluxo fica em `src/App.tsx` (`start` → `lock` → `home`):

1. **Tela de início** (`src/components/StartScreen/`) — fundo branco liso e o
   gato preto centralizado. Não há texto nem botões visíveis; o próprio gato é
   clicável.
2. **Tela de senha** (`src/components/PasscodeScreen/`) — título "Digite sua
   senha", três círculos, teclado numérico e botão de apagar. A senha correta
   (`777`) desbloqueia automaticamente; a errada mostra "Senha incorreta" e
   limpa os dígitos.

A senha fica em **um único lugar**: `PASSCODE`, em `src/config/app.ts`.
O número de círculos acompanha o tamanho da senha (`PASSCODE_LENGTH`).

O arquivo `demo-tela-inicio.mp4`, na raiz do projeto, mostra o fluxo completo
em vídeo (abertura, senha errada, apagar e desbloqueio).

---

## 5. Como adicionar fotos e vídeos (somente administrador)

1. Crie a pasta `public/midias/` e coloque os arquivos lá.
   Exemplo: `public/midias/nossa-primeira-foto.jpg`
2. Abra `src/data/media.ts` e acrescente um item na lista:

```ts
{
  id: 'foto-001',
  kind: 'image',                              // 'image' ou 'video'
  src: './midias/nossa-primeira-foto.jpg',
  fileName: 'nossa-primeira-foto.jpg',        // nome usado ao baixar
  alt: 'Nossa primeira foto juntos',          // descrição para acessibilidade
}
```

Para vídeo, use `kind: 'video'` e informe `duration: '00:42'` — esse valor vira
o selo no canto do card. Informe também `poster`, a imagem de capa extraída do
primeiro quadro do vídeo (ex.: `'./midias/posters/42.jpg'`). No iPhone, o Safari
não desenha o primeiro quadro sozinho: sem `poster`, o card fica preto.

A lista atual tem **69 itens** (57 fotos e 12 vídeos, de `1.jpg` a `54.jfif`),
na ordem em que aparecem no grid. As descrições (`alt`) estão genéricas
("Foto 1", "Vídeo 36") e podem ser personalizadas no mesmo arquivo.

> **Atenção às extensões:** os arquivos de `public/midias/` misturam `.jpg`,
> `.jpeg` e `.jfif`. O `src` em `media.ts` precisa bater **exatamente** com o
> nome do arquivo — `.jfif` e `.jpg` do mesmo número são arquivos diferentes.
> Um caminho errado aparece como card quebrado.

Ao trocar ou adicionar mídias, **suba a versão do cache** em `public/sw.js`
(`CACHE_NAME`, hoje `setevidas-v7`). O service worker usa cache-primeiro: sem
trocar esse nome, quem já instalou o app continua vendo as mídias antigas.

Enquanto a lista estiver vazia, o app mostra o estado vazio (cards cinza).

---

## 6. Como editar a carta

O texto da carta fica em **`src/data/letter.ts`**, na lista `letterParagraphs`.
Cada item da lista é um parágrafo; para quebrar a linha dentro do mesmo
parágrafo, use `\n` na string.

```ts
export const letterParagraphs: string[] = [
  'Primeiro parágrafo...',
  'Segundo parágrafo...',
];
```

Acrescentar ou remover itens muda a carta na hora — nenhum componente precisa
ser alterado. A carta aparece depois de todas as fotos, no final do grid.

---

## 7. Decisões tomadas nesta versão

O projeto foi pedido com duas referências: a especificação escrita (React + Vite
+ PWA, sem upload e sem excluir) e o material em
`Desktop/APP/Interface principal` (rascunho do layout, ícone e PDF).

Onde as duas se contradiziam, **a especificação escrita teve prioridade**:

| Tema | Referência (rascunho/PDF) | O que foi feito |
| --- | --- | --- |
| Tecnologia | React Native + Expo | **React + TypeScript + Vite (PWA)** |
| Botão flutuante de adicionar (gato) | Existe, abre o seletor de arquivos | **Não implementado** nesta etapa (item 5 da especificação). O ícone do gato foi usado nos ícones do app e o símbolo de download virou a ação **Baixar** |
| Menu de três pontinhos | "Baixar" e "Excluir" | **Somente "Baixar"** (sem função de excluir) |
| Layout do grid | 3 colunas, cards 1x1, 1x2 e 2x1 | **Alterado em 04/11/2026**: cada card usa a proporção natural da foto (sem recorte) |
| Cabeçalho | Contador centralizado, 2 linhas | **Replicado** |
| Rodapé | `v1.1.1` no canto inferior esquerdo | **Replicado** |
| Cores | Fundo e cards brancos, texto `#111111` | **Tema escuro** (fundo `#0b0b0d`, texto `#f4f4f5`) — pedido posterior do proprietário |
| Tela de senha | — | **Tela de início + senha numérica local** em 02/11/2026: gato branco/preto na abertura e senha única `777`, sem usuário nem backend |
| Carta | — | **Adicionada** no final da galeria, texto isolado em `src/data/letter.ts` |

Em **04/11/2026** a galeria foi atualizada para **69 mídias reais** (57 fotos e
12 vídeos) em `public/midias/`, declaradas em `src/data/media.ts` — antes eram
50 (48 fotos e 2 vídeos). O estado vazio continua existindo caso a lista volte a
ficar sem itens.

---

## 8. Limites desta etapa (o que ainda **não** existe)

Banco de dados, Firebase, nuvem, login definitivo, sincronização entre celulares,
painel de administração, upload/exclusão pela interface, publicação e hospedagem.

Detalhes e próximos passos: `DIARIO_DO_PROJETO.md`.
