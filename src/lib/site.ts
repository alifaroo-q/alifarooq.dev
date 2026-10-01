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
 * The site's one action style: the saffron key, defined once in `globals.css`.
 * The fold's call to action and the contact form's submit are the same
 * affordance in two places, so they share the one class.
 */
export const ACTION_CLASS = "key";

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
 * The name and the roles, as the `<head>` and the share card print them.
 *
 * Ali works across four kinds of engineering and the site says all four.
 * `PERSON_ROLE` is the one umbrella title: it is half of the home title and
 * the share card's footline, where a single phrase has to do the job.
 * `PERSON_ROLES` is the full list, printed in the fold and handed to a machine
 * as the `Person` block's `jobTitle`. Two literals of a job title is how a site
 * ends up claiming two different jobs, so both live here.
 */
export const PERSON_NAME = "Ali Farooq";
export const PERSON_ROLE = "Software engineer";
export const PERSON_ROLES = [
  "Backend engineer",
  "Software engineer",
  "AI product engineer",
  "Full-stack engineer",
] as const;

/**
 * Where Ali works from and who he will work for, stated once.
 *
 * The fold prints the short form and the contact section the long one, and a
 * time zone written in two places is a time zone that gets changed in one.
 */
export const BASE_LOCATION = "Karachi, Pakistan";
export const BASE_UTC = "UTC+5";
export const REMOTE_REGIONS = [
  "United States",
  "Australia",
  "Middle East",
  "Europe",
] as const;

/**
 * The photograph, written once because two things print it.
 *
 * `Portrait` renders it in About, and the `Person` block hands the same file
 * to a machine as `image` — the one field that lets a search result carry a
 * face. A second literal of the path is a broken image the day the file is
 * renamed, and only one of the two would show it.
 *
 * The file is square and 640px on a side. It is bigger than the 112px box on
 * purpose: that is the retina copy, and it is also the size a knowledge panel
 * wants. `next/image` serves the box a smaller one.
 */
export const PORTRAIT_SRC = "/profile-image.jpg";

/**
 * The two profiles, spelled out (#16).
 *
 * They do not match — `alifaroo-q` on GitHub, `alifarooqdev` on LinkedIn — so
 * neither can be derived from the other. Both are listed, and `sameAs` is the
 * one place a machine gets to tie the site to the name a recruiter types.
 */
export const PROFILE_URLS = [
  "https://github.com/alifaroo-q",
  "https://www.linkedin.com/in/alifarooqdev",
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
