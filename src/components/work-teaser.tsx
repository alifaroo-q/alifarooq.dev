import { Arrow, Cue } from "@/components/cue";
import { Meta } from "@/components/work-parts";
import { ACTION_CLASS } from "@/lib/site";
import { caseHref, caseSub, caseTitle, ENTRIES, FLAGSHIPS } from "@/lib/work";

/**
 * The home page's pointer at the work: the AI systems that lead it, and one
 * button to the rest. The detail lives on `/work` and the pages under it.
 */
export function WorkTeaser() {
  const rest = ENTRIES.length - FLAGSHIPS.length;
  return (
    <>
      <div className="wrap mt-group grid gap-8 md:grid-cols-2" data-land>
        {FLAGSHIPS.map((job) => (
          <a
            className="paper flex flex-col p-6"
            href={caseHref(job)}
            key={job.id}
          >
            <Meta job={job} />
            <span className="mt-2 font-bold font-display text-3xl leading-none tracking-tight">
              {caseTitle(job)}
            </span>
            <span className="mt-1 text-foreground-muted">{caseSub(job)}</span>
            <span className="mt-4 font-serif text-lg italic leading-snug">
              {job.result}
            </span>
            <span className="mt-4 font-semibold text-accent">
              Read the case study <Arrow className="inline" />
            </span>
          </a>
        ))}
      </div>
      <div className="wrap mt-figure">
        <a className={ACTION_CLASS} href="/work">
          <Cue label={`See all ${ENTRIES.length} projects →`} />
        </a>
        <p className="mt-tight text-foreground-muted text-sm">
          {rest} more, from client products to open source.
        </p>
      </div>
    </>
  );
}
