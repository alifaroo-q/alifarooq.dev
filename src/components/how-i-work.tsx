import { Cue } from "@/components/cue";

const STANCE =
  "I own the system around the model: the data, the queues, the guards and the person who checks its work.";
const SUB =
  "I work close to the client. I learn how their business runs, then build a tool that fits it.";
const CLOSING =
  "Because code is cheap, I can try ideas that cost too much to try before.";

const LOOP = [
  {
    step: "Ask",
    line: "I sit with the client or product owner and ask questions until I can write the requirement down in plain words.",
  },
  {
    step: "Agree",
    line: "The agent and I work from the same written plan. Claude or Codex, the tool matters less than the plan.",
  },
  {
    step: "De-risk",
    line: "I find the part most likely to fail and test it first. I design the data before anything else.",
  },
  {
    step: "Spike",
    line: "A spike is a quick, rough build to learn something. I build two or three and keep the best idea.",
  },
  {
    step: "Ship and iterate",
    line: "I put it in front of the client early and change it fast from what they say.",
  },
];

type Rule = {
  title: string;
  line: string;
  links: readonly { href: `#${string}`; label: string }[];
};

const RULES: Rule[] = [
  {
    title: "I name every error a function can return.",
    line: "I model the errors I expect as values with Result and Option types, and I try to list all of them. Today I use Effect TS for this. Rules that must hold live in the database.",
    links: [
      { href: "#job-result-kit", label: "result-kit" },
      { href: "#job-numlix", label: "Numlix ledger" },
    ],
  },
  {
    title: "I let the agent check its own work.",
    line: "I give it unit, integration and browser tests it can run alone. In the browser it clicks through the whole flow and reads the network requests, console logs and errors. Oxlint, custom lint rules and an instructions file catch the rest.",
    links: [],
  },
  {
    title: "I plan for the model being wrong.",
    line: "Model output is treated like any input from outside, and a person approves before AI reaches a client. The email assistant drafts; a consultant sends.",
    links: [
      {
        href: "#job-hcpa-email",
        label: "The email assistant and its prompt-injection guard",
      },
    ],
  },
  {
    title: "I write the decision down.",
    line: "Every big choice gets a short written record: what, why, and what I gave up.",
    links: [{ href: "#job-billys", label: "Billy's Garage" }],
  },
];

function Rules({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-bold font-display text-xl tracking-tight">
        Rules I keep
      </h3>
      <ul className="mt-figure grid gap-x-12 gap-y-6 md:grid-cols-2">
        {RULES.map((rule) => (
          <li key={rule.title}>
            <p className="font-bold font-display leading-snug tracking-tight">
              {rule.title}
            </p>
            <p className="mt-1 text-foreground-muted text-sm">{rule.line}</p>
            {rule.links.length > 0 ? (
              <p className="mt-1 flex flex-wrap gap-x-5 font-semibold text-accent text-sm">
                {rule.links.map((link) => (
                  <a className="hit" href={link.href} key={link.href}>
                    <Cue label={`${link.label} →`} />
                  </a>
                ))}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stance() {
  return (
    <div className="max-w-4xl">
      <p className="font-serif text-[clamp(1.625rem,3.2vw,2.5rem)] italic leading-[1.3] tracking-[-0.01em]">
        {STANCE}
      </p>
      <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.6vw,1.1875rem)] text-foreground-muted">
        {SUB}
      </p>
    </div>
  );
}

/**
 * The stance, then the loop as paper cards that climb like stairs, then the
 * rules, each linked to the job that shows it.
 */
export function HowIWork() {
  return (
    <div className="wrap mt-group">
      <Stance />
      {/* Below md the stairs run sideways in a snap row, so the climb survives
          a phone instead of becoming five stacked cards. */}
      <ol
        aria-label="How I work, step by step"
        className="-mx-6 mt-group flex snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] items-end gap-4 overflow-x-auto px-6 pt-2 pb-4 md:mx-0 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:p-0"
        data-land
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must take keyboard focus so it can be scrolled without a pointer.
        tabIndex={0}
      >
        {LOOP.map((s, i) => (
          <li
            className="paper w-[15.5rem] shrink-0 snap-start p-5 mb-[calc(var(--step)*1.25rem)] md:w-auto md:mb-[calc(var(--step)*2.5rem)]"
            key={s.step}
            style={{ "--step": i } as React.CSSProperties}
          >
            <p className="font-mono text-foreground-label text-xs">
              Step {i + 1}
            </p>
            <p className="mt-2 font-bold font-display text-xl tracking-tight">
              {s.step}
            </p>
            <p className="mt-2 text-foreground-muted text-sm">{s.line}</p>
          </li>
        ))}
      </ol>
      <p className="mt-group font-serif text-xl italic">{CLOSING}</p>
      <div className="paper mt-group p-6 md:p-8">
        <Rules />
      </div>
    </div>
  );
}
