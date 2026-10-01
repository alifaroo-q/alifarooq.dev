import { Cue } from "@/components/cue";
import { BRAND_MARKS } from "@/lib/brand-marks";

/**
 * The tools I reach for, as a row of marks, with a way into the stack page.
 *
 * It lives in About now. It is the only place the home page names a
 * technology, and `/stack` is still the only page that says what any of them
 * cost.
 *
 * The marks are `aria-hidden` and the names are real text beside them: a glyph
 * that repeats the word next to it is a word said twice to a screen reader.
 * `focusable="false"` is for the engines that still give an SVG inside a link a
 * tab stop.
 */
const LABEL_ID = "stack-strip-label";

export function StackStrip({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  /** Layout only, from the call site. */
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-bold text-xl tracking-tight" id={LABEL_ID}>
        What I reach for
      </h3>
      <ul
        aria-labelledby={LABEL_ID}
        className="mt-flow flex flex-wrap items-center gap-x-5 gap-y-3 text-foreground-muted"
      >
        {BRAND_MARKS.map((mark) => (
          <li className="flex items-center gap-2" key={mark.slug}>
            <svg
              aria-hidden="true"
              className="size-5 shrink-0 text-foreground"
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
      <p className="mt-flow font-semibold text-accent">
        <a href={href}>
          <Cue label={label} />
        </a>
      </p>
    </div>
  );
}
