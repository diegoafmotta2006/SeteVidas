# SeteVidas — Interface principal v1.0.0

PWA privado (React + TypeScript + Vite) com:

- contador de tempo ao vivo no topo (anos, meses, semanas, dias / horas, minutos, segundos e milissegundos);
- grid estilo "bento" (3 colunas, cards de alturas diferentes) — a galeria de memórias;
- menu de três pontinhos em cada mídia, com a opção **Baixar** (não existe excluir);
- rodapé com a versão (`v1.0.0`);
- tema escuro fixo;
- estrutura de PWA: manifest, ícones e service worker.

> **Etapa 1:** somente a estrutura e a interface inicial. Ainda não há banco de dados,
> login, sincronização, upload de mídia nem publicação.

---

## 1. Como rodar no computador

Pré-requisito: **Node.js** instalado (versão 20 ou mais nova).
Para conferir, abra o Prompt de Comando e digite `node --version`.

Dentro da pasta do projeto (`setevidas`):

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
Digite esse endereço no navegador do celular. Para **instalar** o app de fato
(ícone na tela inicial), o PWA precisa estar em `https` ou em `localhost`;
isso será resolvido na etapa de publicação/hospedagem.

---

## 2. Estrutura de pastas

```
setevidas/
├─ index.html                  Página única: título, ícones, manifest, viewport
├─ public/                     Arquivos copiados "como estão" para o build
│  ├─ manifest.webmanifest     Nome, cores, ícones e modo do PWA
│  ├─ sw.js                    Service worker (cache offline)
│  └─ icons/                   Ícones gerados a partir do gato com a seta
├─ src/
│  ├─ main.tsx                 Ponto de entrada: monta o React e registra o SW
│  ├─ App.tsx                  Junta contador + grid + rodapé
│  ├─ App.css                  Layout geral da tela
│  ├─ index.css                Reset, cores e fontes (variáveis globais)
│  ├─ config/
│  │  ├─ startDate.ts          ⚠️ ÚNICO lugar com a data/hora inicial
│  │  └─ app.ts                Nome do app e versão do rodapé
│  ├─ components/
│  │  ├─ TimeCounter/          Contador (2 linhas, atualiza a cada segundo)
│  │  ├─ BentoGrid/            Grade de 3 colunas + desenho dos cards
│  │  ├─ MediaCard/            Um card (imagem, vídeo com duração, ou vazio)
│  │  ├─ MediaMenu/            Bottom sheet com a opção "Baixar"
│  │  └─ VersionFooter/        "v1.0.0" no canto inferior esquerdo
│  ├─ data/media.ts            Lista de mídias (adicionada pelo administrador)
│  ├─ hooks/useElapsedTime.ts  Relógio de 1 em 1 segundo
│  ├─ lib/
│  │  ├─ elapsedTime.ts        Conta anos/meses/semanas/dias/horas/min/seg
│  │  ├─ formatElapsed.ts      Escreve o texto em português
│  │  ├─ downloadMedia.ts      Faz o download da mídia escolhida
│  │  └─ registerServiceWorker.ts
│  └─ types/media.ts           Formato de uma mídia (id, tipo, caminho…)
├─ DIARIO_DO_PROJETO.md        Registro do andamento (para retomar depois)
└─ README.md                   Este arquivo
```

---

## 3. Onde mudar a data do contador

Um único arquivo: **`src/config/startDate.ts`**

```ts
export const START_DATE = new Date(2024, 5, 14, 21, 40, 0);
```

A ordem é `(ano, mês, dia, hora, minuto, segundo)` e **o mês começa em 0**
(0 = janeiro, 5 = junho, 11 = dezembro).

O valor atual é **provisório** e está marcado como tal no arquivo. Trocar apenas
essa linha muda todo o app — nenhum outro arquivo precisa ser alterado.

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

## 3.1 Ícone do app

A arte original fica guardada em `assets/icon-source.png` (gato preto sobre
fundo branco). A partir dela foram gerados os arquivos de `public/icons/`:
`icon-192`, `icon-512`, `icon-maskable-512`, `apple-touch-icon` e `favicon-32`.

Para trocar o ícone no futuro: substitua `assets/icon-source.png` por uma imagem
quadrada (ideal: 1024×1024) e gere de novo os arquivos da pasta `public/icons/`.

⚠️ Celulares com o app **já instalado** podem continuar mostrando o ícone
antigo por causa do cache do sistema. Desinstalar e instalar de novo resolve.

---

## 4. Como adicionar fotos e vídeos (somente administrador)

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

Para vídeo, use `kind: 'video'` e informe `duration: '00:32'` — esse valor vira
o selo no canto do card.

Enquanto a lista estiver vazia, o app mostra o estado vazio (cards cinza).

---

## 5. Decisões tomadas nesta versão

O projeto foi pedido com duas referências: a especificação escrita (React + Vite
+ PWA, sem upload e sem excluir) e o material em
`Desktop/APP/Interface principal` (rascunho do layout, ícone e PDF).

Onde as duas se contradiziam, **a especificação escrita teve prioridade**:

| Tema | Referência (rascunho/PDF) | O que foi feito |
| --- | --- | --- |
| Tecnologia | React Native + Expo | **React + TypeScript + Vite (PWA)** |
| Botão flutuante de adicionar (gato) | Existe, abre o seletor de arquivos | **Não implementado** nesta etapa (item 5 da especificação). O ícone do gato foi usado nos ícones do app e o símbolo de download virou a ação **Baixar** |
| Menu de três pontinhos | "Baixar" e "Excluir" | **Somente "Baixar"** (sem função de excluir) |
| Layout do grid | 3 colunas, cards 1x1, 1x2 e 2x1 | **Replicado** |
| Cabeçalho | Contador centralizado, 2 linhas | **Replicado** |
| Rodapé | `v1.0.0` no canto inferior esquerdo | **Replicado** |
| Cores | Fundo e cards brancos, texto `#111111` | **Tema escuro** (fundo `#0b0b0d`, texto `#f4f4f5`) — pedido posterior do proprietário |

Nada de mídia fictícia foi criado: o estado inicial mostra apenas cards vazios,
como combinado.

---

## 6. Limites desta etapa (o que ainda **não** existe)

Banco de dados, Firebase, nuvem, login definitivo, sincronização entre celulares,
painel de administração, upload/exclusão pela interface, publicação e hospedagem.

Detalhes e próximos passos: `DIARIO_DO_PROJETO.md`.
