import { Arrow } from "@/components/cue";
import {
  Built,
  type Flagship,
  Flow,
  type Job,
  LABEL,
  Meta,
  Quote,
} from "@/components/work-parts";
import { caseSub, caseTitle } from "@/lib/work";

const isFlagship = (job: Job): job is Flagship => "flow" in job;

/**
 * One project's page. A night-sky card leads with the name and the result, and
 * three paper cards follow it: the problem, what I built, the stack. A flagship
 * adds its system diagram under them.
 */
export function WorkCase({ job }: { job: Job }) {
  return (
    <article>
      <div className="hour hour-night rounded-[var(--radius)] border-2 border-ink p-8 shadow-[6px_6px_0_0_var(--ink)] md:p-14">
        <Meta job={job} />
        <h1 className="mt-4 font-bold text-[clamp(3rem,9vw,7rem)] leading-[0.95] tracking-[-0.04em]">
          {caseTitle(job)}
        </h1>
        <p className="mt-2 text-foreground-muted text-xl">
          {caseSub(job)} · {job.role}
        </p>
        <p className="mt-10 max-w-3xl font-serif text-[clamp(1.5rem,3.4vw,2.5rem)] text-saffron italic leading-snug">
          {job.result}
        </p>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <section className="paper p-6">
          <h2 className={LABEL}>The problem</h2>
          <p className="mt-3 text-foreground-muted">{job.about}</p>
        </section>
        <section className="paper p-6">
          <h2 className={LABEL}>What I built</h2>
          <div className="mt-3 text-foreground-muted">
            <Built built={job.built} />
          </div>
        </section>
        <section className="paper p-6">
          <h2 className={LABEL}>Under the hood</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {job.stack.split(", ").map((tool) => (
              <li className="chip px-3 py-1.5 text-sm" key={tool}>
                {tool}
              </li>
            ))}
          </ul>
        </section>
      </div>
      {isFlagship(job) ? (
        <div className="mt-12">
          <h2 className="font-bold text-2xl tracking-tight">How it works</h2>
          <div className="mt-5">
            <Flow job={job} />
          </div>
        </div>
      ) : null}
      {job.quote ? (
        <Quote className="mt-12 max-w-3xl text-xl" job={job} />
      ) : null}
    </article>
  );
}

export function BackLink() {
  return (
    <a className="hit ink-link font-semibold" href="/work">
      <Arrow className="inline rotate-180" /> All work
    </a>
  );
}
