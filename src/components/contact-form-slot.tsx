"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { trackContactReached } from "@/lib/analytics";

/**
 * The form's JavaScript, and the funnel's last step — one observer, two jobs
 * (#11, #24, #31).
 *
 * The contact section is on **every** page (#8), and the form behind it is
 * `react-hook-form` plus `zod` plus a resolver. Imported normally, every route
 * on the site would carry a form library that most readers never reach. So the
 * import is `next/dynamic` and the trigger is an `IntersectionObserver` — the
 * same mechanism #5 already needs for the `contact_reached` event.
 *
 * `ssr: false` because there is nothing useful to prerender: the form's whole
 * value is client-side validation and a fetch. What a reader with no
 * JavaScript gets is the `mailto:` in the footer above, which is a finished
 * path rather than a degraded one (#24, story 33).
 */
const ContactForm = dynamic(
  () => import("@/components/contact-form").then((mod) => mod.ContactForm),
  { ssr: false },
);

/**
 * How long to keep offering the event to a tracker that has not arrived.
 *
 * The tracker is an `afterInteractive` script, so it is appended after
 * hydration and then has to cross the network. A reader who reloads parked at
 * the footer, or who follows a `#contact` link straight in, reaches the slot
 * inside that gap — and that reader is the one the funnel most wants to
 * count. Three seconds is long enough for the script on a slow connection and
 * short enough to give up on an ad blocker, which is the other reason the
 * tracker is missing and is never going to stop being one.
 */
const RETRY_DELAY_MS = 300;
const RETRY_LIMIT = 10;

export function ContactFormSlot() {
  const pathname = usePathname();
  const leadRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);

  // The page the event has already been sent for, so a reader who scrolls
  // away from the footer and back is one arrival at contact rather than two.
  // It is keyed on the path rather than a bare flag because the observer is
  // rebuilt whenever the effect re-runs, and the value it carries has to be
  // the page it is about.
  const reportedRef = useRef<string | null>(null);

  useEffect(() => {
    const lead = leadRef.current;
    const slot = slotRef.current;
    if (!slot) return;

    let cancelled = false;
    let retry: ReturnType<typeof setTimeout> | undefined;

    // Only count it as reported once it actually reached the tracker. Marking
    // it on the attempt would drop the event of every reader who arrives
    // before the script does, and drop it permanently — there is no second
    // callback, because the slot never stops intersecting.
    const report = (attemptsLeft: number) => {
      if (cancelled) return;

      if (trackContactReached(pathname)) {
        reportedRef.current = pathname;
        return;
      }

      if (attemptsLeft > 0) {
        retry = setTimeout(() => report(attemptsLeft - 1), RETRY_DELAY_MS);
      }
    };

    // One observer, both targets, no root margin. The lead time the download
    // needs is a property of *where the lead target sits*, not of the observer,
    // which is what lets the same observer answer a second question it must
    // answer honestly. A margin here would move both answers together and
    // report contact as reached a screen before it was.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        if (entry.target === slot && reportedRef.current !== pathname) {
          observer.unobserve(slot);
          report(RETRY_LIMIT);
        }

        if (entry.target === lead) {
          setWanted(true);
          observer.unobserve(entry.target);
        }
      }
    });

    if (lead && !wanted) observer.observe(lead);
    if (reportedRef.current !== pathname) observer.observe(slot);

    return () => {
      cancelled = true;
      clearTimeout(retry);
      observer.disconnect();
    };
  }, [wanted, pathname]);

  // The height is held whether the form has arrived or not, so the page does
  // not move under a reader when it does (#24, story 7). It is a floor rather
  // than a fixed height — the form grows past it once a message is typed, and
  // the error messages grow it further.
  return (
    <div className="relative min-h-96" ref={slotRef}>
      {/* One viewport of lead time, as a box rather than a margin. It sits
          directly above the slot and is a viewport tall, so it comes into view
          one screen before the slot does — the same moment the old
          `rootMargin: "100% 0px"` fired, arrived at without spending the
          observer's only margin. `h-screen`, not `h-dvh`: the two differ only
          by a mobile toolbar, which is nothing next to a screen of lead, and
          a unit the browser does not know would collapse this box to nothing
          and take the whole lead with it, quietly. Nothing is drawn and
          nothing is announced. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-full h-screen"
        ref={leadRef}
      />
      {wanted ? <ContactForm /> : null}
    </div>
  );
}
