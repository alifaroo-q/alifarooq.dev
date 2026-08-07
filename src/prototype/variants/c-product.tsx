/**
 * PROTOTYPE — Variant C: RESTRAINED PRODUCT-MINIMAL
 *
 * Commits to: light neutral surfaces, a single sans face, soft radii and
 * shadows, alternating section backgrounds, and a centred fold. Case studies
 * are cards that lift on hover. This is the well-made SaaS marketing page —
 * included as the pole to accept or reject *explicitly*.
 */

import { about, contact, openSource, person, work } from "../content";

const accent = "#2f5fe0";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[0.6875rem] font-medium tracking-[0.1em] text-slate-500 uppercase">
      {children}
    </span>
  );
}

export function VariantC() {
  return (
    <div className="min-h-dvh bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-[0.9375rem] font-medium">{person.name}</span>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <a href={person.resumeHref} className="hover:text-slate-900">
              Résumé
            </a>
            <a
              href="#contact"
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-white"
              style={{ background: accent }}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* fold — centred, no proof element */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-center md:pt-32">
        <h1 className="text-[clamp(1.75rem,4.4vw,2.75rem)] leading-[1.25] font-medium tracking-[-0.02em] text-balance">
          {person.positioning}
        </h1>
        <p className="mt-8 text-sm text-slate-500">
          {person.name} &nbsp;·&nbsp; {person.role} &nbsp;·&nbsp; {person.location} &nbsp;·&nbsp;{" "}
          {person.availability}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={person.resumeHref}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ background: accent }}
          >
            Download résumé
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* work — cards */}
      <section className="bg-slate-50/70 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <Pill>Work</Pill>
          </div>
          <div className="grid gap-5">
            {work.map((w) => (
              <a
                key={w.id}
                href={w.href}
                className="group block rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-9"
              >
                <p className="text-[0.75rem] font-medium tracking-[0.08em] text-slate-500 uppercase">
                  {w.eyebrow}
                </p>
                <h3 className="mt-3 max-w-[26ch] text-[clamp(1.25rem,2.6vw,1.625rem)] leading-snug font-medium tracking-[-0.015em]">
                  {w.decision}
                </h3>
                <p className="mt-4 max-w-[64ch] text-[0.9375rem] leading-relaxed text-slate-600">
                  {w.constraint}
                </p>
                <p
                  className="mt-6 text-sm font-medium transition-transform group-hover:translate-x-0.5"
                  style={{ color: accent }}
                >
                  {w.artifact} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* open source — one feature panel, two small cards */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <Pill>Open source</Pill>
          </div>

          <p className="mx-auto max-w-[34ch] text-center text-[clamp(1.375rem,3.2vw,2rem)] leading-[1.3] font-medium tracking-[-0.02em] text-balance">
            {openSource.conviction}
          </p>
          <p className="mx-auto mt-5 max-w-[46ch] text-center text-[0.9375rem] text-slate-500">
            {openSource.retrofit}
          </p>

          <a
            href={openSource.featured.href}
            className="group mt-12 block rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-10"
          >
            <h3 className="text-xl font-medium">{openSource.featured.name}</h3>
            <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-slate-600">
              {openSource.featured.pitch}
            </p>
            <p
              className="mt-6 text-sm font-medium transition-transform group-hover:translate-x-0.5"
              style={{ color: accent }}
            >
              {openSource.featured.link} →
            </p>
          </a>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {openSource.origin.map((o) => (
              <a
                key={o.name}
                href={o.href}
                className="block rounded-xl border border-slate-200 p-6 transition-colors hover:bg-slate-50"
              >
                <h4 className="text-[0.9375rem] font-medium">{o.name}</h4>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-slate-600">{o.pitch}</p>
              </a>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            <a href={person.github} className="hover:text-slate-900">
              github.com/alifaroo-q
            </a>
          </p>
        </div>
      </section>

      {/* about */}
      <section className="bg-slate-50/70 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-8 flex justify-center">
            <Pill>About</Pill>
          </div>
          <div className="mx-auto mb-7 grid h-24 w-24 place-items-center rounded-full bg-slate-200 text-[0.625rem] text-slate-500">
            [ photo ]
          </div>
          <div className="space-y-4 text-[1rem] leading-relaxed text-slate-600">
            {about.lines.map((l, i) => (
              <p key={l} className={i === 0 ? "text-slate-900" : undefined}>
                {l}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* contact — shared footer, CTA panel */}
      <footer id="contact" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-10 text-center md:p-14">
            <h2 className="text-[clamp(1.5rem,3.4vw,2rem)] font-medium tracking-[-0.02em] text-white">
              {contact.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-slate-400">
              {contact.line}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${person.email}`}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-opacity hover:opacity-90"
              >
                {person.email}
              </a>
              <a
                href={person.resumeHref}
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Résumé (PDF)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
