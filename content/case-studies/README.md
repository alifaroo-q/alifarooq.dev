# Case studies

One `.mdx` file per case study, flat, and the filename is the slug — so
`treating-google-as-a-system-that-will-fail.mdx` is served at
`/work/treating-google-as-a-system-that-will-fail`.

Two things fail `next build` rather than reaching a reader:

- **A frontmatter field that is missing or the wrong type.** The fields are
  listed in `content-collections.ts`. There is no `title`: `decision` is the
  heading, the h1, the `<title>` and the slug.
- **A missing diagram.** Every case study needs an `.svg` beside it with the
  same basename. There is no field pointing at it, so it cannot point at
  nothing.

The diagram is inlined at build time, so it inherits the page's colour. Author
it with no hex values at all — a state that means "broken" is drawn with a
dashed stroke, never a red one — and give every state and edge a stable `id`,
which is what the section tracking will read. A drawing exported from a design
tool will not have those ids.

The body is free-form MDX. Sections are `##` headings, not fields.
