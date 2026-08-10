/**
 * The one number in the budget that blocks a merge (#18, #34).
 *
 * **JS transferred on the heaviest route.** It is read out
 * of `next build` output, so it needs no browser and no running site, and it
 * gives the same answer twice. That is the whole reason the teeth are on this
 * number and not on LCP: a budget that loses one argument with a flaky metric
 * at 1am is a budget that gets routed around from then on.
 *
 * **The routes come from the prerendered HTML, not from a manifest.** Next 16
 * on Turbopack writes no per-route build manifest, and the HTML is the better
 * source anyway: the `<script src>` tags in it are what the browser actually
 * asks for. A manifest is a claim about that; the page is the thing itself.
 *
 * **Gzip is the blocking number and brotli is printed beside it.** Vercel
 * serves brotli to browsers that ask, so brotli is closer to the truth, but
 * its size moves with a compression level nobody here sets. Gzip is the floor
 * every client gets and it cannot drift, so the gate is on gzip and the
 * smaller true number is reported next to it.
 *
 * **What this does NOT count: the two tracker scripts.** Umami and Vercel
 * Analytics are fetched by the client at run time from another origin, so
 * they are in no build output. They are reported by `lighthouse-report.mjs`,
 * which reads real requests off a real page load.
 *
 * Usage: `pnpm build && node scripts/js-budget.mjs`. Exits 1 over budget.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { kb } from "./site-routes.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The budget: compressed bytes of JS on the heaviest route.
 *
 * **#18 said 100 KB and 100 KB is not reachable.** That number was set from
 * a reading of what the page contains — one webfont, no hero image, inlined
 * SVG, one small client component — and never from a build. The first build
 * measured here came out at 138.5 KB gzipped, of which **117 KB is React DOM
 * and the Next runtime**, before a line of this site's code. The site's own
 * chunks are about 21 KB. There is no cut inside 100 KB that does not mean
 * leaving the App Router.
 *
 * So the gate is set at a number that was measured, with about 6 KB of room:
 * it cannot be met by deleting anything, and it catches the next thing that
 * arrives. That is what a budget is for. The 100 KB figure is recorded on #34
 * rather than quietly dropped, because the interesting part is that it was
 * agreed without anybody building the site.
 */
export const LIMIT_BYTES = 145 * 1024;

/**
 * Every `<script src="/_next/static/...">` a browser will fetch, in order and
 * without repeats.
 *
 * Two things are left out, and both would make the number a lie:
 *
 * - **`noModule` scripts.** Next ships a legacy polyfill chunk behind that
 *   attribute — 39 KB gzipped, and no browser made in the last eight years
 *   downloads it. Counting it would put 39 KB of bytes nobody transfers into
 *   a budget about transferred bytes.
 * - **`<link rel="preload" as="script">`.** A preload names a file that a
 *   `<script>` tag further down names again, so counting both would double
 *   the largest chunk on every route.
 */
export function scriptsFromHtml(html) {
  const sources = [];
  for (const [, attributes] of html.matchAll(/<script([^>]*)>/g)) {
    if (/\bnomodule\b/i.test(attributes)) continue;
    const source = attributes.match(/src="(\/_next\/static\/[^"]+)"/);
    if (source) sources.push(source[1]);
  }
  return [...new Set(sources)];
}

/**
 * The route a prerendered file serves. `index.html` is the home page; every
 * other file is its path under `app/` with the extension removed.
 */
export function routeFromHtmlPath(relativePath) {
  const withoutExtension = relativePath.replace(/\.html$/, "");
  return withoutExtension === "index" ? "/" : `/${withoutExtension}`;
}

/** Every prerendered page under a directory, deepest last. */
function htmlFilesIn(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFilesIn(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

/**
 * One row per route, heaviest first, and whether the heaviest is over.
 *
 * Pure on purpose — `sizeOf` is passed in so the table can be checked without
 * a build on disk.
 */
export function budgetReport(pages, sizeOf, limitBytes = LIMIT_BYTES) {
  const rows = pages
    .map(({ route, scripts }) => {
      const sizes = scripts.map(sizeOf);
      return {
        route,
        chunks: scripts.length,
        gzip: sizes.reduce((total, size) => total + size.gzip, 0),
        brotli: sizes.reduce((total, size) => total + size.brotli, 0),
      };
    })
    .sort((a, b) => b.gzip - a.gzip);

  const heaviest = rows[0];
  return {
    rows,
    heaviest,
    overBudget: Boolean(heaviest) && heaviest.gzip > limitBytes,
  };
}

/** The report as GitHub Markdown, for the job summary and the PR comment. */
export function formatReport(
  { rows, heaviest, overBudget },
  limitBytes = LIMIT_BYTES,
) {
  const verdict = overBudget
    ? `**Over budget.** ${kb(heaviest.gzip)} on \`${heaviest.route}\`, against ${kb(limitBytes)}.`
    : `Heaviest route \`${heaviest.route}\` at ${kb(heaviest.gzip)}, against ${kb(limitBytes)}.`;

  const table = [
    "| Route | Chunks | Gzip | Brotli |",
    "| --- | ---: | ---: | ---: |",
    ...rows.map(
      (row) =>
        `| \`${row.route}\` | ${row.chunks} | ${kb(row.gzip)} | ${kb(row.brotli)} |`,
    ),
  ].join("\n");

  return `### JS budget — ${overBudget ? "FAIL" : "pass"}\n\n${verdict}\n\n${table}`;
}

function main() {
  const appDirectory = join(ROOT, ".next", "server", "app");
  if (!statSync(appDirectory, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(
      "No build output at .next/server/app. Run `pnpm build` first.",
    );
    process.exit(1);
  }

  const pages = htmlFilesIn(appDirectory).map((file) => ({
    route: routeFromHtmlPath(relative(appDirectory, file)),
    scripts: scriptsFromHtml(readFileSync(file, "utf8")),
  }));

  if (pages.length === 0) {
    console.error(
      "Build output has no prerendered pages, so nothing was measured.",
    );
    process.exit(1);
  }

  const sizes = new Map();
  const sizeOf = (url) => {
    if (!sizes.has(url)) {
      const source = readFileSync(
        join(ROOT, ".next", url.replace("/_next/", "")),
      );
      sizes.set(url, {
        gzip: gzipSync(source).byteLength,
        brotli: brotliCompressSync(source).byteLength,
      });
    }
    return sizes.get(url);
  };

  const report = budgetReport(pages, sizeOf);
  console.log(formatReport(report));
  process.exit(report.overBudget ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
