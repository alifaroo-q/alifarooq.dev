/**
 * The analytics surface — one script, one event, one property (#5, #13, #31).
 *
 * The site exists to answer one question for its owner: do the case studies
 * move anyone to make contact? That is an **ordered sequence**, home →
 * case-study detail → contact section reached, and only the first two steps
 * are page views. The third is a scroll position, so it has to be sent as an
 * event, and the event has to say which page it fired on — the contact footer
 * is on every page (#8), so without the page the funnel cannot separate
 * "reached contact after reading a case study" from "scrolled past it on the
 * way down the home page." That distinction is the whole reason an ordered
 * funnel was chosen over a pair of counters.
 */

/**
 * Umami Cloud's tracker, EU data region.
 *
 * The host is `cloud.umami.is` for both regions — `eu.umami.is/script.js`
 * 301s here, so naming it would only buy the reader an extra redirect. The
 * region is a property of the account, chosen at signup and not casually
 * changed, and it decides where the data lands rather than where the script
 * comes from. If the dashboard's own tracking-code box ever shows a different
 * host, that box wins over this constant.
 */
export const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** The event the funnel's last step matches on. */
export const CONTACT_REACHED = "contact_reached";

/**
 * What the tracker puts on `window`, narrowed to the one call the site makes.
 *
 * `umami` is absent for as long as the script is in flight, and stays absent
 * for good behind an ad blocker or with no website id configured. Every call
 * site therefore has to treat it as optional, which is what the `?.` in
 * `trackContactReached` is doing.
 */
declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Send `contact_reached`, naming the page it fired on. Says whether it landed.
 *
 * What happens to the event after that is fire-and-forget: the tracker queues
 * a `fetch`, and the Hobby plan has no API to read events back (#13), so
 * nothing downstream can be asserted on and nothing is tested (#31).
 *
 * The one thing that *is* knowable is whether there was a tracker to hand the
 * event to, and the caller needs it. A missing tracker means one of two very
 * different things — an ad blocker, which is permanent and fine, or a script
 * still in flight, which lasts a moment and would otherwise silently cost the
 * funnel its last step. Returning the answer lets the caller tell them apart
 * by waiting.
 */
export function trackContactReached(page: string) {
  const umami = window.umami;
  if (!umami) return false;

  umami.track(CONTACT_REACHED, { page });
  return true;
}
