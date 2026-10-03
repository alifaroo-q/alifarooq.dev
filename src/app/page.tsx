import Image from "next/image";
import { Caravan, type Stop } from "@/components/caravan";
import { ContactFooter } from "@/components/contact-footer";
import { Cue } from "@/components/cue";
import { Figures } from "@/components/figures";
import { Headline } from "@/components/headline";
import { HowIWork } from "@/components/how-i-work";
import {
  type Flagship,
  type Job,
  JobChapters,
  type SmallJob,
} from "@/components/job-chapters";
import { Portrait } from "@/components/portrait";
import {
  Clouds,
  Dunes,
  Dusk,
  FishMarket,
  Port,
  Shore,
} from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { BRAND_MARKS } from "@/lib/brand-marks";
import {
  ACTION_CLASS,
  BASE_LOCATION,
  BASE_UTC,
  GITHUB_URL,
  PERSON_NAME,
  PERSON_ROLE,
  PORTRAIT_SRC,
  PROFILE_URLS,
  RESUME_HREF,
  SITE_URL,
} from "@/lib/site";

/**
 * The home page.
 *
 * The page is one day on the Karachi coast. The fold is dawn, the three middle
 * hours run from morning to golden hour, About is dusk, and Contact is the
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
  resumeHref: RESUME_HREF,
};

/**
 * The fold. The headline makes the claim, the sentence under it gives one
 * result behind it, and the proof names the AI systems a reader can check.
 */
const fold = {
  headline: {
    lead: "I build full-stack products with",
    accent: "AI",
    tail: "inside them.",
  },
  sentence:
    "Two years at Zenkoders shipping AI products for clients, front to back. 7,000 inbound leads a month go through the AI caller I built.",
  caption: "Good morning from Karachi",
  cue: { time: "08:30", label: "What I built ↓" },
};

/** Each figure is copied from the job it links to. Change both together. The
 * restaurant link targets the card's detail, so the browser opens it. */
const PROOF: { system: string; metric: string; href: `#${string}` }[] = [
  {
    system: "AI voice caller",
    metric: "31 to 49 bookings a week from its SMS follow-up.",
    href: "#job-hcpa-caller",
  },
  {
    system: "Email assistant",
    metric:
      "Drafts sourced replies to 40 to 50 emails a day per consultant. A person checks each one.",
    href: "#job-hcpa-email",
  },
  {
    system: "Restaurant voice AI",
    metric: "Answers the phone for restaurants in Belgium, in 3 languages.",
    href: "#job-voxena-detail",
  },
];

type Tool = { label: string; mark?: keyof typeof BRAND_MARKS };

const TOOL_GROUPS: { title: string; tools: Tool[] }[] = [
  {
    title: "AI I ship",
    tools: [
      { label: "OpenAI", mark: "openai" },
      { label: "Vapi" },
      { label: "Twilio" },
      { label: "pgvector" },
      { label: "BullMQ" },
      { label: "Vision model" },
    ],
  },
  {
    title: "The stack under it",
    tools: [
      { label: "Node.js", mark: "nodedotjs" },
      { label: "Next.js", mark: "nextdotjs" },
      { label: "NestJS", mark: "nestjs" },
      { label: "Postgres", mark: "postgresql" },
      { label: "Redis", mark: "redis" },
      { label: "Docker", mark: "docker" },
      { label: "AWS", mark: "amazonwebservices" },
      { label: "GitHub Actions", mark: "githubactions" },
    ],
  },
  {
    title: "AI I build with",
    tools: [
      { label: "Claude Code", mark: "claude" },
      { label: "GitHub Copilot", mark: "githubcopilot" },
      { label: "Cursor", mark: "cursor" },
    ],
  },
];

/** The agent skills Ali wrote. */
const MY_SKILLS: { slug: string; does: string }[] = [
  {
    slug: "react-state",
    does: "Decides where a React value lives and how it changes.",
  },
  {
    slug: "typescript",
    does: "Config, migration and type errors in TypeScript 6 and 7.",
  },
  {
    slug: "roadmap",
    does: "Plans a project as phases, in the order to build them.",
  },
  {
    slug: "ping",
    does: "Turns a vague message from a client into a clear ask and one plan.",
  },
  {
    slug: "show-me",
    does: "Explains a topic with small diagrams and sketches.",
  },
  {
    slug: "quit-thinking-and-look",
    does: "Finds the root cause of a bug by looking before fixing.",
  },
  {
    slug: "vitest-test-coverage",
    does: "Writes and reviews Vitest tests for business logic and the database.",
  },
];

