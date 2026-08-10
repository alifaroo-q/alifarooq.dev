import type { Section } from "@/lib/rehype-sections";

/**
 * The pinned section index — the second fill of the one detail template (#29).
 *
 * A case study pins a diagram; this page has none, so it pins its own
 * argument. Both answer the same question, "where am I in this argument", and
 * that shared job is what makes one template legitimate for two kinds of page
 * rather than a shell with a hole in it.
 *
 * It tracks by the SAME mechanism the diagram does, and knows nothing about
 * it. Each entry carries `data-part` and a `data-sections` of one slug, which
 * is what the observer selects on and matches against the section in the
 * reading band. Nothing here is imported by `section-tracking.tsx` and nothing
 * there mentions an index — the contract is two data attributes.
 *
 * Nothing sets a colour. The entry in view takes the accent and the rest drop
 * to a ratio, both from `globals.css`, so the whole list survives a ground
 * flip. Untracked — no JavaScript, nothing scrolled, or below the desktop
 * breakpoint — every entry is at full strength, which is a complete contents
 * list rather than a degraded one.
 *
 * The dimmed entry is still text a reader is entitled to read, so it dims
 * less far than a diagram part does. The measurements are in `globals.css`;
 * the short version is that the drawing's ratio puts a sentence at 1.92:1.
 *
 * The entries are deliberately not links. The column is a reference, not
 * navigation: a case study's diagram cannot be clicked into either, and an
 * argument written to be read in order should not open with an invitation to
 * skip through it. The reader who wants a heading has the headings.
 */
export function SectionIndex({
  sections,
  id = "section-index",
}: {
  sections: Section[];
  id?: string;
}) {
  const labelId = `${id}-label`;

  return (
    <div className="border-border border-b px-6 py-10 md:px-10 lg:border-b-0">
      <p className="text-foreground-label text-label uppercase" id={labelId}>
        Sections
      </p>

      {/* `data-section-index` is what tells the stylesheet these parts are
          text. The observer sets the same states here as it does on a
          diagram; the drawing's dim ratio is unreadable on a sentence, so
          globals.css gives this subtree its own. */}
      <ol
        aria-labelledby={labelId}
        className="mt-6 max-w-[34rem] space-y-3"
        data-section-index=""
      >
        {sections.map((section, i) => (
          <li
            className="grid grid-cols-[2.5rem_1fr] gap-x-4"
            data-part=""
            data-sections={section.slug}
            key={section.slug}
          >
            {/* The same two-digit marker the home page uses for its work
                rows, and hidden from assistive technology for the same
                reason: an ordered list already says which one this is. */}
            <span aria-hidden="true" className="pt-0.5 text-label">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{section.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
