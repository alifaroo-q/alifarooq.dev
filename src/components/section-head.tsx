/**
 * The band that opens a section: a real `<h2>` and a hairline that runs to
 * the viewport edge.
 *
 * The heading is a label, not a display step — #8 kept the weight on the
 * decision headings underneath, and a section head that competes with them
 * moves the skim path off the argument and onto the furniture. The rule is
 * `aria-hidden`: it is the label's underline, and a screen reader already
 * has the heading.
 */
export function SectionHead({ id, label }: { id: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4 border-border border-t px-6 py-3 md:px-10">
      <h2 className="text-accent text-label uppercase" id={id}>
        {label}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}
