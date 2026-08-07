/**
 * PROTOTYPE — Variant D: SPEC DOCUMENT
 *
 * Commits to: light and near-monochrome, numbered sections, mono only for
 * labels and metadata (prose stays sans), a persistent left rail, hairline
 * column rules, and tabular rows with real column headers. No cards, no
 * radius, no shadow, no hero. High density, quiet register — the page reads
 * like an engineering document rather than a pitch.
 */

import { about, contact, openSource, person, work } from "../content";

const paper = "#fcfcfb";
const ink = "#141414";
const soft = "#5c5c5c";
const rule = "#dcdcd8";
const link = "#1a4d8f";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase" style={{ color: soft }}>
      {children}
    </span>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t" style={{ borderColor: ink }}>
      <div className="grid md:grid-cols-[8rem_1fr]">
        <div className="border-r px-5 py-4 md:py-8" style={{ borderColor: rule }}>
          <div className="sticky top-4">
            <p className="font-mono text-[0.625rem] tracking-[0.16em]" style={{ color: soft }}>
              {n}
            </p>
            <h2 className="font-mono mt-1 text-[0.6875rem] tracking-[0.16em] uppercase">{title}</h2>
          </div>
        </div>
        <div className="px-5 py-8 md:px-8">{children}</div>
      </div>
    </section>
  );
}

