import type { Metadata } from "next";
import { PERSON_NAME, PERSON_ROLE, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Every page's `<head>`, built from one function (#16).
 *
 * The card is the deliverable and search is only made correct. A recruiter
 * arrives from a link pasted into a message, not from a query, so what the
 * preview says is the first thing they read — and LinkedIn ignores `twitter:`
 * tags and caches the image hard, so the first share sets the card and there
 * is no second draft.
 *
 * The reason this is a function rather than four hand-written objects is
 * Next's own merge rule: `openGraph` is REPLACED by the last segment that
 * defines it, never merged field by field. A page that sets only `title` and
 * `description` inherits the layout's whole `openGraph` block, so a case
 * study would preview under the home page's words. Writing the block out at
 * each call site is the same trap one copy-paste later.
 */

/**
 * The home title. It is `title.default` in the layout, so it is also what a
 * child segment with no title of its own would fall back to.
 */
export const HOME_TITLE = `${PERSON_NAME} — ${PERSON_ROLE}`;

/**
 * The suffix template, as a string and as a function.
 *
 * `<title>` gets the string, because `title.template` is Next's mechanism and
 * fighting it would mean writing the suffix into every page. `og:title` gets
 * the function, because the template does not reach `openGraph.title` — the
 * two would otherwise be a suffix apart and nobody would notice, since the
 * one that drifts is the one nobody looks at in a browser tab.
 */
export const TITLE_TEMPLATE = `%s — ${PERSON_NAME}`;

export function titleWithSuffix(title: string) {
  return TITLE_TEMPLATE.replace("%s", title);
}

/**
 * A page's metadata, minus the OG image — that is the `opengraph-image` file
 * convention's job, and Next fills `og:image` and `twitter:image` in from it.
 *
 * `path` is the self-canonical, resolved against `metadataBase`. #4's 308
 * handles `www` and nothing else; it does not handle the `?utm_source=` a job
 * board pastes back, which is exactly how these links travel.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Omitted on the home page, which is the one page the suffix would repeat. */
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const resolved = title ? titleWithSuffix(title) : HOME_TITLE;

  return {
    // The bare string, so the layout's template adds the suffix. Passing the
    // already-suffixed string here would print the name twice.
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: resolved,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      // `summary_large_image` and no `creator`. A handle tag pointing at an
      // account nobody posts from is a link to nothing (#16).
      card: "summary_large_image",
      title: resolved,
      description,
    },
  };
}

/**
 * The site-level metadata the root layout exports.
 *
 * `metadataBase` lives here with everything else that would otherwise be a
 * second literal of the origin.
 */
export function rootMetadata(description: string): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: HOME_TITLE, template: TITLE_TEMPLATE },
    ...pageMetadata({ description, path: "/" }),
  };
}
