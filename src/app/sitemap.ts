import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CASES, caseHref } from "@/lib/work";

/**
 * The sitemap: home, the work index, and one page per job that has a case
 * page. A new job in `work.ts` reaches it with no edit here.
 *
 * **No `lastModified`.** There is no true modification date to read, and
 * stamping build time would tell crawlers the page changed on every deploy.
 * No `changeFrequency` and no `priority` either; Google has said it ignores
 * both.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", ...CASES.map(caseHref)].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
