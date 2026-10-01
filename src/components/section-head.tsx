import type { ReactNode } from "react";

/**
 * A section's heading: plain bold words and one in italic serif, in coral.
 *
 * The accent is the one place the page changes voice, so it goes on the word
 * the heading turns on, and every heading has at most one. The number that
 * used to lead each section is gone; the hour the section sits in, printed on
 * the scenery below it, says the order now.
 */
export function SectionHead({
  id,
  lead,
  accent,
  tail,
  children,
}: {
  id: string;
  lead?: string;
  accent: string;
  tail?: string;
  /** The line under the heading. */
  children?: ReactNode;
}) {
  return (
    <div className="wrap">
      <h2
        className="max-w-[18ch] font-bold text-[clamp(2.125rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.03em] md:max-w-[20ch]"
        data-reveal
        id={id}
      >
        {lead ? `${lead} ` : null}
        <em className="accent">{accent}</em>
        {tail ? ` ${tail}` : null}
      </h2>
      {children ? (
        <p
          className="mt-flow max-w-measure text-[clamp(1.0625rem,1.6vw,1.1875rem)] text-foreground-muted"
          data-reveal
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}
