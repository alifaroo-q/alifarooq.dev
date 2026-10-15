import type { Flagship } from "@/components/work-parts";
import { FLAGSHIPS } from "@/lib/work";

/**
 * Worst-case flagships for the home work teaser. Titles are a flagship's
 * `what`, subs its `client`; the results are the length a one-line outcome
 * takes when it has a number, a unit and a caveat.
 */
const base: Flagship = {
  ...FLAGSHIPS[0],
  stamp: "in-production",
  diagram: "row",
  flow: [],
};

export const LONG: Flagship = {
  ...base,
  id: "job-long",
  client: "Northwind Industries Holdings International",
  what: "Multi-region healthcare credentialing and compliance platform",
  years: "2023 to 2026, still in production",
  result:
    "Cut a provider's onboarding from 41 days to 6 across 212 hospitals in 14 states, with every licence, DEA, background and exclusion check logged for audit and re-run on a schedule, and a coordinator told exactly which one is still waiting and on whom.",
};

export const COMPOUND: Flagship = {
  ...base,
  id: "job-compound",
  client: "Verkehrsgesellschaft",
  what: "Benachrichtigungseinstellungen",
  years: "2026",
  stamp: "in-development",
  result: "Done.",
};

export const SHORT: Flagship = {
  ...base,
  id: "job-short",
  client: "Q",
  what: "CLI",
  years: "2026",
  stamp: "handed-over",
  result: "",
};

export const WORST = [LONG, COMPOUND, SHORT] as const;
export const ONE = [LONG] as const;
export const EMPTY = [] as const;

/** Labels the `Cue` parser has to take apart. */
export const CUE_LABELS = [
  "Hire me ↓",
  "Read the case study → and then the other one →",
  "Q3 → Q4 ↗",
  "↓",
  "No arrow",
  "A very long label that goes on and on and ends in an arrow, which is allowed ↗",
  "Trailing space →   ",
  "Unbreakable_label_without_any_spaces_at_all_that_is_forty_chars →",
];
