import { notFound } from "next/navigation";
import { Caravan } from "@/components/caravan";
import { ContactFooter } from "@/components/contact-footer";
import { Fold } from "@/components/fold";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { PERSON_NAME } from "@/lib/site";
import { ONE_STOP, WORST_FOLD, WORST_REGIONS, WORST_STOPS } from "./fixtures";

/**
 * Dev-only: the home page's fold, About and footer regions against the worst
 * case, behind a toggle. `?data=worst|one|empty`; no param is the real copy
 * for the parts that take it. Not found in production.
 */
const STATES = [
  ["demo", "Demo data"],
  ["worst", "Worst case"],
  ["one", "One"],
  ["empty", "Empty"],
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { data = "demo" } = await searchParams;
  const worst = data === "worst";
  const stops = worst
    ? WORST_STOPS
    : data === "one"
      ? ONE_STOP
      : data === "empty"
        ? []
        : undefined;
  return (
    <>
      <SiteHeader
        home
        name={worst ? WORST_FOLD.person.name : PERSON_NAME}
        resumeHref="/resume.pdf"
      />
      <main id="main">
        <Fold {...(worst ? WORST_FOLD : DEMO_FOLD)} />
        <section className="hour hour-dusk pt-section pb-32" data-hour="dusk">
          <SectionHead
            accent={worst ? "going, and for how long, and with whom" : "going"}
            id="about"
            lead={
              worst
                ? "Where I've been across four countries, three roles and one very long gap, where I'm"
                : "Where I've been, where I'm"
            }
          />
          {stops ? <Caravan stops={stops} /> : <Caravan stops={DEMO_STOPS} />}
        </section>
      </main>
      <ContactFooter regions={worst ? WORST_REGIONS : undefined} />
      <nav
        aria-label="Data"
        className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-lg bg-neutral-300 p-1 font-sans text-neutral-900 text-xs"
      >
        {STATES.map(([key, label]) => (
          <a
            aria-current={data === key ? "page" : undefined}
            className={`rounded-md px-3 py-2 ${data === key ? "bg-white shadow" : ""}`}
            href={`?data=${key}`}
            key={key}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}

const DEMO_FOLD = {
  person: {
    name: PERSON_NAME,
    location: "Karachi (UTC+5)",
    availability: "Open to remote roles",
    hours: "Flexible hours",
  },
  fold: {
    headline: {
      lead: "I build full-stack products with",
      accent: "AI",
      tail: "inside them.",
    },
    sentence:
      "Two years at Zenkoders shipping AI products for clients, front to back. I build voice agents, email assistants and the backends they run on.",
    caption: "Good morning from Karachi",
    cue: { time: "08:30", label: "What I built ↓" },
  },
  proof: [
    {
      system: "AI voice agent",
      metric: "31 to 49 bookings a week from its SMS follow-up.",
      href: "/work/hcpa-voice-agent",
    },
    {
      system: "Email assistant",
      metric: "Drafts sourced replies to 40 to 50 emails a day per consultant.",
      href: "/work/hcpa-email",
    },
    {
      system: "Restaurant voice AI",
      metric: "Answers the phone for restaurants in Belgium.",
      href: "/work/voxena",
    },
  ],
} satisfies typeof WORST_FOLD;

const DEMO_STOPS = [
  {
    kind: "past" as const,
    place: "Zenkoders",
    span: "Aug 2024 to Oct 2026",
    title: "Trainee, then software engineer",
    moments: [{ when: "Aug 2024", what: "Trainee." }],
  },
  {
    kind: "next" as const,
    span: "From Nov 2026",
    title: "Next",
    line: "Open to remote roles.",
  },
];
