import { describe, expect, it } from "vitest";
import {
  CLS_BUDGET,
  formatReport,
  LCP_BUDGET_MS,
  overBudget,
  readRun,
} from "./lighthouse-report.mjs";

/**
 * These numbers do not block, so the only thing standing between a breach
 * and a shipped regression is that a person reads the row (#18). The tests
 * are therefore about the report being unmissable, not about the run.
 */

function lhr({ lcp, cls, scripts = [] }) {
  return {
    audits: {
      "largest-contentful-paint": { numericValue: lcp },
      "cumulative-layout-shift": { numericValue: cls },
      "network-requests": { details: { items: scripts } },
    },
  };
}

const script = (url, transferSize) => ({
  url,
  transferSize,
  resourceType: "Script",
});

describe("readRun", () => {
  it("splits the site's own JS from a tracker on another origin", () => {
    const run = readRun(
      "https://preview.test/",
      lhr({
        lcp: 900,
        cls: 0,
        scripts: [
          script("https://preview.test/_next/static/chunks/a.js", 40000),
          script("https://cloud.umami.is/script.js", 2000),
          {
            url: "https://preview.test/styles.css",
            transferSize: 9000,
            resourceType: "Stylesheet",
          },
        ],
      }),
    );

    expect(run.scriptBytes).toBe(42000);
    expect(run.thirdPartyScriptBytes).toBe(2000);
  });

  it("copes with a run that recorded no requests", () => {
    const run = readRun("https://preview.test/", {
      audits: {
        "largest-contentful-paint": { numericValue: 800 },
        "cumulative-layout-shift": { numericValue: 0 },
      },
    });
    expect(run.scriptBytes).toBe(0);
  });
});

describe("overBudget", () => {
  const fast = { url: "https://preview.test/", lcp: 900, cls: 0 };

  it("is clean when every route is inside both numbers", () => {
    expect(overBudget([fast])).toBe(false);
  });

  it("catches a slow LCP on one route out of five", () => {
    expect(overBudget([fast, { ...fast, lcp: LCP_BUDGET_MS + 1 }])).toBe(true);
  });

  it("treats any shift at all as a breach, because the budget is zero", () => {
    expect(CLS_BUDGET).toBe(0);
    expect(overBudget([{ ...fast, cls: 0.01 }])).toBe(true);
  });
});

describe("formatReport", () => {
  const run = {
    url: "https://preview.test/work/one",
    lcp: 900,
    cls: 0,
    scriptBytes: 40000,
    thirdPartyScriptBytes: 2000,
  };

  it("says OVER BUDGET in the heading, where it cannot be missed", () => {
    const markdown = formatReport([{ ...run, lcp: 2200 }]);
    expect(markdown).toContain("OVER BUDGET");
    expect(markdown).toContain("**2.20s**");
  });

  it("says plainly that a breach here does not block", () => {
    expect(formatReport([{ ...run, cls: 0.05 }])).toContain("does not block");
  });

  it("marks the number that broke, not the whole row", () => {
    const markdown = formatReport([{ ...run, cls: 0.05 }]);
    expect(markdown).toContain("**0.050**");
    expect(markdown).toContain("| 0.90s |");
  });

  it("names every route it measured", () => {
    const markdown = formatReport([
      run,
      { ...run, url: "https://preview.test/" },
    ]);
    expect(markdown).toContain("`/work/one`");
    expect(markdown).toContain("`/`");
  });
});
