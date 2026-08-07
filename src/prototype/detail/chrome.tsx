/**
 * PROTOTYPE — throwaway. The bits of the detail pages that #8 and #10 already
 * settled, so the takes are not free to disagree about them:
 *
 *   - the header is the home page's header, unchanged
 *   - the contact section is a shared footer on EVERY page (#8, amending #5)
 *
 * Everything a take is actually being judged on — where the diagram sits, how
 * the prose is laid out, whether the two page kinds share a template — is
 * deliberately NOT in this file.
 */

import { contact, person } from "../content";

export function DetailHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--a-line)] bg-[color-mix(in_oklab,var(--a-bg)_88%,transparent)] px-6 py-3 text-[0.8125rem] backdrop-blur md:px-10">
      <a href="/" className="hover:text-[var(--a-accent)]">
        {person.name}
      </a>
      <nav aria-label="Primary" className="flex gap-6 text-[var(--a-fg-2)]">
        <a href={person.resumeHref} className="hover:text-[var(--a-accent)]">
          Résumé
        </a>
        <a href="#contact" className="hover:text-[var(--a-accent)]">
          Contact
        </a>
      </nav>
    </header>
  );
}

/** Back to the section the reader came from, not to the top of the home page. */
export function BackLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group inline-block text-[0.8125rem] text-[var(--a-fg-2)] hover:text-[var(--a-accent)]"
    >
      <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>{" "}
      {label}
    </a>
  );
}

/**
 * #8 calls the end of a detail page the highest-intent moment on the site, so
 * the footer is the same component and the same copy as the home page's. The
 * open question each take answers differently is how much RUNWAY it gets —
 * on the home page the reader arrives having scrolled four sections; here they
 * arrive having read one argument to its end.
 */
export function ContactFooter({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div className="flex items-baseline gap-4 border-t border-[var(--a-line)] px-6 py-3 md:px-10">
        <h2
          id="contact"
          className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase"
        >
          {contact.heading}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-[var(--a-line)]" />
      </div>
      <footer className={`px-6 md:px-10 ${compact ? "py-12" : "py-16 md:py-24"}`}>
        <a
          href={`mailto:${person.email}`}
          className={`block leading-tight wrap-anywhere text-[var(--a-accent)] hover:underline hover:underline-offset-[0.2em] ${
            compact ? "text-[clamp(1.125rem,3.5vw,2rem)]" : "text-[clamp(1.375rem,5vw,3rem)]"
          }`}
        >
          {person.email}
        </a>
        <p className="mt-6 max-w-[52ch] text-[0.9375rem] leading-[1.7] text-[var(--a-fg-2)]">
          {contact.line}
        </p>
        <a
          href={person.resumeHref}
          className="mt-8 inline-block border border-[var(--a-line-strong)] px-5 py-2.5 text-[0.9375rem] transition-colors hover:bg-[var(--a-fg)] hover:text-[var(--a-bg)]"
        >
          Download résumé (PDF)
        </a>
      </footer>
    </>
  );
}
