import { useEffect, useMemo, useState } from 'react';
import { calculateElapsed, type ElapsedBreakdown } from '../lib/elapsedTime';

/**
 * Devolve o tempo decorrido desde `start`.
 *
 * Atualiza a cada quadro da tela (requestAnimationFrame), porque os
 * milissegundos precisam andar de verdade. O navegador pausa sozinho
 * esses quadros quando a aba/app vai para o segundo plano, então o
 * relógio não fica gastando bateria à toa.
 *
 * Como cada atualização lê `new Date()`, o valor nunca atrasa: ao
 * voltar para o app ele já aparece correto.
 */
export function useElapsedTime(start: Date): ElapsedBreakdown {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setNow(new Date());
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return useMemo(() => calculateElapsed(start, now), [start, now]);
}
