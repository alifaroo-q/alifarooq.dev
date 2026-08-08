/**
 * The foundation's proof page.
 *
 * It exists to show that the tokens resolve on both grounds and nothing more —
 * the home page itself is a later ticket. Every colour here comes from a
 * token; not one is set inline. That is a correctness rule, not a style one:
 * an inline colour beats the variables the row flip redefines, and leaves
 * part of the subtree stranded on the wrong ground.
 *
 * The type is deliberately flat. Only body and label sizes are settled, so
 * this page uses only those two rather than inventing a heading step at the
 * call site.
 */

const facts = [
  { term: "Role", detail: "Full stack engineer" },
  { term: "Location", detail: "Lahore, Pakistan — remote" },
  { term: "Availability", detail: "Open to work" },
];

const grounds = [
  { index: "01", name: "Page ground", note: "Set by the reader's system" },
  { index: "02", name: "Opposite ground", note: "Reached by hovering a row" },
];

/**
 * The measure, centred. Hairlines run full-bleed rather than boxing content,
 * so the rules start at the viewport edge and only the text is held in.
 */
function Measure({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-measure px-6">{children}</div>;
}

export default function Home() {
  return (
    <main id="main">
      <header className="border-border border-b py-16">
        <Measure>
          <p className="text-foreground-label text-label uppercase">
            Foundation
          </p>
          <h1 className="mt-6 font-medium">Ali Farooq</h1>
          <p className="text-foreground-muted mt-4">
            The toolchain and the theme, with a page bare enough to see them.
          </p>

          <dl className="mt-10 grid gap-2 sm:grid-cols-[8rem_1fr]">
            {facts.map((fact) => (
              <div className="contents" key={fact.term}>
                <dt className="text-foreground-label text-label pt-1 uppercase">
                  {fact.term}
                </dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </Measure>
      </header>

      <section aria-labelledby="grounds">
        <Measure>
          <h2
            className="text-foreground-label text-label pt-16 pb-6 uppercase"
            id="grounds"
          >
            The two grounds
          </h2>
        </Measure>

        <ul>
          {grounds.map((ground) => (
            <li className="border-border border-t" key={ground.index}>
              <a
                className="flip-ground block bg-background text-foreground"
                href="#grounds"
              >
                <Measure>
                  <div className="flex gap-6 py-5">
                    {/* The index numbers a row for the eye. A screen reader
                        already has the list. */}
                    <span aria-hidden="true" className="text-foreground-label">
                      {ground.index}
                    </span>
                    <span className="flex-1">
                      {ground.name}
                      <span
                        aria-hidden="true"
                        className="text-foreground-label px-2"
                      >
                        /
                      </span>
                      <span className="text-foreground-muted">
                        {ground.note}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-accent">
                      &rarr;
                    </span>
                  </div>
                </Measure>
              </a>
            </li>
          ))}
        </ul>
        <div className="border-border border-t" />
      </section>

      <section aria-labelledby="states">
        <Measure>
          <h2
            className="text-foreground-label text-label pt-16 uppercase"
            id="states"
          >
            States
          </h2>

          <div className="border-error-line bg-error-bg mt-6 border p-4">
            <p className="text-error">
              An error reads in its own colour on its own tint. The tint only
              ever sits on the page ground, never on a raised surface.
            </p>
          </div>

          <p className="text-foreground-disabled mt-6">
            Disabled text is a named colour, not a percentage of a live one.
          </p>

          <p className="mt-6 pb-16">
            <a className="text-accent underline" href="#main">
              A link takes the accent
            </a>
            , which belongs to the ground rather than to the theme.
          </p>
        </Measure>
      </section>
    </main>
  );
}
