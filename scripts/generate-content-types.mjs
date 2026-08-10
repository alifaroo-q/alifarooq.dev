import { createBuilder } from "@content-collections/core";

/**
 * Generates `.content-collections/generated` outside of `next build`.
 *
 * `tsconfig.json` maps the bare specifier `content-collections` at that
 * directory, and the directory is generated, not committed. So a checkout that
 * has never built has no types for it, and `tsc --noEmit` fails on the import
 * in `src/app/work/[slug]/page.tsx`. That is exactly what CI is: a fresh
 * checkout that lints and typechecks and deliberately does not build, for the
 * reason in `docs/deploy.md`.
 *
 * `@content-collections/core` is already a direct dependency and exports the
 * builder, so this needs no new package. `@content-collections/cli` would do
 * the same job, and not needing it is why it is not installed.
 *
 * THE EXIT CODE IS THE POINT. `builder.build()` resolves even when a document
 * fails: the document is dropped, the run reports `documents: 0`, and the
 * process would end 0. That would turn #25's two build guarantees into silent
 * no-ops in CI — a missing diagram and a bad frontmatter field would both pass
 * a green check and only fail later, in the Vercel build. Both raise `_error`
 * instead, so the errors are collected and rethrown here.
 *
 * That is also what lets CI keep its promise without being promoted to a full
 * build: the guarantees live in the config's `transform`, and this runs it.
 */
const errors = [];

const builder = await createBuilder("content-collections.ts");
builder.on("_error", (event) => {
  errors.push(event?.error?.message ?? event?.message ?? String(event));
});

await builder.build();

if (errors.length > 0) {
  // One line per failure, then a non-zero exit. `next build` prints these too;
  // the point here is that the check fails at all.
  for (const message of errors) console.error(message);
  process.exit(1);
}
