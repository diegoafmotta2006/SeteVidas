import { useState } from 'react';
import type { MediaItem } from '../../types/media';
import { MediaMenu } from '../MediaMenu/MediaMenu';
import './MediaCard.css';

interface MediaCardProps {
  /** `null` = card vazio (estado sem mídias). */
  item: MediaItem | null;
  colSpan: number;
  rowSpan: number;
}

function MenuDots() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="3.4" cy="8" r="1.45" fill="currentColor" />
      <circle cx="8" cy="8" r="1.45" fill="currentColor" />
      <circle cx="12.6" cy="8" r="1.45" fill="currentColor" />
    </svg>
  );
}

/** Um card do grid: imagem, vídeo (com selo de duração) ou espaço vazio. */
export function MediaCard({ item, colSpan, rowSpan }: MediaCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const style = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
  };

  if (!item) {
    return (
      <article
        className="media-card media-card--empty"
        style={style}
        role="listitem"
      >
        <span className="media-card__placeholder" aria-hidden="true" />
      </article>
    );
  }

  const isVideo = item.kind === 'video';

  return (
    <article className="media-card" style={style} role="listitem">
      {isVideo ? (
        <video
          className="media-card__media"
          src={item.src}
          aria-label={item.alt}
          preload="metadata"
          muted
          loop
          playsInline
        />
      ) : (
        <img
          className="media-card__media"
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
      )}

      {isVideo && item.duration ? (
        <span className="media-card__duration">{item.duration}</span>
      ) : null}

      <button
        type="button"
        className="media-card__menu-button"
        aria-label="Abrir opções da mídia"
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuDots />
      </button>

      {isMenuOpen ? (
        <MediaMenu
          item={item}
          onClose={() => setIsMenuOpen(false)}
        />
      ) : null}
    </article>
  );
}
