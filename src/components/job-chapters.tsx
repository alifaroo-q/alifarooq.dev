import { Arrow, Cue } from "@/components/cue";
import { Figures } from "@/components/figures";

export type Stamp = "in-production" | "in-development" | "handed-over";

const STAMP: Record<Stamp, { label: string; dot: string }> = {
  "in-production": { label: "In production", dot: "bg-sea" },
  "in-development": { label: "In development", dot: "bg-saffron" },
  "handed-over": { label: "Handed over", dot: "border-2 border-ink" },
};

export type Job = {
  id: string;
  client: string;
  what: string;
  years: string;
  stamp: Stamp;
  role: string;
  /** What the work did, printed first under the name. */
  result: string;
  about: string;
  built: string | readonly string[];
  stack: string;
  /** The client's own words about this job, unedited, credited by client. */
  quote?: string;
};

/**
 * A flagship job also carries its system. `row` draws it across the chapter
 * under the text; `column` stands it beside the text, so two flagships never
 * share one shape.
 */
export type Flagship = Job & {
  flow: readonly { tool: string; step: string }[];
  diagram: "row" | "column";
};

export type SmallJob = {
  id: string;
  name: string;
  kind: string;
  years: string;
  line: string;
  href?: string;
};

const LABEL = "font-mono text-foreground-label text-xs";

