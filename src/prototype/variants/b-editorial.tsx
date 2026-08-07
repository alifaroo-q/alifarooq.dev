/**
 * PROTOTYPE — Variant B: EDITORIAL / TYPOGRAPHIC
 *
 * Commits to: light warm paper, a serif display face carrying the argument,
 * and a deliberate inversion of the fold hierarchy — the *positioning
 * sentence* is the display element, the name is a masthead line above it.
 * Wide measure, generous air, hairline rules instead of boxes. Case studies
 * read as magazine entries with a left rail, never as cards.
 */

import { about, contact, openSource, person, work } from "../content";

const paper = "#faf7f0";
const ink = "#1a1714";
const soft = "#6b6259";
const rule = "#e0d9cc";
const accent = "#8a4b1f";

export function VariantB() {
  return (
    <div className="min-h-dvh font-sans" style={{ background: paper, color: ink }}>
      {/* masthead */}
      <header
        className="mx-auto flex max-w-[74rem] items-baseline justify-between border-b px-6 py-5 md:px-10"
        style={{ borderColor: rule }}
      >
        <span className="font-display text-xl">Ali Farooq</span>
        <nav className="flex gap-8 text-[0.8125rem]" style={{ color: soft }}>
          <a href={person.resumeHref} className="hover:text-[#8a4b1f]">
            Résumé
          </a>
          <a href="#contact" className="hover:text-[#8a4b1f]">
            Contact
          </a>
        </nav>
      </header>

      {/* fold — the sentence is the display element */}
      <section className="mx-auto max-w-[74rem] px-6 pt-20 pb-24 md:px-10 md:pt-28">
        <p
          className="mb-10 text-[0.6875rem] tracking-[0.24em] uppercase"
          style={{ color: accent }}
        >
          {person.name}
        </p>
        <h1 className="font-display max-w-[22ch] text-[clamp(2.25rem,6.2vw,4.5rem)] leading-[1.06]">
          {person.positioning}
        </h1>
        <p className="mt-12 text-sm" style={{ color: soft }}>
          {person.role} &nbsp;·&nbsp; {person.location} &nbsp;·&nbsp; {person.availability}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-8 text-[0.9375rem]">
          <a
            href={person.resumeHref}
            className="underline decoration-[1px] underline-offset-[0.4em] hover:decoration-2"
            style={{ color: accent, textDecorationColor: accent }}
          >
            Download résumé
          </a>
          <a href="#contact" className="underline decoration-[1px] underline-offset-[0.4em] hover:decoration-2">
            Get in touch
          </a>
        </div>
      </section>

      {/* work */}
      <section className="mx-auto max-w-[74rem] px-6 md:px-10">
        <h2
          className="border-t pt-4 text-[0.6875rem] tracking-[0.24em] uppercase"
          style={{ borderColor: ink, color: soft }}
        >
          Work
        </h2>

        {work.map((w) => (
          <article
            key={w.id}
            className="grid gap-y-4 border-b py-14 md:grid-cols-[15rem_1fr] md:gap-x-12"
            style={{ borderColor: rule }}
          >
            <p className="text-[0.8125rem] leading-snug italic" style={{ color: soft }}>
              {w.eyebrow}
            </p>
            <div>
              <h3 className="font-display max-w-[24ch] text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1]">
                {w.decision}
              </h3>
              <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-[1.75]" style={{ color: soft }}>
                {w.constraint}
              </p>
              <a
                href={w.href}
                className="mt-7 inline-block text-[0.9375rem] underline decoration-[1px] underline-offset-[0.4em] hover:decoration-2"
                style={{ color: accent, textDecorationColor: accent }}
              >
                {w.artifact} →
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* open source — conviction as a pull quote, then uneven weight */}
      <section className="mx-auto max-w-[74rem] px-6 pt-20 md:px-10">
        <h2
          className="border-t pt-4 text-[0.6875rem] tracking-[0.24em] uppercase"
          style={{ borderColor: ink, color: soft }}
        >
          Open source
        </h2>

        <blockquote className="py-16">
          <p className="font-display mx-auto max-w-[26ch] text-center text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[1.15]">
            {openSource.conviction}
          </p>
          <p className="mx-auto mt-8 max-w-[44ch] text-center text-[0.9375rem]" style={{ color: soft }}>
            {openSource.retrofit}
          </p>
        </blockquote>

        <article
          className="grid gap-y-4 border-t py-14 md:grid-cols-[15rem_1fr] md:gap-x-12"
          style={{ borderColor: rule }}
        >
          <p className="font-display text-2xl">{openSource.featured.name}</p>
          <div>
            <p className="max-w-[58ch] text-[1.0625rem] leading-[1.75]" style={{ color: soft }}>
              {openSource.featured.pitch}
            </p>
            <a
              href={openSource.featured.href}
              className="mt-7 inline-block text-[0.9375rem] underline decoration-[1px] underline-offset-[0.4em] hover:decoration-2"
              style={{ color: accent, textDecorationColor: accent }}
            >
              {openSource.featured.link} →
            </a>
          </div>
        </article>

        <div
          className="grid gap-10 border-t py-10 md:grid-cols-[15rem_1fr] md:gap-x-12"
          style={{ borderColor: rule }}
        >
          <p className="text-[0.8125rem] italic" style={{ color: soft }}>
            Where it started
          </p>
          <div className="grid max-w-[58ch] gap-8 md:grid-cols-2">
            {openSource.origin.map((o) => (
              <a key={o.name} href={o.href} className="group block">
                <h4 className="font-display text-lg group-hover:text-[#8a4b1f]">{o.name}</h4>
                <p className="mt-2 text-[0.875rem] leading-[1.7]" style={{ color: soft }}>
                  {o.pitch}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* about */}
      <section className="mx-auto max-w-[74rem] px-6 pt-20 md:px-10">
        <h2
          className="border-t pt-4 text-[0.6875rem] tracking-[0.24em] uppercase"
          style={{ borderColor: ink, color: soft }}
        >
          About
        </h2>
        <div className="grid gap-y-8 py-14 md:grid-cols-[15rem_1fr] md:gap-x-12">
          <div
            className="grid h-32 w-32 place-items-center rounded-full text-[0.625rem]"
            style={{ background: rule, color: soft }}
          >
            [ photo ]
          </div>
          <div className="max-w-[56ch] space-y-5 text-[1.0625rem] leading-[1.8]" style={{ color: soft }}>
            {about.lines.map((l, i) => (
              <p key={l} style={i === 0 ? { color: ink } : undefined}>
                {l}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* contact — shared footer */}
      <footer
        id="contact"
        className="mx-auto max-w-[74rem] border-t px-6 py-24 md:px-10"
        style={{ borderColor: ink }}
      >
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
          {contact.heading}
        </h2>
        <a
          href={`mailto:${person.email}`}
          className="font-display mt-6 block text-[clamp(1.5rem,4.4vw,3rem)] break-all underline decoration-[1px] underline-offset-[0.3em] hover:decoration-2"
          style={{ color: accent, textDecorationColor: accent }}
        >
          {person.email}
        </a>
        <p className="mt-8 max-w-[46ch] text-[0.9375rem] leading-[1.7]" style={{ color: soft }}>
          {contact.line}
        </p>
        <a
          href={person.resumeHref}
          className="mt-6 inline-block text-[0.9375rem] underline decoration-[1px] underline-offset-[0.4em] hover:decoration-2"
        >
          Download résumé (PDF)
        </a>
      </footer>
    </div>
  );
}