export function VariantD() {
  return (
    <div className="min-h-dvh font-sans" style={{ background: paper, color: ink }}>
      <div className="mx-auto max-w-[68rem] border-x" style={{ borderColor: rule }}>
        {/* document header */}
        <header
          className="flex items-center justify-between border-b px-5 py-2.5 font-mono text-[0.6875rem]"
          style={{ borderColor: rule, color: soft }}
        >
          <span>alifarooq.dev</span>
          <nav className="flex gap-5">
            <a href={person.resumeHref} className="underline underline-offset-2 hover:text-black">
              résumé.pdf
            </a>
            <a href="#contact" className="underline underline-offset-2 hover:text-black">
              contact
            </a>
          </nav>
        </header>

        {/* fold — a title block plus a fields table. No hero. */}
        <div className="grid md:grid-cols-[8rem_1fr]">
          <div className="border-r px-5 py-6 md:py-10" style={{ borderColor: rule }}>
            <Label>00</Label>
          </div>
          <div className="px-5 py-6 md:px-8 md:py-10">
            <h1 className="text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[0.95] font-medium tracking-[-0.02em]">
              {person.name}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.9vw,1.25rem)] leading-[1.5] font-medium">
              {person.positioning}
            </p>

            <dl
              className="mt-8 grid max-w-2xl grid-cols-[6.5rem_1fr] border-t text-[0.8125rem]"
              style={{ borderColor: rule }}
            >
              {[
                ["Role", person.role],
                ["Based", person.location],
                ["Status", person.availability],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b py-2 pr-4" style={{ borderColor: rule }}>
                    <Label>{k}</Label>
                  </dt>
                  <dd className="border-b py-2" style={{ borderColor: rule }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-6 font-mono text-[0.75rem]">
              <a
                href={person.resumeHref}
                className="underline underline-offset-4 hover:no-underline"
                style={{ color: link }}
              >
                ↓ download résumé
              </a>
              <a href="#contact" className="underline underline-offset-4 hover:no-underline" style={{ color: link }}>
                → get in touch
              </a>
            </div>
          </div>
        </div>

        {/* 01 work — tabular, with column headers */}
        <Section n="01" title="Work">
          <div
            className="hidden grid-cols-[16rem_1fr] gap-x-8 border-b pb-2 md:grid"
            style={{ borderColor: rule }}
          >
            <Label>Context</Label>
            <Label>Decision · constraint</Label>
          </div>
          {work.map((w, i) => (
            <div
              key={w.id}
              className="grid gap-y-3 border-b py-7 md:grid-cols-[16rem_1fr] md:gap-x-8"
              style={{ borderColor: rule }}
            >
              <div>
                <p className="font-mono text-[0.625rem] tracking-[0.16em]" style={{ color: soft }}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-snug" style={{ color: soft }}>
                  {w.eyebrow}
                </p>
              </div>
              <div>
                <h3 className="max-w-[34ch] text-[1.125rem] leading-snug font-medium">{w.decision}</h3>
                <p className="mt-3 max-w-[70ch] text-[0.9375rem] leading-[1.65]" style={{ color: soft }}>
                  {w.constraint}
                </p>
                <a
                  href={w.href}
                  className="mt-4 inline-block font-mono text-[0.75rem] underline underline-offset-4 hover:no-underline"
                  style={{ color: link }}
                >
                  → {w.artifact.toLowerCase()}
                </a>
              </div>
            </div>
          ))}
        </Section>

        {/* 02 open source */}
        <Section n="02" title="Open source">
          <p className="max-w-[44ch] text-[clamp(1.0625rem,2vw,1.375rem)] leading-[1.45] font-medium">
            {openSource.conviction}
          </p>
          <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-[1.65]" style={{ color: soft }}>
            {openSource.retrofit}
          </p>

          <div className="mt-9 border-t pt-7" style={{ borderColor: ink }}>
            <div className="grid gap-y-3 md:grid-cols-[16rem_1fr] md:gap-x-8">
              <div>
                <Label>Featured</Label>
                <p className="font-mono mt-1.5 text-[0.9375rem]">{openSource.featured.name}</p>
              </div>
              <div>
                <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65]" style={{ color: soft }}>
                  {openSource.featured.pitch}
                </p>
                <a
                  href={openSource.featured.href}
                  className="mt-4 inline-block font-mono text-[0.75rem] underline underline-offset-4 hover:no-underline"
                  style={{ color: link }}
                >
                  → {openSource.featured.link.toLowerCase()}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-7 border-t pt-7" style={{ borderColor: rule }}>
            <div className="grid gap-y-4 md:grid-cols-[16rem_1fr] md:gap-x-8">
              <Label>Origin</Label>
              <div className="space-y-4">
                {openSource.origin.map((o) => (
                  <div key={o.name} className="grid gap-x-4 md:grid-cols-[9rem_1fr]">
                    <a
                      href={o.href}
                      className="font-mono text-[0.8125rem] underline underline-offset-4 hover:no-underline"
                      style={{ color: link }}
                    >
                      {o.name}
                    </a>
                    <p className="max-w-[60ch] text-[0.875rem] leading-[1.6]" style={{ color: soft }}>
                      {o.pitch}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 03 about */}
        <Section n="03" title="About">
          <div className="grid gap-y-5 md:grid-cols-[16rem_1fr] md:gap-x-8">
            <div
              className="grid h-24 w-24 place-items-center border font-mono text-[0.625rem]"
              style={{ borderColor: rule, color: soft }}
            >
              [ photo ]
            </div>
            <div className="max-w-[70ch] space-y-3 text-[0.9375rem] leading-[1.7]" style={{ color: soft }}>
              {about.lines.map((l, i) => (
                <p key={l} style={i === 0 ? { color: ink } : undefined}>
                  {l}
                </p>
              ))}
            </div>
          </div>
        </Section>

        {/* 04 contact — shared footer */}
        <Section n="04" title="Contact">
          <div className="grid gap-y-4 md:grid-cols-[16rem_1fr] md:gap-x-8" id="contact">
            <Label>Email</Label>
            <div>
              <a
                href={`mailto:${person.email}`}
                className="font-mono text-[1.125rem] break-all underline underline-offset-4 hover:no-underline"
                style={{ color: link }}
              >
                {person.email}
              </a>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-[1.65]" style={{ color: soft }}>
                {contact.line}
              </p>
              <a
                href={person.resumeHref}
                className="mt-4 inline-block font-mono text-[0.75rem] underline underline-offset-4 hover:no-underline"
                style={{ color: link }}
              >
                ↓ résumé.pdf
              </a>
            </div>
          </div>
        </Section>

        <div className="border-t px-5 py-3 font-mono text-[0.625rem]" style={{ borderColor: rule, color: soft }}>
          end of document
        </div>
      </div>
    </div>
  );
}
