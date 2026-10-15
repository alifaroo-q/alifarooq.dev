import Image from "next/image";
import { Cue } from "@/components/cue";
import { Headline } from "@/components/headline";
import { HourCue } from "@/components/hour-cue";
import { Portrait } from "@/components/portrait";
import { Clouds, Shore } from "@/components/scenery";
import {
  ACTION_CLASS,
  GITHUB_URL,
  PERSON_NAME,
  PERSON_ROLE,
  PORTRAIT_SRC,
} from "@/lib/site";

export type FoldContent = {
  person: {
    name: string;
    location: string;
    availability: string;
    hours: string;
  };
  fold: {
    headline: { lead: string; accent: string; tail: string };
    sentence: string;
    caption: string;
    cue: { time: string; label: string };
  };
  /** One to three: the strip has three columns and no room for a fourth. */
  proof:
    | readonly [Proof]
    | readonly [Proof, Proof]
    | readonly [Proof, Proof, Proof];
};

type Proof = { system: string; metric: string; href: string };

/** The dawn caption: under the arch portrait on desktop, under the status row on a phone. */
function Caption({
  className,
  caption,
}: {
  className: string;
  caption: string;
}) {
  return (
    <p className={`text-foreground-muted ${className}`}>
      <span className="font-mono text-foreground-label text-xs">06:10</span>{" "}
      <em className="font-serif">{caption}</em>
    </p>
  );
}

/**
 * The fold. The headline makes the claim, the sentence under it gives one
 * result behind it, and the proof names the AI systems a reader can check.
 */
export function Fold({ person, fold, proof }: FoldContent) {
  return (
    <section
      aria-label="Introduction"
      className="hour hour-dawn [--scene-h:clamp(8rem,17vw,24rem)]"
      data-hour="dawn"
    >
      <Clouds />
      <div className="wrap grid min-h-svh grid-cols-[minmax(0,1fr)] content-center gap-12 pt-[calc(var(--spacing-header)+1rem)] pb-[calc(var(--scene-h)+4.5rem)] md:pb-[calc(var(--scene-h)*0.2+1rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-20">
        <div className="hidden lg:block" data-enter>
          <Portrait />
          <Caption caption={fold.caption} className="mt-figure text-center" />
        </div>
        <div data-enter>
          <Headline
            accent={fold.headline.accent}
            lead={fold.headline.lead}
            className="max-w-[16ch] font-extrabold text-[clamp(2.5rem,min(6.2vw,8svh),4.75rem)] leading-[1.02] tracking-[-0.035em]"
            tail={fold.headline.tail}
          />
          <p className="mt-flow flex items-center gap-3 font-bold font-display text-[clamp(1.0625rem,1.8vw,1.3125rem)] tracking-tight">
            <Image
              alt=""
              className="size-10 rounded-full border-2 border-ink object-cover object-top lg:hidden"
              height={80}
              sizes="40px"
              src={PORTRAIT_SRC}
              width={80}
            />
            <span>
              {PERSON_NAME}
              <span aria-hidden="true" className="mx-2">
                ·
              </span>
              {PERSON_ROLE}
            </span>
          </p>
          <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.7vw,1.25rem)] text-foreground-muted leading-[1.6]">
            {fold.sentence}
          </p>
          <ul className="paper mt-flow grid sm:grid-cols-3">
            {proof.map((p) => (
              <li
                className="border-border border-t-2 px-4 py-2 first:border-t-0 sm:p-4 sm:border-t-0 sm:border-l-2 sm:first:border-l-0"
                key={p.href}
              >
                <a
                  className="hit font-bold font-display text-accent tracking-tight [overflow-wrap:anywhere]"
                  href={p.href}
                >
                  <Cue label={`${p.system} →`} />
                </a>
                <p className="mt-1 hidden text-foreground-muted text-sm sm:block">
                  {p.metric}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-figure flex flex-wrap items-center gap-x-6 gap-y-figure">
            <a className={ACTION_CLASS} href="#contact">
              <Cue label="Hire me ↓" />
            </a>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground-muted text-sm">
              <span
                aria-hidden="true"
                className="inline-block size-2 rounded-full bg-sea"
                data-live
              />
              {[person.availability, person.location, person.hours].map(
                (item) => (
                  <span key={item}>
                    {item}
                    <span aria-hidden="true" className="ml-3">
                      ·
                    </span>
                  </span>
                ),
              )}
              <a className="hit font-semibold ink-link" href={GITHUB_URL}>
                <Cue label="GitHub ↗" />
              </a>
            </p>
          </div>
        </div>
      </div>
      <Shore />
      <HourCue href="#jobs" label={fold.cue.label} time={fold.cue.time} />
    </section>
  );
}
