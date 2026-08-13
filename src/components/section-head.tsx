/**
 * The band that opens a section: a real `<h2>` and a hairline that runs to
 * the viewport edge.
 *
 * The heading is a label, not a display step — #8 kept the weight on the
 * decision headings underneath, and a section head that competes with them
 * moves the skim path off the argument and onto the furniture. The rule is
 * `aria-hidden`: it is the label's underline, and a screen reader already
 * has the heading.
 *
 * IT CARRIES THE SECTION GAP, and this is the one piece of outer spacing on
 * the site that a component sets for itself rather than leaving to its call
 * site. The reason is that the gap is not a layout choice — it is what makes
 * a section a section, and four call sites free to pick it are four chances
 * to get it wrong.
 *
 * The measurement it fixes: the home page's largest gap was INSIDE a section,
 * not between two. About's bio block sat in 56px of padding while the boundary
 * above it was the previous section's 24px of bottom padding and a hairline.
 * Readers read a small gap as "these belong together" and a large one as "a
 * new thing starts here", so a page whose inner gaps beat its outer ones reads
 * as one long table. The rule is that an element's outer spacing is at least
 * its inner spacing.
 *
 * `mt-section` is the scale's own answer — 3.5rem, named "between top-level
 * sections" in `globals.css` and already spent that way between the items on
 * `/stack`. The home page's four heads are the call sites that never took it.
 *
 * MARGIN, above the border, and not padding below it. Padding would leave the
 * hairline welded to the section above and put the air between the rule and
 * the label it underlines. The whitespace belongs above the heading: about
 * 80px over it against 12px under it, which is the ratio that makes the rule
 * read as the label's and not as the last section's closing line.
 *
 * Every call site is mid-page — three on the home page, one in the footer —
 * so nothing here ever opens a document with a margin it did not ask for.
 */
export function SectionHead({ id, label }: { id: string; label: string }) {
  return (
    <div className="mt-section flex items-baseline gap-4 border-border border-t px-6 py-3 md:px-10">
      {/* The label arrives, and the rule draws out from under it. Two hooks
          rather than one on the wrapper, because they are two different
          motions and the second only reads as an underline if it starts where
          the first one ends. Both are settled in `globals.css`. */}
      <h2 className="text-accent text-label uppercase" data-reveal id={id}>
        {label}
      </h2>
      <span aria-hidden="true" className="section-rule h-px flex-1 bg-border" />
    </div>
  );
}
