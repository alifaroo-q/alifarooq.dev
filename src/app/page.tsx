import { Caravan, type Stop } from "@/components/caravan";
import { ContactFooter } from "@/components/contact-footer";
import { Fold, type FoldContent } from "@/components/fold";
import { HourCue } from "@/components/hour-cue";
import { HowIWork } from "@/components/how-i-work";
import { LateScene } from "@/components/late-scenery";
import { SectionHead } from "@/components/section-head";
import { SiteHeader } from "@/components/site-header";
import { ToolShelf } from "@/components/tool-shelf";
import { WorkTeaser } from "@/components/work-teaser";
import {
  BASE_LOCATION,
  BASE_UTC,
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
const PROOF: FoldContent["proof"] = [
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
        <Fold fold={fold} person={person} proof={PROOF} />

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
