import { APP_VERSION } from '../../config/app';
import './VersionFooter.css';

/** Versão do app, fixa no canto inferior esquerdo, acima da safe area. */
export function VersionFooter() {
  return <footer className="version-footer">{APP_VERSION}</footer>;
}
