import { BentoGrid } from './components/BentoGrid/BentoGrid';
import { TimeCounter } from './components/TimeCounter/TimeCounter';
import { VersionFooter } from './components/VersionFooter/VersionFooter';
import { mediaItems } from './data/media';
import './App.css';

/**
 * Tela inicial (única tela desta versão).
 * Ordem: contador no topo, grid de mídias no meio, versão no rodapé.
 */
export function App() {
  return (
    <div className="app">
      <TimeCounter />

      <main className="app__content">
        <BentoGrid items={mediaItems} />
      </main>

      <VersionFooter />
    </div>
  );
}