/** The AI systems with a diagram, in the order the fold's Proof strip names them. */
const FLAGSHIPS: Flagship[] = [
  {
    id: "job-hcpa-caller",
    client: "HCPA",
    what: "AI caller",
    years: "2025 to 2026",
    stamp: "in-production",
    role: "Lead, near-solo backend, main frontend",
    result:
      "7,000 inbound leads a month go through it. 31 to 49 bookings a week from SMS follow-up.",
    about:
      "New leads came in through Pipedrive but went cold before a sales rep could call. The system calls each lead with an AI voice agent, follows up by SMS, and books a meeting in a rep's calendar.",
    built:
      "The whole path from new lead to booking. It respects rep leave and holidays, and shares bookings fairly so new reps get them too. I found and fixed the bug that had dropped bookings to zero. I also built the admin panel.",
    stack:
      "NestJS, BullMQ, Redis, Postgres, Vapi, Twilio, Google Calendar, Next.js",
    quote: "The call is much better by the way, seems pretty much perfect now!",
    diagram: "row",
    flow: [
      { tool: "Pipedrive", step: "New lead" },
      { tool: "BullMQ", step: "Queue the call" },
      { tool: "Vapi", step: "AI voice call" },
      { tool: "Twilio", step: "SMS follow-up" },
      { tool: "Google Calendar", step: "Meeting booked with a rep" },
    ],
  },
  {
    id: "job-hcpa-email",
    client: "HCPA",
    what: "Email assistant",
    years: "2026",
    stamp: "in-production",
    role: "Solo backend, lead frontend",
    result:
      "Drafts sourced replies to 40 to 50 emails a day per consultant. A person checks each one.",
    about:
      "The assistant reads each email, pulls the client's details and drafts a reply with sources. A consultant checks every draft before it is sent.",
    built:
      "Gmail sync, email sorting, client context from Pipedrive, and search over past cases and official sources. A guard against prompt injection and a lock against double sends.",
    stack: "NestJS, Postgres with pgvector, BullMQ, Gmail API, OpenAI, Next.js",
    diagram: "column",
    flow: [
      { tool: "Gmail API", step: "Sync and sort email" },
      { tool: "Pipedrive", step: "Client details" },
      { tool: "pgvector", step: "Search past cases and official sources" },
      { tool: "OpenAI", step: "Draft a reply with sources" },
      { tool: "Consultant", step: "Checks every draft before it is sent" },
    ],
  },
];

/** The rest of the client work, oldest first by the month the work started. */
const JOBS: Job[] = [
  {
    id: "job-mach1",
    client: "Mach 1",
    what: "Healthcare credentialing",
    years: "2025",
    stamp: "in-production",
    role: "Main backend developer",
    result:
      "Providers go through licence, DEA, background and exclusion checks online.",
    about:
      "Mach 1 helps healthcare sites take on new nurses and doctors. Before a provider can work, someone must check their licences, DEA, background and exclusion lists. The platform takes each provider through those checks online.",
    built:
      "The onboarding backend. Invite links, CV upload with AI parsing, e-signature, and the checks for licences, DEA, background and references, including Nursys and OIG.",
    stack: "NestJS on Fastify, Prisma, Postgres, AWS",
  },
  {
    id: "job-tenley",
    client: "Tenley",
    what: "Property-management SaaS",
    years: "2026",
    stamp: "in-production",
    role: "Lead on a team of five",
    result: "All billing now runs on Stripe, moved in 10 phases.",
    about:
      "Tenley puts a property company's units, tenants, staff and repair tickets in one app. Tenants can call a phone line and report an emergency to an AI voice agent.",
    built: [
      "Moved all billing to Stripe in 10 phases. Stripe now handles prices, invoices, retries and receipts.",
      "Closed gaps where one company could read another company's data.",
      "The emergency phone line: buy a number, give it to a company, link it to the voice agent.",
      "A resident import that finds bad rows before anything is saved.",
      "Faster page loads.",
    ],
    stack: "Next.js 16, Supabase, Stripe, Twilio, Vapi, Vercel",
  },
  {
    id: "job-numlix",
    client: "Numlix",
    what: "SMS number marketplace",
    years: "2026",
    stamp: "in-production",
    role: "Lead",
    result: "The reconcile query went from 28.9 s to 0.5 s in production.",
    about:
      "Numlix sells virtual phone numbers for SMS codes, paid from a wallet. Money moves between users, the payment provider and SMS suppliers, so every balance must match.",
    built:
      "The wallet ledger, with refunds and crash recovery. A check every 15 minutes that matches our records to the payment provider. Access rules on every table.",
    stack: "Next.js 16, Supabase, Drizzle, FedaPay",
    quote:
      "The virtual number was received and the SMS code arrived quickly, a few minutes later. The whole process went smoothly from start to finish.",
  },
  {
    id: "job-mycfo",
    client: "MyCFO",
    what: "Personal finance",
    years: "2026",
    stamp: "in-development",
    role: "Solo",
    result:
      "Shows people with side income what they can really spend, after business costs and tax.",
    about:
      "MyCFO is a money app for people who earn a salary plus freelance or creator income. It shows how much they can really spend after business costs and the tax their side income will owe.",
    built:
      "I am turning the prototype into the real product, now near the end. Sign-up and onboarding, bank links with Plaid, and an engine that sorts money into business, personal, transfer and tax. AI suggests a category and the user confirms it. Stripe subscriptions.",
    stack: "Next.js 16, Effect, Drizzle, Supabase, Plaid, Stripe, OpenAI",
  },
  {
    id: "job-voxena",
    client: "Voxena",
    what: "Restaurant voice AI",
    years: "2026",
    stamp: "handed-over",
    role: "Main backend developer",
    result: "Answers the phone for restaurants in Belgium, in 3 languages.",
    about:
      "Voxena answers the phone for restaurants in Belgium, in French, English and Dutch. It takes reservations, cancellations and questions.",
    built:
      "The platform behind the voice agent. Sign-in, restaurant onboarding, menus, opening hours and FAQs, all in three languages.",
    stack: "NestJS, Prisma, Postgres, AWS",
  },
];

