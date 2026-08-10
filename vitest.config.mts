import { defineConfig } from "vitest/config";

/**
 * The site has one code seam and three build gates, and this runs them
 * (#30, #34).
 *
 * `node`, not `jsdom`: the suite builds a real `Request`, calls the Route
 * Handler and asserts on a real `Response`. There is no DOM in it, so there is
 * no reason to boot one — and no React plugin either, because a component test
 * is exactly what this ticket ruled out. Everything the pages render is
 * checked by `next build` and by reading it.
 *
 * The second glob, over `scripts`, is here because the byte budget blocks
 * a merge (#18). A gate that quietly measures the wrong thing is worse than no gate:
 * it reports a number every time and nobody asks it a second question. The
 * arithmetic in those scripts is pure and takes its sizes as arguments, so it
 * is checked without a build on disk and without a browser.
 *
 * `tsconfigPaths` is Vite's own, not the plugin the Next.js guide still names.
 * The plugin prints a notice saying so on every run.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
  },
});
