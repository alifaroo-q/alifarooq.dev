/**
 * The stack — twelve things, and what each one cost.
 *
 * This is a typed array rather than a collection (#8's shape, not #9's): an
 * item is a RECORD — name, slug, one sentence, sometimes a proof link — and a
 * collection is for free-form documents. A `content/stack/*.mdx` file per
 * technology would make twelve documents out of twelve sentences, and the
 * schema would then be the layout.
 *
 * Three rules hold this file, and the page states all three in its own words:
 *
 * - **The bar is: shipped it, then had to live with it.** Everything below
 *   passed that bar. Things that did not are in `BELOW_BAR`, named as such.
 *   A list with no stated bar is an inventory, and an inventory can only be
 *   read as a claim to know everything on it.
 * - **The sentence states a COST, not a use.** "Postgres — primary store" is
 *   a label; the site does not write labels. Every other page here names the
 *   failure it designed around, and a list that drops into product-copy voice
 *   says the rest of the site was the performance. It is also the one thing
 *   nobody else's stack page does — the surveyed pages either say nothing per
 *   item or say what the tool is for.
 * - **Twelve is a cap, not a count of what is known.** The inventory behind
 *   this file ran to about forty-five. Mongo, MySQL, SQLite, Better Auth, the
 *   OAuth providers, Vercel, Render, GitHub Actions and Cloudflare are all
 *   real and all left out, because each was either used once, or has no cost
 *   worth a sentence, or is a thing every backend engineer is assumed to have.
 *   Forty-five nouns is the failure mode; twelve you can defend is the claim.
 *
 * No level words anywhere — no "advanced", no "expert", no years. The only
 * signal of depth is the sentence, which either knows something or does not.
 */

export type StackItem = {
  /** The heading, and the entry the pinned column prints. */
  name: string;
  /**
   * The tracking key. It is written here rather than derived from `name`
   * because the prose section and the index entry must agree on it, and a
   * slugger run twice is two places to change the rule.
   */
  slug: string;
  /**
   * One sentence, or two. It names what the thing cost, what it hides, or
   * where it bit — never what it is for.
   */
  note: string;
  /**
   * The page that proves it, where one exists.
   *
   * This is the whole reason to write the list at all: the reader stops
   * reading a claim and starts reading an index into the evidence. About a
   * third of the items carry one; the rest stand on the sentence. `href` is
   * checked against the real collections by `stack.test.ts`, so a renamed
   * case study breaks the build rather than shipping a dead link on the one
   * page that claims to be the evidence index.
   */
  proof?: { href: string; label: string };
};

/**
 * Ordered by how load-bearing it is to the work, not by layer and not by how
 * surprising it is.
 *
 * A reader on this page is placing me, so the thing I would be hired for goes
 * first. Ordering by surprise — the LLM work at the top, because the site
 * never mentions it — is a hook, and a hook is the register everything else
 * here refuses.
 */
