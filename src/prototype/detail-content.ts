/**
 * PROTOTYPE — throwaway. Detail-page copy for the two page kinds #17 has to lay out.
 *
 * Copy is prototype-grade and written to #14's voice rules so the takes can be
 * judged at real density. It is NOT settled content — the case-study body is
 * #6's to write and the drizzle-tx body is #7's. If a take wants different
 * words, that is a content decision and belongs back on those tickets.
 *
 * Structure, though, IS settled and is reproduced faithfully:
 *   #6  case study = problem → decision, stops at "so I extracted it",
 *       one checkable artifact, no "can't share the code" line
 *   #7  drizzle-tx = seven sections, technical register, section 3 is the centre
 *   #9  no `title` on a case study: `decision` is the heading and the h1
 */

/** Slot 1 — the Gmail automation system. Carries the state diagram. */
export const caseStudy = {
  eyebrow: "A healthcare services provider",
  decision: "Treating Google as a system that will fail",
  /** #16's authored description, ~150 chars. Shown here so the takes can test it as a standfirst. */
  description:
    "An automation on top of Gmail, built so that every way Google can go quiet is a state the system can see itself in.",
  artifactLabel: "Gmail connection states",
  artifactCaption:
    "Solid is healthy. Dashed is mail no longer moving. The only edge back out of disconnected is a person.",

  /** The constraint, restated for the reader who did not come from the home page. */
  constraint:
    "OAuth tokens expire. Gmail watches lapse after seven days. Webhooks drop. Every one of those fails quietly, and the visible symptom is the same in all three cases: nothing arrives, and nothing says so.",

  sections: [
    {
      /** `key` ties the section to the parts of the diagram it is talking about. */
      key: "problem",
      heading: "The problem",
      body: [
        "The automation read a shared inbox, classified what came in, and pushed the result into the CRM the team actually worked out of. On a good day nobody thought about it.",
        "A bad day looked exactly like a quiet day. Mail stopped being processed, no error was raised, and the first person to notice was whoever eventually asked why a lead had gone cold. By then the gap was measured in days.",
      ],
    },
    {
      key: "decision",
      heading: "The decision",
      body: [
        "I stopped treating the Google connection as infrastructure and started treating it as a state machine with failure states I had to name.",
        "Every connection carries an explicit state and a deadline. A watch has a known expiry, so a renewal is scheduled before it, not after a failure. A refresh that returns 401 moves the connection to invalid rather than retrying into a wall. Invalid raises an alert immediately, because the only fix is a human re-consenting.",
      ],
    },
    {
      key: "cost",
      heading: "The cost",
      body: [
        "The recovery machinery was written before a single one of these failures had happened in production, and most of it has still never fired. That is the trade: the work is paid up front, against outages that are invisible until they are expensive.",
        "I would make the same call again. The alternative is a system whose failure mode is silence, and silence is the one signal nobody escalates.",
      ],
    },
  ],
};

/** #7's seven-section skeleton, in order. Section 3 is the centre of the page. */
export const ossPage = {
  name: "drizzle-tx",
  standfirst:
    "Automatic transaction propagation for Drizzle and NestJS — and an argument about where a failure is allowed to live.",
  description:
    "Why transaction propagation on Drizzle needs one place where a Result becomes a throw, and what the compiler has to hold in return.",

  sections: [
    {
      heading: "The wall",
      centre: false,
      body: [
        "Twenty-two modules, one operation that spanned several of them, and one transaction that had to cover the whole thing. Threading a transaction handle through every call signature between the entry point and the leaf was not an option — it puts a database concern in the type of every method it passes through, including the ones that never touch a database.",
        "So I extracted it. What follows is the part the case study stops before.",
      ],
    },
    {
      heading: "Why the ORM makes it hard",
      centre: false,
      body: [
        "Drizzle rolls a transaction back on exactly one signal: the callback throws. There is no rollback method to call and no return value it inspects. If the code inside the boundary reports failure by returning it, the transaction commits.",
        "That is the seam. A codebase that models failure as a value sits directly on top of a driver that only understands failure as an exception.",
      ],
    },
    {
      heading: "The inversion",
      centre: true,
      body: [
        "Inside the boundary, a failed Result is converted to a throw. Outside it, the throw is converted straight back to a Result. The conversion happens in one file and nowhere else, which is what keeps it from becoming a second error-handling convention.",
        "The part worth reading is the double fault. If the rollback itself fails, the driver's error is the one that propagates, and the domain error that caused the rollback is gone. So the domain error is carried out on the rollback error as lostDomainError rather than being replaced by it. It is a small piece of code that exists entirely because the obvious version loses the only fact worth having.",
      ],
    },
    {
      heading: "Making the compiler hold the line",
      centre: false,
      body: [
        "An ambient transaction context is invisible control flow, and invisible control flow is where the bugs go. So the type system carries the part that matters: a scope opened as REQUIRES_NEW is branded Independent, and returning its inner value into the enclosing scope is a compile error rather than a silent join.",
        "The brand is a phantom type. It costs nothing at runtime and exists only to make one class of mistake unwritable.",
      ],
    },
    {
      heading: "Where I disagreed with myself",
      centre: false,
      body: [
        "There are two Result implementations here, written four months apart, and they resolve the same design question in opposite directions. The first says a success with no value is never. The second says it is Ok<T>. Both rationales are written down, and I still think both are defensible.",
        "I have left it visible rather than reconciled it, because the disagreement is the honest record of what re-deriving an idea actually looks like.",
      ],
    },
    {
      heading: "What I'd change",
      centre: false,
      body: [
        "The transaction host is a process-global map keyed on the string default, and the last constructor to run wins. It works because there is one database. It is the first thing that breaks when there are two.",
        "The open question I have not settled: whether the whole inversion should be dropped in favour of throwing first and converting at the edges. I will move if the boundary file ever needs a second conversion path, and not before.",
      ],
    },
    {
      heading: "Try it",
      centre: false,
      body: [
        "The core package pins a release candidate of drizzle-orm on purpose — the rollback path it depends on only behaves that way in the rc. The README says so at the install step.",
        "Source and the architecture decision records are on GitHub.",
      ],
    },
  ],
};
