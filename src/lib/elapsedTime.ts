/** Resultado da contagem: cada unidade já separada e arredondada para baixo. */
export interface ElapsedBreakdown {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /**
   * Milissegundos (0 a 999), contados de verdade.
   *
   * Eles só andam porque o contador é atualizado a cada quadro da tela
   * (veja `src/hooks/useElapsedTime.ts`). Se um dia quiser deixá-los
   * parados em 000, basta devolver `0` aqui.
   */
  milliseconds: number;
}

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/** Quantidade de dias que um mês possui (o mês 1 = fevereiro, etc.). */
function daysInMonth(year: number, month: number): number {
  // Dia 0 do mês seguinte = último dia do mês pedido.
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Soma meses a uma data respeitando meses mais curtos.
 * Ex.: 31/01 + 1 mês = 28/02 (e não 03/03, como o JavaScript faria sozinho).
 */
function addMonths(date: Date, months: number): Date {
  const zeroBasedMonth = date.getMonth() + months;
  const year = date.getFullYear() + Math.floor(zeroBasedMonth / 12);
  const month = ((zeroBasedMonth % 12) + 12) % 12;
  const day = Math.min(date.getDate(), daysInMonth(year, month));

  return new Date(
    year,
    month,
    day,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
}

const ZERO: ElapsedBreakdown = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};

/**
 * Calcula o tempo decorrido entre `start` e `now`.
 *
 * - Anos e meses são contados no calendário (como uma pessoa conta).
 * - As semanas saem dos dias restantes (3 semanas = 21 dias).
 * - Horas, minutos e segundos vêm do resto do dia.
 *
 * Datas no futuro (ou inválidas) devolvem tudo zerado.
 */
export function calculateElapsed(start: Date, now: Date): ElapsedBreakdown {
  if (Number.isNaN(start.getTime()) || Number.isNaN(now.getTime())) {
    return ZERO;
  }

  if (now.getTime() <= start.getTime()) {
    return ZERO;
  }

  let totalMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (totalMonths < 0) {
    totalMonths = 0;
  }

  // "Âncora" = data inicial + meses completos já vividos.
  let anchor = addMonths(start, totalMonths);
  if (anchor.getTime() > now.getTime()) {
    totalMonths -= 1;
    anchor = addMonths(start, totalMonths);
  }

  let rest = now.getTime() - anchor.getTime();

  const totalDays = Math.floor(rest / MS_PER_DAY);
  rest -= totalDays * MS_PER_DAY;

  const hours = Math.floor(rest / MS_PER_HOUR);
  rest -= hours * MS_PER_HOUR;

  const minutes = Math.floor(rest / MS_PER_MINUTE);
  rest -= minutes * MS_PER_MINUTE;

  const seconds = Math.floor(rest / MS_PER_SECOND);
  rest -= seconds * MS_PER_SECOND;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
    hours,
    minutes,
    seconds,
    milliseconds: Math.floor(rest),
  };
}
