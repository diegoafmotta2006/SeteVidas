import catImage from '../../assets/cat-splash.png';
import './StartScreen.css';

interface StartScreenProps {
  /** Chamado ao tocar no gato: abre a tela de senha. */
  onStart: () => void;
}

/**
 * Tela de abertura: fundo branco liso e apenas o gato preto no centro.
 * Sem texto, sem botões visíveis. A tela inteira é a área clicável.
 */
export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <button
        type="button"
        className="start-screen__cat-button"
        onClick={onStart}
        aria-label="Abrir o app"
      >
        <img
          className="start-screen__cat"
          src={catImage}
          alt=""
          width="914"
          height="885"
          draggable={false}
        />
      </button>
    </div>
  );
}
