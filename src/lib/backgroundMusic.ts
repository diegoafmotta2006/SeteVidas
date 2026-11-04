/**
 * Música de fundo: toca uma única vez ao desbloquear o app.
 *
 * O volume é baixo de propósito (música de fundo). Quando um vídeo
 * é aberto, o volume é reduzido para não competir com o áudio dele.
 */

const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/musica.m4a`;

/** Volume normal da música de fundo. */
const MUSIC_VOLUME = 0.03;

/** Volume enquanto um vídeo está aberto. */
const DUCKED_VOLUME = 0.01;

let audio: HTMLAudioElement | null = null;
let isDucked = false;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(MUSIC_SRC);
    audio.loop = false;
    audio.preload = 'auto';
    audio.volume = MUSIC_VOLUME;
  }

  return audio;
}

function applyVolume() {
  if (audio) {
    audio.volume = isDucked ? DUCKED_VOLUME : MUSIC_VOLUME;
  }
}

/**
 * "Prepara" o áudio num toque do usuário (abertura do app).
 *
 * No iPhone, o navegador só libera som depois de um toque; tocar em
 * volume zero aqui garante que o `play()` do desbloqueio funcione.
 */
export function primeBackgroundMusic() {
  const element = getAudio();
  const volume = element.volume;

  element.volume = 0;
  void element
    .play()
    .then(() => {
      element.pause();
      element.currentTime = 0;
      element.volume = volume;
    })
    .catch(() => {
      element.volume = volume;
    });
}

/** Toca a música do início, uma única vez. */
export function playBackgroundMusicOnce() {
  const element = getAudio();
  applyVolume();
  element.currentTime = 0;

  // Alguns navegadores podem bloquear o áudio; nesse caso o app segue
  // funcionando normalmente, apenas sem música.
  void element.play().catch(() => {});
}

/** Abaixa a música enquanto um vídeo com áudio está aberto. */
export function duckBackgroundMusic() {
  isDucked = true;
  applyVolume();
}

/** Volta a música ao volume normal. */
export function unduckBackgroundMusic() {
  isDucked = false;
  applyVolume();
}
