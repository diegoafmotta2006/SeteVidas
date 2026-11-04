import { useEffect, useState } from 'react';
import { BentoGrid } from './components/BentoGrid/BentoGrid';
import { LoveLetter } from './components/LoveLetter/LoveLetter';
import { PasscodeScreen } from './components/PasscodeScreen/PasscodeScreen';
import { StartScreen } from './components/StartScreen/StartScreen';
import { TimeCounter } from './components/TimeCounter/TimeCounter';
import { VersionFooter } from './components/VersionFooter/VersionFooter';
import { mediaItems } from './data/media';
import {
  playBackgroundMusicOnce,
  primeBackgroundMusic,
} from './lib/backgroundMusic';
import { playCatTap } from './lib/soundEffects';
import './App.css';

/** start = gato no fundo branco; lock = senha; home = tela principal. */
type AppScreen = 'start' | 'lock' | 'home';

const THEME_COLOR: Record<AppScreen, string> = {
  start: '#ffffff',
  lock: '#ffffff',
  home: '#0b0b0d',
};

/**
 * Fluxo do app: tela de início → tela de senha → tela principal.
 * A senha é local e única ("777"), sem usuário, cadastro ou backend.
 */
export function App() {
  const [screen, setScreen] = useState<AppScreen>('start');

  // Ajusta a barra do sistema e o fundo para combinar com a tela atual.
  useEffect(() => {
    const isHome = screen === 'home';

    document.body.dataset.screen = screen;

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[screen]);

    document
      .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
      ?.setAttribute('content', isHome ? 'black-translucent' : 'default');

    document.documentElement.style.colorScheme = isHome ? 'dark' : 'light';
  }, [screen]);

  if (screen === 'start') {
    return (
      <StartScreen
        onStart={() => {
          // Som leve do gato + libera o áudio no celular.
          playCatTap();
          primeBackgroundMusic();
          setScreen('lock');
        }}
      />
    );
  }

  if (screen === 'lock') {
    return (
      <PasscodeScreen
        onUnlock={() => {
          // Toca a música uma única vez, no momento do desbloqueio.
          playBackgroundMusicOnce();
          setScreen('home');
        }}
      />
    );
  }

  return (
    <div className="app">
      <TimeCounter />

      <main className="app__content">
        <BentoGrid items={mediaItems} />
        <LoveLetter />
      </main>

      <VersionFooter />
    </div>
  );
}
