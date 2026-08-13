import { Cue } from "@/components/cue";
import { BRAND_MARKS } from "@/lib/brand-marks";

/**
 * The stack strip, at the foot of the fold.
 *
 * IT MOVED HERE FROM ABOUT, and the comment it replaces argued the other way:
 * "putting a line of nouns above the work would let it outrank three
 * arguments". That was a real objection and it is overruled rather than
 * answered — the space between the actions and the way-out line was about
 * 600px of nothing on a 1080p screen, and a fold that holds the screen has to
 * earn the screen it holds.
 *
 * What keeps the old objection from coming true is weight, which is the same
 * device the open-source block uses. The strip is set at the label size and
 * the muted colour, it is the quietest block in the fold, and it sits BELOW
 * the actions rather than between them and the claim. Nothing here flips the
 * ground — that inversion is the site's signal for "a piece of work you can
 * read", and a reference list is not one.
 *
 * It is not a duplicate. The About line is gone; this is the only place the
 * home page names a technology, and `/stack` is still the only page that says
 * what any of them cost.
 *
 * The marks are `aria-hidden` and the names are real text beside them. A glyph
 * that repeats the word next to it is a word said twice to a screen reader,
 * and `title` on the path would do exactly that. `focusable="false"` is for
 * the old IE-era SVG tab stop that some engines still honour inside links.
 */
/** One id, so the label and the list cannot drift apart. */
const LABEL_ID = "stack-strip-label";

export function StackStrip({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  /** Layout only, from the call site. The strip sets no spacing of its own
      around itself, the way every other block here leaves its outer margin to
      whatever is placing it. */
  className?: string;
}) {
  return (
    <div className={className}>
      {/* A `p`, and deliberately NOT an `h2`. `SectionHead` spends h2 on the
          four things the page is made of — Work, Open source, About, Contact —
          and a fifth in the fold would put a footnote in the outline as their
          peer. This is the sector line's pattern from the work rows: a label
          in the label register above the thing it labels.

          The association is stated instead. `aria-labelledby` on the list
          gives "Stack, list, 6 items" without claiming a section. */}
      <p className="text-foreground-label text-label uppercase" id={LABEL_ID}>
        Stack
      </p>

      {/* A LIST, because it is one. Six items with no order to them reads to a
          screen reader as "list, six items" rather than as a run-on line, and
          the count is the part a reader scanning by ear wants first.

          `gap-x-figure` and not `gap-x-group`: the pairs are one row of one
          kind of thing, and at the group step they stop reading as a row and
          start reading as six separate blocks that happen to share a line. */}
      <ul
        aria-labelledby={LABEL_ID}
        className="mt-tight flex flex-wrap items-center gap-x-figure gap-y-tight text-foreground-muted text-sm"
      >
        {BRAND_MARKS.map((mark) => (
          <li className="flex items-center gap-2" key={mark.slug}>
            {/* `size-4` against a 15px label, and the box is square so the
                glyph never decides the row's height. `fill="currentColor"` is
                the whole reason these marks were chosen: the strip inherits
                the muted colour here and would inherit an inverted one inside
                a flipped row, with no value written at this call site. */}
            <svg
              aria-hidden="true"
              className="size-4 shrink-0"
              fill="currentColor"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={mark.d} />
            </svg>
            {mark.label}
          </li>
        ))}
      </ul>

      {/* The route to `/stack`, and the only one on the site. The label names
          what is behind the click the way every other cue here does, and it
          spends a number rather than an adjective: twelve is what the list
          actually holds, so "the whole list" can stop being a promise the
          reader has to take on trust. */}
      <p className="mt-flow">
        <a className="text-accent text-sm" href={href}>
          <Cue label={label} />
        </a>
      </p>
    </div>
  );
}
