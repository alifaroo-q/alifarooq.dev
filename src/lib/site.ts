/**
 * The handful of facts that more than one page prints.
 *
 * The address is here rather than in the home page's `person` block because
 * the contact footer is on every page (#8) and the fold prints the same
 * string. Two literals of one address is one edit away from a site that
 * disagrees with itself, and #15 already holds the site and the resume to
 * exactly that rule.
 */
export const CONTACT_EMAIL = "hello@alifarooq.dev";

/**
 * The site's one action style: an accent outline that fills on hover.
 *
 * It is here rather than copied because the fold's resume link and the contact
 * form's submit button are the same affordance in two places, and a class list
 * copied twice is two things that used to match. It carries no layout — the
 * call site adds that — and it sets nothing that is not a token, so it follows
 * the ground like everything else.
 */
export const ACTION_CLASS =
  "border border-accent px-5 py-2.5 text-accent transition-colors hover:bg-accent hover:text-accent-foreground";

/**
 * The origin, written once (#16).
 *
 * Four things print it and none of them can disagree: `metadataBase`, every
 * page's self-canonical, the sitemap's five URLs, and the `Person` block's
 * `url`. #4 made the apex canonical and `www` a 308, so this is the apex.
 */
export const SITE_URL = "https://alifarooq.dev";

/** The `og:site_name` — the domain, not the person. The person is the title. */
export const SITE_NAME = "alifarooq.dev";

/**
 * The name and the role, as the `<head>` and the share card print them.
 *
 * `role` is the same string the fold's micro-line carries. It is also half of
 * the home title and the `Person` block's `jobTitle`, and three literals of a
 * job title is how a site ends up claiming two different jobs.
 */
export const PERSON_NAME = "Ali Farooq";
export const PERSON_ROLE = "Backend engineer";

/**
 * The two profiles, spelled out (#16).
 *
 * They do not match — `alifaroo-q` on GitHub, `itsalifarooq` on LinkedIn — so
 * neither can be derived from the other. Both are listed, and `sameAs` is the
 * one place a machine gets to tie the site to the name a recruiter types.
 */
export const PROFILE_URLS = [
  "https://github.com/alifaroo-q",
  "https://www.linkedin.com/in/itsalifarooq",
];

/**
 * #14's conviction specimen, stated once (#7).
 *
 * The home page prints it as the open-source block's lead, and the
 * `/open-source/<slug>` share card prints it under the repo name. One string,
 * because a card that paraphrases the page it links to is a card that is
 * already out of date.
 */
export const OPEN_SOURCE_CONVICTION =
  "Failure should be part of what a function returns, not something you find out about in production.";
