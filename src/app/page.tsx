import { allCaseStudies } from "content-collections";
import { Portrait } from "@/components/portrait";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";

/**
 * The home page.
 *
 * The copy lives here in TSX rather than in a `home.mdx` singleton (#24). A
 * singleton makes the schema BE the layout: every slot on this page would
 * become a frontmatter field, and moving a slot would then be a content
 * migration. The case studies are the other way round — they are free-form
 * prose with a handful of fields, so they are a collection.
 *
 * Nothing here sets a colour. Every value arrives as a token through a class,
 * which is what lets a work row invert its whole subtree at once. See the
 * header of `globals.css`; it is a correctness rule, not a preference.
 *
 * Order is fixed by #8: fold → Work → Open source → About → Contact. Work
 * precedes open source because the reader arrives from a resume or a LinkedIn
 * profile asking what he built at work — and because the case studies cannot
 * link to code, so the repos carry the verifiability load and read better
 * AFTER the claims they back.
 */

const person = {
  name: "Ali Farooq",

  /**
   * #8's positioning sentence, cut at its existing commas. Not a rewrite —
   * the same string, split so each clause can be marked against the work row
   * it promises. The sentence IS the page's table of contents: three clauses,
   * three case studies, in the order the sections appear. Marking it is the
   * one device on the page that no other terminal portfolio has (#10), and it
   * is available only because #8 wrote the sentence that way.
   *
   * It deliberately spends no named fact — no module count, no metric, no
   * client sector. That is what lets every concrete detail arrive after the
   * abstraction instead of competing with it.
   */
  positioningLead:
    "I'm a backend engineer who designs for the failure case first —",
  positioningClauses: [
    "the integration that degrades silently,",
    "the payment that must never be captured twice,",
    "the transaction that outgrows the service it started in.",
  ],

  // The micro-line. Role, location, availability, and nothing that could be
  // read as proof: #8 kept every badge, stat and repo link out of the fold,
  // on the grounds that a fold which produces evidence for its own claim is
  // a fold that does not trust it. The page below is the proof.
  role: "Backend engineer",
  location: "Karachi, Pakistan",
  availability: "Open to backend roles",

  email: "hello@alifarooq.dev",
  // Short and year-free, so a link pasted into an application does not go
  // stale. The file itself is #32's.
  resumeHref: "/resume.pdf",
};

/**
 * #8 names the employer exactly once, on this page, and never inside a case
 * study. That single mention is what stops the anonymised work reading as
 * evasion: the clients are nameless BECAUSE the employer is stated.
 *
 * Seniority is a date, not a duration. "Since 2024" is the same fact as "two
 * years" and does the arithmetic in the reader's head rather than handing
 * over a small credential to be discounted before the evidence is read.
 *
 * The second line is one clause. It used to carry three examples, and #14 cut
 * them: they were the positioning sentence's three clauses restated, same
 * structure and same rhythm, so the page read as saying it twice.
 */
const about = [
  "Software engineer at Zenkoders since 2024, working on the backend of client products — which is why the work above is described without naming the clients.",
  "The problems I keep being handed are the ones where being wrong is expensive.",
  "I'm in Karachi, and open to backend roles.",
];

/**
 * Ties a clause of the positioning sentence to the work row that answers it.
 *
 * Decorative, and hidden from assistive technology on purpose: a screen
 * reader gets the sentence unbroken and then gets the rows in the same order,
 * which is the same argument without the visual crutch. Set at the label size
 * rather than below it — that size is a floor on this site, and a marker is
 * not the thing to make an exception for.
 */
function Marker({ n }: { n: number }) {
  return (
    <sup aria-hidden="true" className="ml-0.5 text-accent text-label">
      {String(n).padStart(2, "0")}
    </sup>
  );
}

/** One row of the fold's micro-line, with a dotted leader out to its value. */
function Fact({
  term,
  detail,
  live = false,
}: {
  term: string;
  detail: string;
  live?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="flex flex-1 items-baseline gap-3 text-foreground-label text-sm after:block after:h-0 after:flex-1 after:border-border-strong after:border-b after:border-dotted after:content-['']">
        {term}
      </dt>
      <dd className="flex items-baseline gap-2 text-sm">
        {/* A dot, not a word. #8 wants availability stated outright and #10
            kept this one UI convention from the register it otherwise
            stripped: it is the cheapest way to make the line read as current
            rather than as boilerplate. */}
        {live ? (
          <span
            aria-hidden="true"
            className="inline-block size-1.5 self-center rounded-full bg-accent"
          />
        ) : null}
        {detail}
      </dd>
    </div>
  );
}

