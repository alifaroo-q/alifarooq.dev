import { describe, expect, it } from "vitest";
import {
  budgetReport,
  formatReport,
  routeFromHtmlPath,
  scriptsFromHtml,
} from "./js-budget.mjs";

/**
 * The gate that blocks a merge is worth a suite of its own (#34).
 *
 * A budget that silently measures the wrong thing is worse than no budget:
 * it reports a number every time and is never questioned. The three parts
 * that could go wrong quietly are reading the page, naming the route, and
 * adding up — so those are what is tested here, with the sizes handed in.
 */

describe("scriptsFromHtml", () => {
  it("takes the scripts a browser fetches", () => {
    const html = `
      <script src="/_next/static/chunks/a.js" async=""></script>
      <script src="/_next/static/chunks/b.js" async="" crossorigin=""></script>
    `;
    expect(scriptsFromHtml(html)).toEqual([
      "/_next/static/chunks/a.js",
      "/_next/static/chunks/b.js",
    ]);
  });

  it("leaves out the legacy polyfill chunk, which no browser downloads", () => {
    const html = `
      <script src="/_next/static/chunks/a.js" async=""></script>
      <script src="/_next/static/chunks/polyfills.js" noModule=""></script>
    `;
    expect(scriptsFromHtml(html)).toEqual(["/_next/static/chunks/a.js"]);
  });

  // React writes `noModule` today. The attribute is `nomodule` in HTML, and
  // a serialiser that spells it that way must not put 39 KB nobody fetches
  // into a number that blocks a merge.
  it("leaves it out whichever way the attribute is spelt", () => {
    const html = `<script src="/_next/static/chunks/polyfills.js" nomodule=""></script>`;
    expect(scriptsFromHtml(html)).toEqual([]);
  });

  it("counts a preloaded chunk once, not twice", () => {
    const html = `
      <link rel="preload" as="script" href="/_next/static/chunks/a.js"/>
      <script src="/_next/static/chunks/a.js" async=""></script>
    `;
    expect(scriptsFromHtml(html)).toEqual(["/_next/static/chunks/a.js"]);
  });

  it("ignores inline scripts and anything off /_next/static", () => {
    const html = `
      <script type="application/ld+json">{"@type":"Person"}</script>
      <script src="https://cloud.umami.is/script.js"></script>
    `;
    expect(scriptsFromHtml(html)).toEqual([]);
  });
});

describe("routeFromHtmlPath", () => {
  it("reads the home page off index.html", () => {
    expect(routeFromHtmlPath("index.html")).toBe("/");
  });

  it("reads a nested route off its path", () => {
    expect(routeFromHtmlPath("work/the-money-rule.html")).toBe(
      "/work/the-money-rule",
    );
  });
});

describe("budgetReport", () => {
  const sizes = {
    "/framework.js": { gzip: 90 * 1024, brotli: 80 * 1024 },
    "/form.js": { gzip: 20 * 1024, brotli: 15 * 1024 },
  };
  const sizeOf = (url) => sizes[url];

  // The limit is handed in on every case. These tests are about the
  // arithmetic, and they must not go red the day the number is re-argued.
  const LIMIT = 100 * 1024;

  it("puts the heaviest route first and fails on it", () => {
    const report = budgetReport(
      [
        { route: "/", scripts: ["/framework.js"] },
        { route: "/work/one", scripts: ["/framework.js", "/form.js"] },
      ],
      sizeOf,
      LIMIT,
    );

    expect(report.rows.map((row) => row.route)).toEqual(["/work/one", "/"]);
    expect(report.heaviest.route).toBe("/work/one");
    expect(report.overBudget).toBe(true);
  });

  it("passes when the heaviest route is under the limit", () => {
    const report = budgetReport(
      [{ route: "/", scripts: ["/framework.js"] }],
      sizeOf,
      LIMIT,
    );
    expect(report.overBudget).toBe(false);
  });

  it("is a pass at exactly the limit, not a fail", () => {
    const exact = [{ route: "/", scripts: ["/framework.js", "/form.js"] }];
    expect(budgetReport(exact, sizeOf, 110 * 1024).overBudget).toBe(false);
  });

  it("counts a chunk shared by two routes once per route", () => {
    const report = budgetReport(
      [{ route: "/", scripts: ["/framework.js", "/framework.js"] }],
      sizeOf,
      LIMIT,
    );
    expect(report.rows[0].gzip).toBe(180 * 1024);
  });
});

describe("formatReport", () => {
  const sizeOf = () => ({ gzip: 50 * 1024, brotli: 40 * 1024 });
  const LIMIT = 100 * 1024;

  it("says FAIL loudly enough to be read in a summary", () => {
    const report = budgetReport(
      [{ route: "/", scripts: ["a", "b", "c"] }],
      sizeOf,
      LIMIT,
    );
    const markdown = formatReport(report, LIMIT);

    expect(markdown).toContain("FAIL");
    expect(markdown).toContain("Over budget");
    expect(markdown).toContain("150.0 KB");
  });

  it("still names the heaviest route when it passes", () => {
    const report = budgetReport(
      [{ route: "/", scripts: ["a"] }],
      sizeOf,
      LIMIT,
    );
    const markdown = formatReport(report, LIMIT);

    expect(markdown).toContain("pass");
    expect(markdown).toContain("`/`");
  });
});