function Meta({ job }: { job: Job }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${LABEL}`}>
      {job.years}
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`inline-block size-2 rounded-full ${STAMP[job.stamp].dot}`}
        />
        {STAMP[job.stamp].label}
      </span>
    </p>
  );
}

function Result({ text, className }: { text: string; className: string }) {
  return (
    <p className={className}>
      <span className={`mr-2 not-italic ${LABEL}`}>Result</span>
      <Figures text={text} />
    </p>
  );
}

function Quote({ job, className }: { job: Job; className: string }) {
  return job.quote ? (
    <figure className={`border-ink border-t-2 pt-3 ${className}`}>
      <blockquote className="leading-snug">“{job.quote}”</blockquote>
      <figcaption className={`mt-2 ${LABEL}`}>{job.client}</figcaption>
    </figure>
  ) : null;
}

function Built({ built }: { built: Job["built"] }) {
  return typeof built === "string" ? (
    built
  ) : (
    <ul className="list-disc space-y-1 pl-5">
      {built.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * The system as a row of paper steps joined by arrows. The list is its own
 * text equivalent. `data-diagram-node` and `data-diagram-path` are the hooks
 * for a draw-on in the motion runtime; nothing here animates.
 */
const FLOW = {
  row: {
    list: "lg:col-span-2 lg:row-start-2 lg:flex-row lg:items-stretch",
    item: "lg:flex-1 lg:flex-row lg:items-stretch",
    arrow: "lg:my-0 lg:h-6 lg:w-10 lg:rotate-0 lg:self-center",
    node: "lg:flex-col lg:items-start lg:py-3",
  },
  column: {
    list: "lg:col-start-2 lg:row-span-2 lg:row-start-1",
    item: "",
    arrow: "",
    node: "",
  },
} as const;

function Flow({ job }: { job: Flagship }) {
  const shape = FLOW[job.diagram];
  return (
    <ol
      aria-label={`${job.what}, step by step`}
      className={`flex flex-col items-center ${shape.list}`}
      data-diagram
    >
      {job.flow.map((s, i) => (
        <li
          className={`flex w-full flex-col items-center ${shape.item}`}
          key={s.step}
        >
          {i > 0 ? (
            <svg
              aria-hidden="true"
              className={`my-1.5 h-5 w-8 shrink-0 rotate-90 ${shape.arrow}`}
              fill="none"
              focusable="false"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 40 24"
            >
              <path
                d="M3 12H36M29 5l7 7-7 7"
                data-diagram-path
                pathLength={1}
              />
            </svg>
          ) : null}
          <div
            className={`paper flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2 ${shape.node}`}
            data-diagram-node
          >
            <span className={LABEL}>{s.tool}</span>
            <span className="font-semibold leading-snug">{s.step}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function FlagshipChapter({ job }: { job: Flagship }) {
  const column = job.diagram === "column";
  return (
    <li
      className="grid items-start gap-6 md:gap-8 lg:grid-cols-[1fr_1.1fr]"
      id={job.id}
    >
      <div>
        <Meta job={job} />
        <h3 className="mt-2 font-bold text-[clamp(2.125rem,4.4vw,3.25rem)] leading-none tracking-[-0.03em]">
          {job.what}
        </h3>
        <p className="mt-2 text-foreground-muted text-lg">{job.client}</p>
        <Result
          className="mt-5 max-w-md font-serif text-xl italic leading-snug"
          text={job.result}
        />
        <p className="mt-5 max-w-measure text-foreground-muted">{job.about}</p>
        <Quote className="mt-figure max-w-md text-lg" job={job} />
      </div>
      <Flow job={job} />
      <details
        className={`paper group p-6 text-foreground-muted md:p-8 ${column ? "lg:col-start-1 lg:row-start-2" : "lg:col-start-2 lg:row-start-1"}`}
        data-open-wide
      >
        <summary className="-my-3 flex min-h-11 cursor-pointer items-center font-semibold text-accent">
          Role, what I built and the stack
          <span className="sr-only"> for the {job.what}</span>
          <span className="ml-2 inline-flex group-open:rotate-180">
            <Arrow dir={90} />
          </span>
        </summary>
        <dl className="grid gap-4 pt-4 md:pt-0">
          <div>
            <dt className={LABEL}>Role</dt>
            <dd className="mt-1 text-foreground">{job.role}</dd>
          </div>
          <div>
            <dt className={LABEL}>What I built</dt>
            <dd className="mt-1">
              <Built built={job.built} />
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Stack</dt>
            <dd className="mt-1 font-mono text-sm">{job.stack}</dd>
          </div>
        </dl>
      </details>
    </li>
  );
}

function CompactCard({ job }: { job: Job }) {
  return (
    <li className="paper flex flex-col p-5" id={job.id}>
      <Meta job={job} />
      <h3 className="mt-2 font-bold font-display text-2xl leading-tight tracking-tight">
        {job.client}
      </h3>
      <p className="text-foreground-muted">{job.what}</p>
      <Result
        className="mt-3 font-serif text-lg italic leading-snug"
        text={job.result}
      />
      <p className="mt-3 font-mono text-foreground-muted text-xs leading-relaxed">
        {job.stack}
      </p>
      <Quote className="mt-4" job={job} />
      <details className="group mt-auto pt-2 text-foreground-muted text-sm">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-accent">
          Read more<span className="sr-only"> about {job.client}</span>
          <span className="ml-2 inline-flex group-open:rotate-180">
            <Arrow dir={90} />
          </span>
        </summary>
        {/* A link to this id opens the card (the browser reveals a closed
            <details> around a fragment target); the margin keeps the card's
            heading in view above it. */}
        <p
          className="scroll-mt-[24rem] text-foreground"
          id={`${job.id}-detail`}
        >
          {job.about}
        </p>
        <p className={`mt-3 ${LABEL}`}>{job.role}</p>
        <div className="mt-1">
          <Built built={job.built} />
        </div>
      </details>
    </li>
  );
}

/**
 * The flagship systems lead, each with its diagram. The rest of the client
 * work is a grid of cards whose detail opens on demand.
 */
export function JobChapters({
  flagships,
  jobs,
  smallJobs,
}: {
  flagships: readonly Flagship[];
  jobs: readonly Job[];
  smallJobs: readonly SmallJob[];
}) {
  return (
    <div className="wrap mt-group">
      <ol className="grid gap-16 md:gap-20">
        {flagships.map((job) => (
          <FlagshipChapter job={job} key={job.id} />
        ))}
      </ol>

      <h3 className="mt-section font-bold font-display text-xl tracking-tight">
        More client work
      </h3>
      <ul
        className="mt-figure grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        data-land
      >
        {jobs.map((job) => (
          <CompactCard job={job} key={job.id} />
        ))}
      </ul>

      <h3 className="mt-group font-bold font-display text-xl tracking-tight">
        Smaller jobs, and my own
      </h3>
      <ul className="mt-figure grid gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        {smallJobs.map((s) => (
          <li id={s.id} key={s.id}>
            <p className="font-bold">
              {s.href ? (
                <a className="hit ink-link" href={s.href}>
                  <Cue label={`${s.name} ↗`} />
                </a>
              ) : (
                s.name
              )}{" "}
              <span className="font-mono font-normal text-foreground-label text-xs">
                {s.kind} · {s.years}
              </span>
            </p>
            <p className="mt-1 text-foreground-muted text-sm">{s.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
