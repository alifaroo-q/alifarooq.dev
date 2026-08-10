import { allCaseStudies } from "content-collections";
import { ContactFooter } from "@/components/contact-footer";
import { Portrait } from "@/components/portrait";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import {
  ACTION_CLASS,
  CONTACT_EMAIL,
  OPEN_SOURCE_CONVICTION,
  PERSON_NAME,
  PERSON_ROLE,
  PROFILE_URLS,
  SITE_URL,
} from "@/lib/site";
import { cn } from "@/lib/utils";

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
  name: PERSON_NAME,

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
  role: PERSON_ROLE,
  location: "Karachi, Pakistan",
  availability: "Open to backend roles",

  // The same string the footer prints, read from one place — the fold and the
  // contact section both carry the address, and two literals of it is one edit
  // away from a page that disagrees with itself.
  email: CONTACT_EMAIL,
  // Short and year-free, so a link pasted into an application does not go
  // stale. The file itself is #32's.
  resumeHref: "/resume.pdf",
};

/**
 * The open-source block (#7, #29).
 *
 * Entirely non-technical, and it carries no mechanism — not because a hiring
 * manager could not follow one, but because the mechanism may only appear
 * below a link. That is what makes the case-study split mechanically safe:
 * if this block cannot explain how anything works, nothing can leak upward
 * into the case study that shares its subject.
 *
 * The weight is uneven on purpose. Three equal cards re-assert the pipeline
 * story visually — a reader counts three boxes and infers a sequence before
 * reading a word — and the claim here is the opposite one: a conviction held
 * twice, not a production line. Equal weight would also promise three clicks
 * when only `drizzle-tx` has a page to click into.
 *
 * So: the conviction leads, `drizzle-tx` is a row, and the two that started it
 * sit beneath as a pair. The `retrofit` line is the whole of what the home
 * page says about the repeat. The argument for it — two implementations of the
 * same type resolving the same question in opposite directions, four months
 * apart — is a named section on the detail page, where a reader has agreed to
 * that level of detail.
 *
 * No npm scope appears here, and none may (#22). The packages are cited by
 * repo name and GitHub URL. A scope is how you GET the code; the URL is where
 * the argument for it lives. "Published on npm" as a bare fact is allowed, and
 * it is what carries `result-kit-lint`, whose entire pitch is that it is
 * tooling somebody can actually run.
 */
