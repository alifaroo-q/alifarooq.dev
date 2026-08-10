# Open source

One `.mdx` file per document, flat, and the filename is the slug — so
`drizzle-tx.mdx` is served at `/open-source/drizzle-tx`. The route is
`/open-source/`, never `/oss`: a URL is the one string a reader cannot skim
past and the one you cannot rename later.

Three fields, listed in `content-collections.ts`, and a missing or mistyped one
fails `next build` rather than reaching a reader. `title` is the repo name, and
it is the heading, the `<title>` and the source of the slug. `description` is
both the meta description and the standfirst under the h1, so it has to read as
a sentence and not as a keyword line.

There is no diagram here. The pinned column is filled by the document's own
`##` headings, collected during the same compile that produces the body — so
the index cannot name a heading the body does not have. Sections are headings,
not fields.

Two content rules this directory inherits, and both are checkable by reading:

- **No npm scope string, anywhere.** Packages are cited by repo name and
  GitHub URL. The bare fact "published on npm" is allowed; `@scope/name` is
  not. The site says why, the README says how, and a scope is how you get it.
- **No version numbers, ever.** The test is what has to change on this site
  when a release is cut, and the answer has to stay "nothing". The one thing
  that comes close is the `drizzle-orm` release-candidate pin, which is stated
  as a caveat and names no version.

This collection holds one document. The other two repos are home-page copy in
`src/app/page.tsx`, and promoting one of them to a page later is a new file
here, not a schema change.
