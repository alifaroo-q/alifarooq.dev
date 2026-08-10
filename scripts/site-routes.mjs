/**
 * The five routes, read back off the deployment under test (#34).
 *
 * Both post-deploy checks need the same list, so it lives here rather than in
 * whichever of them was written first.
 *
 * **The list comes from the deployed `/sitemap.xml`, never from a list in a
 * script.** A committed list is a list somebody has to remember, and the once
 * it is forgotten is the once it matters — the reasoning is `src/app/sitemap.ts`,
 * which maps the collections for the same reason. Reading it back off the
 * preview also proves the sitemap serves.
 *
 * **`VERCEL_AUTOMATION_BYPASS_SECRET`, if the preview is protected.** Vercel
 * can put every preview behind its own login, and a login page is what both
 * checks would then measure. The bypass goes on the URL rather than in a
 * header because axe drives a browser and cannot send one. If previews are
 * open, leave the variable unset and nothing is appended. docs/deploy.md has
 * the dashboard step for both choices.
 */

/**
 * The site's own URLs, pointed at the deployment under test.
 *
 * The sitemap carries the canonical origin, which is never the preview, so
 * only the path is kept from each entry.
 */
export function routesFromSitemap(xml, baseUrl) {
  const base = new URL(baseUrl);
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].trim(),
  );
  const paths = locations.map((location) => new URL(location).pathname);
  return [...new Set(paths)].map(
    (path) => withBypass(new URL(path, base)).href,
  );
}

/**
 * The same URL, carrying Vercel's automation bypass when there is one.
 *
 * The second parameter asks Vercel to set a cookie on the first hit, so the
 * rest of a browser session needs nothing. The token is still put on every
 * URL, because a run that loses the cookie must not quietly start measuring
 * login pages.
 */
export function withBypass(
  url,
  secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
) {
  if (!secret) return url;
  const withToken = new URL(url);
  withToken.searchParams.set("x-vercel-protection-bypass", secret);
  withToken.searchParams.set("x-vercel-set-bypass-cookie", "true");
  return withToken;
}

/** Fetch the sitemap and return the routes, or exit with a plain reason. */
export async function fetchRoutes(baseUrl) {
  const sitemap = withBypass(new URL("/sitemap.xml", baseUrl));
  const response = await fetch(sitemap, { redirect: "manual" });

  // A protected preview answers 3xx to Vercel's own login. Following it gives
  // a 200 and a page with no routes in it, which reads as "the site has no
  // pages" rather than "nobody could get in" — and both checks would then
  // measure a login screen and call it the site.
  if (response.status >= 300 && response.status < 400) {
    console.error(
      `${baseUrl} sits behind Vercel's deployment protection: the sitemap redirects to a login.`,
    );
    console.error(
      "Either open previews, or set VERCEL_AUTOMATION_BYPASS_SECRET. See docs/deploy.md.",
    );
    process.exit(1);
  }
  if (!response.ok) {
    console.error(
      `Could not read ${baseUrl}/sitemap.xml — ${response.status}.`,
    );
    process.exit(1);
  }

  const urls = routesFromSitemap(await response.text(), baseUrl);
  if (urls.length === 0) {
    console.error("The sitemap named no routes, so nothing was checked.");
    process.exit(1);
  }
  return urls;
}

/** Kilobytes to one decimal, so a column of them lines up and reads fast. */
export function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
