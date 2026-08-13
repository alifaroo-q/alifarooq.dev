import { ContactFormSlot } from "@/components/contact-form-slot";
import { SectionHead } from "@/components/section-head";
import { CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The contact footer — one component, on every page (#8, #24).
 *
 * It is a real section rather than a link in the header because a `mailto:`
 * has no scroll depth, and #5's ordered funnel ends on this section reaching
 * the reader. That measurement is #31's; the section it measures is this one.
 *
 * **Compact on a detail page.** A reader who has just followed one argument to
 * its end does not need to be approached again — they arrived at the footer
 * having already decided. So the lead sentence is the thing the compact
 * variant drops: it is the part that introduces, and on a detail page the page
 * above it did that job (#17).
 *
 * The order is email, then form, then notice. The address first because it is
 * the fastest path and the one that works with no JavaScript; the notice last
 * because it describes the form, and a rule about what happens to a message
 * reads better under the box than above it.
 */
export function ContactFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer>
      <SectionHead id="contact" label="Contact" />

      {/* `pt-group` on both variants, and the bottom keeps its own step. The
          head above now carries 56px of its own, so opening with another 56
          would leave the label as far from the section it introduces as from
          the one it ended. The foot is the page's last edge and wants the
          room, so only the top comes down. */}
      <div
        className={cn(
          "px-6 pt-group md:px-10",
          compact ? "pb-10 md:pb-12" : "pb-14 md:pb-16",
        )}
      >
        {/* One container, one width, for everything in the footer — the lead,
            the address, the form and the notice. Each of the four carried its
            own `max-w-measure` before, which is four chances to forget it and
            four right edges the day one of them does. */}
        <div className="max-w-measure">
          {compact ? null : (
            <p className="text-[clamp(1.1875rem,2.6vw,1.625rem)] leading-[1.4]">
              Send me a message about a role, a project, or anything on this
              page.
            </p>
          )}

          <p className={compact ? undefined : "mt-group"}>
            <a
              className="underline underline-offset-[0.2em] hover:text-accent"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>
          </p>

          <div className="mt-group">
            <ContactFormSlot />
          </div>

          {/* #14's settled string, verbatim. It is two things a visitor is owed
            under Art. 13 — what the message is for, and how long it is kept —
            and it is here instead of a consent checkbox and a `/privacy` page
            because nothing on this site stores a message anywhere but the
            inbox. The day something does, that trade stops holding. */}
          <p className="mt-group text-foreground-label text-sm">
            Goes straight to my inbox. I use it to reply, and for nothing else.
            I keep messages as long as the thread is useful. Ask and I'll delete
            yours.
          </p>
        </div>
      </div>
    </footer>
  );
}
