import { allCaseStudies } from "content-collections";
import { ContactFooter } from "@/components/contact-footer";
import { Cue } from "@/components/cue";
import { Headline } from "@/components/headline";
import { Portrait } from "@/components/portrait";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { StackStrip } from "@/components/stack-strip";
import {
  ACTION_CLASS,
  CONTACT_EMAIL,
  OPEN_SOURCE_CONVICTION,
  PERSON_NAME,
  PERSON_ROLE,
  PORTRAIT_SRC,
  PROFILE_URLS,
  SITE_URL,
} from "@/lib/site";
import { STACK_CUE } from "@/lib/stack";
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
  // A colon, not the em dash it used to end on. What follows is a list, and a
  // colon is what introduces one; the dash was reading as prose.md's pivot,
  // which short copy has no room to earn.
  positioningLead:
    "I'm a backend engineer who designs for the failure case first:",
  positioningClauses: [
    "the integration that degrades silently,",
    "the payment that must never be captured twice,",
    "the transaction that outgrows the service it started in.",
  ],

  // The micro-line. Location, availability, and nothing that could be read as
  // proof: #8 kept every badge, stat and repo link out of the fold, on the
  // grounds that a fold which produces evidence for its own claim is a fold
  // that does not trust it. The page below is the proof.
  //
  // The `role` row is GONE, and that is the point. It printed "Backend
  // engineer" two inches under a sentence whose first six words are "I'm a
  // backend engineer" — the largest prose on the page. A spec row that repeats
  // the claim above it teaches a reader that the rows are decoration. The two
  // left both say something the sentence does not. `PERSON_ROLE` still reaches
  // the `<head>` and the `Person` block, which is where a machine needs it.
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
  retrofit:
    "Four months later I hit the same wall and answered it the other way.",

  featured: {
    name: "drizzle-tx",
    // #7's pitch as #8 amended it. It lost "22-module" because that number is
    // the case study's, and the case study's home-page heading is literally
    // "22 modules, one transaction boundary" — the same fact twice in one
    // scroll reads as padding rather than emphasis.
    pitch:
      "I let the handle travel with the request, so it stops showing up in signatures that never touch the database. Drizzle only undoes work when something throws. This library never throws.",
    href: "/open-source/drizzle-tx",
    // Names what is behind the click, the way the work rows name their
    // diagram, rather than asking for the click on trust.
    label: "Read how it holds →",
  },

  origin: [
    {
      name: "result-kit",
      pitch:
        "Where I started. I had built this by hand once already: thirty-nine static methods, and six of them were ever called from outside.",
      href: "https://github.com/alifaroo-q/result-kit",
      // #52. The cell keeps its repo link and gains a second line, because
      // the cells are deliberately not links and the visible text is the URL
      // with the protocol cut — pointing `href` inward would print a path
      // where a domain belongs. The label is the featured row's habit at the
      // quieter weight: name what is behind the click.
      page: "/open-source/result-kit",
      pageLabel: "Why there are no classes in it →",
    },
    {
      name: "result-kit-lint",
      // #14's rewrite, which split the sentence at its em-dash.
      pitch:
        "Lint rules that fail the build when a result goes unchecked. Without them, the convention holds for as long as I remember to keep it.",
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
  "I have been a software engineer at Zenkoders since 2024, on the backend of client products. That is why the work above never names a client.",
  "The problems I get handed are the ones where being wrong is expensive.",
  "I'm in Karachi, and open to backend roles.",
];

/**
 * The stack, and the only route to `/stack`.
 *
 * Three case studies argue in depth about a narrow slice — Postgres, Drizzle,
 * one payment integration — and a reader finishing them cannot tell whether
 * anything else has been shipped. Nothing on this site says AWS, Redis, a
 * queue, Docker, or any of the LLM work. That is the gap this closes.
 *
 * IT MOVED OUT OF ABOUT AND INTO THE FOLD, and the note that used to sit here
 * argued against exactly that: "putting a line of nouns above the work would
 * let it outrank three arguments", on the grounds that a reader who got as far
 * as About had already decided to care. That is overruled, not answered. The
 * fold holds the whole screen and there was about 600px of nothing between the
 * actions and the way-out line on a 1080p display, and a held screen has to
 * earn what it holds.
 *
 * The old objection is kept honest by WEIGHT rather than by position, which is
 * the open-source block's device. The strip is the quietest thing in the fold,
 * it is below the actions rather than above them, and it does not flip the
 * ground — that inversion is the site's signal for "a piece of work you can
 * read", and a reference list is not one.
 *
 * It became a LIST of six marks where it was a sentence naming six. What that
 * costs is the sentence's nuance — "Next.js when the frontend is mine",
 * "Postgres underneath and AWS around it" — which said how the six relate and
 * a row of chips cannot. Six is still the count: twelve nouns is the list, and
 * the list is what the separate page is for.
 *
 * The label is NOT written here. It spells a count, so it lives beside the
 * array it counts and `stack.test.ts` holds the two together — a number in a
 * file that cannot see the list is a number that goes wrong quietly.
 */
const stack = {
  href: "/stack",
  // Names what is behind the click, the habit the work rows and the featured
  // repo both keep, at the quietest weight on the page.
  label: STACK_CUE,
};

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
            // The one thing on the site that moves without being asked to, and
            // the reason it may is the same reason the dot exists: the line
            // has to read as current. A slow breathe, settled in `globals.css`.
            data-live
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
 * `image` is the same file About renders, absolute because a relative path in
 * structured data resolves against nothing a consumer can rely on. It is the
 * one field that lets a result carry a face rather than a favicon.
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
  image: `${SITE_URL}${PORTRAIT_SRC}`,
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
        {/* THE FOLD, AND IT HOLDS THE SCREEN.

            One viewport tall, less the header it sits under, so the first
            thing a reader sees is the whole claim and NOTHING of the evidence.
            The work rows start below the bottom edge — that is what makes them
            arrive on the scroll rather than already be there, and it is why
            this section owns a height at all. `svh` rather than `vh`: on a
            phone `vh` is the tallest the viewport ever gets, so the first row
            would be tucked under the browser chrome instead of under the fold.

            `min-h`, never `h`. A short landscape window makes the fold taller
            than the screen rather than clipping the sentence, which is the
            failure that matters.

            THE CONTENT SITS AT THE TOP, and it used to be centred. `my-auto`
            on the block split the fold's slack above AND below it, which cost
            twice. It pushed the claim into the middle of the viewport —
            NN/g's scroll study puts 57% of viewing time above the fold and 65%
            of THAT in the top half, so centring spends the name and the
            sentence on the weaker half. And it left the way-out line stranded
            around three quarters down with dead space under it, where a line
            that means "the page continues past this edge" has to BE at the
            edge. The claim is anchored to the top now and the slack is taken
            lower down — by the actions, which is the block that wants to be at
            the foot. Both halves fixed at once.

            FOUR SLOTS — the name, the claim row (the sentence with the
            micro-line beside it), the stack strip, and the actions. The
            micro-line is IN the claim row rather than a slot of its own, and
            that pairing is the one real decision in here: it went the other
            way first, sitting with the actions, which ranked a control level
            with metadata. It belongs with the sentence, which it annotates.
            Pairing it there also takes about 7rem off the stack, so the fold
            fits a laptop viewport without the sentence and the button fighting
            for the same screen.

            `data-enter` staggers all four in reading order, and it is on a
            `contents` box so it can. The runtime staggers a container's
            CHILDREN, and the actions need `mt-auto` — which only works on a
            flex child of the section itself. `display: contents` generates no
            box, so the four are laid out by the section while still being one
            container's children. Without it the hook and the auto margin want
            two different parents and one of them has to lose. The hook is on
            the CONTAINER because the children take their delay from their
            position in it; a delay written on a block is a delay the next
            block forgets. */}
        <section className="flex min-h-[calc(100svh-var(--spacing-header))] flex-col px-6 pt-section pb-figure md:px-10">
          <div className="contents" data-enter>
            {/* The name is non-negotiable up here. A reader arriving from a
                LinkedIn link needs to confirm within a second that they are in
                the right place, which is why #10 did not adopt the runner-up
                take's inverted fold. */}
            <Headline className="font-medium text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] tracking-tight">
              {person.name}
            </Headline>

            {/* THE CLAIM ROW — the sentence, and the micro-line annotating it.

                `flow` above it, and it is the gap that does the most work on
                this screen. The scale's own answer: `flow` is block to block
                inside ONE thought, and the name and the sentence that finishes
                it are one thought. At `group` the sentence read as a separate
                item in a list. Bound tight to the name it reads as the rest of
                the line.

                The facts sit BESIDE the sentence rather than under it, and
                that is what buys the actions their own rank below. Everything
                on this page is capped at the measure and left-anchored, so
                past about 1100px the right of the fold was empty while the
                stack ran on down past the bottom edge. The micro-line is the
                one block here small enough and quiet enough to go in that
                space: it is an annotation on the claim, not a step after it,
                and beside the first line is where an annotation belongs.

                `lg`, and NOT `sm`. At 640px the measure alone is 544px of the
                560px of content width, so a second column has nothing to sit
                in and both would be squeezed under their own minimums. The two
                clear each other comfortably at 1024px and stack below it.

                The right track is a WIDTH, not a measure and not a gap, so it
                is written here rather than tokenised. It needs a floor because
                the dotted leader inside `Fact` fills whatever it is given, so
                a `max-content` column collapses the leader to nothing; 18rem
                is roughly what the longest row ("Open to backend roles") needs
                before the leader stops being visible. It grows to 24rem where
                there is room, which is the leader getting longer rather than
                the column drifting away from the sentence.

                `items-baseline`, not `items-start`. The sentence is set at up
                to 22px on 1.6 and the micro-line at 14px, so their first lines
                start at different depths inside boxes that begin at the same
                y. Aligned by BOX the metadata floats about 10px high; aligned
                by BASELINE it sits on the sentence's first line, which is the
                thing it annotates. */}
            <div className="mt-flow grid gap-x-section gap-y-group lg:grid-cols-[minmax(0,var(--container-measure))_minmax(18rem,24rem)] lg:items-baseline lg:justify-start">
              <p className="max-w-measure text-[clamp(1.0625rem,2.1vw,1.375rem)] leading-[1.6]">
                {person.positioningLead}{" "}
                {person.positioningClauses.map((clause, i) => (
                  <span key={clause}>
                    {clause}
                    {/* Set at the label size rather than below it. That size
                        is a floor on this site, and a marker is not the thing
                        to make an exception for. */}
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

              {/* `max-w-sm` is 24rem, the same number the grid track tops out
                  at. Below `lg` there is no track to cap it, and a two-row
                  list running the full width of a tablet is 700px of dotted
                  leader between a word and a place name. */}
              <dl className="max-w-sm space-y-1.5">
                <Fact detail={person.location} term="based" />
                <Fact detail={person.availability} live term="status" />
              </dl>
            </div>

            {/* THE STACK STRIP, tucked straight under the claim.

                `group`, which is the scale's answer for "a new thought, and it
                has a sub-heading" — the strip carries its own label, and the
                micro-line beside the sentence has already put the reader in
                the register of quiet facts about the person. The strip
                continues that register rather than starting a rank.

                It is above the actions and it used to be below them. What that
                buys is the fold's one gap landing BETWEEN the facts and the
                thing to do about them, which is the only break on the screen
                worth a gap that size. */}
            <StackStrip
              className="mt-group"
              href={stack.href}
              label={stack.label}
            />

            {/* THE ACTIONS, at the foot of the fold.

                `mt-auto` moved here, and this block is now what spends the
                held screen. The claim and the strip sit at the top as one
                block of facts; the actions drop to the bottom edge and the way
                out sits under them. Everything above is what he is, and the
                last thing before the fold ends is what to do about it.

                `pt-section` is the floor for the case with no slack to take: a
                short window makes the fold taller than the screen, `mt-auto`
                resolves to zero, and the actions still need a gap above them.

                ONE BOX, and the second action is a cue line.

                It was two boxes, and they were the only two on the site.
                Three things were wrong with the pair and the third is the one
                that settles it:

                The second style was written HERE, inline, next to the constant
                that exists so an affordance is not a copied class list.
                `ACTION_CLASS` is imported at the top of this file.

                It was drawn in `--border-strong`, which `globals.css` measures
                at 1.76:1 on the dark ground and 1.73:1 on the light one. SC
                1.4.11 asks 3:1 of a control's boundary, so the box was a fail
                — and the same file already holds `--error-line` to that rule
                by name.

                And the site does not do this anywhere else. The header gives
                Resume and Contact as plain links; every work row, every repo
                and the stack line end in a cue with an arrow. Two competing
                outlines in the fold was the register of a landing page, not of
                this one.

                So the resume keeps the box, because a download is the one
                thing here that is not navigation. Contact becomes what every
                other invitation on the site is. The address is still in the
                fold, which is the half of the pair worth keeping.

                `items-center` and not the row's default stretch: a one-line
                text link stretched to a 44px box would sit at its top edge,
                which is the misalignment it is here to avoid. */}
            <div className="mt-auto flex flex-wrap items-center gap-x-figure gap-y-tight pt-section">
              <a className={ACTION_CLASS} href={person.resumeHref}>
                Download resume
              </a>
              <a className="text-accent" href={`mailto:${person.email}`}>
                <Cue label="Get in touch →" />
              </a>
            </div>
          </div>

          {/* The one line the held screen costs, and the reason it is cheap.

              A fold that fills the viewport hides the evidence under it, so it
              has to say that there IS evidence under it — otherwise a reader
              who does not scroll has read a claim and left. It names the
              section rather than saying "scroll", because the arrow already
              says which way and the label is the only part carrying a fact.

              `mt-group`, because the actions above it now take the slack. The
              cue held `mt-auto` itself while it was the last thing in the
              fold; two auto margins in one column split the free space between
              them and would push the actions back up into the middle of the
              screen. One block takes the slack and the cue follows it at a
              fixed step.

              `group` and not `flow`: the actions are a different thought from
              the way out of the page, and this is the gap that says so.

              Outside `data-enter` on purpose: the stagger is the fold's four
              slots and this is not a fifth, it is the way out of them.

              It writes its own arrow rather than going through `Cue`. Every
              cue on the site ends in `→` and nudges right on hover; this one
              points DOWN, and a right-moving down arrow is two directions in
              one gesture. The arrow is `aria-hidden` for the reason `Cue`
              hides its own: the link already says where it goes. */}
          <a
            className="mt-group self-start text-foreground-label text-label uppercase hover:text-accent"
            href="#work"
          >
            Work{" "}
            <span aria-hidden="true" className="fold-cue inline-block">
              ↓
            </span>
          </a>
        </section>

        {/* WORK — rows, never cards. A reader counts boxes and infers a
            sequence before reading a word, which is the reading #7 rejected
            for the open-source block and the one #6's decision-led headings
            cannot afford either. The label is "Work": "Case studies"
            announces a genre and primes the reader for marketing copy. */}
        <SectionHead id="work" label="Work" />
        <section aria-labelledby="work">
          {/* Every row starts below the fold's bottom edge, so every row is
              scrolled to rather than landed on. `data-reveal` scrubs each one
              against its own progress up the screen — it runs on the scroll,
              not alongside it, so it also runs backwards. */}
          {work.map((caseStudy, i) => (
            <a
              className={cn(
                "flip-ground group grid grid-cols-[2.5rem_1fr] gap-x-4 bg-background px-6 py-8 text-foreground md:grid-cols-[4rem_1fr] md:px-10 md:py-10",
                // The rule between two rows, and only between two rows. The
                // last row used to draw one as well, which sat directly on the
                // next section head's own top rule — a 2px line made of two
                // 1px ones. Now that the head takes `mt-section` the two would
                // be a hairline, 56px of nothing, and a second hairline. The
                // head's rule closes the stack; this one only divides it.
                i < work.length - 1 && "border-border border-b",
              )}
              data-reveal
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
              <div className="max-w-measure">
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
                <h3 className="mt-tight font-medium text-[clamp(1.3125rem,3vw,1.875rem)] leading-tight">
                  {caseStudy.decision}
                </h3>
                <p className="mt-flow text-foreground-muted">
                  {caseStudy.constraint}
                </p>
                {/* The diagram stays off this page. It is the strongest asset
                    each slot has and the one thing that cannot be skimmed —
                    inline, it is spent on people who will not look, and it
                    removes the only real reason to click. Naming it turns
                    that withholding into a promise, where "Read the case
                    study" asks for the click on trust alone. */}
                <p className="mt-flow text-accent">
                  <Cue label={caseStudy.artifactLabel} />
                </p>
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
          {/* The conviction, and the one clause the retrofit gets up here.

              `pt-group` and not the 56px it opened with. The section head now
              carries 56px above it, and a section that then puts another 56px
              between its label and its first line leaves the label floating
              between the two — as near to the section it ended as to the one
              it opens. `group` is the scale's step for "a new thought under a
              sub-heading", which is what this is. */}
          <div className="px-6 pt-group pb-12 md:px-10">
            <div className="max-w-measure">
              <p className="text-[clamp(1.1875rem,2.6vw,1.625rem)] leading-[1.4]">
                {openSource.conviction}
              </p>
              <p className="mt-flow text-foreground-muted">
                {openSource.retrofit}
              </p>
            </div>
          </div>

          {/* The feature. A row, like the work rows, because it is the same
              kind of promise: one click, one page. It is the only thing in
              this section that flips the ground, which is the section's
              weighting done structurally rather than stated. */}
          <a
            className="flip-ground block border-border border-y bg-background px-6 py-8 text-foreground md:px-10 md:py-10"
            data-reveal
            href={openSource.featured.href}
          >
            <div className="max-w-measure">
              <h3 className="font-medium text-[clamp(1.3125rem,3vw,1.875rem)] leading-tight">
                {openSource.featured.name}
              </h3>
              <p className="mt-flow text-foreground-muted">
                {openSource.featured.pitch}
              </p>
              <p className="mt-flow text-accent">
                <Cue label={openSource.featured.label} />
              </p>
            </div>
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
                data-reveal
                key={repo.name}
              >
                <div className="max-w-measure">
                  <h3 className="font-medium text-lg">{repo.name}</h3>
                  <p className="mt-tight text-foreground-muted text-sm">
                    {repo.pitch}
                  </p>
                  <p className="mt-flow">
                    <a
                      className="text-sm underline underline-offset-[0.2em] hover:text-accent"
                      href={repo.href}
                    >
                      {repo.href.replace("https://", "")}
                    </a>
                  </p>
                  {/* The write-up, where one exists (#52). Below the repo
                      link, not instead of it: the repo is what the cell
                      promises, and the page is the thing a link to GitHub
                      cannot signal — that there is an argument behind the
                      name. */}
                  {/* Both halves, not just the path: the cue line needs its
                      label to name what is behind the click, and a link with
                      an href and nothing to say is not the thing #52 asked
                      for. `"page" in repo` only ever proved the first half. */}
                  {repo.page && repo.pageLabel && (
                    <p className="mt-tight">
                      <a className="text-accent text-sm" href={repo.page}>
                        <Cue label={repo.pageLabel} />
                      </a>
                    </p>
                  )}
                </div>
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
          data-reveal
        >
          <Portrait />
          <div className="max-w-measure space-y-flow text-foreground-muted">
            {/* The stack line that used to close this block is gone, and it
                is in the fold now. See the note on `stack` above: About is
                three lines of biography again, which is what it was before the
                list needed somewhere to live. */}
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
