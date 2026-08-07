/**
 * PROTOTYPE — Detail take C: STICKY REFERENCE.
 *
 * The claim: a state diagram is a thing you look BACK at. If it appears once
 * and scrolls away, every later sentence that names a state ("moves the
 * connection to invalid") asks the reader to remember a picture instead of
 * seeing it. So the diagram pins to the viewport beside the prose and stays
 * there for the whole page.
 *
 * This is the take that treats the artifact as evidence under examination
 * rather than as a reveal.
 *
 * What it costs, deliberately shown rather than hidden: the drizzle-tx page
 * has NO artifact — #9 gave `openSource` no diagram — so the sticky column has
 * nothing to hold. It gets a sticky section index instead, which is a
 * different component doing a different job in the same slot. If that reads as
 * a fudge, this take has answered #17's template question in the negative.
 *
 * Second cost, also deliberate: the sticky column collapses entirely under
 * ~1024px, so the phone reader gets take A's layout. A direction that only
 * exists on a desktop is a direction with a hole in it.
 */

import { GmailStateDiagram } from "../diagram";
import { caseStudy, ossPage } from "../detail-content";
import { BackLink, ContactFooter, DetailHeader } from "./chrome";

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

function Sections({ sections }: { sections: { heading: string; body: string[] }[] }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.heading} id={s.heading.toLowerCase().replace(/\W+/g, "-")} className="mt-12 first:mt-0">
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
          <Sections sections={isWork ? caseStudy.sections : ossPage.sections} />
        </div>

        {/* reference column — the artifact for a case study, a section index
            for drizzle-tx. Same slot, different jobs. That is the finding. */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-[3.75rem]">
            {isWork ? (
              <figure className="border-b border-[var(--a-line)] px-6 py-10 md:px-10 lg:border-b-0">
                <span className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
                  {caseStudy.artifactLabel}
                </span>
                <div className="mt-6 overflow-x-auto">
                  <div className="min-w-[38rem]">
                    <GmailStateDiagram className="w-full text-[var(--a-fg)]" />
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
                <ol className="mt-6 space-y-2.5 text-[0.875rem] tabular-nums">
                  {ossPage.sections.map((s, i) => (
                    <li key={s.heading} className="flex gap-4">
                      <span aria-hidden className="text-[var(--a-fg-3)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${s.heading.toLowerCase().replace(/\W+/g, "-")}`}
                        className={`hover:text-[var(--a-accent)] ${
                          s.centre ? "text-[var(--a-fg)]" : "text-[var(--a-fg-2)]"
                        }`}
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        </div>
      </main>

      {/* compact, because the sticky column already spent the vertical budget */}
      <ContactFooter compact />
    </div>
  );
}
