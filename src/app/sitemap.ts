import { allCaseStudies, allOpenSources } from "content-collections";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * The sitemap, mapped over the collections rather than committed (#16).
 *
 * Five URLs today: home, three `/work/<slug>`, one `/open-source/<slug>`. It
 * is written this way so a fourth case study cannot go missing — a committed
 * list is a list somebody has to remember, and the one time it is forgotten
 * is the one time it matters.
 *
 * **No `lastModified` on any entry.** #9 gave the collections no `date` field
 * on purpose, so there is no true modification date to read, and stamping
 * build time would tell crawlers all five pages changed on every deploy — a
 * lie that costs trust and buys nothing at this size. The field is optional.
 * It becomes a live question when a `posts` collection arrives, and `date` is
 * already the field #9 named as what that collection would differ on.
 *
 * No `changeFrequency` and no `priority` either. Both are hints Google has
 * said it ignores, and a relative priority across five pages is a claim about
 * which of your own pages matters less.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    ...allCaseStudies.map((doc) => ({ url: `${SITE_URL}/work/${doc.slug}` })),
    ...allOpenSources.map((doc) => ({
      url: `${SITE_URL}/open-source/${doc.slug}`,
    })),
  ];
}
