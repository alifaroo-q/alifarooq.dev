import Image from "next/image";
import { Caravan, type Stop } from "@/components/caravan";
import { ContactFooter } from "@/components/contact-footer";
import { Cue } from "@/components/cue";
import { Headline } from "@/components/headline";
import { HowIWork } from "@/components/how-i-work";
import { LateScene } from "@/components/late-scenery";
import { Portrait } from "@/components/portrait";
import { Clouds, Shore } from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { ToolShelf } from "@/components/tool-shelf";
import { WorkTeaser } from "@/components/work-teaser";
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
import { workHref } from "@/lib/work";

/**
 * The home page.
 *
 * The page is one day on the Karachi coast. The fold is dawn, the three middle
 * hours run from morning to golden hour, a band of Sea View marks the early
 * evening, About is dusk, and Contact is the night. Each hour ends in a band of scenery and a cue that names the next
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
    "Two years at Zenkoders shipping AI products for clients, front to back. I build voice agents, email assistants and the backends they run on.",
  caption: "Good morning from Karachi",
  cue: { time: "08:30", label: "What I built ↓" },
};

/** Each figure is copied from the job it links to. Change both together. */
const PROOF: { system: string; metric: string; href: string }[] = [
  {
    system: "AI voice agent",
    metric: "31 to 49 bookings a week from its SMS follow-up.",
    href: workHref("job-hcpa-voice-agent"),
  },
  {
    system: "Email assistant",
    metric:
      "Drafts sourced replies to 40 to 50 emails a day per consultant. A person checks each one.",
    href: workHref("job-hcpa-email"),
  },
  {
    system: "Restaurant voice AI",
    metric: "Answers the phone for restaurants in Belgium, in 3 languages.",
    href: workHref("job-voxena"),
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
      <SiteHeader home name={person.name} resumeHref={person.resumeHref} />
      <main id="main">
        {/* Dawn. */}
        <section
          aria-label="Introduction"
          className="hour hour-dawn [--scene-h:clamp(8rem,17vw,24rem)]"
          data-hour="dawn"
        >
          <Clouds />
          <div className="wrap grid min-h-svh content-center gap-12 pt-[calc(var(--spacing-header)+1rem)] pb-[calc(var(--scene-h)+4.5rem)] md:pb-[calc(var(--scene-h)*0.2+1rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-20">
            <div className="hidden lg:block" data-enter>
              <Portrait />
              <Caption className="mt-figure text-center" />
            </div>
            <div data-enter>
              <Headline
                accent={fold.headline.accent}
                lead={fold.headline.lead}
                className="max-w-[16ch] font-extrabold text-[clamp(2.5rem,min(6.2vw,8svh),4.75rem)] leading-[1.02] tracking-[-0.035em]"
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
                {fold.sentence}
              </p>
              <ul className="paper mt-flow grid sm:grid-cols-3">
                {PROOF.map((p) => (
                  <li
                    className="border-border border-t-2 px-4 py-2 first:border-t-0 sm:p-4 sm:border-t-0 sm:border-l-2 sm:first:border-l-0"
                    key={p.href}
                  >
                    <a
                      className="hit font-bold font-display text-accent tracking-tight"
                      href={p.href}
                    >
                      <Cue label={`${p.system} →`} />
                    </a>
                    <p className="mt-1 hidden text-foreground-muted text-sm sm:block">
                      {p.metric}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-figure flex flex-wrap items-center gap-x-6 gap-y-figure">
                <a className={ACTION_CLASS} href="#contact">
                  <Cue label="Hire me ↓" />
                </a>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-foreground-muted text-sm">
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
              </div>
            </div>
          </div>
          <Shore />
          <HourCue href="#jobs" label={fold.cue.label} time={fold.cue.time} />
        </section>

        {/* Morning: the work, in short. The rest lives on /work. */}
        <section
          aria-labelledby="jobs"
          className="hour hour-morning pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="morning"
        >
          <SectionHead accent="built" id="jobs" lead="What I">
            Two AI systems lead. Behind them is more client work from Zenkoders,
            and a few things of my own.
          </SectionHead>
          <WorkTeaser />
          <LateScene name="fishMarket" />
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
          <LateScene name="port" />
          <HourCue href="#tools" label="What I build with ↓" time="16:30" />
        </section>

        {/* Golden hour: the tools. */}
        <section
          aria-labelledby="tools"
          className="hour hour-golden pt-section pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="golden"
        >
          <SectionHead accent="build" id="tools" lead="What I" tail="with">
            My core stack, the services around it, and the AI I code with.
          </SectionHead>
          <ToolShelf />
          <LateScene name="dunes" />
          <HourCue href="#about" label="About ↓" time="18:40" />
        </section>

        {/* Early evening: Sea View, met by scrolling. */}
        <div
          aria-hidden="true"
          className="hour hour-evening h-[calc(var(--scene-h)+6rem)]"
          data-hour="evening"
        >
          <LateScene name="seaView" />
        </div>

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
          <LateScene name="dusk" />
          <HourCue href="#contact" label="Get in touch ↓" time="21:30" />
        </section>
      </main>

      {/* Night. */}
      <ContactFooter />
    </>
  );
}
