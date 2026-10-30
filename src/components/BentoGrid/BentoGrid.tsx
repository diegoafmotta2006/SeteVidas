import type { MediaItem } from '../../types/media';
import { MediaCard } from '../MediaCard/MediaCard';
import './BentoGrid.css';

interface Span {
  colSpan: number;
  rowSpan: number;
}

/**
 * Desenho do grid (3 colunas), copiado da referência visual:
 * cards altos, cards quadrados e um card horizontal largo.
 *
 * Cada bloco da lista "fecha" um retângulo completo de 3 colunas,
 * então o padrão pode ser repetido sem deixar buracos.
 */
const PATTERN_A: Span[] = [
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 4 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
];

const PATTERN_B: Span[] = [
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
];

const BENTO_PATTERN: Span[] = [...PATTERN_A, ...PATTERN_B];

/** Quantos cards vazios desenhar quando ainda não há mídias. */
const EMPTY_CARD_COUNT = BENTO_PATTERN.length;

interface BentoGridProps {
  items: MediaItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  const isEmpty = items.length === 0;
  const cardCount = isEmpty ? EMPTY_CARD_COUNT : items.length;

  return (
    <div
      className="bento-grid"
      role="list"
      aria-label={isEmpty ? 'Galeria vazia' : 'Galeria de mídias'}
    >
      {Array.from({ length: cardCount }, (_, index) => {
        const span = BENTO_PATTERN[index % BENTO_PATTERN.length] ?? {
          colSpan: 1,
          rowSpan: 1,
        };

        return (
          <MediaCard
            key={items[index]?.id ?? `vazio-${index}`}
            item={items[index] ?? null}
            colSpan={span.colSpan}
            rowSpan={span.rowSpan}
          />
        );
      })}
    </div>
  );
}
