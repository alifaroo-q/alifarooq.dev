import { allCaseStudies, allOpenSources } from "content-collections";
import { describe, expect, it } from "vitest";
import {
  HOME_TITLE,
  pageMetadata,
  rootMetadata,
  titleWithSuffix,
} from "./metadata";
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
    path: "/work/22-modules-one-transaction-boundary",
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
      "/work/22-modules-one-transaction-boundary",
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
    expect(HOME_TITLE).toBe("Ali Farooq — Backend engineer");
    expect(root.openGraph?.title).toBe(HOME_TITLE);
  });
});

describe("the strings the head prints", () => {
  const authored = [
    ...allCaseStudies.map((doc) => ({
      name: doc.slug,
      title: doc.decision,
      description: doc.description,
    })),
    ...allOpenSources.map((doc) => ({
      name: doc.slug,
      title: doc.title,
      description: doc.description,
    })),
  ];

  it.each(authored)(
    "$name: no npm scope reaches metadata (#22)",
    ({ title, description }) => {
      // A scope is how you GET the code; the URL is where the argument for it
      // lives. Neither belongs in a title or a description.
      expect(title).not.toMatch(/@[\w-]+\//);
      expect(description).not.toMatch(/@[\w-]+\//);
    },
  );

  it.each(authored)(
    "$name: the title does not restate the name",
    ({ title }) => {
      // The suffix adds it.
      expect(title).not.toContain("Ali Farooq");
    },
  );

  it.each(authored)(
    "$name: the suffixed title survives the ~60-character cut",
    ({ title }) => {
      // #16 wrote this as a 40 to 55 character band on `decision`, but the
      // band was only ever a proxy. What matters is the string a search
      // result shows, suffix included — and asserting that stops the band
      // being mistaken for a rule about copy: `22 modules, one transaction
      // boundary` is 36 characters and was never the problem.
      //
      // #6 shortened one heading from 60 to 47 to get inside this, and the
      // slug was renamed with it. Anything longer now fails here rather than
      // in a search result nobody is watching.
      expect(titleWithSuffix(title).length).toBeLessThanOrEqual(60);
    },
  );
});
