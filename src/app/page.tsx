import { allCaseStudies } from "content-collections";
import { ContactFooter } from "@/components/contact-footer";
import { Cue } from "@/components/cue";
import { Headline } from "@/components/headline";
import { Portrait } from "@/components/portrait";
import { Clouds, Dunes, Dusk, Port, Shore } from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { StackStrip } from "@/components/stack-strip";
import {
  ACTION_CLASS,
  BASE_LOCATION,
  BASE_UTC,
  CONTACT_EMAIL,
  OPEN_SOURCE_CONVICTION,
  PERSON_NAME,
  PERSON_ROLE,
  PERSON_ROLES,
  PORTRAIT_SRC,
  PROFILE_URLS,
  SITE_URL,
} from "@/lib/site";
import { STACK_CUE } from "@/lib/stack";
import { cn } from "@/lib/utils";

/**
 * The home page.
 *
 * The page is one day on the Karachi coast. The fold is dawn, Work is noon at
 * the port, Open source is the golden hour, About is dusk, and Contact is the
 * night. Each hour ends in a band of scenery and a cue that names the next
 * one, stamped with its time, so the order of the sections is carried by the
 * clock and not by numbers.
 *
 * The copy lives here in TSX and not in an MDX singleton: a singleton makes
 * the schema the layout, and moving a slot would then be a content migration.
 * The case studies are the other way round, free-form prose with a few fields,
 * so they are a collection.
 *
 * Nothing here sets a colour. Every value arrives as a token through a class;
 * see the header of `globals.css`.
 *
 * Order is fixed: fold, Work, Open source, About, Contact. Work comes first
 * because the reader arrives from a resume asking what was built at work, and
 * because the case studies cannot link to code, so the repos carry the
 * verifiability and read better after the claims they back.
 */

const person = {
  name: PERSON_NAME,
  location: `${BASE_LOCATION.split(",")[0]} (${BASE_UTC})`,
  availability: "Open to remote roles",
  hours: "Flexible hours",
  email: CONTACT_EMAIL,
  resumeHref: "/resume.pdf",
};

/**
 * The fold. The headline makes the claim, the sentence under it says what is
 * behind the claim, and one line names the umbrella title and the range under
 * it. Four titles side by side read as a keyword list, so the four live in
 * About, each next to the work that backs it.
 */
const fold = {
  headline: {
    lead: "I build software that",
    accent: "keeps working",
    tail: "when things break.",
  },
  sentence:
    "Two years of AI-automation systems, taken end to end: the database, the queues, the integrations and the dashboard on top.",
  title: PERSON_ROLE,
  range: "backend, full-stack and AI product",
  caption: "Good morning from Karachi",
  cue: { time: "12:00", label: "Noon at the port ↓" },
};

/**
 * Tints for the three case studies, in `order`. The same three colours colour
 * the tags in the fold, so a reader can follow a failure from the headline to
 * the card that answers it.
 */
const TINTS = [
  { tag: "bg-[#f6c8b6]", dot: "bg-coral" },
  { tag: "bg-[#f9dc8d]", dot: "bg-saffron" },
  { tag: "bg-[#bfe0e0]", dot: "bg-sea" },
] as const;

const work = {
  lead: "Three decisions and",
  accent: "what they cost",
  intro:
    "This is client work, and I name the client where I can. Each card is one decision I would defend, along with the bill that came with it.",
  cue: { time: "16:30", label: "Golden hour: the code ↓" },
};

/**
 * The open-source block. It carries no mechanism: the mechanism may only
 * appear below a link, which is what makes the split with the case studies
 * safe, since nothing here can leak upward into the page that shares its
 * subject.
 *
 * The weight is uneven on purpose. Three equal cards would claim a production
 * line, and the claim is the opposite: a conviction held twice. So the
 * conviction leads, `drizzle-tx` is the big card, and the two that started it
 * sit beside it. Only `drizzle-tx` has a page to click into.
 *
 * No npm scope appears here. A scope is how you GET the code; the URL is where
 * the argument for it lives.
 */
