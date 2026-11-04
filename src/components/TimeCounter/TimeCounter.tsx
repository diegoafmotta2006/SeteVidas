import { START_DATE } from '../../config/startDate';
import { useElapsedTime } from '../../hooks/useElapsedTime';
import { formatCalendarLine, formatClockLine } from '../../lib/formatElapsed';
import './TimeCounter.css';

/**
 * Cabeçalho da tela inicial: apenas o contador de tempo.
 * Atualiza sozinho a cada segundo (ver useElapsedTime).
 */
export function TimeCounter() {
  const elapsed = useElapsedTime(START_DATE);
  const calendarLine = formatCalendarLine(elapsed);
  const clockLine = formatClockLine(elapsed);

  return (
    <header
      className="time-counter"
      role="timer"
      aria-live="off"
      aria-atomic="true"
      aria-label={`${calendarLine}. ${clockLine}.`}
    >
      <p className="time-counter__calendar">{calendarLine}</p>
      <p className="time-counter__clock">{clockLine}</p>
    </header>
  );
}
