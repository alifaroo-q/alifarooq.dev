import { ContactFormSlot } from "@/components/contact-form-slot";
import { Harbour, Stars } from "@/components/scenery";
import { SectionHead } from "@/components/section-head";
import {
  BASE_LOCATION,
  BASE_UTC,
  CONTACT_EMAIL,
  REMOTE_REGIONS,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Night, and the footer of every page.
 *
 * The page ends in the dark: a navy sky with stars and a moon, a lit harbour
 * and a lighthouse. The form sits in a cream card, which resets the tokens to
 * day ink, so it is as legible here as the cards were at noon. The detail
 * pages pass `compact`, which drops the invitation and keeps the form; the
 * reader has already been persuaded and does not need the pitch twice.
 */
export function ContactFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className="hour hour-night pt-section pb-[calc(var(--scene-h)*0.6+3rem)]"
      data-hour="night"
    >
      <Stars />
      <SectionHead accent="hello" id="contact" lead="Say">
        {compact
          ? null
          : "Send me a message about a role, a project, or anything on this page."}
      </SectionHead>
      <div
        className={cn(
          "wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16",
          compact ? "mt-figure" : "mt-group",
        )}
      >
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
          <p className="mt-group text-[clamp(1rem,1.6vw,1.125rem)]">
            I work remotely from Karachi, {BASE_UTC}, with flexible hours. I am
            looking at roles in:
          </p>
          <ul className="mt-tight flex flex-wrap gap-2.5">
            {REMOTE_REGIONS.map((region) => (
              <li
                className="rounded-full border-2 border-cream bg-background px-3.5 py-1 font-medium text-sm"
                key={region}
              >
                {region}
              </li>
            ))}
          </ul>
          {/* The one honest note on what happens to a message. */}
          <p className="mt-group text-foreground-muted text-sm">
            Goes straight to my inbox. I use it to reply, and for nothing else.
            I keep messages as long as the thread is useful. Ask and I'll delete
            yours.
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
