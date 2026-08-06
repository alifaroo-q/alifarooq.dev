const contact = [
  { label: "hello@alifarooq.dev", href: "mailto:hello@alifarooq.dev" },
  { label: "+92 316 790 2206", href: "tel:+923167902206" },
];

const profiles = [
  { label: "GitHub", href: "https://github.com/alifaroo-q" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/itsalifarooq" },
];

const stack = ["TypeScript", "Node", "NestJS", "Hono", "OpenAI", "PostgreSQL"];

/** Mono label in the left rail; stacks above its content on small screens. */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]">
      <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase text-[var(--text-3)] sm:pt-[0.2rem]">
        {label}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:px-10 sm:py-28">
      <div className="reveal flex flex-col gap-14">
        {/* Dated status line — honest, no countdown, no progress bar. */}
        <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.18em] uppercase text-[var(--text-3)]">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full bg-[var(--accent)]"
          />
          Rebuilding - August 2026
        </p>

        <header className="flex flex-col gap-6">
          <h1 className="font-display text-[length:var(--text-nameplate)] leading-[0.92] tracking-[-0.02em]">
            Ali Farooq
          </h1>

          {/* The 10-second payload: role, then stack, both scannable. */}
          <div className="flex flex-col gap-3">
            <p className="text-xl sm:text-2xl">Full stack engineer</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[var(--text-3)]">
              {stack.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  {item}
                  {i < stack.length - 1 && (
                    <span
                      aria-hidden
                      className="text-[color-mix(in_oklab,var(--text-3)_55%,var(--page))]"
                    >
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="flex max-w-[62ch] flex-col gap-5 text-[1.0625rem] leading-[1.65] text-[var(--text-2)]">
          <p className="text-pretty">
            I build AI-powered backend systems, automation workflows, and
            integration-heavy products, the kind where the interesting problem
            is everything that happens after the happy path.
          </p>
          <p className="text-pretty">
            This site is being rebuilt in the open. Case studies and open source
            write-ups are on the way; until then, the fastest way to reach me is
            directly.
          </p>
        </div>

        <div className="flex flex-col gap-8 border-t border-[var(--line)] pt-10">
          <Row label="Contact">
            <address className="flex flex-col items-start gap-2 font-mono text-sm not-italic">
              {contact.map((item) => (
                <a key={item.label} href={item.href} className="link">
                  {item.label}
                </a>
              ))}
            </address>
          </Row>

          <Row label="Elsewhere">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
              {profiles.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </Row>
        </div>

        <footer className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-[var(--text-3)]">
          alifarooq.dev
        </footer>
      </div>
    </main>
  );
}