export default function Home() {
  // Ordered by the collection's own field, not by filename or read order —
  // the row order is the order the positioning sentence promised, so it
  // cannot be left to whatever the filesystem hands back.
  const work = allCaseStudies.toSorted((a, b) => a.order - b.order);

  return (
    <>
      <SiteHeader name={person.name} resumeHref={person.resumeHref} />

      <main id="main">
        {/* THE FOLD — four slots: name, sentence, micro-line, action pair. */}
        <section className="px-6 pt-20 pb-20 md:px-10 md:pt-28">
          {/* The name is non-negotiable up here. A reader arriving from a
              LinkedIn link needs to confirm within a second that they are in
              the right place, which is why #10 did not adopt the runner-up
              take's inverted fold. */}
          <h1 className="font-medium text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] tracking-tight">
            {person.name}
          </h1>

          <p className="mt-10 max-w-measure text-[clamp(1.0625rem,2.1vw,1.375rem)] leading-[1.6]">
            {person.positioningLead}{" "}
            {person.positioningClauses.map((clause, i) => (
              <span key={clause}>
                {clause}
                <Marker n={i + 1} />
                {i < person.positioningClauses.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <dl className="mt-12 max-w-md space-y-1.5">
            <Fact detail={person.role} term="role" />
            <Fact detail={person.location} term="based" />
            <Fact detail={person.availability} live term="status" />
          </dl>

          {/* The action pair. No inventory line above it — the sentence is
              already the table of contents, and a second line under it would
              summarise a page the reader can see. A fold with two claims has
              none. */}
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              className="border border-accent px-5 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              href={person.resumeHref}
            >
              Download resume
            </a>
            <a
              className="border border-border-strong px-5 py-2.5 transition-colors hover:bg-foreground hover:text-background"
              href={`mailto:${person.email}`}
            >
              Get in touch
            </a>
          </div>
        </section>

        {/* WORK — rows, never cards. A reader counts boxes and infers a
            sequence before reading a word, which is the reading #7 rejected
            for the open-source block and the one #6's decision-led headings
            cannot afford either. The label is "Work": "Case studies"
            announces a genre and primes the reader for marketing copy. */}
        <SectionHead id="work" label="Work" />
        <div>
          {work.map((caseStudy, i) => (
            <a
              className="flip-ground group grid grid-cols-[2.5rem_1fr] gap-x-4 border-border border-b bg-background px-6 py-8 text-foreground md:grid-cols-[4rem_1fr] md:px-10 md:py-10"
              href={`/work/${caseStudy.slug}`}
              key={caseStudy.slug}
            >
              {/* The same marker the sentence carried, pointing back. */}
              <span
                aria-hidden="true"
                className="pt-1.5 text-accent text-label"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                {/* The sector, one level up and never the scheme or the niche
                    (#6). It carries the context a hiring manager scans for —
                    did he work in a domain like mine — at almost no visual
                    cost, while the heading keeps the weight on judgment. */}
                <p className="text-foreground-label text-label uppercase">
                  {caseStudy.sector}
                </p>
                {/* The decision IS the heading. A slot that surveys a project
                    reads as documentation; one that names a decision reads as
                    judgment, which is what is being assessed. */}
                <h3 className="mt-2 max-w-[30ch] font-medium text-[clamp(1.3125rem,3vw,1.875rem)] leading-tight">
                  {caseStudy.decision}
                </h3>
                <p className="mt-4 max-w-measure text-foreground-muted">
                  {caseStudy.constraint}
                </p>
                {/* The diagram stays off this page. It is the strongest asset
                    each slot has and the one thing that cannot be skimmed —
                    inline, it is spent on people who will not look, and it
                    removes the only real reason to click. Naming it turns
                    that withholding into a promise, where "Read the case
                    study" asks for the click on trust alone. */}
                <p className="mt-5 text-accent">{caseStudy.artifactLabel}</p>
              </div>
            </a>
          ))}
        </div>

        {/* OPEN SOURCE — the slot, in its settled position. The conviction
            lead, the featured repo and the paired origin are #29's, along
            with the drizzle-tx page they point at. The label is fixed here
            because the order is: evidence reads better after the claims it
            backs, and this is where those claims end. */}
        <SectionHead id="open-source" label="Open source" />

        {/* ABOUT — after the work, not before it. Nobody scrolled for
            biography. */}
        <SectionHead id="about" label="About" />
        <section className="grid gap-8 px-6 py-14 md:grid-cols-[9rem_1fr] md:px-10">
          <Portrait />
          <div className="max-w-measure space-y-4 text-foreground-muted">
            {about.map((line, i) => (
              <p className={i === 0 ? "text-foreground" : undefined} key={line}>
                {line}
              </p>
            ))}
          </div>
        </section>
      </main>

      {/* CONTACT — the slot. The section itself is shared across every page
          on the site and belongs to #30, which also owns the form and the
          route behind it. It is a real section rather than a header mailto
          because a mailto has no scroll depth, and #5's ordered funnel ends
          on this one reaching the reader. */}
      <SectionHead id="contact" label="Contact" />
    </>
  );
}
