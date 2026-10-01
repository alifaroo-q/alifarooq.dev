import { Cue } from "@/components/cue";

/**
 * The floating bar.
 *
 * It is fixed, so it sits on whichever hour the reader is in, and it is a card
 * like everything else on the page: cut paper with a hard shadow. The nav marks
 * the hour in view from `html[data-hour]` (see `hour-watcher.tsx` and the
 * `[data-nav]` rules), so this stays a server component.
 *
 * Links are root-relative, `/#work` and not `#work`, because the detail pages
 * wear the same bar and a bare hash would resolve against their own path.
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
        <div className="paper flex h-14 items-center justify-between gap-3 px-4 text-sm md:px-5">
          <a
            className="font-bold font-display text-lg tracking-tight md:text-xl"
            href="/"
          >
            <span className="md:hidden">af</span>
            <span className="hidden md:inline">{name.toLowerCase()}</span>
            <span aria-hidden="true" className="text-coral">
              .
            </span>
          </a>
          <nav aria-label="Primary" className="flex gap-3 font-medium sm:gap-6">
            <a className="py-1" data-nav="work" href="/#work">
              Work
            </a>
            <a className="py-1" data-nav="open-source" href="/#open-source">
              Open source
            </a>
            <a className="py-1" data-nav="about" href="/#about">
              About
            </a>
          </nav>
          <a className="font-semibold ink-link" href={resumeHref}>
            <Cue label="Resume ↗" />
          </a>
        </div>
      </div>
    </header>
  );
}
