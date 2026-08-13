/**
 * A cue line — the invitation, and the arrow that ends it.
 *
 * Every one of these strings ends the same way: "See the state diagram →",
 * "Read how it holds →", "The whole list, and what each one cost →". The
 * arrow is the only part of the line that pictures what the click does, so it
 * is the part that moves on hover — and a text node cannot be moved in halves.
 * This splits it, and nothing else.
 *
 * The arrow comes out of the accessible name. A screen reader announcing
 * "right arrow" after the invitation adds a word to a link that was already a
 * complete sentence about where it goes.
 *
 * The pattern is `artifact-figure.tsx`'s, deliberately: that file strips the
 * same arrow off the same strings to caption the drawing. Two readings of one
 * convention, and they have to agree about what the convention is.
 */
const TRAILING_ARROW = /\s*([→>]+)\s*$/u;

export function Cue({ label }: { label: string }) {
  const arrow = TRAILING_ARROW.exec(label);

  // A label written without one is a label, not a mistake. It prints as it is.
  if (!arrow) {
    return label;
  }

  return (
    <>
      {label.slice(0, arrow.index)}{" "}
      <span aria-hidden="true" className="cue-arrow">
        {arrow[1]}
      </span>
    </>
  );
}
