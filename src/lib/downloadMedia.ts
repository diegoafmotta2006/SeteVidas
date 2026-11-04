import type { MediaItem } from '../types/media';

/**
 * Inicia o download de uma mídia usando o próprio navegador.
 *
 * Funciona para arquivos servidos pela mesma origem do app
 * (ex.: arquivos dentro da pasta `public/`). Para arquivos em
 * outro domínio, o navegador pode abrir a mídia em vez de baixar.
 */
export function downloadMedia(item: MediaItem): void {
  const link = document.createElement('a');
  link.href = item.src;
  link.download = item.fileName;
  link.rel = 'noopener';

  document.body.appendChild(link);
  link.click();
  link.remove();
}
