import { Cue } from "@/components/cue";

/**
 * The floating bar.
 *
 * It is fixed, so it sits on whichever hour the reader is in, and it is a card
 * like everything else on the page: cut paper with a hard shadow. The nav marks
 * the hour in view from `html[data-hour]` (see `hour-watcher.tsx` and the
 * `[data-nav]` rules), so this stays a server component.
 *
 * One link per stack hour, then About.
 */
export function SiteHeader({
  name,
  resumeHref,
}: {
  name: string;
  resumeHref: string;
}) {
  return (
    <header className="fixed inset-x-0 top-3 z-30" data-site-header>
      <div className="wrap">
        <div className="paper flex h-14 items-center justify-between gap-2 whitespace-nowrap px-3 text-[0.8125rem] min-[400px]:gap-3 min-[400px]:px-4 min-[400px]:text-sm md:px-5">
          <a
            className="flex h-11 items-center font-bold font-display text-lg tracking-tight md:text-xl"
            href="/"
          >
            <span className="md:hidden">af</span>
            <span className="hidden md:inline">{name.toLowerCase()}</span>
            <span aria-hidden="true" className="text-coral">
              .
            </span>
          </a>
          <nav
            aria-label="Primary"
            className="flex gap-2.5 font-medium min-[400px]:gap-3 sm:gap-6"
          >
            <a className="hit py-1" data-nav="full-stack" href="#full-stack">
              Full-stack
            </a>
            <a className="hit py-1" data-nav="data" href="#data">
              Data
            </a>
            <a className="hit py-1" data-nav="cloud" href="#cloud">
              Cloud
            </a>
            <a className="hit py-1" data-nav="ai" href="#ai">
              AI
            </a>
            <a className="hit py-1" data-nav="about" href="#about">
              About
            </a>
          </nav>
          <a className="hit font-semibold ink-link" href={resumeHref}>
            <Cue label="Resume ↗" />
          </a>
        </div>
      </div>
    </header>
  );
}