const openSource = {
  lead: "Two libraries and",
  accent: "one argument",
  conviction: OPEN_SOURCE_CONVICTION,
  retrofit:
    "Four months later I hit the same wall and answered it the other way.",
  featured: {
    name: "drizzle-tx",
    pitch:
      "I let the handle travel with the request, so it stops showing up in signatures that never touch the database. Drizzle only undoes work when something throws. This library never throws.",
    href: "/open-source/drizzle-tx",
    label: "Read how it holds →",
  },
  origin: [
    {
      name: "result-kit",
      pitch:
        "Where I started. I had built this by hand once already: thirty-nine static methods, and six of them were ever called from outside.",
      href: "https://github.com/alifaroo-q/result-kit",
      page: "/open-source/result-kit",
      pageLabel: "Why there are no classes in it →",
    },
    {
      name: "result-kit-lint",
      pitch:
        "Lint rules that fail the build when a result goes unchecked. Without them, the convention holds for as long as I remember to keep it.",
      href: "https://github.com/alifaroo-q/result-kit-lint",
    },
  ],
  published: "Both are published on npm.",
  cue: { time: "18:40", label: "Dusk, a little about me ↓" },
};

const about = {
  lead: "A bit about",
  accent: "me",
  bio: [
    "I have been a software engineer at Zenkoders since 2024, across the backend, the AI features and the dashboards of client products. Most of what you see here is client work, so it carries their names.",
    "The problems I get handed are the ones where being wrong is expensive.",
  ],
  /**
   * The four titles, each with the work that backs it. Every sentence restates
   * something already on this site or the resume, and each link goes to the page
   * that holds the evidence, so the range is something a reader can check.
   */
  rolesLabel: "Four ways I work",
  roles: [
    {
      title: "Backend engineer",
      line: "NestJS, PostgreSQL and BullMQ queues, with the rules that must hold kept in the database.",
      href: "/work/the-money-rule-in-the-database-not-the-service",
      label: "The money rule →",
    },
    {
      title: "Software engineer",
      line: "Features taken end to end, from the schema to the release, in client products across healthcare, fintech and SaaS.",
      href: "#work",
      label: "Three decisions →",
    },
    {
      title: "AI product engineer",
      line: "AI voice booking, Gmail automation and document extraction. I treat what a model returns like any other input from outside.",
      href: "/work/treating-google-as-a-system-that-will-fail",
      label: "The automation case →",
    },
    {
      title: "Full-stack engineer",
      line: "The Next.js dashboard on top of the queues and the database, and this site.",
      href: "/stack",
      label: "The stack →",
    },
  ],
  rows: [
    {
      span: "2024 to now",
      title: "Software engineer, Zenkoders",
      line: "Backend of client products in healthcare, fintech and SaaS, including Numlix, Mach 1 and Voxena. AI voice booking on BullMQ queues, Gmail automation, document extraction out of PDFs nobody controls.",
      figures: [
        { n: "7,000", of: "inbound leads a month, booked against a calendar" },
        { n: "100", of: "consultants drafting email through it" },
      ],
    },
    {
      span: "2020 to 2024",
      title: "BS Computer Software Engineering",
      line: "DHA Suffa University. Gold medal, top of the batch.",
      figures: [],
    },
  ],
  resumeLabel: "The whole thing, dated and on one page →",
  cue: { time: "21:30", label: "Night, say hello ↓" },
};

const stack = { href: "/stack", label: STACK_CUE };

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  jobTitle: [...PERSON_ROLES],
  url: SITE_URL,
  image: `${SITE_URL}${PORTRAIT_SRC}`,
  sameAs: PROFILE_URLS,
};

/** The line on the scenery that names the next hour and links to it. */
function HourCue({
  href,
  time,
  label,
}: {
  href: string;
  time: string;
  label: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--scene-h)+0.25rem)] z-10 flex justify-center md:bottom-6">
      <a
        className="pill pointer-events-auto min-h-11 gap-3 whitespace-nowrap px-4 py-2 text-sm"
        href={href}
      >
        <span className="font-mono text-foreground-label text-xs">{time}</span>
        <span className="font-semibold">
          <Cue label={label} />
        </span>
      </a>
    </div>
  );
}

