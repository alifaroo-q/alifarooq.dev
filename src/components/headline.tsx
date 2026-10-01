/**
 * The page's h1, with its entrance and its one accented phrase.
 *
 * Each word sits in its own clip so it can rise into view on its own beat (the
 * motion hooks are `data-headline` and `data-word`, read by `motion-runtime`).
 * The clip is given room at the bottom so an italic descender is not cut, and
 * the accent words are real `em` elements, so the emphasis is in the document
 * and not only on the screen.
 */
export function Headline({
  lead,
  accent,
  tail,
  className,
}: {
  lead: string;
  accent: string;
  tail: string;
  className?: string;
}) {
  const parts = [
    ...lead.split(" ").map((word) => ({ word, accent: false })),
    ...accent.split(" ").map((word) => ({ word, accent: true })),
    ...tail.split(" ").map((word) => ({ word, accent: false })),
  ].map((part, i) => ({ ...part, key: `${i}-${part.word}` }));
  return (
    <h1 className={className} data-headline>
      {parts.map((part, i) => (
        <span key={part.key}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <span className="inline-block" data-word>
              {part.accent ? (
                <em className="accent">{part.word}</em>
              ) : (
                part.word
              )}
            </span>
          </span>
          {i < parts.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
