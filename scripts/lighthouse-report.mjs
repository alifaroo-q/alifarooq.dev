/**
 * The two numbers that are measured and reported, not enforced (#18, #34).
 *
 * **LCP ≤ 1.5s and CLS = 0**, under Lighthouse's mobile throttling, which is
 * its default. Both need a real browser against a real deployment, so both
 * can wobble for reasons that are not the code. #18 put the teeth on the byte
 * count instead and wrote down what happens if that judgement was wrong:
 *
 * > **Reopening condition**: if LCP or CLS is reported over budget twice and
 * > shipped anyway, the reporting has failed and they should be promoted to
 * > blocking.
 *
 * That condition can only be seen if the numbers are somewhere a person
 * reads, which is why this prints Markdown for the pull request rather than
 * a log line, and why an over-budget row is marked rather than left to be
 * worked out from the figures.
 *
 * **CLS is zero, not 0.1.** There is no image without dimensions, no ad and
 * no injected banner, and `next/font` ships a metric-matched fallback. Zero
 * is reachable, so any other reading means something arrived that nobody
 * thought about — and a 0.1 allowance would swallow exactly that signal.
 *
 * **JS over the wire is reported here too**, because it is the only place the
 * two tracker scripts are visible. Umami and Vercel Analytics are fetched by
 * the client from another origin, so `js-budget.mjs` cannot see them: they
 * are in no build output. They are watched here and they gate nothing — a
 * third party changing their file must not be able to block a merge.
 *
 * Usage: `node scripts/lighthouse-report.mjs <base-url>`. Always exits 0.
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchRoutes, kb } from "./site-routes.mjs";

/** The budget, from #18. */
export const LCP_BUDGET_MS = 1500;
export const CLS_BUDGET = 0;

/** The three figures one Lighthouse run carries. */
export function readRun(url, lhr) {
  const requests = lhr.audits["network-requests"]?.details?.items ?? [];
  return {
    url,
    lcp: lhr.audits["largest-contentful-paint"].numericValue,
    cls: lhr.audits["cumulative-layout-shift"].numericValue,
    scriptBytes: requests
      .filter((request) => request.resourceType === "Script")
      .reduce((total, request) => total + (request.transferSize ?? 0), 0),
    thirdPartyScriptBytes: requests
      .filter(
        (request) =>
          request.resourceType === "Script" &&
          new URL(request.url).origin !== new URL(url).origin,
      )
      .reduce((total, request) => total + (request.transferSize ?? 0), 0),
  };
}

/** Over budget on either number, on any route. */
export function overBudget(runs) {
  return runs.some((run) => run.lcp > LCP_BUDGET_MS || run.cls > CLS_BUDGET);
}

/** The runs as GitHub Markdown, with every breach marked in the row. */
export function formatReport(runs) {
  const mark = (value, budget, text) =>
    value > budget ? `**${text}** ⚠️` : text;

  const rows = runs.map((run) => {
    const path = new URL(run.url).pathname;
    return [
      `| \`${path}\``,
      mark(run.lcp, LCP_BUDGET_MS, `${(run.lcp / 1000).toFixed(2)}s`),
      mark(run.cls, CLS_BUDGET, run.cls.toFixed(3)),
      kb(run.scriptBytes),
      `${kb(run.thirdPartyScriptBytes)} |`,
    ].join(" | ");
  });

  const heading = overBudget(runs)
    ? "### LCP and CLS — OVER BUDGET (reported, does not block)"
    : "### LCP and CLS — within budget";

  return [
    heading,
    "",
    `Lighthouse mobile throttling. Budgets: LCP ≤ ${LCP_BUDGET_MS / 1000}s, CLS = ${CLS_BUDGET}.`,
    "",
    "| Route | LCP | CLS | JS over the wire | of that, third party |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...rows,
    "",
    "Third-party JS is Umami and Vercel Analytics. It is watched, never gated.",
  ].join("\n");
}

async function main() {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    console.error("Usage: node scripts/lighthouse-report.mjs <base-url>");
    process.exit(1);
  }

  const urls = await fetchRoutes(baseUrl);

  const lighthouse = process.env.LIGHTHOUSE_BIN ?? "lighthouse";
  const directory = mkdtempSync(join(tmpdir(), "lighthouse-"));
  const runs = [];

  try {
    for (const [index, url] of urls.entries()) {
      const output = join(directory, `run-${index}.json`);
      const run = spawnSync(
        lighthouse,
        [
          url,
          "--only-categories=performance",
          "--output=json",
          `--output-path=${output}`,
          "--quiet",
          "--chrome-flags=--headless --no-sandbox --disable-gpu",
        ],
        { stdio: "inherit" },
      );

      if (run.error || run.status !== 0) {
        // A Lighthouse that will not start is a reporting failure, not a
        // code failure, and this job is the one that must not block.
        console.error(`Lighthouse did not complete for ${url}. Skipping it.`);
        continue;
      }
      runs.push(readRun(url, JSON.parse(readFileSync(output, "utf8"))));
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }

  console.log(
    runs.length > 0 ? formatReport(runs) : "### LCP and CLS — not measured",
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