export default function Home() {
  const caseStudies = allCaseStudies.toSorted((a, b) => a.order - b.order);

  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has no other insertion point, and the value is a local literal with no user input in it.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        type="application/ld+json"
      />
      <SiteHeader name={person.name} resumeHref={person.resumeHref} />
      <main id="main">
        {/* Dawn. */}
        <section
          aria-label="Introduction"
          className="hour hour-dawn"
          data-hour="dawn"
        >
          <Clouds />
          <div className="wrap grid min-h-svh content-center gap-12 pt-[calc(var(--spacing-header)+2rem)] pb-[calc(var(--scene-h)+3.5rem)] md:pb-[calc(var(--scene-h)*0.5+3rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-20">
            <div className="order-2 lg:order-1" data-enter>
              <Portrait />
              <p className="mt-figure text-center text-foreground-muted">
                <span className="font-mono text-foreground-label text-xs">
                  06:10
                </span>{" "}
                <em className="font-serif">{fold.caption}</em>
              </p>
            </div>
            <div className="order-1 lg:order-2" data-enter>
              <Headline
                accent={fold.headline.accent}
                className="max-w-[16ch] font-extrabold text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[1.02] tracking-[-0.035em]"
                lead={fold.headline.lead}
                tail={fold.headline.tail}
              />
              <p className="mt-figure max-w-measure text-[clamp(1.0625rem,1.7vw,1.25rem)] text-foreground-muted leading-[1.6]">
                {fold.sentence}
              </p>
              <p className="mt-figure font-bold font-display text-[clamp(1.0625rem,1.8vw,1.3125rem)] tracking-tight">
                {fold.title}
                <span aria-hidden="true" className="px-3 text-coral">
                  /
                </span>
                <span className="font-semibold text-foreground-muted">
                  {fold.range}
                </span>
              </p>
              <p className="mt-figure flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground-muted text-sm">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full bg-sea"
                  data-live
                />
                {person.availability}
                <span aria-hidden="true">·</span>
                {person.location}
                <span aria-hidden="true">·</span>
                {person.hours}
              </p>
              <div className="mt-figure flex flex-wrap items-center gap-x-8 gap-y-4">
                <a className={ACTION_CLASS} href="#work">
                  <Cue label="Explore my work ↘" />
                </a>
                <a
                  className="hit font-semibold ink-link"
                  href={`mailto:${person.email}`}
                >
                  <Cue label="Say hello ↗" />
                </a>
              </div>
            </div>
          </div>
          <Shore />
          <HourCue href="#work" label={fold.cue.label} time={fold.cue.time} />
        </section>

        {/* Noon. */}
        <section
          aria-labelledby="work"
          className="hour hour-noon pt-section pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="noon"
        >
          <SectionHead accent={work.accent} id="work" lead={work.lead}>
            {work.intro}
          </SectionHead>
          <div className="wrap mt-group grid gap-8 lg:grid-cols-3 lg:gap-10">
            {caseStudies.map((caseStudy, i) => (
              <a
                className="paper group flex flex-col p-6 md:p-7"
                data-reveal
                href={`/work/${caseStudy.slug}`}
                id={`work-${caseStudy.order}`}
                key={caseStudy.slug}
              >
                <div className="lg:min-h-[3.1rem]">
                  <span
                    className={cn(
                      "inline-block rounded-[1.1rem] border-2 border-ink px-3 py-1 font-medium text-ink text-xs leading-snug",
                      TINTS[i]?.tag,
                    )}
                  >
                    {caseStudy.sector}
                  </span>
                </div>
                <h3 className="mt-flow font-bold text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.15] tracking-tight lg:min-h-[3.45em]">
                  {caseStudy.decision}
                </h3>
                <p className="mt-flow text-foreground-muted">
                  {caseStudy.constraint}
                </p>
                <p className="mt-auto pt-figure font-semibold text-accent">
                  <Cue label={caseStudy.artifactLabel} />
                </p>
              </a>
            ))}
          </div>
          <Port />
          <HourCue
            href="#open-source"
            label={work.cue.label}
            time={work.cue.time}
          />
        </section>

        {/* Golden hour. */}
        <section
          aria-labelledby="open-source"
          className="hour hour-golden pt-section pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="golden"
        >
          <SectionHead
            accent={openSource.accent}
            id="open-source"
            lead={openSource.lead}
          >
            {openSource.conviction}
          </SectionHead>
          <div className="wrap mt-group grid gap-8 lg:gap-10">
            <a
              className="paper grid gap-x-10 gap-y-figure p-6 md:grid-cols-[1fr_auto] md:items-end md:p-8"
              data-reveal
              href={openSource.featured.href}
            >
              <div>
                <span className="inline-block rounded-full border-2 border-ink bg-saffron px-3 py-1 font-medium text-ink text-xs">
                  Has a write-up
                </span>
                <h3 className="mt-flow font-bold text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] tracking-tight">
                  {openSource.featured.name}
                </h3>
                <p className="mt-flow max-w-measure text-foreground-muted">
                  {openSource.featured.pitch}
                </p>
              </div>
              <p className="font-semibold text-accent">
                <Cue label={openSource.featured.label} />
              </p>
            </a>
            <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
              {openSource.origin.map((repo) => (
                <div className="paper p-6" data-reveal key={repo.name}>
                  <h3 className="font-bold text-xl tracking-tight">
                    {repo.name}
                  </h3>
                  <p className="mt-tight text-foreground-muted">{repo.pitch}</p>
                  <p className="mt-flow text-sm">
                    <a className="hit ink-link" href={repo.href}>
                      {repo.href.replace("https://", "")}
                    </a>
                  </p>
                  {repo.page && repo.pageLabel ? (
                    <p className="mt-tight font-semibold text-accent text-sm">
                      <a className="hit" href={repo.page}>
                        <Cue label={repo.pageLabel} />
                      </a>
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <p className="wrap mt-group max-w-measure text-foreground-muted">
            {openSource.retrofit} {openSource.published}
          </p>
          <Dunes />
          <HourCue
            href="#about"
            label={openSource.cue.label}
            time={openSource.cue.time}
          />
        </section>

        {/* Dusk. */}
        <section
          aria-labelledby="about"
          className="hour hour-dusk pt-section pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="dusk"
        >
          <SectionHead accent={about.accent} id="about" lead={about.lead}>
            {about.bio[0]} {about.bio[1]}
          </SectionHead>
          <div className="wrap mt-group">
            <div className="paper p-6 md:p-8" data-reveal>
              <h3 className="font-bold text-xl tracking-tight">
                {about.rolesLabel}
              </h3>
              <dl className="mt-figure grid gap-x-10 gap-y-figure md:grid-cols-2">
                {about.roles.map((role) => (
                  <div key={role.title}>
                    <dt className="font-bold font-display text-lg tracking-tight">
                      {role.title}
                    </dt>
                    <dd className="mt-1 text-foreground-muted">
                      {role.line}
                      <span className="mt-1 block font-semibold text-accent text-sm">
                        <a className="hit" href={role.href}>
                          <Cue label={role.label} />
                        </a>
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="wrap mt-group grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            {about.rows.slice(0, 1).map((row) => (
              <div className="paper p-6 md:p-7" data-reveal key={row.span}>
                <h3 className="mt-tight font-bold text-xl leading-tight tracking-tight">
                  {row.title}
                </h3>
                <p className="mt-1 font-mono text-foreground-label text-xs">
                  {row.span}
                </p>
                <p className="mt-flow text-foreground-muted">{row.line}</p>
                <dl className="mt-figure space-y-3">
                  {row.figures.map((figure) => (
                    <div className="flex items-baseline gap-3" key={figure.n}>
                      <dt className="font-bold font-display text-2xl tabular-nums">
                        {figure.n}
                      </dt>
                      <dd className="text-foreground-muted text-sm">
                        {figure.of}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <div className="grid gap-8 lg:gap-10">
              {about.rows.slice(1).map((row) => (
                <div className="paper p-6 md:p-7" data-reveal key={row.span}>
                  <h3 className="mt-tight font-bold text-xl leading-tight tracking-tight">
                    {row.title}
                  </h3>
                  <p className="mt-1 font-mono text-foreground-label text-xs">
                    {row.span}
                  </p>
                  <p className="mt-flow text-foreground-muted">{row.line}</p>
                </div>
              ))}
              <div className="paper p-6 md:p-7" data-reveal>
                <StackStrip href={stack.href} label={stack.label} />
              </div>
            </div>
          </div>
          <p className="wrap mt-figure font-semibold" data-reveal>
            <a className="hit ink-link" href={person.resumeHref}>
              <Cue label={about.resumeLabel} />
            </a>
          </p>
          <Dusk />
          <HourCue
            href="#contact"
            label={about.cue.label}
            time={about.cue.time}
          />
        </section>
      </main>

      {/* Night. */}
      <ContactFooter />
    </>
  );
}
