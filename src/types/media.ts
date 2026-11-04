/**
 * Tipos de mídia aceitos pela galeria.
 *
 * Por enquanto o app só exibe o que estiver declarado em
 * `src/data/media.ts`. O administrador do projeto adiciona os
 * arquivos manualmente; não existe upload na interface.
 */
export type MediaKind = 'image' | 'video';

export interface MediaItem {
  /** Identificador único e estável (usado como key do React). */
  id: string;
  kind: MediaKind;
  /** Caminho do arquivo. Pode ser relativo (./midias/foto.jpg) ou uma URL. */
  src: string;
  /** Nome sugerido ao baixar pelo menu de três pontinhos. */
  fileName: string;
  /** Duração no formato mm:ss — obrigatória apenas para vídeos. */
  duration?: string;
  /** Descrição para leitores de tela. */
  alt: string;
}
