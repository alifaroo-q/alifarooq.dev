import type { ReactNode } from "react";
import { SectionTracking } from "@/components/section-tracking";

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
 * `SectionTracking` owns the `<main>` element because the observer needs one
 * root over both columns: the sections it watches are in the prose and the
 * parts it dims are in the reference slot. It renders nothing of its own and
 * sets no colour — without JavaScript what is left is the complete machine,
 * undimmed, which #26 calls the real fallback rather than a degraded state.
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
        <p className="mt-group text-label text-foreground-label uppercase">
          {eyebrow}
        </p>
        {/* The title is the sanctioned exception to the measure: display, not
            prose. At 52px inside the 544px reading column it would break every
            ten characters, so its line count is set against its OWN size, in
            `ch`. It is the only element on the site allowed to do this. */}
        <h1 className="mt-tight max-w-[24ch] font-medium text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.1] tracking-tight">
          {heading}
        </h1>
        {/* The standfirst is prose, and it takes the measure. It carries the
            cap itself rather than through a wrapper because it has no prose
            siblings up here — a container around one paragraph states a rule
            nobody can break. */}
        <p className="mt-figure max-w-measure text-[clamp(1rem,1.8vw,1.125rem)] text-foreground-muted leading-[1.6]">
          {standfirst}
        </p>
      </div>

      <SectionTracking
        className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
        id="main"
      >
        {/* The prose. Its h2s are grouped into `<section>` elements by the
            content pipeline, which is what the observer watches and what
            carries the desktop minimum height.

            The extra room at the foot is the other half of that spacing rule.
            A section can only take the accent by owning the reading band, and
            the LAST section can only reach the band if there is page left
            below it. Measured at 1440x900 without it, this page scrolled 1089
            and the handover to the final section wanted 1175 — so a reader
            reached the end of the argument with the PREVIOUS section's parts
            still lit, which is worse than no tracking. 33svh puts the
            handover 154px inside the page. It is desktop-only, like the
            tracking it exists for, and it is where the shared contact footer
            will land. */}
        <div className="order-2 px-6 py-14 md:px-10 lg:order-1 lg:border-border lg:border-r lg:pb-[33svh]">
          {/* The measure lives HERE and nowhere below it. `mdx-content.tsx`
              types every element the prose can produce and sets a width on
              none of them, so a heading, a code block and a table cannot end
              on different right edges — which is what they did while each
              element carried its own cap and three of them had none.

              It is a separate element from the padded column on purpose: a
              max-width includes padding, so putting it on the column above
              would take the 80px of gutter out of the measure and leave a
              464px reading column. */}
          <div className="max-w-measure">{children}</div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-header">{reference}</div>
        </div>
      </SectionTracking>
    </>
  );
}
