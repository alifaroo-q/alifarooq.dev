/**
 * PROTOTYPE — Detail take A: ARTIFACT FIRST.
 *
 * The claim: #8 withheld the diagram and made the click affordance name it
 * ("See the state diagram →"). A link that names a thing should land on that
 * thing. So the diagram is the first element under the heading, full-bleed,
 * above any prose. The promise is paid before the reader has to trust anything.
 *
 * The risk this take is exposing: a diagram with no prose in front of it has
 * to be self-explanatory, and it makes the page open on its most technical
 * element for a recruiter who clicked out of curiosity.
 *
 * The two page kinds SHARE a template here — same eyebrow/heading/lede stack,
 * same single column, with the artifact slot simply empty on drizzle-tx. That
 * is the cheapest answer to #17's template question, and this take exists to
 * show what it costs.
 */

import { GmailStateDiagram } from "../diagram";
import { caseStudy, ossPage } from "../detail-content";
import { BackLink, ContactFooter, DetailHeader } from "./chrome";

function Shell({
  eyebrow,
  heading,
  standfirst,
  backLabel,
  backHref,
  artifact,
  sections,
}: {
  eyebrow: string;
  heading: string;
  standfirst: string;
  backLabel: string;
  backHref: string;
  artifact?: React.ReactNode;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="take-a min-h-dvh">
      <DetailHeader />
      <main className="px-6 pt-12 md:px-10 md:pt-16">
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
      </main>

      {/* The artifact, immediately. Full-bleed, hairline top and bottom. */}
      {artifact ? (
        <figure className="mt-12 border-y border-[var(--a-line)] py-10">
          <div className="overflow-x-auto px-6 md:px-10">
            <div className="min-w-[44rem]">{artifact}</div>
          </div>
          <figcaption className="mt-6 max-w-[54ch] px-6 text-[0.8125rem] leading-[1.7] text-[var(--a-fg-3)] md:px-10">
            {caseStudy.artifactCaption}
          </figcaption>
        </figure>
      ) : null}

      <div className="px-6 py-14 md:px-10">
        {sections.map((s) => (
          <section key={s.heading} className="mt-12 first:mt-0">
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
      </div>

      <ContactFooter />
    </div>
  );
}

export function DetailA({ page }: { page: "work" | "oss" }) {
  if (page === "oss") {
    return (
      <Shell
        eyebrow="Open source"
        heading={ossPage.name}
        standfirst={ossPage.standfirst}
        backLabel="Open source"
        backHref="/#open-source"
        sections={ossPage.sections}
      />
    );
  }
  return (
    <Shell
      eyebrow={caseStudy.eyebrow}
      heading={caseStudy.decision}
      standfirst={caseStudy.constraint}
      backLabel="Work"
      backHref="/#work"
      artifact={<GmailStateDiagram className="w-full text-[var(--a-fg)]" />}
      sections={caseStudy.sections}
    />
  );
}
