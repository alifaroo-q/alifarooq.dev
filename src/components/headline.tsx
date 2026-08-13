/**
 * The name at the top of the home page, split into words the runtime can move
 * one at a time.
 *
 * The split is in the MARKUP, not in a script that rewrites the heading after
 * it loads: a reader without JavaScript gets the same `<h1>` with the same
 * words, and there is no frame where the name is one shape and then another.
 *
 * Two boxes per word, and the outer one is doing the work. The clip is what
 * makes a word rise OUT of the line rather than over the line above it, and a
 * transform cannot clip itself.
 *
 * The space between words is a real space, never a margin. A margin here reads
 * as "AliFarooq" to a screen reader and to anyone copying the name out of the
 * page.
 */
export function Headline({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const words = children.split(" ");

  return (
    // `data-headline` is the hook `motion-runtime.tsx` reads. It carries no
    // duration and no curve, like every other hook on the site.
    <h1 className={className} data-headline>
      {words.map((word, i) => (
        <span key={word}>
          <span className="inline-block overflow-hidden align-bottom">
            <span className="inline-block" data-word>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
