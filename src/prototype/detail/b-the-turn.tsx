/**
 * PROTOTYPE — Detail take B: THE TURN.
 *
 * The claim: the diagram is not an illustration and it is not a payoff — it is
 * the HINGE. The page states the problem in prose, the diagram arrives as the
 * answer to it, and everything after the diagram is read in its light. The
 * artifact gets the whole viewport width and a numbered read-along beside it,
 * so it is impossible to scroll past as decoration.
 *
 * Against take A: the link said "see the state diagram", and here the reader
 * has to read two paragraphs first. This take argues that is fine, because the
 * diagram means nothing until you know what it is a diagram OF.
 *
 * The two page kinds DO NOT share a template. drizzle-tx gets its own shell:
 * a numbered seven-section spine with section 3 marked as the centre, because
 * #7 gave it a different reader and a shared shell would flatten that.
 */

import { GmailStateDiagram } from "../diagram";
import { caseStudy, ossPage } from "../detail-content";
import { BackLink, ContactFooter, DetailHeader } from "./chrome";

function Masthead({
  eyebrow,
  heading,
  backLabel,
  backHref,
}: {
  eyebrow: string;
  heading: string;
  backLabel: string;
  backHref: string;
}) {
  return (
    <>
      <BackLink label={backLabel} href={backHref} />
      <p className="mt-10 text-[0.6875rem] tracking-[0.18em] text-[var(--a-fg-3)] uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-[24ch] text-[clamp(1.875rem,5.5vw,3.25rem)] leading-[1.1] font-medium tracking-tight">
        {heading}
      </h1>
    </>
  );
}

function Prose({ body }: { body: string[] }) {
  return (
    <div className="max-w-[54ch] space-y-4 text-[0.9375rem] leading-[1.75] text-[var(--a-fg-2)]">
      {body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** Case study: problem in prose → diagram as the turn → decision and cost. */
function CaseStudyPage() {
  const [problem, ...rest] = caseStudy.sections;

  return (
    <div className="take-a min-h-dvh">
      <DetailHeader />
      <main className="px-6 pt-12 md:px-10 md:pt-16">
        <Masthead
          eyebrow={caseStudy.eyebrow}
          heading={caseStudy.decision}
          backLabel="Work"
          backHref="/#work"
        />

        <p className="mt-8 max-w-[54ch] text-[clamp(1rem,1.8vw,1.125rem)] leading-[1.6]">
          {caseStudy.constraint}
        </p>

        <section className="mt-14">
          <h2 className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
            {problem.heading}
          </h2>
          <div className="mt-5">
            <Prose body={problem.body} />
          </div>
        </section>
      </main>

      {/* The turn. Ruled off top and bottom, labelled, and given a read-along
          so the reader is told what to look at rather than left to guess. */}
      <figure className="mt-16 border-y border-[var(--a-line-strong)] bg-[var(--a-bg-raised)] py-12">
        <figcaption className="px-6 md:px-10">
          <span className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
            {caseStudy.artifactLabel}
          </span>
          <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.7]">
            {caseStudy.artifactCaption}
          </p>
        </figcaption>
        <div className="mt-10 overflow-x-auto px-6 md:px-10">
          <div className="min-w-[46rem]">
            <GmailStateDiagram className="w-full text-[var(--a-fg)]" />
          </div>
        </div>
      </figure>

      <div className="px-6 py-14 md:px-10">
        {rest.map((s) => (
          <section key={s.heading} className="mt-12 first:mt-0">
            <h2 className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
              {s.heading}
            </h2>
            <div className="mt-5">
              <Prose body={s.body} />
            </div>
          </section>
        ))}
      </div>

      <ContactFooter />
    </div>
  );
}

/** drizzle-tx: its own shell. Numbered spine, section 3 given the weight. */
function OssPage() {
  return (
    <div className="take-a min-h-dvh">
      <DetailHeader />
      <main className="px-6 pt-12 md:px-10 md:pt-16">
        <Masthead
          eyebrow="Open source"
          heading={ossPage.name}
          backLabel="Open source"
          backHref="/#open-source"
        />
        <p className="mt-8 max-w-[54ch] text-[clamp(1rem,1.8vw,1.125rem)] leading-[1.6]">
          {ossPage.standfirst}
        </p>
      </main>

      <div className="mt-16">
        {ossPage.sections.map((s, i) => (
          <section
            key={s.heading}
            className={`grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[var(--a-line)] px-6 py-10 md:grid-cols-[4rem_1fr] md:px-10 ${
              s.centre ? "bg-[var(--a-bg-raised)]" : ""
            }`}
          >
            <span
              aria-hidden
              className="pt-1 text-[0.6875rem] tracking-[0.1em] text-[var(--a-accent)] tabular-nums"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2
                className={`font-medium ${
                  s.centre
                    ? "text-[clamp(1.3125rem,3vw,1.75rem)] leading-tight"
                    : "text-[1.0625rem]"
                }`}
              >
                {s.heading}
              </h2>
              <div className="mt-4">
                <Prose body={s.body} />
              </div>
              {s.heading === "Try it" ? (
                <p className="mt-5 text-[0.9375rem] text-[var(--a-accent)]">
                  <a href="https://github.com/alifaroo-q" className="hover:underline">
                    github.com/alifaroo-q/drizzle-tx →
                  </a>
                </p>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <ContactFooter />
    </div>
  );
}

export function DetailB({ page }: { page: "work" | "oss" }) {
  return page === "oss" ? <OssPage /> : <CaseStudyPage />;
}
