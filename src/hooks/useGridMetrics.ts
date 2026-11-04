import { useEffect, useRef, useState } from 'react';

interface GridMetrics {
  columns: number;
  rows: number;
}

/**
 * Mede quantas colunas o grid tem agora e quantas linhas cabem na altura
 * disponível.
 *
 * O grid usa `auto-fill`, então o número de colunas depende da largura do
 * container (não da janela). Medir é a única forma de saber quantos cards
 * desenhar no estado vazio sem sobrar espaço na tela larga.
 */
export function useGridMetrics<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const [metrics, setMetrics] = useState<GridMetrics>({
    columns: 3,
    rows: 5,
  });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const viewport = element.parentElement;

    const measure = () => {
      const styles = getComputedStyle(element);

      const columns = styles.gridTemplateColumns
        .split(' ')
        .filter((value) => value !== '' && value !== 'none').length;

      const rowHeight = Number.parseFloat(styles.gridAutoRows) || 0;
      const rowGap = Number.parseFloat(styles.rowGap) || 0;
      const available = viewport?.clientHeight ?? 0;

      const rows =
        rowHeight > 0
          ? Math.floor(available / (rowHeight + rowGap))
          : 0;

      setMetrics((current) => {
        const next: GridMetrics = {
          columns: columns > 0 ? columns : current.columns,
          rows: rows > 0 ? rows : current.rows,
        };

        const unchanged =
          next.columns === current.columns && next.rows === current.rows;

        return unchanged ? current : next;
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    if (viewport) {
      observer.observe(viewport);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, columns: metrics.columns, rows: metrics.rows };
}
