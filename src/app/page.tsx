import { ContactFooter } from "@/components/contact-footer";
import { Cue } from "@/components/cue";
import { Headline } from "@/components/headline";
import { Portrait } from "@/components/portrait";
import {
  Clouds,
  Dunes,
  Dusk,
  FishMarket,
  Port,
  SeaView,
  Shore,
} from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { BRAND_MARKS } from "@/lib/brand-marks";
import {
  ACTION_CLASS,
  BASE_LOCATION,
  BASE_UTC,
  CONTACT_EMAIL,
  PERSON_NAME,
  PERSON_ROLE,
  PERSON_ROLES,
  PORTRAIT_SRC,
  PROFILE_URLS,
  SITE_URL,
} from "@/lib/site";

/**
 * The home page.
 *
 * The page is one day on the Karachi coast. The fold is dawn, the four stack
 * hours run from morning to early evening, About is dusk, and Contact is the
 * night. Each hour ends in a band of scenery and a cue that names the next
 * one, stamped with its time, so the order of the sections is carried by the
 * clock and not by numbers.
 *
 * The copy lives here in TSX and not in an MDX singleton: a singleton makes
 * the schema the layout, and moving a slot would then be a content migration.
 *
 * Nothing here sets a colour. Every value arrives as a token through a class;
 * see the header of `globals.css`.
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
    lead: "I build full-stack products with",
    accent: "AI",
    tail: "inside them.",
  },
  sentence:
    "Two years of client products at Zenkoders. Next.js on the front, NestJS and Postgres behind it, shipped on AWS, with LLM features and agents on top.",
  title: PERSON_ROLE,
  range: "full-stack and AI product",
  caption: "Good morning from Karachi",
  cue: { time: "08:30", label: "Morning at the fish market ↓" },
};

type Tool = { label: string; mark?: keyof typeof BRAND_MARKS };

/**
 * The stack, one group per hour. `id` is the anchor the nav and About link to,
 * and `hour` is the sky class and the `data-hour` the nav lights from.
 */
const HOURS = [
  {
    id: "full-stack",
    hour: "morning",
    time: "08:30",
    lead: "One",
    accent: "language,",
    tail: "front to back",
    line: "TypeScript from the browser to the database. NestJS on the server, Next.js for the dashboards on top.",
    tools: [
      { label: "Node.js", mark: "nodedotjs" },
      { label: "Next.js", mark: "nextdotjs" },
      { label: "NestJS", mark: "nestjs" },
    ],
    Scenery: FishMarket,
    cue: { time: "12:00", label: "Noon at the port ↓" },
  },
  {
    id: "data",
    hour: "noon",
    time: "12:00",
    lead: "Where the",
    accent: "data",
    tail: "lives",
    line: "Postgres is my default store, and I put the rules that must hold in it. Redis for cache, locks and BullMQ queues.",
    tools: [
      { label: "Postgres", mark: "postgresql" },
      { label: "Redis", mark: "redis" },
    ],
    Scenery: Port,
    cue: { time: "16:30", label: "Golden hour on the dunes ↓" },
  },
  {
    id: "cloud",
    hour: "golden",
    time: "16:30",
    lead: "From a commit to",
    accent: "production",
    line: "Docker images, built and tested in GitHub Actions, shipped to AWS.",
    tools: [
      { label: "Docker", mark: "docker" },
      { label: "AWS", mark: "amazonwebservices" },
      { label: "GitHub Actions", mark: "githubactions" },
      { label: "CI/CD" },
    ],
    Scenery: Dunes,
    cue: { time: "17:45", label: "Evening at Sea View ↓" },
  },
  {
    id: "ai",
    hour: "evening",
    time: "17:45",
    lead: "Models in the product,",
    accent: "agents",
    tail: "at my desk",
    line: "AI voice booking, Gmail automation and document extraction, built on OpenAI and LangChain. I write code with Claude Code, Copilot and Cursor every day.",
    tools: [
      { label: "LLMs" },
      { label: "Agents" },
      { label: "OpenAI", mark: "openai" },
      { label: "LangChain", mark: "langchain" },
      { label: "Claude Code", mark: "claude" },
      { label: "GitHub Copilot", mark: "githubcopilot" },
      { label: "Cursor", mark: "cursor" },
    ],
    Scenery: SeaView,
    cue: { time: "18:40", label: "Dusk, a little about me ↓" },
  },
] satisfies {
  id: string;
  hour: string;
  time: string;
  lead: string;
  accent: string;
  tail?: string;
  line: string;
  tools: Tool[];
  Scenery: () => React.JSX.Element;
  cue: { time: string; label: string };
}[];

