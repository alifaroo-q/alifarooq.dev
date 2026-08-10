"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * The form's JavaScript, loaded when a reader reaches the footer (#11, #24).
 *
 * The contact section is on **every** page (#8), and the form behind it is
 * `react-hook-form` plus `zod` plus a resolver. Imported normally, every route
 * on the site would carry a form library that most readers never reach. So the
 * import is `next/dynamic` and the trigger is an `IntersectionObserver` — the
 * same mechanism #5 already needs for the `contact_reached` event, doing two
 * jobs rather than one.
 *
 * `ssr: false` because there is nothing useful to prerender: the form's whole
 * value is client-side validation and a fetch. What a reader with no
 * JavaScript gets is the `mailto:` in the footer above, which is a finished
 * path rather than a degraded one (#24, story 33).
 *
 * The margin is deliberate. Observing the slot itself would start the download
 * at the moment it becomes visible, and the reader would watch it arrive. A
 * screen of lead time is enough for the chunk to land before it is looked at.
 */
const ContactForm = dynamic(
  () => import("@/components/contact-form").then((mod) => mod.ContactForm),
  { ssr: false },
);

/** One viewport of lead time before the form is wanted. */
const LEAD_MARGIN = "100% 0px";

export function ContactFormSlot() {
  const slotRef = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || wanted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        setWanted(true);
        observer.disconnect();
      },
      { rootMargin: LEAD_MARGIN },
    );

    observer.observe(slot);

    return () => observer.disconnect();
  }, [wanted]);

  // The height is held whether the form has arrived or not, so the page does
  // not move under a reader when it does (#24, story 7). It is a floor rather
  // than a fixed height — the form grows past it once a message is typed, and
  // the error messages grow it further.
  return (
    <div className="min-h-96" ref={slotRef}>
      {wanted ? <ContactForm /> : null}
    </div>
  );
}
