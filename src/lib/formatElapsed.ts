import type { ElapsedBreakdown } from './elapsedTime';

interface Unit {
  value: number;
  singular: string;
  plural: string;
}

function joinUnits(units: Unit[]): string {
  return units
    .map(({ value, singular, plural }) =>
      `${value} ${value === 1 ? singular : plural}`,
    )
    .join(', ');
}

/** Primeira linha: "2 anos, 4 meses, 3 semanas, 2 dias". */
export function formatCalendarLine(elapsed: ElapsedBreakdown): string {
  return joinUnits([
    { value: elapsed.years, singular: 'ano', plural: 'anos' },
    { value: elapsed.months, singular: 'mês', plural: 'meses' },
    { value: elapsed.weeks, singular: 'semana', plural: 'semanas' },
    { value: elapsed.days, singular: 'dia', plural: 'dias' },
  ]);
}

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function pad3(value: number): string {
  return value.toString().padStart(3, '0');
}

/** Segunda linha: "8h 32min 13s 000ms". */
export function formatClockLine(elapsed: ElapsedBreakdown): string {
  return `${elapsed.hours}h ${pad2(elapsed.minutes)}min ${pad2(elapsed.seconds)}s ${pad3(elapsed.milliseconds)}ms`;
}
