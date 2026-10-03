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
    line: "I design the data first, then test the riskiest part before I build anything else.",
  },
  {
    step: "Spike",
    line: "Code is cheap now, so I build two or three rough versions of an idea and keep the best one.",
  },
  {
    step: "Ship and iterate",
    line: "I put it in front of the client early and change it fast from what they say.",
  },
];

const RULES: { title: string; line?: string; href?: string; label?: string }[] =
  [
    {
      title: "I name every error a function can return.",
      line: "I model the errors I expect as values with Result and Option types, and I try to list all of them. Today I use Effect TS for this.",
      href: "#job-result-kit",
      label: "result-kit",
    },
    {
      title: "I let the agent check its own work.",
      line: "I give it unit, integration and browser tests it can run alone. In the browser it clicks through the whole flow and reads the network requests, console logs and errors. Oxlint, custom lint rules and an instructions file catch the rest.",
    },
    {
      title: "A person approves before AI reaches a client.",
      line: "The email assistant drafts; a consultant sends.",
      href: "#job-hcpa-email",
      label: "HCPA email assistant",
    },
    {
      title: "I plan for the model being wrong.",
      line: "Model output is treated like any input from outside.",
      href: "#job-hcpa-email",
      label: "The prompt-injection guard",
    },
    {
      title: "Rules that must hold live in the database.",
      href: "#job-numlix",
      label: "Numlix ledger",
    },
    {
      title: "I write the decision down.",
      line: "Every big choice gets a short written record: what, why, and what I gave up.",
      href: "#job-billys",
      label: "Billy's Garage",
    },
  ];

function Rules({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-bold font-display text-xl tracking-tight">
        Rules I keep
      </h3>
      <ul className="mt-figure grid gap-x-12 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {RULES.map((rule) => (
          <li key={rule.title}>
            <p className="font-bold font-display leading-snug tracking-tight">
              {rule.title}
            </p>
            {rule.line ? (
              <p className="mt-1 text-foreground-muted text-sm">{rule.line}</p>
            ) : null}
            {rule.href ? (
              <p className="mt-1 font-semibold text-accent text-sm">
                <a className="hit" href={rule.href}>
                  <Cue label={`${rule.label} →`} />
                </a>
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
      <p className="font-serif text-[clamp(1.625rem,3.2vw,2.5rem)] italic leading-tight tracking-[-0.01em]">
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
      <ol className="mt-group grid gap-5 md:grid-cols-5 md:items-end" data-land>
        {LOOP.map((s, i) => (
          <li
            className="paper p-5 md:mb-[calc(var(--step)*2.5rem)]"
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
