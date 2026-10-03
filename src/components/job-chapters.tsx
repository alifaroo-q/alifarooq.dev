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
  /** The italic line: the outcome when there is one, else the problem. */
  result: string;
  about: string;
  built: string | readonly string[];
  stack: string;
};

export type SmallJob = {
  id: string;
  name: string;
  kind: string;
  years: string;
  line: string;
};

const LABEL =
  "font-mono text-foreground-label text-xs uppercase tracking-[0.12em]";

/**
 * Each job is a short chapter: the client and its result on one side, the
 * paper card with the detail on the other. The sides swap per job on wide
 * screens so the list reads down the page as a story, not as a grid.
 */
export function JobChapters({
  jobs,
  smallJobs,
}: {
  jobs: readonly Job[];
  smallJobs: readonly SmallJob[];
}) {
  return (
    <div className="wrap mt-group">
      <ol className="grid gap-16">
        {jobs.map((job, i) => (
          <li
            className={`grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            id={job.id}
            key={job.id}
          >
            <div>
              <p className="font-mono text-foreground-label text-xs">
                {String(i + 1).padStart(2, "0")} · {job.years}
              </p>
              <h3 className="mt-2 font-bold text-[clamp(2.25rem,5vw,3.75rem)] leading-none tracking-[-0.03em]">
                {job.client}
              </h3>
              <p className="mt-2 text-foreground-muted text-lg">{job.what}</p>
              <p className="mt-6 max-w-md font-serif text-xl italic leading-snug">
                {job.result}
              </p>
            </div>
            <div className="paper p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <span className="font-mono text-foreground-label text-xs">
                  {job.role}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-foreground-label text-xs">
                  <span
                    aria-hidden="true"
                    className={`inline-block size-2 rounded-full ${STAMP[job.stamp].dot}`}
                  />
                  {STAMP[job.stamp].label}
                </span>
              </div>
              <p>{job.about}</p>
              <dl className="mt-figure grid gap-4 text-foreground-muted">
                <div>
                  <dt className={LABEL}>What I built</dt>
                  <dd className="mt-1">
                    {typeof job.built === "string" ? (
                      job.built
                    ) : (
                      <ul className="list-disc space-y-1 pl-5">
                        {job.built.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Stack</dt>
                  <dd className="mt-1 font-mono text-sm">{job.stack}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt-group font-bold font-display text-xl tracking-tight">
        Smaller jobs, and my own
      </h3>
      <ul className="mt-figure grid gap-x-10 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        {smallJobs.map((s) => (
          <li id={s.id} key={s.id}>
            <p className="font-bold">
              {s.name}{" "}
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
