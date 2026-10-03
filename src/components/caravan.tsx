import { Cue } from "@/components/cue";

/**
 * One stop on the way. A past stop is a place with dated moments; the next
 * stop is the open one. A new job is one more entry: the caravan grows a camel.
 */
export type Stop =
  | {
      kind: "past";
      place: string;
      span: string;
      title: string;
      moments: readonly { when: string; what: string }[];
    }
  | { kind: "next"; span: string; title: string; line: string };

const CAMEL_SHAPES = [
  <ellipse cx="50" cy="50" key="body" rx="30" ry="15" />,
  <path d="M34 42 Q50 10 66 40Z" key="hump" />,
  <path d="M74 46 Q88 42 90 20 L101 22 Q99 50 80 58Z" key="neck" />,
  <path d="M89 21 Q102 9 112 20 L110 29 Q100 25 96 31Z" key="head" />,
  <rect height="34" key="l1" width="6" x="27" y="58" />,
  <rect height="34" key="l2" width="6" x="38" y="60" />,
  <rect height="34" key="l3" width="6" x="62" y="60" />,
  <rect height="34" key="l4" width="6" x="73" y="58" />,
];

/**
 * The outline is every shape stroked wide, and the fill is the same shapes
 * drawn again on top, so only the outer edge of the stroke shows.
 */
function Camel({ ghost }: { ghost: boolean }) {
  return (
    <svg aria-hidden="true" className="h-28 w-auto" viewBox="0 0 120 100">
      <path
        d="M22 46 Q10 54 14 68"
        fill="none"
        className="stroke-ink"
        strokeDasharray={ghost ? "5 5" : undefined}
        strokeLinecap="round"
        strokeWidth="4"
      />
      <g
        fill="none"
        className="stroke-ink"
        strokeDasharray={ghost ? "6 5" : undefined}
        strokeLinejoin="round"
        strokeWidth="6"
      >
        {CAMEL_SHAPES}
      </g>
      <g className={ghost ? "fill-caravan-ghost" : "fill-caravan"}>
        {CAMEL_SHAPES}
      </g>
      {ghost ? null : (
        <>
          <path d="M36 38 H66 L68 58 H34Z" className="fill-coral" />
          <path d="M36 52 H68" className="stroke-saffron" strokeWidth="3" />
          {[38, 46, 54, 62].map((x) => (
            <circle cx={x} cy="61" className="fill-saffron" key={x} r="2.5" />
          ))}
          <circle cx="104" cy="19" className="fill-ink" r="1.8" />
        </>
      )}
    </svg>
  );
}

/** The caravan at dusk: each stop a camel with its tag hung under it. */
export function Caravan({ stops }: { stops: readonly Stop[] }) {
  return (
    <div className="wrap relative mt-group">
      <svg
        aria-hidden="true"
        className="absolute inset-x-6 top-[6.25rem] hidden h-10 w-[calc(100%-3rem)] md:block"
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
      >
        <path
          d="M0 20 C200 6 400 30 600 18 S1000 8 1200 20"
          fill="none"
          className="stroke-trail"
          strokeDasharray="10 14"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <ol className="relative grid gap-12 md:grid-cols-3 md:gap-8">
        {stops.map((stop) => (
          <li className="flex flex-col items-start" key={stop.title}>
            <Camel ghost={stop.kind === "next"} />
            <span
              aria-hidden="true"
              className="ml-[3.1rem] h-6 w-[2px] bg-ink"
            />
            {stop.kind === "past" ? (
              <div className="paper w-full -rotate-1 p-5">
                <p className="font-mono text-foreground-label text-xs">
                  {stop.span}
                </p>
                <h3 className="mt-1 font-bold font-display text-xl tracking-tight">
                  {stop.place}
                </h3>
                <p className="text-foreground-muted">{stop.title}</p>
                <ul className="mt-3 grid gap-1.5 text-sm">
                  {stop.moments.map((m) => (
                    <li className="flex gap-3" key={m.what}>
                      <span className="w-16 shrink-0 pt-0.5 font-mono text-foreground-label text-xs">
                        {m.when}
                      </span>
                      {m.what}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="w-full rotate-1 rounded-[4px] border-[3px] border-ink border-dashed p-5">
                <p className="font-mono text-foreground-label text-xs">
                  {stop.span}
                </p>
                <h3 className="mt-1 font-bold font-display text-xl tracking-tight">
                  {stop.title}
                </h3>
                <p className="text-foreground-muted">{stop.line}</p>
                <p className="mt-3">
                  <a className="hit font-semibold ink-link" href="#contact">
                    <Cue label="Hire me ↓" />
                  </a>
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
