import type { Metadata } from "next";
import { ContactFooter } from "@/components/contact-footer";
import { DetailShell } from "@/components/detail-shell";
import { SectionIndex } from "@/components/section-index";
import { pageMetadata } from "@/lib/metadata";
import { BELOW_BAR, STACK, STACK_HEDGE } from "@/lib/stack";

/**
 * `/stack` — the third fill of the one detail template (#17).
 *
 * A case study pins a diagram, an open-source page pins its own headings, and
 * this page pins the twelve names. All three answer "where am I in this
 * argument", which is what makes one shell legitimate for a third kind of page
 * rather than a shell with a hole in it.
 *
 * The prose is written here rather than in MDX because it is not a document.
 * Twelve records with one sentence each is an array — see `src/lib/stack.ts`,
 * which also carries the argument for the bar, the cap and the ordering.
 *
 * **This page is not in the header nav, and it is reached only from the home
 * page's About area.** That is deliberate. The surveyed sites that carry a
 * page like this bury it, and a header slot beside Resume and Contact would
 * rank a reference list with the work.
 *
 * The register does not change here either. Same flat sentences as the case
 * studies, and every item names a cost rather than a use — a list that drops
 * into product-copy voice says the rest of the site was the performance.
 */
export const dynamic = "error";

/**
 * The standfirst is the bar, stated outright and without comparison.
 *
 * It is not defensive if it does not mention anybody else's list. The site
 * argues for its own choices on every other page; a list that arrived
 * unexplained would be the one unargued block on it.
 */
const STANDFIRST =
  "Everything here is something I shipped and then had to live with. Twelve of them, and what each one cost.";

/**
 * A sentence, not the word "Stack".
 *
 * Every other `h1` on the site is a claim — "The handle goes in the signature".
 * A one-word heading here would be the only label among them, and a label is
 * what the rest of the page spends twelve sentences refusing to be.
 */
const HEADING = "Twelve things I have had to live with.";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Stack",
    // The standfirst is the description. One string in two places, the same
    // rule the open-source pages follow: the card and the page open together.
    description: STANDFIRST,
    path: "/stack",
  });
}

export default function StackPage() {
  return (
    <>
      <DetailShell
        // Back to About, because that is the only block that links here.
        backHref="/#about"
        backLabel="About"
        eyebrow="Stack"
        heading={HEADING}
        reference={
          <SectionIndex
            id="stack-index"
            // Not "Sections". The reader is looking at twelve names.
            label="The list"
            sections={STACK.map((item) => ({
              slug: item.slug,
              title: item.name,
            }))}
          />
        }
        standfirst={STANDFIRST}
      >
        {STACK.map((item) => (
          /* The same `data-section` contract the MDX pipeline emits, written
             by hand because there is no MDX here. The observer knows nothing
             about either — it selects on the attribute.

             The floor is 24svh, not the 48svh `mdx-content.tsx` sets. That
             rule is one band-height rather than two, and the reason is the
             shape of the content: a case study's sections are paragraphs and
             need room to own the band alone, while these are one sentence
             each and would take 278px of empty column apiece at the larger
             number — which is the exact cost `mdx-content.tsx` measured and
             rejected when its own floor was three band-heights. One band is
             the floor at which two items stop sharing the band at rest. */
          <section
            className="mt-section first:mt-0 lg:min-h-[24svh]"
            data-section={item.slug}
            key={item.slug}
          >
            {/* The name takes the h2 treatment the prose uses — accent, at the
                label size. It is a heading in the document outline because it
                is one: twelve named things, each with its own paragraph. */}
            <h2 className="text-accent text-label uppercase">{item.name}</h2>
            <p className="mt-flow text-foreground-muted">{item.note}</p>
            {item.proof ? (
              <p className="mt-flow">
                <a className="text-accent text-sm" href={item.proof.href}>
                  {item.proof.label}
                </a>
              </p>
            ) : null}
          </section>
        ))}

        {/* The two bounding sentences, below the list and quieter than it.
            They are the whole of what stops this being an inventory: one says
            where the list ends, the other says what sits under the bar. */}
        <div className="mt-section border-border border-t pt-figure text-foreground-label text-sm">
          <p>{BELOW_BAR}</p>
          <p className="mt-flow">{STACK_HEDGE}</p>
        </div>
      </DetailShell>

      {/* Compact, like every other page behind a click. */}
      <ContactFooter compact />
    </>
  );
}
