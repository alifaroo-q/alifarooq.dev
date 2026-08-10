import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Script from "next/script";
import { UMAMI_SCRIPT_URL } from "@/lib/analytics";

/**
 * Both counters, at the foot of every page (#5, #13, #31).
 *
 * **Umami Cloud** is here for one thing Vercel cannot do on Hobby: an ordered
 * funnel with a custom event as its last step. Custom events are Pro-gated on
 * Vercel and no Vercel plan documents a funnel at all, so the question this
 * site was built to answer would have no answer.
 *
 * **Vercel Web Analytics stays on beside it.** It is free, it is already part
 * of the platform, and it is the fallback if Umami's free plan turns out to
 * have a cap nobody could read at the time it was chosen — the one figure
 * #13 could not confirm from a primary source.
 *
 * **No consent banner**, and the reason matters more than the outcome. It is
 * not "no cookies", which is the vendor's own weaker claim; it is **no device
 * access** under ePrivacy Art. 5(3), which is written about storing or
 * reading anything in the reader's terminal equipment. Umami's tracker
 * writes nothing — it reads one opt-out key, `umami.disabled`, that only the
 * site owner ever sets. Vercel derives its identifier server-side from the
 * request and throws it away after a day. The moment anything here writes an
 * analytics id to `localStorage`, that argument is gone and a banner is owed.
 */
export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <>
      {/* No id, no script. That is the state of a local checkout and of any
          fork, and loading a tracker that can only 400 is worse than loading
          nothing. `NEXT_PUBLIC_` is inlined at build time, so this is decided
          when the site is built, not when it is served. */}
      {websiteId ? (
        <Script data-website-id={websiteId} src={UMAMI_SCRIPT_URL} />
      ) : null}
      <VercelAnalytics />
    </>
  );
}
