import { describe, expect, it } from "vitest";
import {
  looksLikeCopy,
  measure,
  stringsFromCode,
  stringsFromMdx,
  stripComments,
} from "./prose-check.mjs";

/**
 * The three ways this checker could report a confident wrong number.
 *
 * It could count the comments, which in this repo are longer than the copy and
 * full of the exact punctuation the rules are about. It could count a Tailwind
 * class list as a sentence and drag every average down with it. Or it could
 * count a code fence in a case study as prose. All three would still print a
 * table, and nobody reading the table could tell.
 */

describe("stripComments", () => {
  it("drops JSDoc, which is not copy", () => {
    const src = `/** The measure is a LENGTH — never a character count. */\nconst a = "Real copy that a reader sees here.";`;
    const out = stripComments(src);
    expect(out).not.toContain("LENGTH");
    expect(out).toContain("Real copy");
  });

  it("drops line comments", () => {
    expect(
      stripComments(`// a note — with a dash\nconst a = 1;`),
    ).not.toContain("note");
  });
});

describe("looksLikeCopy", () => {
  it("takes a sentence", () => {
    expect(looksLikeCopy("One thread, shared by everybody.")).toBe(true);
  });

  it("leaves a Tailwind class list", () => {
    expect(
      looksLikeCopy("mt-flow text-foreground-muted lg:min-h-[24svh]"),
    ).toBe(false);
  });

  it("leaves paths and URLs", () => {
    expect(looksLikeCopy("/work/the-money-rule-in-the-database")).toBe(false);
    expect(looksLikeCopy("https://alifarooq.dev/stack page")).toBe(false);
  });
});

describe("stringsFromCode", () => {
  it("takes the literal and not the comment around it", () => {
    const src = `
      /** Why this string is what it is — at length. */
      export const NOTE = "Cache and lock. The reads are the easy part.";
      const cls = "mt-section border-border border-t pt-figure";
    `;
    expect(stringsFromCode(src)).toEqual([
      "Cache and lock. The reads are the easy part.",
    ]);
  });
});

describe("stringsFromMdx", () => {
  it("takes frontmatter values and prose, and leaves the code fence", () => {
    const src = [
      "---",
      'decision: "The handle goes in the signature"',
      'constraint: "One write crossed four owners and had to land whole."',
      "order: 3",
      "---",
      "",
      "I passed it in, and paid for it in thirty-four files.",
      "",
      "```ts",
      "const performedBy = await this.resolvePerformedBy(...);",
      "```",
    ].join("\n");

    const out = stringsFromMdx(src);
    expect(out).toContain(
      "One write crossed four owners and had to land whole.",
    );
    expect(out).toContain(
      "I passed it in, and paid for it in thirty-four files.",
    );
    expect(out.some((s) => s.includes("resolvePerformedBy"))).toBe(false);
    expect(out.some((s) => s.includes("order"))).toBe(false);
  });
});

describe("measure", () => {
  it("counts the reversal tic in the shapes it arrived in", () => {
    const m = measure([
      "A queue relocates the failure rather than removing it.",
      "The work is not a prompt but a schema.",
      "It stores cents instead of a scale.",
    ]);
    expect(m.reversals).toBe(3);
  });

  it("counts em dashes and first person separately", () => {
    const m = measure([
      "I booked $0.0769 as 8c — a four percent error.",
      "The image is identical everywhere.",
    ]);
    expect(m.emDash).toBe(1);
    expect(m.firstPerson).toBe(1);
    expect(m.strings).toBe(2);
  });

  it("reports uniformity, which is what a template looks like", () => {
    // Four entries, all a short fragment then one long sentence: the exact
    // shape twelve /stack notes had before they were rewritten.
    const template = Array.from(
      { length: 4 },
      (_, i) => `Item ${i} here. ${"word ".repeat(30)}done.`,
    );
    expect(measure(template).uniformity).toBe("4/4 share the top rhythm (SL)");
  });

  it("varies when the writing varies", () => {
    const mixed = [
      "Cache and lock. The reads are the easy part. The hard question is which data is allowed to be stale, and who gets to decide.",
      "One thread, shared by everybody. I have watched a single handler do real work on the CPU while requests that needed nothing from it queued up behind.",
      "My default store, and I put rules in it the service cannot be trusted with. A check constraint keeps a wallet from going below zero.",
      "Sentry for exceptions, Seq for structured logs. Logs start earning their storage on the day you can follow one request end to end.",
    ];
    // Four strings, no bucket shared by more than half of them.
    expect(measure(mixed).uniformity).toBe("2/4 share the top rhythm (SM)");
  });

  it("says nothing about rhythm when there is too little to compare", () => {
    // Under three multi-sentence strings there is no pattern to report, and a
    // "2/2 share the top rhythm" on a two-string page would read as a finding.
    const m = measure(["One sentence here. And a second one after it."]);
    expect(m.uniformity).toBeNull();
  });
});
