/**
 * WCAG 2.2 AA over the whole site, in both themes, and it blocks (#18, #34).
 *
 * **Why this one blocks and LCP does not.** Axe reports only what it can
 * prove from the rendered page. There is no sampling and no timing in it, so
 * there is no flaky-metric argument to have, and a red run means something is
 * actually wrong.
 *
 * **Both themes, because contrast is what axe catches most.** The theme is
 * chosen by `prefers-color-scheme` alone — there is no toggle and no class to
 * set (`src/app/globals.css`) — so the only way to see the light page is to
 * make the browser prefer it. Chrome's `--blink-settings=preferredColorScheme`
 * does that and does not read the machine's own setting, which a CI runner
 * has no opinion about anyway. `0` is dark, `1` is light.
 *
 * Until this ran, the light palette had never been rendered by anything.
 *
 * **The routes come from the deployed sitemap, not from a list here** —
 * `scripts/site-routes.mjs` says why.
 *
 * Usage: `node scripts/a11y-scan.mjs https://preview.example`. Set `AXE_BIN`
 * if the `axe` command is not on the path. Exits 1 on any violation.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { fetchRoutes } from "./site-routes.mjs";

/** WCAG 2.2 AA is every A and AA tag up to 2.2 (#18). */
export const WCAG_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
];

/**
 * Dark first, because it is the ground the site was designed on and a failure
 * there is the more serious one.
 */
export const THEMES = [
  { name: "dark", preferredColorScheme: 0 },
  { name: "light", preferredColorScheme: 1 },
];

/** The arguments for one theme's run, as a single browser over every route. */
export function axeArguments(urls, theme) {
  return [
    ...urls,
    "--tags",
    WCAG_TAGS.join(","),
    "--chrome-options",
    [
      "no-sandbox",
      "disable-dev-shm-usage",
      `blink-settings=preferredColorScheme=${theme.preferredColorScheme}`,
    ].join(","),
    // The page hydrates and the tracked column starts its observer. Half a
    // second of settling costs nothing and keeps the run off a moving page.
    "--load-delay",
    "500",
    "--exit",
  ];
}

async function main() {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    console.error("Usage: node scripts/a11y-scan.mjs <base-url>");
    process.exit(1);
  }

  const urls = await fetchRoutes(baseUrl);

  const axe = process.env.AXE_BIN ?? "axe";
  const failed = [];

  for (const theme of THEMES) {
    console.log(`\n=== ${theme.name} theme — ${urls.length} routes ===\n`);
    const run = spawnSync(axe, axeArguments(urls, theme), { stdio: "inherit" });
    if (run.error) {
      console.error(`Could not run \`${axe}\`: ${run.error.message}`);
      process.exit(1);
    }
    if (run.status !== 0) failed.push(theme.name);
  }

  if (failed.length > 0) {
    console.error(`\nWCAG 2.2 AA failures in: ${failed.join(", ")}.`);
    process.exit(1);
  }
  console.log(`\nWCAG 2.2 AA clean on ${urls.length} routes, both themes.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
