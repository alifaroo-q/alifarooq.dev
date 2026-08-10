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
