import { useCallback, useEffect, useRef, useState } from 'react';
import { PASSCODE, PASSCODE_LENGTH } from '../../config/app';
import { playError, playTap } from '../../lib/soundEffects';
import './PasscodeScreen.css';

const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

interface PasscodeScreenProps {
  /** Chamado assim que a senha correta é digitada. */
  onUnlock: () => void;
}

function BackspaceIcon() {
  return (
    <svg
      width="26"
      height="20"
      viewBox="0 0 26 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9.4 2h12.1A2.5 2.5 0 0 1 24 4.5v11a2.5 2.5 0 0 1-2.5 2.5H9.4a2.5 2.5 0 0 1-1.8-.75L2 10l5.6-6.25A2.5 2.5 0 0 1 9.4 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m11.6 7.4 5.2 5.2m0-5.2-5.2 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Tela de bloqueio por senha numérica, no estilo do desbloqueio do iPhone.
 * A senha é única e local (sem usuário, cadastro ou backend).
 */
export function PasscodeScreen({ onUnlock }: PasscodeScreenProps) {
  const [digits, setDigits] = useState('');
  const [hasError, setHasError] = useState(false);
  const onUnlockRef = useRef(onUnlock);

  onUnlockRef.current = onUnlock;

  // Avalia a senha assim que o último dígito é digitado.
  useEffect(() => {
    if (digits.length !== PASSCODE_LENGTH) {
      return;
    }

    if (digits === PASSCODE) {
      // Pequena pausa só para o terceiro círculo aparecer antes de entrar.
      const timer = window.setTimeout(() => onUnlockRef.current(), 140);
      return () => window.clearTimeout(timer);
    }

    playError();
    setHasError(true);
    const timer = window.setTimeout(() => setDigits(''), 450);
    return () => window.clearTimeout(timer);
  }, [digits]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (digits.length >= PASSCODE_LENGTH) {
        return;
      }

      playTap();
      setHasError(false);
      setDigits((current) =>
        current.length >= PASSCODE_LENGTH ? current : current + digit,
      );
    },
    [digits.length],
  );

  const handleBackspace = useCallback(() => {
    if (digits.length === 0 || digits.length >= PASSCODE_LENGTH) {
      return;
    }

    playTap();
    setHasError(false);
    setDigits((current) => current.slice(0, -1));
  }, [digits.length]);

  // Permite digitar também pelo teclado físico (útil no computador).
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        handleDigit(event.key);
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleBackspace]);

  return (
    <div
      className="passcode-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Digite sua senha"
    >
      <div className="passcode-screen__content">
        <h1 className="passcode-screen__title">Digite sua senha</h1>

        <div
          className="passcode-screen__dots"
          role="status"
          aria-label={`${digits.length} de ${PASSCODE_LENGTH} dígitos`}
        >
          {Array.from({ length: PASSCODE_LENGTH }, (_, index) => (
            <span
              key={`digito-${index}`}
              className={
                index < digits.length
                  ? 'passcode-screen__dot passcode-screen__dot--filled'
                  : 'passcode-screen__dot'
              }
            />
          ))}
        </div>

        <div className="passcode-screen__message" aria-live="polite">
          {hasError ? (
            <span className="passcode-screen__error">Senha incorreta</span>
          ) : null}
        </div>
      </div>

      <div className="passcode-screen__keypad" role="group" aria-label="Teclado numérico">
        {DIGIT_KEYS.map((digit) => (
          <button
            key={digit}
            type="button"
            className="passcode-screen__key"
            onClick={() => handleDigit(digit)}
          >
            {digit}
          </button>
        ))}

        <span className="passcode-screen__key-spacer" aria-hidden="true" />

        <button
          type="button"
          className="passcode-screen__key"
          onClick={() => handleDigit('0')}
        >
          0
        </button>

        <button
          type="button"
          className="passcode-screen__key passcode-screen__key--ghost"
          onClick={handleBackspace}
          aria-label="Apagar o último número"
        >
          <BackspaceIcon />
        </button>
      </div>
    </div>
  );
}