const about = {
  lead: "A bit about",
  accent: "me",
  bio: [
    "I have been a software engineer at Zenkoders since 2024, across the backend, the AI features and the dashboards of client products.",
    "The problems I get handed are the ones where being wrong is expensive.",
  ],
  /**
   * The four titles, each linked to the stack hour that backs it. Every
   * sentence restates something already on this site or the resume.
   */
  rolesLabel: "Four ways I work",
  roles: [
    {
      title: "Backend engineer",
      line: "NestJS, PostgreSQL and BullMQ queues, with the rules that must hold kept in the database.",
      href: "#data",
      label: "Data, at noon →",
    },
    {
      title: "Software engineer",
      line: "Features taken end to end, from the schema to the release, in client products across healthcare, fintech and SaaS.",
      href: "#cloud",
      label: "Cloud and CI/CD, at golden hour →",
    },
    {
      title: "AI product engineer",
      line: "AI voice booking, Gmail automation and document extraction. I treat what a model returns like any other input from outside.",
      href: "#ai",
      label: "AI, in the evening →",
    },
    {
      title: "Full-stack engineer",
      line: "The Next.js dashboard on top of the queues and the database, and this site.",
      href: "#full-stack",
      label: "Full-stack, in the morning →",
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
          <div className="wrap grid min-h-svh content-center gap-12 pt-[calc(var(--spacing-header)+2rem)] pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.6+3rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-20">
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
                <a className={ACTION_CLASS} href="#full-stack">
                  <Cue label="What I build with ↘" />
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
          <HourCue
            href="#full-stack"
            label={fold.cue.label}
            time={fold.cue.time}
          />
        </section>

        {HOURS.map(({ Scenery, ...hour }, i) => (
          <section
            aria-labelledby={hour.id}
            className={`hour hour-${hour.hour} pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]`}
            data-hour={hour.hour}
            key={hour.id}
          >
            <SectionHead
              accent={hour.accent}
              id={hour.id}
              lead={hour.lead}
              tail={hour.tail}
            >
              {hour.line}
            </SectionHead>
            <ul className="wrap mt-group flex flex-wrap gap-4 md:gap-6">
              {hour.tools.map((tool: Tool) => (
                <li
                  className="paper flex items-center gap-3 px-5 py-4 font-bold font-display text-lg tracking-tight md:text-xl"
                  data-reveal
                  key={tool.label}
                >
                  {tool.mark ? (
                    <svg
                      aria-hidden="true"
                      className="size-6 shrink-0"
                      fill="currentColor"
                      focusable="false"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={BRAND_MARKS[tool.mark].d} />
                    </svg>
                  ) : null}
                  {tool.label}
                </li>
              ))}
            </ul>
            <Scenery />
            <HourCue
              href={`#${HOURS[i + 1]?.id ?? "about"}`}
              label={hour.cue.label}
              time={hour.cue.time}
            />
          </section>
        ))}

        {/* Dusk. */}
        <section
          aria-labelledby="about"
          className="hour hour-dusk pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
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
                <h3 className="font-bold text-xl leading-tight tracking-tight">
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
                  <h3 className="font-bold text-xl leading-tight tracking-tight">
                    {row.title}
                  </h3>
                  <p className="mt-1 font-mono text-foreground-label text-xs">
                    {row.span}
                  </p>
                  <p className="mt-flow text-foreground-muted">{row.line}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="wrap mt-group font-semibold" data-reveal>
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
