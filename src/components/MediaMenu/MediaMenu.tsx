import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { downloadMedia } from '../../lib/downloadMedia';
import type { MediaItem } from '../../types/media';
import './MediaMenu.css';

interface MediaMenuProps {
  item: MediaItem;
  onClose: () => void;
}

/**
 * Menu de três pontinhos (bottom sheet) com a opção "Baixar".
 * Não existe opção de excluir, conforme a especificação.
 */
export function MediaMenu({ item, onClose }: MediaMenuProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Leva o foco do teclado para dentro da folha, sem destacar o botão.
    sheetRef.current?.focus();

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

  const handleDownload = () => {
    downloadMedia(item);
    onClose();
  };

  return createPortal(
    <div className="media-menu" role="presentation" onClick={onClose}>
      <div
        className="media-menu__sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Opções da mídia"
        ref={sheetRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="media-menu__handle" aria-hidden="true" />

        <button
          type="button"
          className="media-menu__action"
          onClick={handleDownload}
        >
          Baixar
        </button>

        <button
          type="button"
          className="media-menu__cancel"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>,
    document.body,
  );
}
