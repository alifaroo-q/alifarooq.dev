import { allCaseStudies, allOpenSources } from "content-collections";
import { describe, expect, it } from "vitest";
import { STACK } from "./stack";

/**
 * The proof links are the reason this page exists rather than being a list of
 * nouns: an item that links stops being a claim and becomes an index into the
 * evidence. A dead link there is worse than no link, because it is a dead link
 * on the page that offers itself as the evidence.
 *
 * So the slugs are checked against the real collections, the way a case study's
 * missing diagram is checked — at build time, not in review. Renaming a case
 * study now breaks this, which is the whole point.
 */
describe("stack", () => {
  const pages = new Set([
    ...allCaseStudies.map((doc) => `/work/${doc.slug}`),
    ...allOpenSources.map((doc) => `/open-source/${doc.slug}`),
  ]);

  it("links only to pages that exist", () => {
    for (const item of STACK) {
      if (!item.proof) continue;
      expect(pages, `${item.name} points at a page that is gone`).toContain(
        item.proof.href,
      );
    }
  });

  it("holds the cap at twelve", () => {
    // The cap is the claim. The inventory behind this file ran to about
    // forty-five, and a list that quietly grows back to that is the failure
    // mode every surveyed site fell into. Raising it is a decision, and a
    // decision should have to edit a test.
    expect(STACK).toHaveLength(12);
  });

  it("gives every item a slug of its own", () => {
    // The slug is the tracking key: the prose section and the pinned index
    // entry match on it. Two items sharing one would light the wrong name.
    expect(new Set(STACK.map((item) => item.slug)).size).toBe(STACK.length);
  });
});
