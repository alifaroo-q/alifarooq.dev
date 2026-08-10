import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compile as compileMdx } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { rehypeSections, type Section } from "./src/lib/rehype-sections";

// One MDX file per document, flat, slug from the filename (#9).
const CASE_STUDY_DIR = "content/case-studies";
const OPEN_SOURCE_DIR = "content/open-source";

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
 * There is still no syntax highlighter, and #29 declined to argue for one.
 * `rehype-pretty-code` writes two palettes into the markup as inline
 * `--shiki-*` values and needs a CSS rule to pick one — a second colour
 * system, unmeasured on either ground, which the theme rules say has to be
 * measured before it ships. The drizzle-tx page was the page expected to need
 * it, and it argues in prose: the identifiers it names are inline `code`, and
 * a highlighter colours neither of the two things that page is about.
 */
async function compileWith(content: string, collect?: Section[]) {
  const code = await compileMdx(content, {
    outputFormat: "function-body",
    remarkPlugins: [[remarkGfm, { singleTilde: false }]],
    rehypePlugins: [[rehypeSections, { collect }]],
  });
  return String(code);
}

/** The body alone, for a page whose second column is not the section list. */
async function compile(content: string) {
  return compileWith(content);
}

/**
 * The body and its section list, from ONE compile.
 *
 * Both are cached together under the document's content, so a page cannot
 * render an index that names headings its own body no longer has.
 */
async function compileWithIndex(content: string) {
  const sections: Section[] = [];
  const code = await compileWith(content, sections);
  return { code, sections };
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

/**
 * Open source. Three fields, and `caseStudies` above is untouched by its
 * arrival — no shared base schema, no `kind` discriminator (#9).
 *
 * The two collections disagree on the most basic field a document can have.
 * A case study has no `title` at all, because `decision` is its heading; this
 * one is named after the repo and has nothing else. That disagreement is the
 * concrete reason they are kept apart: a base schema is the exact mechanism
 * that would make adding a third collection an edit to the first two.
 *
 * The only real overlap is `content` and a three-line `transform`. Duplicating
 * that is cheaper than a coupling renegotiated on every new collection.
 *
 * `description` is the meta description AND the page's standfirst. On a case
 * study those are two fields, because `constraint` also has to read well on
 * the home page beneath a heading. Here the home-page pitch is TSX (#9), so
 * the second field would have exactly one reader and would be prose with
 * ceremony.
 *
 * The collection holds one document, and that is not a shortfall. The other
 * two repos are home-page copy, and a `hasDetail` flag whose only job is to
 * hide two thirds of a collection from `generateStaticParams` is a field that
 * lies about the collection's shape. A second page later is a promotion, not
 * a migration.
 */
const openSource = defineCollection({
  name: "openSource",
  directory: OPEN_SOURCE_DIR,
  include: "*.mdx",
  schema: z.object({
    title: z.string(), // the repo name: heading, <title>, and the slug's source
    description: z.string(), // the meta description and the standfirst
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    // One compile, two outputs. There is no `.svg` read here and no artifact
    // to guarantee: this page's pinned column is its own section list, so the
    // thing that could go missing is a heading, and a document with no
    // headings renders an empty index rather than failing a build.
    const { code, sections } = await ctx.cache(doc.content, compileWithIndex);

    return { ...doc, slug: doc._meta.path, body: code, sections };
  },
});

export default defineConfig({ content: [caseStudies, openSource] });
