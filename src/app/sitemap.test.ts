import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/lib/site";
import sitemap from "./sitemap";

/**
 * The sitemap is the one piece of #33 that is logic rather than a string.
 *
 * The site is one page now. What these assertions hold is that nothing else
 * creeps in, and that nobody adds `lastModified` because the type allows it.
 */
describe("sitemap", () => {
  const entries = sitemap();

  it("lists the home page, and nothing else", () => {
    expect(entries.map((entry) => entry.url)).toEqual([SITE_URL]);
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
