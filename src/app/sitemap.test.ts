import { allCaseStudies, allOpenSources } from "content-collections";
import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/site";
import sitemap from "./sitemap";

/**
 * The sitemap is the one piece of #33 that is logic rather than a string.
 *
 * It is generated from the collections precisely so a fourth case study
 * cannot go missing, and the thing that would break that promise — someone
 * committing a hand-written list back, or adding `lastModified` because the
 * type allows it — is what these assertions hold.
 */
describe("sitemap", () => {
  const entries = sitemap();

  it("lists the home page and every document, and nothing else", () => {
    expect(entries.map((entry) => entry.url)).toEqual([
      SITE_URL,
      ...allCaseStudies.map((doc) => `${SITE_URL}/work/${doc.slug}`),
      ...allOpenSources.map((doc) => `${SITE_URL}/open-source/${doc.slug}`),
    ]);
  });

  it("carries no lastModified — there is no date field to read (#9)", () => {
    // Stamping build time would tell crawlers all five pages changed on every
    // deploy. `changeFrequency` and `priority` are out for the same reason:
    // a hint nobody reads, asserting something the site cannot know.
    for (const entry of entries) {
      expect(entry.lastModified).toBeUndefined();
      expect(entry.changeFrequency).toBeUndefined();
      expect(entry.priority).toBeUndefined();
    }
  });

  it("writes absolute URLs on the apex origin (#4)", () => {
    for (const entry of entries) {
      expect(
        entry.url.startsWith(`${SITE_URL}/`) || entry.url === SITE_URL,
      ).toBe(true);
    }
  });
});
