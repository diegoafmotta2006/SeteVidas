import type { MediaItem } from '../types/media';

/**
 * ============================================================
 *  MÍDIAS DO APP (adicionadas pelo administrador)
 * ============================================================
 *
 * O app NÃO tem botão de upload. Para publicar uma mídia:
 *
 * 1. Coloque o arquivo dentro da pasta `public/midias/`.
 *    Ex.: public/midias/nossa-primeira-foto.jpg
 *
 * 2. Acrescente um item na lista abaixo. O caminho começa com
 *    `./midias/` porque o build usa caminhos relativos.
 *
 * 3. Rode o build/deploy de novo. Pronto: a mídia aparece no
 *    grid e o menu de três pontinhos passa a oferecer "Baixar".
 *
 * Enquanto a lista estiver vazia, o app mostra o estado vazio
 * (cards cinza), exatamente como combinado nesta primeira etapa.
 *
 * Exemplo de item de imagem:
 *
 *   {
 *     id: 'foto-001',
 *     kind: 'image',
 *     src: './midias/nossa-primeira-foto.jpg',
 *     fileName: 'nossa-primeira-foto.jpg',
 *     alt: 'Nossa primeira foto juntos',
 *   },
 *
 * Exemplo de item de vídeo (a duração vira o selo no card):
 *
 *   {
 *     id: 'video-001',
 *     kind: 'video',
 *     src: './midias/primeiro-video.mp4',
 *     fileName: 'primeiro-video.mp4',
 *     duration: '00:32',
 *     alt: 'Vídeo do nosso primeiro passeio',
 *   },
 * ============================================================
 */
export const mediaItems: MediaItem[] = [];
