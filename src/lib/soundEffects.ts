/**
 * Sons leves do app, gerados na hora com a Web Audio API.
 *
 * Não dependem de arquivos: um toque curto para o gato e o teclado da
 * senha, e dois tons discretos quando a senha está errada.
 */

let context: AudioContext | null = null;

type ToneOptions = {
  frequency: number;
  endFrequency?: number;
  duration: number;
  volume: number;
  type?: OscillatorType;
  delay?: number;
};

function getContext(): AudioContext | null {
  const AudioContextClass =
    window.AudioContext ??
    (
      window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!context) {
    context = new AudioContextClass();
  }

  if (context.state === 'suspended') {
    void context.resume();
  }

  return context;
}

function playTone(
  audioContext: AudioContext,
  {
    frequency,
    endFrequency,
    duration,
    volume,
    type = 'sine',
    delay = 0,
  }: ToneOptions,
) {
  const start = audioContext.currentTime + delay;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      start + duration,
    );
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

/** Toque macio e mais grave do gato, diferente do clique do teclado. */
export function playCatTap() {
  const audioContext = getContext();

  if (!audioContext) {
    return;
  }

  playTone(audioContext, {
    frequency: 520,
    endFrequency: 680,
    duration: 0.14,
    volume: 0.055,
  });

  playTone(audioContext, {
    frequency: 1040,
    endFrequency: 1360,
    duration: 0.1,
    volume: 0.018,
    delay: 0.01,
  });
}

/** Toque curto e seco, parecido com o clique do teclado do iPhone. */
export function playTap() {
  const audioContext = getContext();

  if (!audioContext) {
    return;
  }

  playTone(audioContext, {
    frequency: 1500,
    endFrequency: 950,
    duration: 0.045,
    volume: 0.05,
  });
}

/** Dois tons graves e discretos para senha incorreta. */
export function playError() {
  const audioContext = getContext();

  if (!audioContext) {
    return;
  }

  playTone(audioContext, {
    frequency: 320,
    endFrequency: 260,
    duration: 0.09,
    volume: 0.05,
    type: 'triangle',
  });

  playTone(audioContext, {
    frequency: 250,
    endFrequency: 200,
    duration: 0.12,
    volume: 0.05,
    type: 'triangle',
    delay: 0.11,
  });
}
