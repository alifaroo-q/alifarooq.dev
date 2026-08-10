import { describe, expect, it } from "vitest";
import { kb, routesFromSitemap, withBypass } from "./site-routes.mjs";

/**
 * Both post-deploy checks measure whatever this returns, so a quiet mistake
 * here is a green run over the wrong pages (#34).
 */

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://alifarooq.dev</loc></url>
<url><loc>https://alifarooq.dev/work/one</loc></url>
<url><loc>https://alifarooq.dev/open-source/two</loc></url>
</urlset>`;

describe("routesFromSitemap", () => {
  it("moves the canonical URLs onto the deployment under test", () => {
    expect(routesFromSitemap(SITEMAP, "https://preview.vercel.app")).toEqual([
      "https://preview.vercel.app/",
      "https://preview.vercel.app/work/one",
      "https://preview.vercel.app/open-source/two",
    ]);
  });

  it("finds nothing in a sitemap with no entries", () => {
    expect(
      routesFromSitemap("<urlset></urlset>", "https://preview.vercel.app"),
    ).toEqual([]);
  });

  it("keeps one URL when the sitemap repeats one", () => {
    const repeated = `<urlset>
      <url><loc>https://alifarooq.dev/work/one</loc></url>
      <url><loc>https://alifarooq.dev/work/one</loc></url>
    </urlset>`;
    expect(
      routesFromSitemap(repeated, "https://preview.vercel.app"),
    ).toHaveLength(1);
  });
});

describe("kb", () => {
  it("reads to one decimal, so a column of them lines up", () => {
    expect(kb(150 * 1024)).toBe("150.0 KB");
    expect(kb(1536)).toBe("1.5 KB");
  });
});

describe("withBypass", () => {
  it("leaves the URL alone when previews are open", () => {
    const url = withBypass(new URL("https://preview.test/work/one"), undefined);
    expect(url.href).toBe("https://preview.test/work/one");
  });

  it("carries the token on the URL, because a browser cannot send a header", () => {
    const url = withBypass(new URL("https://preview.test/work/one"), "s3cret");
    expect(url.searchParams.get("x-vercel-protection-bypass")).toBe("s3cret");
    expect(url.searchParams.get("x-vercel-set-bypass-cookie")).toBe("true");
  });

  it("does not change the URL it was handed", () => {
    const original = new URL("https://preview.test/");
    withBypass(original, "s3cret");
    expect(original.search).toBe("");
  });
});
