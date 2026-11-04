import type { MediaItem } from '../../types/media';
import { useGridMetrics } from '../../hooks/useGridMetrics';
import { MediaCard } from '../MediaCard/MediaCard';
import './BentoGrid.css';

interface Span {
  colSpan: number;
  rowSpan: number;
}

/**
 * Desenho dos cards, copiado da referência visual:
 * cards altos, cards quadrados e um card horizontal largo.
 *
 * No celular o grid tem 3 colunas e cada bloco "fecha" um retângulo
 * completo, sem buracos. No desktop o `auto-fill` acrescenta colunas,
 * e o `dense` do CSS preenche os eventuais buracos com cards menores.
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

/** Área média de um card do padrão (em células), para o estado vazio. */
const AVERAGE_CELLS_PER_CARD =
  BENTO_PATTERN.reduce(
    (total, span) => total + span.colSpan * span.rowSpan,
    0,
  ) / BENTO_PATTERN.length;

interface BentoGridProps {
  items: MediaItem[];
}

export function BentoGrid({ items }: BentoGridProps) {
  const { ref, columns, rows } = useGridMetrics<HTMLDivElement>();
  const isEmpty = items.length === 0;

  // Até 3 colunas (celular) mantém exatamente o mesmo estado vazio de antes.
  // Em telas largas desenha cards suficientes para preencher a altura visível.
  const emptyCount =
    columns <= 3
      ? EMPTY_CARD_COUNT
      : Math.ceil(
          (columns * Math.max(rows, 3)) / AVERAGE_CELLS_PER_CARD,
        );

  const cardCount = isEmpty ? emptyCount : items.length;

  return (
    <div
      ref={ref}
      className={`bento-grid ${isEmpty ? 'bento-grid--empty' : 'bento-grid--filled'}`}
      role="list"
      aria-label={isEmpty ? 'Galeria vazia' : 'Galeria de mídias'}
    >
      {Array.from({ length: cardCount }, (_, index) => {
        // O padrão bento só define os cards vazios. Com mídias, cada card
        // recebe a proporção natural da foto/vídeo (ver MediaCard).
        const span = isEmpty
          ? BENTO_PATTERN[index % BENTO_PATTERN.length] ?? {
              colSpan: 1,
              rowSpan: 1,
            }
          : { colSpan: 1, rowSpan: 1 };

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
