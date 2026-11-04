import { letterParagraphs } from '../../data/letter';
import './LoveLetter.css';

/**
 * Carta que aparece no final da galeria, depois de todas as fotos.
 * O conteúdo vem de `src/data/letter.ts`, onde novas linhas podem ser
 * acrescentadas enquanto o projeto continuar.
 */
export function LoveLetter() {
  if (letterParagraphs.length === 0) {
    return null;
  }

  return (
    <section className="love-letter" aria-label="Mensagem">
      <article className="love-letter__card">
        {letterParagraphs.map((paragraph, index) => (
          <p
            key={`carta-${index}`}
            className={
              index === 0
                ? 'love-letter__paragraph love-letter__paragraph--opening'
                : 'love-letter__paragraph'
            }
          >
            {paragraph}
          </p>
        ))}
      </article>
    </section>
  );
}
