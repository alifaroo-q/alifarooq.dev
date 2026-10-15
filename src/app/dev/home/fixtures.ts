import type { Stop } from "@/components/caravan";
import type { FoldContent } from "@/components/fold";

/**
 * Worst-case copy for the home page's fold, About and footer regions. The long
 * strings are what a longer job history and a longer name produce; the short
 * ones are what a student project produces.
 */
export const WORST_FOLD: FoldContent = {
  person: {
    name: "Aleksandra Wiśniewska-Kowalczyk",
    location: "Karachi (UTC+5), with overlap in US Pacific and Central Europe",
    availability:
      "Open to full-time remote roles, contracts and single projects",
    hours: "Flexible hours across four time zones",
  },
  fold: {
    headline: {
      lead: "I build full-stack, multi-region, audit-ready products with",
      accent: "AI",
      tail: "inside them and a person who checks every output.",
    },
    sentence:
      "Two years at Zenkoders shipping AI products for clients, front to back, across healthcare, property management, restaurant telephony and personal finance. I build voice agents, email assistants and the backends, queues and guards they run on, and I stay on the call until the numbers move.",
    caption:
      "Good morning from Karachi, where the call to prayer and the first ferry overlap",
    cue: {
      time: "08:30",
      label: "What I built, in order of how much it matters ↓",
    },
  },
  proof: [
    {
      system: "Multi-region healthcare credentialing and compliance platform",
      metric:
        "Cut a provider's onboarding from 41 days to 6 across 212 hospitals in 14 states, with every check logged for audit and re-run on a schedule.",
      href: "/work/mach1",
    },
    { system: "AI", metric: "Yes.", href: "/work/voxena" },
    {
      system: "Benachrichtigungseinstellungen",
      metric: "Answers the phone in 3 languages.",
      href: "/work/hcpa-email",
    },
  ],
};

const MOMENTS = Array.from({ length: 8 }, (_, i) => ({
  when: [
    "Jan 2025",
    "Mar 2025",
    "Jun 2025",
    "Sep 2025",
    "Dec 2025",
    "Feb 2026",
    "Jul 2026",
    "Oct 2026",
  ][i],
  what: [
    "Promoted from trainee to software engineer after taking the on-call rota for the voice agent.",
    "Excellence in Work award for delivery.",
    "Led a team of five through a ten-phase billing migration without a day of downtime.",
    "Gave a talk.",
    "Moved the whole backend from one cloud region to three.",
    "Wrote the runbook that the next two hires onboarded from.",
    "Shipped.",
    "Handed over the platform to the client's in-house engineers with a recorded walkthrough and a written decision log.",
  ][i],
}));

export const WORST_STOPS: Stop[] = [
  {
    kind: "past",
    place: "Dow University of Health Sciences and Dow Institute of Technology",
    span: "2016 to 2020, with a year out",
    title:
      "BS Computer Software Engineering, with a minor in applied mathematics and statistics",
    moments: MOMENTS,
  },
  { kind: "past", place: "Q", span: "2024", title: "T", moments: [] },
  {
    kind: "past",
    place: "Zenkoders",
    span: "Aug 2024 to Oct 2026",
    title: "Trainee, then software engineer",
    moments: [{ when: "2024", what: "Trainee." }],
  },
  {
    kind: "next",
    span: "From Nov 2026, with a notice period of up to eight weeks",
    title: "Next, and the one after that",
    line: "Open to remote roles, contracts and a few single projects each year, with a preference for teams that write decisions down.",
  },
];

export const ONE_STOP: Stop[] = [WORST_STOPS[2]];

export const WORST_REGIONS = [
  "United States",
  "United States (Pacific time only)",
  "Australia",
  "New Zealand",
  "Middle East",
  "Gulf Cooperation Council member states",
  "Europe",
  "United Kingdom and Ireland",
  "Singapore",
  "Canada",
  "Remote-first companies headquartered anywhere with a four-hour overlap",
  "Japan",
];
