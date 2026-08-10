/**
 * Wraps the h2-delimited body in `<section>` elements (#26).
 *
 * The body is free-form MDX and its sections are `##` headings, not fields —
 * so until this runs there is nothing for an observer to observe and nothing
 * for the minimum-height rule to sit on. Grouping happens here rather than in
 * the schema because the author should keep writing headings, not markup.
 *
 * The key is the heading slugged: "The problem" becomes `the-problem`, which
 * is the same string the SVG's `data-sections` lists. Deriving it from the
 * heading on both sides is what keeps the mapping out of a lookup table that
 * could drift from either.
 *
 * This runs on hast rather than on mdast: a wrapper is an element, and mdast
 * has no node for one that survives to HTML.
 */

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

type HastRoot = { type: "root"; children: HastNode[] };

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function slugOf(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function rehypeSections() {
  return (tree: HastRoot) => {
    const grouped: HastNode[] = [];
    let open: HastNode | undefined;

    for (const child of tree.children) {
      if (child.type === "element" && child.tagName === "h2") {
        open = {
          type: "element",
          tagName: "section",
          // Written as the attribute rather than as a camelCased property:
          // `data-section` is what the observer selects on, and what the
          // rendered markup has to read for a reader viewing source.
          properties: { "data-section": slugOf(textOf(child)) },
          children: [],
        };
        grouped.push(open);
      }

      // Anything before the first h2 belongs to no section and is left where
      // it was. It is not a heading's argument, so it is not tracked.
      (open?.children ?? grouped).push(child);
    }

    tree.children = grouped;
  };
}
