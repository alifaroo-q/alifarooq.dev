import { ContactFormSlot } from "@/components/contact-form-slot";
import { Cue } from "@/components/cue";
import { Harbour, Stars } from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import {
  BASE_LOCATION,
  BASE_UTC,
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  REMOTE_REGIONS,
} from "@/lib/site";

/**
 * Night, and the footer of every page.
 *
 * The page ends in the dark: a navy sky with stars and a moon, a lit harbour
 * and a lighthouse. The form sits in a cream card, which resets the tokens to
 * day ink, so it is as legible here as the cards were at noon.
 */
export function ContactFooter() {
  return (
    <footer
      className="hour hour-night pt-section pb-[calc(var(--scene-h)*0.85+3rem)]"
      data-hour="night"
    >
      <Stars />
      <SectionHead accent="job" id="contact" lead="Bring me a">
        Full-time remote, contract or a single project. Tell me what you need
        and I reply within 24 hours.
      </SectionHead>
      <div className="wrap mt-group grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16">
        <div className="max-w-measure">
          <p className="text-[clamp(1.125rem,2vw,1.375rem)]">
            Or write to{" "}
            <a
              className="hit ink-link font-semibold"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p className="mt-flow flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            <a className="hit ink-link" href={GITHUB_URL}>
              <Cue label="GitHub ↗" />
            </a>
            <a className="hit ink-link" href={LINKEDIN_URL}>
              <Cue label="LinkedIn ↗" />
            </a>
          </p>
          <p className="mt-group text-[clamp(1rem,1.6vw,1.125rem)]">
            I work remotely from {BASE_LOCATION}, {BASE_UTC}, with flexible
            hours. Open to roles in:
          </p>
          <ul className="mt-tight flex flex-wrap gap-2.5">
            {REMOTE_REGIONS.map((region) => (
              <li className="chip px-3 py-1 text-sm" key={region}>
                {region}
              </li>
            ))}
          </ul>
          {/* The one honest note on what happens to a message. */}
          <p className="mt-group text-foreground-muted text-sm">
            Messages go straight to my inbox. I use them to reply, and for
            nothing else. Ask and I'll delete yours.
          </p>
          <p className="mt-figure font-mono text-foreground-label text-xs">
            24°51′N 67°00′E · {BASE_LOCATION} · {BASE_UTC}
          </p>
        </div>
        <div className="paper p-6 md:p-8">
          <ContactFormSlot />
        </div>
      </div>
      <Harbour />
    </footer>
  );
}