const SMALL_JOBS: SmallJob[] = [
  {
    id: "job-rnd",
    name: "R&D tax intake",
    kind: "HCPA",
    years: "2025 to 2026",
    line: "An eligibility chatbot, AI sorting of ledger accounts, and a ledger processor that writes to Google Sheets.",
  },
  {
    id: "job-ndis",
    name: "NDIS documents",
    kind: "HCPA",
    years: "2025 to 2026",
    line: "Reads NDIS PDFs with a vision model and fills the portal through a Chrome extension. Solo.",
  },
  {
    id: "job-billys",
    name: "Billy's Garage",
    kind: "Client",
    years: "2026",
    line: "Garage management for UK garages: jobs, estimates customers approve by link, stock and online booking. Solo backend.",
  },
  {
    id: "job-markregistry",
    name: "MarkRegistry",
    kind: "Client",
    years: "2026",
    line: "Turns 6.3 GB of government trademark reports into a searchable register of 228,404 records and 96,031 logos.",
  },
  {
    id: "job-result-kit",
    name: "result-kit",
    kind: "Open source",
    years: "2026",
    line: "A TypeScript result type on npm, with lint rules for ESLint and Oxlint.",
    href: "https://github.com/alifaroo-q/result-kit",
  },
];

/** Where I've been and where I'm going, oldest first. The last stop is open. */
const STOPS: Stop[] = [
  {
    kind: "past",
    place: "DHA Suffa University",
    span: "2020 to 2024",
    title: "BS Computer Software Engineering",
    moments: [{ when: "2024", what: "Gold medal, top of the batch." }],
  },
  {
    kind: "past",
    place: "Zenkoders",
    span: "Aug 2024 to Oct 2026",
    title: "Trainee, then software engineer",
    moments: [
      { when: "Aug 2024", what: "Trainee." },
      { when: "Oct 2024", what: "Software engineer." },
      { when: "2026", what: "Excellence in Work award for delivery." },
    ],
  },
  {
    kind: "next",
    span: "From Nov 2026",
    title: "Next",
    line: "Open to remote roles.",
  },
];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  jobTitle: PERSON_ROLE,
  url: SITE_URL,
  image: `${SITE_URL}${PORTRAIT_SRC}`,
  sameAs: PROFILE_URLS,
};

