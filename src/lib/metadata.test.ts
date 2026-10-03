import { describe, expect, it } from "vitest";
import { HOME_TITLE, pageMetadata, rootMetadata } from "./metadata";
import { SITE_URL } from "./site";

/**
 * What a shared link says, held to #16.
 *
 * Next merges `openGraph` by replacement rather than field by field, so the
 * failure this guards is silent: a page that forgets the block previews under
 * the home page's words, and nothing in a build or a typecheck notices.
 */
describe("pageMetadata", () => {
  const page = pageMetadata({
    title: "22 modules, one transaction boundary",
    description: "One operation spanned 22 modules.",
    path: "/work/the-handle-goes-in-the-signature",
  });

  it("leaves the bare title for the layout's template to suffix", () => {
    expect(page.title).toBe("22 modules, one transaction boundary");
  });

  it("suffixes og:title itself, because the template never reaches it", () => {
    expect(page.openGraph?.title).toBe(
      "22 modules, one transaction boundary — Ali Farooq",
    );
    expect(page.twitter?.title).toBe(
      "22 modules, one transaction boundary — Ali Farooq",
    );
  });

  it("carries a self-canonical", () => {
    expect(page.alternates?.canonical).toBe(
      "/work/the-handle-goes-in-the-signature",
    );
  });

  it("is summary_large_image with no creator handle", () => {
    expect(page.twitter).toMatchObject({ card: "summary_large_image" });
    expect(page.twitter).not.toHaveProperty("creator");
  });
});

describe("rootMetadata", () => {
  const root = rootMetadata("The home description.");

  it("sets metadataBase to the apex and the home title as the default", () => {
    expect(String(root.metadataBase)).toBe(`${SITE_URL}/`);
    expect(root.title).toEqual({
      default: HOME_TITLE,
      template: "%s — Ali Farooq",
    });
  });

  it("keeps the home page free of the suffix", () => {
    expect(HOME_TITLE).toBe("Ali Farooq — AI-native full-stack engineer");
    expect(root.openGraph?.title).toBe(HOME_TITLE);
  });
});
