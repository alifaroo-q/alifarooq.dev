/**
 * Name, resume, contact. Three items, and #8 capped it there: on a page this
 * short a section nav is theatre, and it would also compete with the
 * positioning sentence for the job of saying what is below.
 *
 * The resume appears here AND in the fold, deliberately. The two audiences
 * differ — the recruiter wants the PDF in the first five seconds without
 * reading anything, the engineer wants it after being convinced.
 *
 * It lives on the home page rather than in `layout.tsx` because the detail
 * pages navigate by their own back link (`DetailShell`), and giving them a
 * second, competing way up is a decision that belongs to whichever ticket
 * settles the shared chrome. `--spacing-header` is already the height every
 * anchor's `scroll-margin` clears, so this is the element that token names.
 */
export function SiteHeader({
  name,
  resumeHref,
}: {
  name: string;
  resumeHref: string;
}) {
  return (
    // `data-site-header` is the hook the hairline's scroll animation reads.
    // The border is declared here and stays declared: what the animation does
    // is hold it back until the page has moved. See `globals.css`.
    <header
      className="sticky top-0 z-10 flex h-header items-center justify-between border-border border-b bg-background px-6 text-sm md:px-10"
      data-site-header
    >
      <span className="font-medium">{name}</span>
      <nav aria-label="Primary" className="flex gap-6 text-foreground-muted">
        <a className="hover:text-accent" href={resumeHref}>
          Resume
        </a>
        <a className="hover:text-accent" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  );
}
