import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/site";
import { CASES, caseHref } from "@/lib/work";
import sitemap from "./sitemap";

/**
 * The sitemap is the one piece of #33 that is logic rather than a string.
 *
 * What these assertions hold is that the list is the home page, the work index
 * and the case pages, and that nobody adds `lastModified` because the type
 * allows it.
 */
describe("sitemap", () => {
  const entries = sitemap();

  it("lists the home page, the work index and each case page", () => {
    expect(entries.map((entry) => entry.url)).toEqual([
      SITE_URL,
      `${SITE_URL}/work`,
      ...CASES.map((job) => `${SITE_URL}${caseHref(job)}`),
    ]);
  });

  it("carries no lastModified — there is no date field to read (#9)", () => {
    // Stamping build time would tell crawlers the page changed on every
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
