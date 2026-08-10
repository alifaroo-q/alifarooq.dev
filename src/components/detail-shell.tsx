import type { ReactNode } from "react";

/**
 * The detail-page shell — one template, two fills (#17).
 *
 * The reference column is a fixed slot the LAYOUT owns, high on the page and
 * identical on every detail page, rather than something each page places for
 * itself. The home page's click affordance names the artifact ("See the state
 * diagram →"), so a reader who clicked should not have to hunt for it, and
 * three identical placements read as a set rather than three one-offs.
 *
 * It lives in a component rather than in a `layout.tsx` because the slot and
 * the prose share one grid: a route layout would have to render the column
 * outside the flow that positions it. `/open-source/<slug>` fills the same
 * slot with a section index (#29) — the column's job is always "where am I in
 * this argument", and only the fill changes.
 *
 * There is no tracking here. #26 adds the observer that dims the parts the
 * current section is not talking about; what this renders is the state that
 * ticket calls the real fallback — the complete machine, undimmed, for a
 * reader with no JavaScript or nothing scrolled yet.
 */
export function DetailShell({
  eyebrow,
  heading,
  standfirst,
  backLabel,
  backHref,
  reference,
  children,
}: {
  eyebrow: string;
  heading: string;
  standfirst: string;
  backLabel: string;
  backHref: string;
  reference: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <div className="border-border border-b px-6 pt-12 pb-14 md:px-10 md:pt-16">
        {/* Back to the section the reader came from, not the top of the page. */}
        <a
          className="group inline-block text-foreground-muted text-sm hover:text-accent"
          href={backHref}
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">
            ←
          </span>{" "}
          {backLabel}
        </a>
        <p className="mt-10 text-label text-foreground-label uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-[24ch] font-medium text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.1] tracking-tight">
          {heading}
        </h1>
        <p className="mt-6 max-w-measure text-[clamp(1rem,1.8vw,1.125rem)] text-foreground-muted leading-[1.6]">
          {standfirst}
        </p>
      </div>

      <main
        className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
        id="main"
      >
        {/* The prose. #17 also asks that each section carry a minimum height
            on desktop, so that exactly one of them owns the reading band — a
            short section beside a long one is what makes a tracked column
            flicker. That rule needs the sections to be elements, which they
            are not yet: the body is free-form MDX delimited by h2s. It lands
            with the tracking in #26. */}
        <div className="order-2 px-6 py-14 md:px-10 lg:order-1 lg:border-border lg:border-r">
          {children}
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-header">{reference}</div>
        </div>
      </main>
    </>
  );
}
