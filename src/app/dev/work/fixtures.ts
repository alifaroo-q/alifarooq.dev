import type { Flagship, Job } from "@/components/work-parts";
import type { Entry } from "@/lib/work";

/**
 * Worst-case data for the work index and a case page, shaped like `work.ts`.
 * The long strings are the length real client projects have when the one-line
 * brief becomes a procurement title; the short ones are one-word products.
 */
const LONG_QUOTE =
  "We had been through three agencies before this and every one of them handed over a demo. This is the first time the thing on the screen was also the thing running in production, and when the carrier integration changed its payload on a Friday night it was fixed before our Monday standup. I would hire again without a second thought, and I have already recommended Ali to two other directors in our network.";

const FLAGSHIP: Flagship = {
  id: "job-worst-flagship",
  client: "Northwind Industries Holdings International",
  what: "Multi-region healthcare credentialing and compliance platform",
  years: "2023 to 2026, still in production",
  stamp: "in-production",
  role: "Technical lead, backend architect, main frontend developer and on-call engineer",
  result:
    "Cut a provider's onboarding from 41 days to 6 across 212 hospitals in 14 states, with every licence, DEA, background and exclusion check logged for audit and re-run on a schedule.",
  about:
    "Hospital networks credential every nurse and doctor before they can work a shift, and each state, payer and facility keeps its own rules. The platform takes a provider through every check online, remembers what has already been verified, and tells a coordinator exactly what is still missing and who it is waiting on.",
  built: [
    "The onboarding backend: invite links, CV upload with AI parsing, e-signature and the checks themselves, including Nursys, OIG and state boards.",
    "A rules engine that decides which checks a provider needs from the facility, the state and the payer, so a coordinator never picks them by hand.",
    "Audit logging on every state change, kept for seven years and exportable per provider as a single signed PDF.",
    "A nightly re-verification run for licences close to expiry, with a queue a human works through.",
    "Role-based access across 3 organisation tiers, so one network can never read another's providers.",
    "Imports from 9 legacy spreadsheets, each with its own column names and date formats.",
    "Alerts to Slack, email and SMS, rate-limited so one stuck provider does not page the whole team.",
    "A reporting layer for compliance officers: time per step, drop-off, and the checks that fail most.",
  ],
  stack:
    "NestJS on Fastify, Prisma, Postgres with row-level security, Redis, BullMQ, AWS (ECS Fargate, RDS, S3, SQS, SNS, KMS, CloudWatch), Next.js 16 with the App Router, Server Components and Server Actions, Playwright, Terraform",
  quote: LONG_QUOTE,
  diagram: "column",
  flow: [
    {
      tool: "Coordinator",
      step: "Invites a provider from the facility's roster",
    },
    {
      tool: "Next.js",
      step: "Provider uploads a CV, licences and signs consent",
    },
    {
      tool: "OpenAI",
      step: "Parse the CV into structured work history and gaps",
    },
    {
      tool: "NestJS rules engine",
      step: "Decide which checks this facility, state and payer require",
    },
    {
      tool: "BullMQ",
      step: "Fan out one job per check with retry and backoff",
    },
    { tool: "Nursys", step: "Licence verification" },
    { tool: "OIG", step: "Exclusion list screening" },
    {
      tool: "Postgres",
      step: "Write the result and an audit entry in one transaction",
    },
    { tool: "Slack", step: "Tell the coordinator what is still missing" },
    { tool: "Coordinator", step: "Approve the provider to work" },
  ],
};

const SHORT: Job = {
  id: "job-q",
  client: "Q",
  what: "CLI",
  years: "2026",
  stamp: "handed-over",
  role: "Solo",
  result: "Done.",
  about: "A tool.",
  built: "It.",
  stack: "Go",
};

const NO_QUOTE: Job = {
  ...SHORT,
  id: "job-twin-a",
  client: "Tenley",
  what: "Property-management SaaS",
  stamp: "in-development",
  result: "All billing now runs on Stripe, moved in 10 phases.",
  built: ["Moved all billing to Stripe in 10 phases."],
};

const TWIN: Job = { ...NO_QUOTE, id: "job-twin-b" };

const entry = (job: Job, title: string, sub: string): Entry => ({
  id: job.id,
  title,
  sub,
  years: job.years,
  result: job.result,
  href: `/work/${job.id.replace(/^job-/, "")}`,
  job,
});

export const WORST_CASE: Job = FLAGSHIP;

export const WORST: readonly Entry[] = [
  entry(FLAGSHIP, FLAGSHIP.what, FLAGSHIP.client),
  entry(SHORT, "Q", "CLI"),
  entry(NO_QUOTE, "Tenley", "Property-management SaaS"),
  entry(TWIN, "Tenley", "Property-management SaaS"),
  {
    id: "job-no-page",
    title:
      "Benachrichtigungseinstellungen-Migration für die Krankenhausverwaltung",
    sub: "Client",
    years: "2025 to 2026 (paused, then resumed)",
    result:
      "Turns 6.3 GB of government trademark reports into a searchable register of 228,404 records and 96,031 logos, deduplicated by phonetic and visual similarity.",
  },
  {
    id: "job-external",
    title: "@zireal/result-kit",
    sub: "Open source",
    years: "2026",
    result:
      "A TypeScript result type on npm, with lint rules for ESLint and Oxlint.",
    href: "https://github.com/alifaroo-q/result-kit",
  },
  {
    id: "job-url",
    title:
      "https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a",
    sub: "A project whose name is its address",
    years: "2024",
    result: "",
  },
  ...Array.from(
    { length: 24 },
    (_, i): Entry => ({
      id: `job-filler-${i}`,
      title: `Project ${i + 1}`,
      sub: "Client",
      years: "2025",
      result: "One more line of a result.",
    }),
  ),
];

export const ONE: readonly Entry[] = [WORST[2]];

export const EMPTY: readonly Entry[] = [];