/** The dawn caption: under the arch portrait on desktop, under the status row on a phone. */
function Caption({ className }: { className: string }) {
  return (
    <p className={`text-foreground-muted ${className}`}>
      <span className="font-mono text-foreground-label text-xs">06:10</span>{" "}
      <em className="font-serif">{fold.caption}</em>
    </p>
  );
}

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
        <span className="font-mono text-foreground-label text-xs" data-roll>
          {time}
        </span>
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
            <div className="hidden lg:block" data-enter>
              <Portrait />
              <Caption className="mt-figure text-center" />
            </div>
            <div data-enter>
              <Headline
                accent={fold.headline.accent}
                lead={fold.headline.lead}
                className="max-w-[16ch] font-extrabold text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[1.02] tracking-[-0.035em]"
                tail={fold.headline.tail}
              />
              <p className="mt-flow flex items-center gap-3 font-bold font-display text-[clamp(1.0625rem,1.8vw,1.3125rem)] tracking-tight">
                <Image
                  alt=""
                  className="size-10 rounded-full border-2 border-ink object-cover object-top lg:hidden"
                  height={80}
                  sizes="40px"
                  src={PORTRAIT_SRC}
                  width={80}
                />
                <span>
                  {PERSON_NAME}
                  <span aria-hidden="true" className="mx-2">
                    ·
                  </span>
                  {PERSON_ROLE}
                </span>
              </p>
              <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.7vw,1.25rem)] text-foreground-muted leading-[1.6]">
                <Figures text={fold.sentence} />
              </p>
              <ul className="paper mt-flow grid sm:grid-cols-3">
                {PROOF.map((p) => (
                  <li
                    className="border-border border-t-2 p-4 first:border-t-0 sm:border-t-0 sm:border-l-2 sm:first:border-l-0"
                    key={p.href}
                  >
                    <a
                      className="hit font-bold font-display text-accent tracking-tight"
                      href={p.href}
                    >
                      <Cue label={`${p.system} →`} />
                    </a>
                    <p className="mt-1 text-foreground-muted text-sm">
                      <Figures text={p.metric} />
                    </p>
                  </li>
                ))}
              </ul>
              <a className={`${ACTION_CLASS} mt-figure`} href="#contact">
                <Cue label="Hire me ↓" />
              </a>
              <p className="mt-figure flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground-muted text-sm">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full bg-sea"
                  data-live
                />
                {[person.availability, person.location, person.hours].map(
                  (item) => (
                    <span className="whitespace-nowrap" key={item}>
                      {item}
                      <span aria-hidden="true" className="ml-3">
                        ·
                      </span>
                    </span>
                  ),
                )}
                <a className="hit font-semibold ink-link" href={GITHUB_URL}>
                  <Cue label="GitHub ↗" />
                </a>
              </p>
              <Caption className="mt-tight lg:hidden" />
            </div>
          </div>
          <Shore />
          <HourCue href="#jobs" label={fold.cue.label} time={fold.cue.time} />
        </section>

        {/* Morning: the jobs. */}
        <section
          aria-labelledby="jobs"
          className="hour hour-morning pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="morning"
        >
          <SectionHead accent="built" id="jobs" lead="What I">
            Client work at Zenkoders since August 2024, and a few things of my
            own.
          </SectionHead>
          <JobChapters
            flagships={FLAGSHIPS}
            jobs={JOBS}
            smallJobs={SMALL_JOBS}
          />
          <FishMarket />
          <HourCue href="#how" label="How I work ↓" time="12:00" />
        </section>

        {/* Noon: how I work. */}
        <section
          aria-labelledby="how"
          className="hour hour-noon pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="noon"
        >
          <SectionHead accent="work" id="how" lead="How I" />
          <HowIWork />
          <Port />
          <HourCue href="#tools" label="What I build with ↓" time="16:30" />
        </section>

        {/* Golden hour: the tools and the skills. */}
        <section
          aria-labelledby="tools"
          className="hour hour-golden pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="golden"
        >
          <SectionHead accent="build" id="tools" lead="What I" tail="with" />
          {TOOL_GROUPS.map((group) => (
            <div className="wrap mt-group" key={group.title}>
              <h3 className="font-bold font-display text-xl tracking-tight">
                {group.title}
              </h3>
              <ul className="mt-figure flex flex-wrap gap-3 md:gap-4">
                {group.tools.map((tool) => (
                  <li
                    className="chip gap-2 px-3 py-1.5 text-sm"
                    key={tool.label}
                  >
                    {tool.mark ? (
                      <svg
                        aria-hidden="true"
                        className="size-4 shrink-0"
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
            </div>
          ))}
          <div className="wrap mt-group">
            <h3 className="font-bold font-display text-xl tracking-tight">
              Skills I wrote for my agents
            </h3>
            <ul className="mt-figure grid max-w-4xl gap-x-10 gap-y-3 md:grid-cols-2">
              {MY_SKILLS.map((skill) => (
                <li key={skill.slug}>
                  {skill.does}{" "}
                  <code className="font-mono text-foreground-label text-xs">
                    {skill.slug}
                  </code>
                </li>
              ))}
            </ul>
          </div>
          <Dunes />
          <HourCue href="#about" label="About ↓" time="18:40" />
        </section>

        {/* Dusk: where I've been, where I'm going. */}
        <section
          aria-labelledby="about"
          className="hour hour-dusk pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="dusk"
        >
          <SectionHead
            accent="going"
            id="about"
            lead="Where I've been, where I'm"
          />
          <Caravan stops={STOPS} />
          <Dusk />
          <HourCue href="#contact" label="Get in touch ↓" time="21:30" />
        </section>
      </main>

      {/* Night. */}
      <ContactFooter />
    </>
  );
}
