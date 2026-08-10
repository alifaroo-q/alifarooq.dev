import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compile as compileMdx } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { rehypeSections } from "./src/lib/rehype-sections";

// One MDX file per document, flat, slug from the filename (#9).
const CASE_STUDY_DIR = "content/case-studies";

/**
 * The MDX compiler, called by every collection and edited by none.
 *
 * `@content-collections/mdx` is deliberately never installed (#11, #12): it is
 * 17 months stale and wraps `mdx-bundler@10`. Compiling here instead also
 * sidesteps Turbopack's plugin-serialization limit by construction — the
 * plugins run in the Node process that evaluates this file, and Turbopack only
 * ever sees the already-compiled string.
 *
 * `outputFormat: "function-body"` is what lets `run()` evaluate the result at
 * prerender time in a Server Component, with no browser-side `eval`.
 *
 * The one rehype plugin groups the body into `<section>` elements at the h2s
 * (#26). It is the pipeline's job and not the template's: the section is what
 * the observer watches and what carries the minimum height, and neither can
 * be attached to a heading that has no body element after it.
 *
 * There is no syntax highlighter here yet. `rehype-pretty-code` writes two
 * palettes into the markup as inline `--shiki-*` values and needs a CSS rule
 * to pick one — a second colour system, unmeasured on either ground, which
 * the theme rules say has to be measured before it ships. Nothing on a case
 * study needs it; the drizzle-tx page does, so it is that ticket's to argue
 * for (#29).
 */
async function compile(content: string) {
  const code = await compileMdx(content, {
    outputFormat: "function-body",
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [rehypeSections],
  });
  return String(code);
}

/**
 * Case studies. No `title`: `decision` is the home-page heading, the detail
 * page's h1, the `<title>` and the source of the slug, and a second field is
 * a place for those to drift (#9).
 *
 * No `draft`, no `date`, no `kind` discriminator and no shared base schema.
 * A base schema is the exact mechanism that would make adding a `posts`
 * collection later touch an existing one.
 */
const caseStudies = defineCollection({
  name: "caseStudies",
  directory: CASE_STUDY_DIR,
  include: "*.mdx",
  schema: z.object({
    sector: z.string(), // "A healthcare services provider" — home eyebrow
    decision: z.string(), // heading, h1, <title>, and the slug's source
    constraint: z.string(), // ~2 lines; home page only
    artifactLabel: z.string(), // "See the state diagram →"
    order: z.number(),
    description: z.string(), // the meta description; no other page reads it
    content: z.string(),
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    slug: doc._meta.path,
    body: await ctx.cache(doc.content, compile),
    // The diagram shares the MDX basename, so there is no `src` field that
    // could point at nothing. A missing or misnamed file is an unhandled
    // rejection here, which fails `next build` — the site cannot ship a case
    // study whose promised artifact is absent (#9).
    //
    // Keyed off `_meta.path`, not `_meta.filePath`: `path` is the only `_meta`
    // field #12 exercised in a passing build.
    artifactSvg: await readFile(
      join(CASE_STUDY_DIR, `${doc._meta.path}.svg`),
      "utf8",
    ),
  }),
});

export default defineConfig({ content: [caseStudies] });