export const STACK: StackItem[] = [
  {
    name: "TypeScript",
    slug: "typescript",
    note: "Everything I write is TypeScript. Inside the program the types hold. At the edge they are only a claim: an unparsed response is whatever the annotation says it is, and the compiler carries that claim all the way to production. So I parse at the boundary and keep the failure in the type.",
    proof: {
      href: "/open-source/result-kit",
      label: "What I do with the failure case →",
    },
  },
  {
    name: "Node",
    slug: "node",
    note: "One thread, shared by everybody. I have watched a single handler do real work on the CPU while requests that needed nothing from it queued up behind. It is the first thing I check when a service slows down under load and the database looks fine.",
  },
  {
    name: "Postgres",
    slug: "postgres",
    note: "My default store, and I put rules in it the service cannot be trusted with. A check constraint keeps a wallet from going below zero. A unique key keeps the same capture from being written twice. The price is a migration every time a rule moves, and I have paid it and would pay it again.",
    proof: {
      href: "/work/the-money-rule-in-the-database-not-the-service",
      label: "The money rule, in the database →",
    },
  },
  {
    name: "Redis",
    slug: "redis",
    note: "Cache and lock. The reads are the easy part. The hard question is which data is allowed to be stale, and who gets to decide. I have inherited keys nobody could name an owner for, and they are all still there.",
  },
  {
    name: "Queues",
    slug: "queues",
    note: "BullMQ on Redis, SQS on AWS, RabbitMQ when the routing earned it. A queue moves the failure somewhere no user is watching. That makes the retry policy and the dead-letter queue the real design work, and I have never got either right on the first pass.",
  },
  {
    name: "AWS",
    slug: "aws",
    note: "EC2, S3, RDS, SQS, Lambda, CloudWatch. IAM is the part that costs me time. I write a policy narrow enough to be right, then somebody widens it to unblock a deploy on a Friday and it stays wide. Including me.",
  },
  {
    name: "Docker",
    slug: "docker",
    note: "Compose on my machine, images in CI. Docker made “works on my machine” a smaller lie. The image is identical everywhere. The environment it reads at boot is not, and that is where the afternoon goes.",
  },
  {
    name: "NestJS",
    slug: "nestjs",
    note: "Twenty-seven feature modules on one backend, and the container is why there are that many. Wiring is cheap, so every module reaches the database itself. By the time that is a problem, no single place owns a transaction. Putting the handle back in the signatures took thirty-four files.",
    proof: {
      href: "/work/the-handle-goes-in-the-signature",
      label: "What that cost, and the fix →",
    },
  },
  {
    name: "Next.js and React",
    slug: "next-react",
    note: "I have shipped and maintained both, and this site is one of them. The cost sits on the server-client boundary, which serialises every value that crosses it. The bug then arrives looking like a rendering problem, and it is usually the shape of the data I sent.",
  },
  {
    name: "Payments",
    slug: "payments",
    note: "Stripe, and Fedapay for West African francs. Money is where a retry stops being free. The same webhook arrives twice, and the second one has to do nothing in a way I can prove. I once booked a cost of $0.0769 as 8c, and every total still added up, because a wrong number adds up with itself perfectly well.",
    proof: {
      href: "/work/the-money-rule-in-the-database-not-the-service",
      label: "Why the rule left the service →",
    },
  },
  {
    name: "LLMs and agents",
    slug: "llms",
    note: "OpenAI models, LangChain and LlamaIndex, retrieval over pgvector and Pinecone. The model fails in a way nothing else here does: it returns the right shape with the wrong answer and no sign that anything went wrong. So the work is the schema at the edge and the decision about what the model is allowed to see. Very little of it is the prompt.",
  },
  {
    name: "Observability",
    slug: "observability",
    note: "Sentry for exceptions, Seq for structured logs. Logs start earning their storage on the day you can follow one request end to end. Before that you have a great deal of evidence and no way to rebuild what happened.",
  },
];

/**
 * The three strings the page and its share card both print (#16).
 *
 * They live here rather than in `page.tsx` because the card is a separate
 * route and cannot import from a page module. Two literals of a headline is a
 * card that previews under a heading the page stopped using — and the card is
 * the copy nobody looks at again, so it is the one that would drift.
 *
 * `STACK_HEADING` is a sentence, not the word "Stack". Every other `h1` on the
 * site is a claim; a one-word heading here would be the only label among them,
 * and a label is what the twelve sentences below spend the page refusing to be.
 *
 * `STACK_STANDFIRST` is the bar, stated outright and without comparison — it
 * is not defensive if it does not mention anybody else's list. It is also the
 * meta description, so the card and the page open on the same sentence.
 *
 * `STACK_EYEBROW` names the zone rather than the contents, which is what the
 * open-source pages do with theirs: the heading is already the claim, and what
 * the reader needs from an eyebrow is which part of the site they are in.
 */
export const STACK_HEADING =
  "Twelve tools I shipped and then had to live with.";

export const STACK_STANDFIRST =
  "Everything here I shipped, and then kept running long enough for it to cost me something. That is the whole bar for being on the list.";

export const STACK_EYEBROW = "Stack";

/**
 * The completeness hedge, taken without the date that usually comes with it.
 *
 * The surveyed pages that handle this well carry both a hedge and an "updated
 * on" line. The hedge is a true statement about the list's bounds and never
 * goes stale; a date is a promise to review, and the first missed review turns
 * it into an advertisement for how old the page is.
 */
export const STACK_HEDGE =
  "This is not a complete list. I stopped where I ran out of things I could defend.";

/**
 * What did not clear the bar, in one sentence.
 *
 * The alternative was a second group — "enough to read it, not enough to have
 * carried it" — and a second group is a container, which asks to be filled,
 * and then a third. One sentence is honest, bounded, and cannot grow into the
 * skill ladder this page exists to avoid.
 *
 * Python is worded differently from the other two on purpose. It shipped; it
 * was not lived with. That is a different claim from having watched Java and
 * .NET work, and collapsing the two would overclaim one and underclaim the
 * other.
 */
export const BELOW_BAR =
  "I have shipped Python, but not for long enough to claim it. I have watched Java and C# up close and never carried either one.";
