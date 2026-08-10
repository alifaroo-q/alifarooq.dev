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
  return [...new Set(paths)].map((path) => new URL(path, base).href);
}

/** Fetch the sitemap and return the routes, or exit with a plain reason. */
export async function fetchRoutes(baseUrl) {
  const response = await fetch(new URL("/sitemap.xml", baseUrl));
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
