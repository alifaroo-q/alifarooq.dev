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

/** A flagship job also carries its system, drawn as a row or a column of steps. */
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

export const LABEL = "font-mono text-foreground-label text-xs";

export function Meta({ job }: { job: Job }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${LABEL}`}>
      {job.years}
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

export function Quote({ job, className }: { job: Job; className: string }) {
  return job.quote ? (
    <figure className={`border-ink border-t-2 pt-3 ${className}`}>
      <blockquote className="leading-snug">“{job.quote}”</blockquote>
      <figcaption className={`mt-2 ${LABEL}`}>{job.client}</figcaption>
    </figure>
  ) : null;
}

export function Built({ built }: { built: Job["built"] }) {
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
    list: "lg:flex-row lg:items-stretch",
    item: "lg:flex-1 lg:flex-row lg:items-stretch",
    arrow: "lg:my-0 lg:h-6 lg:w-10 lg:rotate-0 lg:self-center",
    node: "lg:flex-col lg:items-start lg:py-3",
  },
  column: {
    list: "",
    item: "",
    arrow: "",
    node: "",
  },
} as const;

export function Flow({ job }: { job: Flagship }) {
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
            className={`paper flat flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2 ${shape.node}`}
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
