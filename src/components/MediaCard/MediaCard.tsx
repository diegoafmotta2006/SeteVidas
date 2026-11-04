import { useState, type CSSProperties, type SyntheticEvent } from 'react';
import type { MediaItem } from '../../types/media';
import { MediaMenu } from '../MediaMenu/MediaMenu';
import { MediaViewer } from '../MediaViewer/MediaViewer';
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  // Proporção natural (largura / altura). 1 = quadrado até a mídia carregar.
  const [aspectRatio, setAspectRatio] = useState(1);

  if (!item) {
    return (
      <article
        className="media-card media-card--empty"
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        }}
        role="listitem"
      >
        <span className="media-card__placeholder" aria-hidden="true" />
      </article>
    );
  }

  const isVideo = item.kind === 'video';

  // O card inteiro assume a proporção da foto, então a mídia aparece
  // inteira, sem recorte.
  const style: CSSProperties = { aspectRatio };

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    if (naturalWidth > 0 && naturalHeight > 0) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const handleVideoMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = event.currentTarget;

    if (videoWidth > 0 && videoHeight > 0) {
      setAspectRatio(videoWidth / videoHeight);
    }
  };

  return (
    <article className="media-card" style={style} role="listitem">
      <button
        type="button"
        className="media-card__open"
        aria-label={`Abrir ${item.alt} em tela cheia`}
        onClick={() => setIsViewerOpen(true)}
      >
        {isVideo ? (
          <video
            className="media-card__media"
            src={item.src}
            aria-label={item.alt}
            preload="metadata"
            muted
            loop
            playsInline
            onLoadedMetadata={handleVideoMetadata}
          />
        ) : (
          <img
            className="media-card__media"
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
          />
        )}
      </button>

      {isVideo && item.duration ? (
        <span className="media-card__duration">{item.duration}</span>
      ) : null}

      <button
        type="button"
        className="media-card__menu-button"
        aria-label="Abrir opções da mídia"
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
        onClick={(event) => {
          event.stopPropagation();
          setIsMenuOpen(true);
        }}
      >
        <MenuDots />
      </button>

      {isMenuOpen ? (
        <MediaMenu
          item={item}
          onClose={() => setIsMenuOpen(false)}
        />
      ) : null}

      {isViewerOpen ? (
        <MediaViewer
          item={item}
          onClose={() => setIsViewerOpen(false)}
        />
      ) : null}
    </article>
  );
}
