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

/** The built resume. The header and the contact section both link it. */
export const RESUME_HREF = "/resume.pdf";

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
 * The name and the one job title. The fold, the `<head>`, the share card and
 * the `Person` block's `jobTitle` all print `PERSON_ROLE`, so the site cannot
 * claim two different jobs.
 */
export const PERSON_NAME = "Ali Farooq";
export const PERSON_ROLE = "AI full-stack engineer";

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
export const GITHUB_URL = "https://github.com/alifaroo-q";
export const LINKEDIN_URL = "https://www.linkedin.com/in/alifarooqdev";
export const PROFILE_URLS = [GITHUB_URL, LINKEDIN_URL];
