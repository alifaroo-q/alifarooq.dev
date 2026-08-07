/**
 * PROTOTYPE — throwaway. Real copy for the four visual takes of the home page.
 *
 * Every string here is settled content, not placeholder:
 *   #8 fold slots, section order, eyebrow/heading pairs, click affordances
 *   #6 case-study angles, constraints, anonymisation rules
 *   #7 OSS conviction lead, uneven weighting, amended drizzle-tx pitch
 *
 * If a variant wants different words, that is a content decision and belongs
 * back on those tickets — not here.
 */

export const person = {
  name: "Ali Farooq",
  positioning:
    "I'm a backend engineer who designs for the failure case first — the integration that degrades silently, the payment that must never be captured twice, the transaction that outgrows the service it started in.",

  /**
   * The same sentence, decomposed. #8's central claim is that the sentence *is*
   * the page's table of contents — three clauses, three case-study slots, in the
   * order the sections appear. Nothing on the page showed that. Splitting it
   * lets a take mark each clause against the slot it opens. No copy changes;
   * this is the identical string, cut at its existing commas.
   */
  positioningLead: "I'm a backend engineer who designs for the failure case first —",
  positioningClauses: [
    "the integration that degrades silently,",
    "the payment that must never be captured twice,",
    "the transaction that outgrows the service it started in.",
  ],
  // Fold micro-line: role, location, availability. Deliberately no proof element.
  role: "Backend engineer",
  location: "Karachi, Pakistan",
  availability: "Open to backend roles",
  email: "hello@alifarooq.dev",
  resumeHref: "/ali-farooq-resume.pdf",
  github: "https://github.com/alifaroo-q",
};

export const work = [
  {
    id: "gmail-automation",
    eyebrow: "A healthcare services provider",
    decision: "Treating Google as a system that will fail",
    constraint:
      "OAuth tokens expire, Gmail watches lapse, webhooks drop — and all of it happens silently. The automation had to detect its own blind spots before anyone downstream noticed the mail had stopped moving.",
    artifact: "See the state diagram",
    href: "/work/treating-google-as-a-system-that-will-fail",
  },
  {
    id: "money-invariant",
    eyebrow: "A virtual-phone-number & SMS platform",
    decision: "Putting the money invariant in the database, not the service",
    constraint:
      "A double-capture is real money and an RLS gap is a breach — neither is recoverable by apologising. The guard could not live somewhere a future service was free to route around.",
    artifact: "See the ledger transitions",
    href: "/work/putting-the-money-invariant-in-the-database",
  },
  {
    id: "transaction-boundary",
    eyebrow: "A multi-tenant workshop-management SaaS",
    decision: "22 modules, one transaction boundary",
    constraint:
      "One operation spanned modules that had no business knowing about each other, and threading a transaction handle through every call signature was not an option. So I extracted it.",
    artifact: "See the module sketch",
    href: "/work/22-modules-one-transaction-boundary",
  },
];

/**
 * #7: the home block is entirely non-technical and carries no mechanism.
 * Weighting is uneven on purpose — three equal cards re-assert the pipeline
 * that was rejected.
 */
export const openSource = {
  conviction:
    "Failure should be part of what a function returns, not something you find out about in production.",
  // The retrofit, in exactly one clause.
  retrofit: "I've held that twice now — the second time re-derived rather than reused.",
  featured: {
    name: "drizzle-tx",
    pitch:
      "The same idea where it cost the most: automatic transaction handling across a service too large to thread a handle through, on a database layer that only knows how to undo work when something throws.",
    link: "Read how it works",
    href: "/open-source/drizzle-tx",
  },
  origin: [
    {
      name: "result-kit",
      pitch:
        "Where it started: a TypeScript library that makes failure part of what a function returns, instead of an exception you find out about in production.",
      href: "https://github.com/alifaroo-q/result-kit",
    },
    {
      name: "result-kit-lint",
      pitch:
        "A convention nobody enforces is a convention that decays — lint rules that fail the build when a result goes unchecked.",
      href: "https://github.com/alifaroo-q/result-kit-lint",
    },
  ],
};

/** #8: names the employer once, states seniority as a date, states availability outright. */
export const about = {
  lines: [
    "Software engineer at Zenkoders since 2024, working on the backend of client products — which is why the work above is described without naming the clients.",
    "The problems I keep being handed are the ones where being wrong is expensive: money that must not move twice, integrations that go quiet rather than loud, systems that outgrow the shape they were started in.",
    "I'm in Karachi, and open to backend roles.",
  ],
};

export const contact = {
  heading: "Contact",
  line: "The fastest way to reach me is email. Résumé is a PDF, no form in front of it.",
};
