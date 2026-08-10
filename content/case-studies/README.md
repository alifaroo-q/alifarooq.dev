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
which is what the section tracking reads. A drawing exported from a design
tool will not have those ids.

Each part is a `<g>` carrying three things:

- `id` — stable, and the name the section tracking logs against.
- `data-part` — marks the group as a part, so the tracking can select all of
  them without listing every id.
- `data-sections` — a space-separated list of the `##` headings the part
  belongs to, lowercased and hyphenated. That list is the whole mapping: a
  part named by the section being read takes the accent, and the rest drop to
  `0.24` opacity. A heading renamed in the MDX and not here quietly stops
  matching, and the page then shows the whole diagram for that section rather
  than a blank one — that is the symptom to look for.

Three more asset rules, each of them a defect the prototype hit first:

- Nothing that must inherit the focus state may live in `<defs>`. An SVG
  `<marker>`'s `currentColor` resolves against the marker rather than against
  the element referencing it, so arrowheads are drawn inline in the same `<g>`
  as their edge.
- No `role`, no `aria-label` and no `font-family` on the asset, but do set
  `aria-hidden="true"` on the root `<svg>`. The template names the figure and
  the page supplies the face; a name on the file would drift from the visible
  caption. `aria-hidden` says that rather than leaving it implied, and biome
  lints these files, so without it `noSvgWithoutTitle` fails the check.
- Size the type for the width it is drawn at, not for the number in the file.
  The drawing is scaled to the figure, so a user unit is under a CSS pixel;
  `--text-label` in `globals.css` is a floor, and a label has to clear it once
  scaled.

The body is free-form MDX. Sections are `##` headings, not fields.
