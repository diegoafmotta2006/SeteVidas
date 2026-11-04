import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  duckBackgroundMusic,
  unduckBackgroundMusic,
} from '../../lib/backgroundMusic';
import type { MediaItem } from '../../types/media';
import './MediaViewer.css';

interface MediaViewerProps {
  item: MediaItem;
  onClose: () => void;
}

/**
 * Visualizador em tela cheia: mostra a mídia inteira, na proporção
 * original, sobre um fundo transparente e embaçado.
 */
export function MediaViewer({ item, onClose }: MediaViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Enquanto um vídeo está aberto, a música de fundo fica mais baixa
  // para não sobrepor o áudio do vídeo. Ao fechar, volta ao normal.
  useEffect(() => {
    if (item.kind !== 'video') {
      return;
    }

    duckBackgroundMusic();

    return () => {
      unduckBackgroundMusic();
    };
  }, [item.kind]);

  return createPortal(
    <div className="media-viewer" role="presentation" onClick={onClose}>
      <button
        type="button"
        className="media-viewer__close"
        aria-label="Fechar"
        ref={closeRef}
        onClick={onClose}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4 4l10 10M14 4L4 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        className="media-viewer__stage"
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        onClick={(event) => event.stopPropagation()}
      >
        {item.kind === 'video' ? (
          <video
            className="media-viewer__media"
            src={item.src}
            aria-label={item.alt}
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            className="media-viewer__media"
            src={item.src}
            alt={item.alt}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
