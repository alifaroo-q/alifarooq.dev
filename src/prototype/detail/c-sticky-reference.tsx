"use client";

/**
 * PROTOTYPE — Detail take C: STICKY REFERENCE  (chosen direction, refined)
 *
 * The claim: a state diagram is a thing you look BACK at. If it appears once
 * and scrolls away, every later sentence that names a state ("moves the
 * connection to invalid") asks the reader to remember a picture instead of
 * seeing it. So the reference pins to the viewport beside the prose and stays
 * there for the whole page.
 *
 * REFINEMENT PASS 1 — THE REFERENCE TRACKS THE SECTION.
 *
 * Pinned-but-inert was the weak version: the diagram was in view, but working
 * out which part of it the current paragraph was about was still the reader's
 * job. So the prose now drives it. The problem section lights the two edges
 * that break silently; the decision section lights the renewal loop that
 * catches them; the cost section lights the one edge that needs a human.
 *
 * This is what makes the take worth choosing rather than merely tidy — the
 * diagram stops being an illustration of the page and becomes the page's
 * second column of argument.
 *
 * It also repairs C's worst seam. The drizzle-tx page has no artifact (#9 gave
 * `openSource` no diagram), and in pass 1 the pinned slot held a section index
 * doing an unrelated job. Under tracking they are the same job — the column
 * always answers "where am I in this argument" — so one layout now covers both
 * page kinds honestly, and #17's template question resolves to ONE template
 * with two fills rather than two templates.
 *
 * Two costs kept in view rather than designed away:
 *   - the column collapses under 1024px, so the phone reader gets the diagram
 *     once, up top, undimmed. The tracking is desktop-only by construction.
 *   - the real SVG assets must be authored with per-part ids (see diagram.tsx).
 */

import { useMemo } from "react";

import { caseStudy, ossPage } from "../detail-content";
import { GmailStateDiagram } from "../diagram";
import { BackLink, ContactFooter, DetailHeader } from "./chrome";
import { StickyReference, useActiveSection } from "./sticky-ref";

const slug = (s: string) => s.toLowerCase().replace(/\W+/g, "-");

function Masthead({
  eyebrow,
  heading,
  standfirst,
  backLabel,
  backHref,
}: {
  eyebrow: string;
  heading: string;
  standfirst: string;
  backLabel: string;
  backHref: string;
}) {
  return (
    <div className="border-b border-[var(--a-line)] px-6 pt-12 pb-14 md:px-10 md:pt-16">
      <BackLink label={backLabel} href={backHref} />
      <p className="mt-10 text-[0.6875rem] tracking-[0.18em] text-[var(--a-fg-3)] uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-[24ch] text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.1] font-medium tracking-tight">
        {heading}
      </h1>
      <p className="mt-6 max-w-[54ch] text-[clamp(1rem,1.8vw,1.125rem)] leading-[1.6] text-[var(--a-fg-2)]">
        {standfirst}
      </p>
    </div>
  );
}

/**
 * Sections are spaced so exactly one of them owns the reading band at a time.
 * A short section next to a long one is what makes a tracked column flicker,
 * so the minimum height is stated rather than left to the copy.
 */
function Sections({
  sections,
  active,
}: {
  sections: { key: string; heading: string; body: string[] }[];
  active: string | null;
}) {
  return (
    <>
      {sections.map((s) => (
        <section
          key={s.key}
          id={`section-${s.key}`}
          className="mt-16 first:mt-0 lg:min-h-[60vh]"
          aria-current={active === s.key ? "true" : undefined}
        >
          <h2 className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
            {s.heading}
          </h2>
          <div className="mt-5 max-w-[54ch] space-y-4 text-[0.9375rem] leading-[1.75] text-[var(--a-fg-2)]">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function DetailC({ page }: { page: "work" | "oss" }) {
  const isWork = page === "work";

  const sections = useMemo(
    () =>
      isWork
        ? caseStudy.sections
        : ossPage.sections.map((s) => ({ ...s, key: slug(s.heading) })),
    [isWork],
  );

  const active = useActiveSection(useMemo(() => sections.map((s) => s.key), [sections]));

  return (
    <div className="take-a min-h-dvh">
      <DetailHeader />

      <Masthead
        eyebrow={isWork ? caseStudy.eyebrow : "Open source"}
        heading={isWork ? caseStudy.decision : ossPage.name}
        standfirst={isWork ? caseStudy.constraint : ossPage.standfirst}
        backLabel={isWork ? "Work" : "Open source"}
        backHref={isWork ? "/#work" : "/#open-source"}
      />

      <main className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* prose column */}
        <div className="order-2 px-6 py-14 md:px-10 lg:order-1 lg:border-r lg:border-[var(--a-line)]">
          <Sections sections={sections} active={active} />
        </div>

        {/* the tracked reference. One slot, one job — "where am I in this
            argument" — filled by the diagram where there is one and by the
            section index where there is not. */}
        <div className="order-1 lg:order-2">
          <StickyReference active={active}>
            {isWork ? (
              <figure className="border-b border-[var(--a-line)] px-6 py-10 md:px-10 lg:border-b-0">
                <span className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
                  {caseStudy.artifactLabel}
                </span>
                <div className="mt-6 overflow-x-auto">
                  <div className="min-w-[38rem]">
                    <GmailStateDiagram className="w-full text-[var(--a-fg)]" focus={active} />
                  </div>
                </div>
                <figcaption className="mt-6 max-w-[46ch] text-[0.8125rem] leading-[1.7] text-[var(--a-fg-3)]">
                  {caseStudy.artifactCaption}
                </figcaption>
              </figure>
            ) : (
              <nav
                aria-label="On this page"
                className="border-b border-[var(--a-line)] px-6 py-10 md:px-10 lg:border-b-0"
              >
                <span className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
                  On this page
                </span>
                <ol className="mt-6 space-y-1 text-[0.875rem] tabular-nums">
                  {sections.map((s, i) => (
                    <li
                      key={s.key}
                      data-idx=""
                      data-active={active === s.key ? "true" : "false"}
                      className="flex gap-4 py-1.5 pl-4 text-[var(--a-fg-2)]"
                    >
                      <span aria-hidden className="text-[var(--a-fg-3)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a href={`#section-${s.key}`} className="hover:text-[var(--a-accent)]">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </StickyReference>
        </div>
      </main>

      {/* compact, because the sticky column already spent the vertical budget */}
      <ContactFooter compact />
    </div>
  );
}
