import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Generated alongside the sitemap, so the two cannot name different origins.
 *
 * Everything is allowed. There is deliberately **no `Disallow` for
 * `/resume.pdf`**, which is the one file the site does not want indexed: the
 * `X-Robots-Tag: noindex` header in `next.config.ts` does that job, and the
 * two controls do not stack — they conflict. A `Disallow` stops the crawler
 * fetching the file, so it never reads the header, and a blocked URL found
 * through a link can still be listed. Adding one here would quietly undo the
 * decision it looks like it reinforces (#16).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
