import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * The sitemap. The site is one page, so it lists one URL.
 *
 * **No `lastModified`.** There is no true modification date to read, and
 * stamping build time would tell crawlers the page changed on every deploy.
 * No `changeFrequency` and no `priority` either; Google has said it ignores
 * both.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL }];
}
