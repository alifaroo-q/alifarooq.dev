/**
 * The inlined diagram.
 *
 * The SVG is read at build time (#9), so it arrives as markup rather than as
 * an `<img>` — which is what lets it inherit `currentColor` and carry no hex
 * of its own. Nothing here sets a colour either.
 *
 * The accessible name is the TEMPLATE's job, not the asset's. axe will not
 * reliably fault an inline `<svg>` with no name, and WCAG 2.2 AA is a ship
 * blocker, so a committed file cannot be the thing that guarantees it. The
 * wrapper takes `role="img"` — which makes the drawing's own nodes
 * presentational — and points `aria-labelledby` at the figcaption, so the name
 * and the visible caption cannot drift apart.
 */
function captionFor(artifactLabel: string) {
  // `artifactLabel` is written as a link on the home page — "See the state
  // diagram →". Here the reader is looking at the thing, so the invitation and
  // the arrow come off and what is left names it: "The state diagram".
  const named = artifactLabel
    .replace(/\s*[→>]+\s*$/u, "")
    .replace(/^see\s+/iu, "")
    .trim();

  return named.charAt(0).toUpperCase() + named.slice(1);
}

export function ArtifactFigure({
  svg,
  artifactLabel,
  id = "artifact",
}: {
  svg: string;
  artifactLabel: string;
  id?: string;
}) {
  const captionId = `${id}-caption`;

  return (
    <figure className="border-border border-b px-6 py-10 md:px-10 lg:border-b-0">
      {/* A floor and a ceiling on the drawing's width. The floor keeps it
          legible in a narrow column and hands the overflow to the figure
          rather than to the page; the ceiling stops a wide column blowing a
          small diagram up until its strokes read as a poster. */}
      <div className="overflow-x-auto">
        <div
          aria-labelledby={captionId}
          className="min-w-[26rem] max-w-[40rem] text-foreground [&_svg]:h-auto [&_svg]:w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the SVG is a committed file in this repo, read at build time. Inlining is the point — an <img> could not inherit currentColor.
          dangerouslySetInnerHTML={{ __html: svg }}
          role="img"
        />
      </div>
      <figcaption
        className="mt-figure max-w-measure text-foreground-label text-sm"
        id={captionId}
      >
        {captionFor(artifactLabel)}
      </figcaption>
    </figure>
  );
}
