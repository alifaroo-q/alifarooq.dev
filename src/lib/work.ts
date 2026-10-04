import type { Flagship, Job, SmallJob } from "@/components/work-parts";

/** The AI systems with a diagram, in the order the fold's Proof strip names them. */
export const FLAGSHIPS: Flagship[] = [
  {
    id: "job-hcpa-voice-agent",
    client: "HCPA",
    what: "AI voice agent",
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
export const JOBS: Job[] = [
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

export const SMALL_JOBS: SmallJob[] = [
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

/** The URL segment of a job's own page: its id without the `job-` prefix. */
export const slugOf = (job: Job) => job.id.replace(/^job-/, "");

export const caseHref = (job: Job) => `/work/${slugOf(job)}`;

/** The jobs with a page of their own, in the order the pages lead into each other. */
export const CASES: readonly Job[] = [...FLAGSHIPS, ...JOBS];

export const findCase = (slug: string) =>
  CASES.find((job) => slugOf(job) === slug);

/** The title a page prints. A flagship is named by its system, the rest by their client. */
export const caseTitle = (job: Job) =>
  FLAGSHIPS.some((f) => f.id === job.id) ? job.what : job.client;

/** The line under it. */
export const caseSub = (job: Job) =>
  FLAGSHIPS.some((f) => f.id === job.id) ? job.client : job.what;

/**
 * One row of the work index. A job with a page links to it, a small job links
 * out or goes nowhere, and `job` is set only when there is a page to preview.
 */
export type Entry = {
  id: string;
  title: string;
  sub: string;
  years: string;
  result: string;
  href?: string;
  job?: Job;
};

export const ENTRIES: readonly Entry[] = [
  ...CASES.map((job) => ({
    id: job.id,
    title: caseTitle(job),
    sub: caseSub(job),
    years: job.years,
    result: job.result,
    href: caseHref(job),
    job,
  })),
  ...SMALL_JOBS.map((s) => ({
    id: s.id,
    title: s.name,
    sub: s.kind,
    years: s.years,
    result: s.line,
    href: s.href,
  })),
];

/**
 * Where a link to one project goes: its page, or its row on `/work` when it has
 * no page. It throws on an id that is not in the list, so a renamed job breaks
 * the build and not a link.
 */
export function workHref(id: string) {
  const entry = ENTRIES.find((e) => e.id === id);
  if (!entry) {
    throw new Error(`No project with id ${id}.`);
  }
  return entry.job ? caseHref(entry.job) : `/work#${id}`;
}
