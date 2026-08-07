/**
 * PROTOTYPE — Variant A: TERMINAL / BRUTALIST
 *
 * Commits to: dark-first, monospace throughout, zero border-radius, hairline
 * rules that run full-bleed, and inversion (not colour) as the hover state.
 * Density is high; whitespace is rationed. Case studies read as rows in a
 * listing, not cards — the page looks like something a machine printed.
 */

import { about, contact, openSource, person, work } from "../content";

const ink = "#08080a";
const line = "#23232a";
const dim = "#7d7d88";
const fg = "#e9e9ee";
const accent = "#ffb454";

function SectionRule({ label }: { label: string }) {
  return (
    <div
      className="flex items-baseline gap-4 border-t px-6 py-3 md:px-10"
      style={{ borderColor: line }}
    >
      <span className="text-[0.6875rem] tracking-[0.2em] uppercase" style={{ color: accent }}>
        {label}
      </span>
      <span className="h-px flex-1" style={{ background: line }} />
    </div>
  );
}

export function VariantA() {
  return (
    <div className="min-h-dvh font-mono" style={{ background: ink, color: fg }}>
      {/* header — name, resume, contact. Nothing else. */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3 text-xs backdrop-blur md:px-10"
        style={{ borderColor: line, background: `${ink}e6` }}
      >
        <span className="lowercase">ali_farooq</span>
        <nav className="flex gap-6 lowercase" style={{ color: dim }}>
          <a href={person.resumeHref} className="hover:text-[#ffb454]">
            resume.pdf
          </a>
          <a href="#contact" className="hover:text-[#ffb454]">
            contact
          </a>
        </nav>
      </header>

      {/* fold — four slots, no proof element */}
      <section className="px-6 pt-16 pb-20 md:px-10 md:pt-24">
        <p className="mb-6 text-xs" style={{ color: dim }}>
          <span style={{ color: accent }}>$</span> whoami
        </p>
        <h1 className="text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-medium tracking-tight lowercase">
          ali farooq
        </h1>
        <p className="mt-10 max-w-[54ch] text-[clamp(1rem,2.1vw,1.375rem)] leading-[1.5]">
          {person.positioning}
        </p>

        <dl className="mt-12 max-w-md space-y-1 text-xs" style={{ color: dim }}>
          {[
            ["role", person.role],
            ["based", person.location],
            ["status", person.availability],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-2">
              <dt className="w-16 shrink-0 lowercase">{k}</dt>
              <span className="flex-1 translate-y-[-0.2em] border-b border-dotted" style={{ borderColor: line }} />
              <dd style={{ color: fg }}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <a
            href={person.resumeHref}
            className="border px-4 py-2 transition-colors hover:bg-[#ffb454] hover:text-black"
            style={{ borderColor: accent, color: accent }}
          >
            [ download resume ]
          </a>
          <a
            href="#contact"
            className="border px-4 py-2 transition-colors hover:bg-[#e9e9ee] hover:text-black"
            style={{ borderColor: line }}
          >
            [ get in touch ]
          </a>
        </div>
      </section>

      {/* work — rows, indexed, whole row inverts on hover */}
      <SectionRule label="work" />
      <div style={{ borderColor: line }}>
        {work.map((w, i) => (
          <a
            key={w.id}
            href={w.href}
            className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b px-6 py-8 transition-colors hover:bg-[#e9e9ee] hover:text-black md:grid-cols-[4rem_1fr] md:px-10 md:py-10"
            style={{ borderColor: line }}
          >
            <span className="pt-1 text-xs tabular-nums group-hover:text-black" style={{ color: dim }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                className="text-[0.6875rem] tracking-[0.18em] uppercase group-hover:text-black/60"
                style={{ color: dim }}
              >
                {w.eyebrow}
              </p>
              <h3 className="mt-2 max-w-[30ch] text-[clamp(1.25rem,3vw,1.875rem)] leading-tight font-medium">
                {w.decision}
              </h3>
              <p
                className="mt-4 max-w-[62ch] text-sm leading-relaxed group-hover:text-black/70"
                style={{ color: dim }}
              >
                {w.constraint}
              </p>
              <p className="mt-5 text-sm group-hover:text-black" style={{ color: accent }}>
                {w.artifact} →
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* open source — uneven weight: conviction, then drizzle-tx, then the pair */}
      <SectionRule label="open source" />
      <section className="px-6 py-14 md:px-10">
        <p className="max-w-[46ch] border-l-2 pl-5 text-[clamp(1.125rem,2.4vw,1.625rem)] leading-[1.45]" style={{ borderColor: accent }}>
          {openSource.conviction}
        </p>
        <p className="mt-4 max-w-[46ch] pl-5 text-sm" style={{ color: dim }}>
          {openSource.retrofit}
        </p>

        <a
          href={openSource.featured.href}
          className="group mt-12 block border p-6 transition-colors hover:bg-[#e9e9ee] hover:text-black md:p-8"
          style={{ borderColor: line }}
        >
          <h3 className="text-xl group-hover:text-black" style={{ color: accent }}>
            {openSource.featured.name}
          </h3>
          <p className="mt-3 max-w-[58ch] text-sm leading-relaxed group-hover:text-black/70">
            {openSource.featured.pitch}
          </p>
          <p className="mt-5 text-sm">{openSource.featured.link} →</p>
        </a>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {openSource.origin.map((o) => (
            <a
              key={o.name}
              href={o.href}
              className="border border-dashed p-5 text-xs transition-colors hover:border-solid"
              style={{ borderColor: line, color: dim }}
            >
              <h4 style={{ color: fg }}>{o.name}</h4>
              <p className="mt-2 leading-relaxed">{o.pitch}</p>
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs" style={{ color: dim }}>
          <a href={person.github} className="underline underline-offset-4 hover:text-[#ffb454]">
            github.com/alifaroo-q
          </a>
        </p>
      </section>

      {/* about */}
      <SectionRule label="about" />
      <section className="grid gap-8 px-6 py-14 md:grid-cols-[9rem_1fr] md:px-10">
        <div
          className="grid aspect-square w-28 place-items-center border text-[0.625rem]"
          style={{ borderColor: line, color: dim }}
        >
          [ photo ]
        </div>
        <div className="max-w-[62ch] space-y-4 text-sm leading-relaxed" style={{ color: dim }}>
          {about.lines.map((l, i) => (
            <p key={l} style={i === 0 ? { color: fg } : undefined}>
              {l}
            </p>
          ))}
        </div>
      </section>

      {/* contact — shared footer component on every page */}
      <SectionRule label="contact" />
      <footer id="contact" className="px-6 py-16 md:px-10 md:py-24">
        <a
          href={`mailto:${person.email}`}
          className="block text-[clamp(1.5rem,5vw,3rem)] leading-tight break-all hover:underline"
          style={{ color: accent }}
        >
          <span style={{ color: dim }}>$ mail </span>
          {person.email}
        </a>
        <p className="mt-6 max-w-[52ch] text-sm" style={{ color: dim }}>
          {contact.line}
        </p>
        <a
          href={person.resumeHref}
          className="mt-6 inline-block border px-4 py-2 text-sm hover:bg-[#e9e9ee] hover:text-black"
          style={{ borderColor: line }}
        >
          [ resume.pdf ]
        </a>
      </footer>
    </div>
  );
}