const openSource = {
  // #14's pinned conviction specimen, stated once. `result-kit`'s pitch used
  // to end by restating it almost word for word; that clause is cut here, on
  // the precedent #14 set when it cut the About line for restating the
  // positioning sentence. Saying it twice in one screen reads as padding.
  conviction: OPEN_SOURCE_CONVICTION,
  retrofit: "The same conviction, re-derived rather than reused.",

  featured: {
    name: "drizzle-tx",
    // #7's pitch as #8 amended it. It lost "22-module" because that number is
    // the case study's, and the case study's home-page heading is literally
    // "22 modules, one transaction boundary" — the same fact twice in one
    // scroll reads as padding rather than emphasis.
    pitch:
      "The same idea where it cost the most: automatic transaction handling across a service too large to thread a handle through, on a database layer that only knows how to undo work when something throws.",
    href: "/open-source/drizzle-tx",
    // Names what is behind the click, the way the work rows name their
    // diagram, rather than asking for the click on trust.
    label: "Read how it holds →",
  },

  origin: [
    {
      name: "result-kit",
      pitch:
        "Where it started: a TypeScript library that makes failure part of what a function returns.",
      href: "https://github.com/alifaroo-q/result-kit",
    },
    {
      name: "result-kit-lint",
      // #14's rewrite, which split the sentence at its em-dash.
      pitch:
        "A convention nobody enforces is a convention that decays. Lint rules that fail the build when a result goes unchecked.",
      href: "https://github.com/alifaroo-q/result-kit-lint",
    },
  ],

  published: "Both are published on npm.",
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
 * The sentence and the row print the SAME string from here, because the whole
 * device is that they match — two call sites formatting a number the same way
 * by coincidence is one edit away from not matching. What differs is only how
 * each carries it: a superscript inside prose, a column entry beside a row.
 *
 * Decorative, and hidden from assistive technology at both call sites: a
 * screen reader gets the sentence unbroken and then gets the rows in the same
 * order, which is the argument without the visual crutch.
 */
function marker(n: number) {
  return String(n).padStart(2, "0");
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

/**
 * The site's only structured data — `Person`, on this page and no other (#16).
 *
 * It is the one piece that ties the site to the name a recruiter types, and
 * the reason it is here rather than in the root layout is that "on the home
 * page" is the whole of the decision: a `Person` block repeated on five pages
 * claims five people.
 *
 * `sameAs` carries both handles spelled out, because they do not match —
 * `alifaroo-q` on GitHub, `itsalifarooq` on LinkedIn — so anyone deriving one
 * from the other gets it wrong.
 *
 * No `email` and no `address`. Both are already visible to a human on this
 * page, nothing renders the machine-readable copy, and the email version is a
 * gift to scrapers. `BreadcrumbList` is not here either: it exists to render a
 * trail Google will not show for a two-level, five-page site.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  jobTitle: PERSON_ROLE,
  url: SITE_URL,
  sameAs: PROFILE_URLS,
};

export default function Home() {
  // Ordered by the collection's own field, not by filename or read order —
  // the row order is the order the positioning sentence promised, so it
  // cannot be left to whatever the filesystem hands back.
  const work = allCaseStudies.toSorted((a, b) => a.order - b.order);

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other insertion point, and the value is a local literal with no user input in it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        type="application/ld+json"
      />

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
                {/* Set at the label size rather than below it. That size is a
                    floor on this site, and a marker is not the thing to make
                    an exception for. */}
                <sup
                  aria-hidden="true"
                  className="ml-0.5 text-accent text-label"
                >
                  {marker(i + 1)}
                </sup>
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
            <a className={ACTION_CLASS} href={person.resumeHref}>
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
        <section aria-labelledby="work">
          {work.map((caseStudy) => (
            <a
              className="flip-ground group grid grid-cols-[2.5rem_1fr] gap-x-4 border-border border-b bg-background px-6 py-8 text-foreground md:grid-cols-[4rem_1fr] md:px-10 md:py-10"
              href={`/work/${caseStudy.slug}`}
              key={caseStudy.slug}
            >
              {/* The same marker the sentence carried, pointing back — and
                  read off the case study's own `order`, not off where it
                  landed in the array. The row that answers clause two is the
                  one the collection ordered second; a render index only
                  agrees with that by accident, and stops agreeing the moment
                  a study is added, dropped or reordered. */}
              <span
                aria-hidden="true"
                className="pt-1.5 text-accent text-label"
              >
                {marker(caseStudy.order)}
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
        </section>

        {/* OPEN SOURCE — in its settled position. The label is fixed here
            because the order is: evidence reads better after the claims it
            backs, and this is where those claims end. The copy and the
            weighting are in `openSource` above. */}
        <SectionHead id="open-source" label="Open source" />
        <section aria-labelledby="open-source">
          {/* The conviction, and the one clause the retrofit gets up here. */}
          <div className="px-6 pt-14 pb-12 md:px-10">
            <p className="max-w-measure text-[clamp(1.1875rem,2.6vw,1.625rem)] leading-[1.4]">
              {openSource.conviction}
            </p>
            <p className="mt-5 max-w-measure text-foreground-muted">
              {openSource.retrofit}
            </p>
          </div>

          {/* The feature. A row, like the work rows, because it is the same
              kind of promise: one click, one page. It is the only thing in
              this section that flips the ground, which is the section's
              weighting done structurally rather than stated. */}
          <a
            className="flip-ground block border-border border-y bg-background px-6 py-8 text-foreground md:px-10 md:py-10"
            href={openSource.featured.href}
          >
            <h3 className="font-medium text-[clamp(1.3125rem,3vw,1.875rem)] leading-tight">
              {openSource.featured.name}
            </h3>
            <p className="mt-4 max-w-measure text-foreground-muted">
              {openSource.featured.pitch}
            </p>
            <p className="mt-5 text-accent">{openSource.featured.label}</p>
          </a>

          {/* The paired origin, beneath and quieter. The cells are not links:
              three clickable boxes would be the three equal cards this block
              exists to avoid, so the repo URL inside each one carries the
              click and the pair keeps its weight. */}
          <div className="grid md:grid-cols-2">
            {openSource.origin.map((repo, i) => (
              <div
                className={cn(
                  "px-6 py-8 md:px-10",
                  i === 0 && "border-border border-b md:border-r md:border-b-0",
                )}
                key={repo.name}
              >
                <h3 className="font-medium text-lg">{repo.name}</h3>
                <p className="mt-3 max-w-measure text-foreground-muted text-sm">
                  {repo.pitch}
                </p>
                <p className="mt-4">
                  <a
                    className="text-sm underline underline-offset-[0.2em] hover:text-accent"
                    href={repo.href}
                  >
                    {repo.href.replace("https://", "")}
                  </a>
                </p>
              </div>
            ))}
          </div>

          {/* The registry as a bare fact, never a scope string (#22). It is
              the one signal a repo link does not carry, and `result-kit-lint`
              is the pitch that needs it: tooling nobody can install is a
              convention with a README. */}
          <p className="border-border border-t px-6 py-6 text-foreground-label text-sm md:px-10">
            {openSource.published}
          </p>
        </section>

        {/* ABOUT — after the work, not before it. Nobody scrolled for
            biography. */}
        <SectionHead id="about" label="About" />
        <section
          aria-labelledby="about"
          className="grid gap-8 px-6 py-14 md:grid-cols-[9rem_1fr] md:px-10"
        >
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

      {/* CONTACT — the shared footer, full rather than compact. This is the
          one page a reader can arrive at without having read an argument to
          its end, so it is the one that still has something to introduce. */}
      <ContactFooter />
    </>
  );
}
