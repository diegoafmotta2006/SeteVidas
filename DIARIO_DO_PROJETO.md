# Diário do projeto — SeteVidas

> Este arquivo é o "resumo de continuidade" do projeto.
> Se o trabalho parar e voltar em outra conversa (ou com outra IA), leia este
> arquivo primeiro: ele conta o que já foi feito, o que foi decidido e qual é o
> próximo passo. Atualize a data no topo sempre que mexer nele.

**Última atualização:** 29/10/2026
**Versão da interface:** v1.0.0
**Etapa atual:** 1 — estrutura + interface inicial (concluída)

---

## 0. Histórico rápido

| Data | Mudança |
| --- | --- |
| 29/10/2026 | Primeira versão da interface (contador, grid, menu Baixar, PWA claro) |
| 29/10/2026 | Tema escuro, milissegundos no contador e novo ícone (gato de cauda curvada) |
| 29/10/2026 | Milissegundos passaram a contar de verdade (atualização por quadro) |

---

## 1. O que é o app

SeteVidas é um app privado para duas pessoas, instalado na tela inicial do
celular (PWA). A tela principal tem:

1. um contador de tempo desde a data de início (anos, meses, semanas, dias /
   horas, minutos, segundos), atualizado a cada segundo;
2. um grid de fotos e vídeos (estilo bento/Pinterest);
3. o menu de três pontinhos em cada mídia, com a opção **Baixar**;
4. a versão (`v1.0.0`) no rodapé.

Sem busca, sem abas, sem menu inferior, sem botão de adicionar mídia.

---

## 2. Decisões tomadas (e por quê)

| Assunto | Decisão |
| --- | --- |
| Tecnologia | React + TypeScript + Vite, empacotado como PWA (a especificação pedia isso; o PDF de referência citava React Native) |
| Data inicial | Fica em **um único arquivo** (`src/config/startDate.ts`); o valor atual é o definido pelo proprietário (25/06/2026 20:23) |
| Grid | 3 colunas com padrão de alturas que se repete sem deixar buracos (`src/components/BentoGrid`) |
| Mídias | Lista manual em `src/data/media.ts`; o administrador edita o arquivo. Nenhum upload na interface |
| Menu da mídia | Somente "Baixar" + "Cancelar" (não existe excluir nesta versão) |
| Ícone | Gerado a partir de `assets/icon-source.png` (gato de cauda curvada) em 192, 512, maskable e apple-touch |
| Tema | Escuro fixo: fundo `#0b0b0d`, cards `#17171a`, texto `#f4f4f5` |
| Milissegundos | Contam de verdade (0–999). A tela é atualizada a cada quadro (`requestAnimationFrame`), que o navegador pausa sozinho em segundo plano |
| Botão flutuante do gato | **Não implementado**: a especificação proíbe botão de adicionar nesta etapa. O ícone foi usado como ícone do app e o motivo "download" virou a ação Baixar |
| Fonte | Fonte do sistema (Inter/SF Pro quando existirem), sem baixar fontes da internet |
| Dependências | Só React, React DOM, Vite, TypeScript e o plugin do React — nada além disso |

---

## 3. O que já funciona

- [x] Contador em duas linhas, atualizando a cada segundo
- [x] Milissegundos contando de verdade (0–999), sem tremida no layout
- [x] Tema escuro em toda a interface (contador, grid, menu, rodapé, barra do sistema)
- [x] Ícones do app a partir da nova arte do gato
- [x] Cálculo em calendário (anos/meses) e semanas a partir dos dias restantes
- [x] Recalcula ao voltar do segundo plano (visibilidade da aba)
- [x] Grid responsivo de 3 colunas com cards 1x1, 1x2 e 2x1
- [x] Estado vazio com cards cinza-claro
- [x] Card de vídeo com selo de duração (mm:ss)
- [x] Menu de três pontinhos em bottom sheet com "Baixar"
- [x] Rodapé com versão
- [x] Manifest, ícones e service worker (cache do esqueleto do app)
- [x] Layout full-screen com `safe-area` (notch/barra de gestos)
- [x] `npm run build` sem erros de TypeScript

---

## 4. Como foi conferido

- Build de produção gerado em `dist/`
- Testado em viewport de celular (390 x 844) e desktop (1280 x 800)
- Grid testado com mídias reais (fotos de exemplo) e depois voltado ao estado
  vazio — nenhuma foto fictícia ficou no projeto
- Menu "Baixar" aberto e conferido (foco de teclado e fechamento por Esc/clique
  fora)

---

## 5. Pendências conhecidas

1. **Data real do início** — já ajustada pelo proprietário
   (25/06/2026 20:23, em `src/config/startDate.ts`). Conferir se é exatamente
   essa a data/hora oficial.
2. **Fuso horário** — a data é lida no fuso do aparelho. Se os dois celulares
   estiverem em fusos diferentes, a contagem pode variar em horas.
3. **Publicação** — o PWA só pode ser instalado em `https` (ou `localhost`).
   Falta escolher a hospedagem.
4. **Aparência final** — cores, tipografia e espaçamentos serão ajustados com
   as referências visuais definitivas do proprietário.
5. **Vídeos** — hoje o card mostra o vídeo parado com selo de duração; tocar
   para reproduzir não faz parte desta etapa.
6. **Consumo** — o contador redesenha junto com a tela (~60x por segundo)
   enquanto o app está aberto para os milissegundos andarem. Em celular antigo,
   se o consumo incomodar, dá para trocar por uma atualização a cada 50 ms
   (`setInterval`) e os milissegundos continuam contando, só que em passos.

---

## 6. Próximo passo sugerido

1. Confirmar a data/hora real e trocar em `src/config/startDate.ts`.
2. Receber as referências visuais finais e ajustar cores/tipografia.
3. Decidir a hospedagem (ex.: Netlify, Vercel ou GitHub Pages) para o app
   poder ser instalado nos dois celulares.
4. Só depois pensar em login, sincronização e administração de mídias
   (etapas futuras, fora do escopo da v1.0.0).

---

## 7. Mapa rápido dos arquivos

```
src/config/startDate.ts   → data inicial (único lugar)
src/config/app.ts         → nome e versão
src/data/media.ts         → lista de mídias (administrador)
src/components/...        → cada parte visual da tela
src/lib/...               → cálculos, formatação e download
public/                   → manifest, service worker e ícones
```
