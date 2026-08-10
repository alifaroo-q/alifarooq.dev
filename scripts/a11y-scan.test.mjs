import { describe, expect, it } from "vitest";
import { axeArguments, THEMES, WCAG_TAGS } from "./a11y-scan.mjs";

/**
 * The thing in the accessibility job that could go wrong silently (#34): a
 * theme that never flipped, which leaves a green run proving half of what it
 * claims. The route list is checked in `site-routes.test.mjs`.
 */

describe("themes", () => {
  it("checks both grounds, and only through the media query", () => {
    expect(THEMES.map((theme) => theme.name)).toEqual(["dark", "light"]);
  });

  it("asks Chrome for a different colour scheme in each run", () => {
    const [dark, light] = THEMES.map((theme) =>
      axeArguments(["https://x.test/"], theme),
    );

    expect(dark.join(" ")).toContain("preferredColorScheme=0");
    expect(light.join(" ")).toContain("preferredColorScheme=1");
  });
});

describe("axeArguments", () => {
  it("runs every route in one browser, and fails the run on a violation", () => {
    const args = axeArguments(
      ["https://x.test/", "https://x.test/work/one"],
      THEMES[0],
    );

    expect(args.slice(0, 2)).toEqual([
      "https://x.test/",
      "https://x.test/work/one",
    ]);
    expect(args).toContain("--exit");
  });

  it("asks for WCAG 2.2 AA and nothing wider", () => {
    const args = axeArguments(["https://x.test/"], THEMES[0]);
    expect(args[args.indexOf("--tags") + 1]).toBe(WCAG_TAGS.join(","));
    expect(WCAG_TAGS).toContain("wcag22aa");
  });
});
