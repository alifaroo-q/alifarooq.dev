/**
 * PROTOTYPE — Variant A: TERMINAL / BRUTALIST  (chosen direction, refined)
 *
 * Commits to: dark-first, monospace throughout, zero border-radius, hairline
 * rules that run full-bleed, and inversion (not colour) as the hover state.
 * Density is high; whitespace is rationed. Case studies read as rows in a
 * listing, not cards — the page looks like something a machine printed.
 *
 * Refinement pass 1 — see `.take-a` in globals.css. No colour is set inline;
 * every value is a variable, so `.a-row:hover` inverts the whole subtree at
 * once instead of stranding grey text on a light ground. JetBrains Mono,
 * body at 15px/1.7, measure cut to ~54ch.
 *
 * Refinement pass 2 — ARGUMENT OVER COSPLAY. The terminal register is a
 * crowded one (akkila.dev is a near neighbour), and the shell furniture was
 * the least defensible part of it. Removed: the `$ whoami` prompt, the
 * `$ mail` prefix, `~/` path notation on section heads, the `[ bracket ]`
 * button chrome, and the lowercased name. What replaces them is structure:
 * #8 established that the positioning sentence *is* the table of contents —
 * three clauses, three slots, in order — so each clause now carries the
 * marker of the case study it opens, and each work row carries the same
 * marker back. The page argues; it no longer cosplays.
 *
 * What stays is the part that was never cosplay: dark ground, mono, hard
 * edges, full-bleed rules, whole-row inversion.
 */

import { about, contact, openSource, person, work } from "../content";

/** Ties a clause of the positioning sentence to the slot it opens. Decorative. */
function Marker({ n }: { n: number }) {
  return (
    <sup
      aria-hidden
      className="ml-0.5 align-super text-[0.5625rem] tracking-[0.1em] text-[var(--a-accent)] tabular-nums"
    >
      {String(n).padStart(2, "0")}
    </sup>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.6875rem] tracking-[0.18em] text-[var(--a-fg-3)] uppercase">
      {children}
    </span>
  );
}

function SectionHead({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-[var(--a-line)] px-6 py-3 md:px-10">
      <h2 id={id} className="text-[0.6875rem] tracking-[0.2em] text-[var(--a-accent)] uppercase">
        {label}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-[var(--a-line)]" />
    </div>
  );
}

