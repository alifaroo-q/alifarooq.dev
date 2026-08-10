import { defineConfig } from "vitest/config";

/**
 * The site has one code seam, and this runs it (#30).
 *
 * `node`, not `jsdom`: the suite builds a real `Request`, calls the Route
 * Handler and asserts on a real `Response`. There is no DOM in it, so there is
 * no reason to boot one — and no React plugin either, because a component test
 * is exactly what this ticket ruled out. Everything the pages render is
 * checked by `next build` and by reading it.
 *
 * `tsconfigPaths` is Vite's own, not the plugin the Next.js guide still names.
 * The plugin prints a notice saying so on every run.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
