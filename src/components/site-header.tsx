import { Cue } from "@/components/cue";

/**
 * The floating bar.
 *
 * It is fixed, so it sits on whichever hour the reader is in, and it is a card
 * like everything else on the page: cut paper with a hard shadow. The nav marks
 * the hour in view from `html[data-hour]` (see `hour-watcher.tsx` and the
 * `[data-nav]` rules), so this stays a server component.
 */
/** Each link is a 44px box at the least. The underline
 * sits on the inner span, so it stays the width of the word. */
const NAV_LINK = "inline-flex h-11 min-w-11 items-center justify-center";

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
        <div className="paper flex h-14 items-center justify-between gap-2 whitespace-nowrap px-3 text-xs min-[400px]:gap-3 min-[400px]:px-4 min-[400px]:text-sm md:px-5">
          <a
            className="flex h-11 min-w-11 items-center font-bold font-display text-lg tracking-tight md:text-xl"
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
            className="flex font-medium min-[400px]:gap-1 sm:gap-6"
          >
            <a className={NAV_LINK} data-nav="work" href="#jobs">
              <span>Work</span>
            </a>
            <a className={NAV_LINK} data-nav="how" href="#how">
              <span className="sm:hidden">How</span>
              <span className="hidden sm:inline">How I work</span>
            </a>
            <a className={NAV_LINK} data-nav="tools" href="#tools">
              <span>Tools</span>
            </a>
            <a className={NAV_LINK} data-nav="about" href="#about">
              <span>About</span>
            </a>
            <a className={NAV_LINK} data-nav="contact" href="#contact">
              <span>Contact</span>
            </a>
          </nav>
          <a
            className="inline-flex h-11 min-w-11 items-center justify-center font-semibold ink-link"
            href={resumeHref}
          >
            <span className="min-[400px]:hidden">
              <Cue label="CV ↗" />
            </span>
            <span className="hidden min-[400px]:inline">
              <Cue label="Resume ↗" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