export function VariantA() {
  return (
    <div className="take-a min-h-dvh">
      <a href="#main" className="a-skip text-sm">
        Skip to content
      </a>

      {/* header — name, resume, contact. Nothing else. */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--a-line)] bg-[color-mix(in_oklab,var(--a-bg)_88%,transparent)] px-6 py-3 text-[0.8125rem] backdrop-blur md:px-10">
        <span>{person.name}</span>
        <nav aria-label="Primary" className="flex gap-6 text-[var(--a-fg-2)]">
          <a href={person.resumeHref} className="hover:text-[var(--a-accent)]">
            Résumé
          </a>
          <a href="#contact" className="hover:text-[var(--a-accent)]">
            Contact
          </a>
        </nav>
      </header>

      <main id="main">
        {/* fold — four slots, no proof element */}
        <section className="px-6 pt-20 pb-20 md:px-10 md:pt-28">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-medium tracking-tight">
            {person.name}
          </h1>

          {/* The sentence, marked against the sections it opens. Still one
              sentence — the markers are quiet and the prose runs unbroken. */}
          <p className="mt-10 max-w-[54ch] text-[clamp(1.0625rem,2.1vw,1.375rem)] leading-[1.6]">
            {person.positioningLead}{" "}
            {person.positioningClauses.map((clause, i) => (
              <span key={clause}>
                {clause}
                <Marker n={i + 1} />
                {i < person.positioningClauses.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <dl className="mt-12 max-w-md space-y-1.5 text-[0.8125rem]">
            {[
              ["role", person.role, false],
              ["based", person.location, false],
              ["status", person.availability, true],
            ].map(([k, v, live]) => (
              <div key={String(k)} className="flex items-baseline gap-3">
                <dt className="flex flex-1 items-baseline gap-3 text-[var(--a-fg-3)] lowercase after:block after:h-0 after:flex-1 after:border-b after:border-dotted after:border-[var(--a-line-strong)] after:content-['']">
                  {k}
                </dt>
                <dd className="flex items-baseline gap-2">
                  {live ? (
                    <span
                      aria-hidden
                      className="inline-block size-1.5 self-center rounded-full bg-[var(--a-accent)]"
                    />
                  ) : null}
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap gap-3 text-[0.9375rem]">
            <a
              href={person.resumeHref}
              className="border border-[var(--a-accent)] px-5 py-2.5 text-[var(--a-accent)] transition-colors hover:bg-[var(--a-accent)] hover:text-[var(--a-bg)]"
            >
              Download résumé
            </a>
            <a
              href="#contact"
              className="border border-[var(--a-line-strong)] px-5 py-2.5 transition-colors hover:bg-[var(--a-fg)] hover:text-[var(--a-bg)]"
            >
              Get in touch
            </a>
          </div>
        </section>

        {/* work — rows carry the marker of the clause that promised them */}
        <SectionHead id="work" label="Work" />
        <div>
          {work.map((w, i) => (
            <a
              key={w.id}
              href={w.href}
              className="a-row group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-[var(--a-line)] px-6 py-8 md:grid-cols-[4rem_1fr] md:px-10 md:py-10"
            >
              <span
                aria-hidden
                className="pt-1.5 text-[0.6875rem] tracking-[0.1em] text-[var(--a-accent)] tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <Label>{w.eyebrow}</Label>
                <h3 className="mt-2 max-w-[30ch] text-[clamp(1.3125rem,3vw,1.875rem)] leading-tight font-medium">
                  {w.decision}
                </h3>
                <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.7] text-[var(--a-fg-2)]">
                  {w.constraint}
                </p>
                <p className="mt-5 text-[0.9375rem] text-[var(--a-accent)]">
                  {w.artifact}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* open source — uneven weight: conviction, then drizzle-tx, then the pair */}
        <SectionHead id="open-source" label="Open source" />
        <section className="px-6 py-14 md:px-10">
          <p className="max-w-[42ch] border-l-2 border-[var(--a-accent)] pl-5 text-[clamp(1.1875rem,2.4vw,1.625rem)] leading-[1.45]">
            {openSource.conviction}
          </p>
          <p className="mt-4 max-w-[54ch] pl-5 text-[0.9375rem] leading-[1.7] text-[var(--a-fg-2)]">
            {openSource.retrofit}
          </p>

          <a
            href={openSource.featured.href}
            className="a-row group mt-12 block border border-[var(--a-line-strong)] p-6 md:p-8"
          >
            <h3 className="text-xl text-[var(--a-accent)]">{openSource.featured.name}</h3>
            <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-[1.7] text-[var(--a-fg-2)]">
              {openSource.featured.pitch}
            </p>
            <p className="mt-5 text-[0.9375rem]">
              {openSource.featured.link}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </p>
          </a>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {openSource.origin.map((o) => (
              <a
                key={o.name}
                href={o.href}
                className="a-row block border border-dashed border-[var(--a-line-strong)] p-5 hover:border-solid"
              >
                <h4 className="text-[0.9375rem]">{o.name}</h4>
                <p className="mt-2 text-[0.875rem] leading-[1.7] text-[var(--a-fg-2)]">{o.pitch}</p>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[0.8125rem] text-[var(--a-fg-2)]">
            <a
              href={person.github}
              className="underline underline-offset-4 hover:text-[var(--a-accent)]"
            >
              github.com/alifaroo-q
            </a>
          </p>
        </section>

        {/* about */}
        <SectionHead id="about" label="About" />
        <section className="grid gap-8 px-6 py-14 md:grid-cols-[9rem_1fr] md:px-10">
          <div
            aria-hidden
            className="grid aspect-square w-28 place-items-center border border-[var(--a-line-strong)] text-[0.6875rem] text-[var(--a-fg-3)]"
          >
            [ photo ]
          </div>
          <div className="max-w-[54ch] space-y-4 text-[0.9375rem] leading-[1.75] text-[var(--a-fg-2)]">
            {about.lines.map((l, i) => (
              <p key={l} className={i === 0 ? "text-[var(--a-fg)]" : undefined}>
                {l}
              </p>
            ))}
          </div>
        </section>
      </main>

      {/* contact — shared footer component on every page */}
      <SectionHead id="contact" label="Contact" />
      <footer className="px-6 py-16 md:px-10 md:py-24">
        <a
          href={`mailto:${person.email}`}
          className="block text-[clamp(1.375rem,5vw,3rem)] leading-tight wrap-anywhere text-[var(--a-accent)] hover:underline hover:underline-offset-[0.2em]"
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
    </div>
  );
}
