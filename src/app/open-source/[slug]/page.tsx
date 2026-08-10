import { allOpenSources } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactFooter } from "@/components/contact-footer";
import { DetailShell } from "@/components/detail-shell";
import { MdxContent } from "@/components/mdx-content";
import { SectionIndex } from "@/components/section-index";
import { pageMetadata } from "@/lib/metadata";

/**
 * The open-source detail page — `/open-source/<slug>`, not `/oss` (#9, #16).
 * A URL is the one string a reader cannot skim past and the one that cannot be
 * renamed later, so it takes the same rule the visible labels take.
 *
 * The register changes at the section boundary and this is the far side of it
 * (#7). The home page carries no mechanism at all; this page assumes the click
 * was deliberate and is written for someone who will open the repo. The VOICE
 * does not change with it — same flat sentences, only the nouns get technical
 * — because a register that loosens when it gets technical says the home page
 * was the performance.
 *
 * It is the same shell the case studies use, filled differently. There is no
 * diagram here, so the pinned column holds the document's own sections, and
 * they track exactly as a diagram's parts do.
 */
export const dynamicParams = false;
export const dynamic = "error";

// `allOpenSources`, not `allOpenSource`: the generator pluralises the
// collection name, and the collection is named for the section it fills.
export function generateStaticParams() {
  return allOpenSources.map((doc) => ({ slug: doc.slug }));
}

function findDoc(slug: string) {
  return allOpenSources.find((doc) => doc.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = findDoc(slug);

  if (!doc) return {};

  // The repo name is the title, and `description` is both the meta
  // description and the standfirst the page prints. One string in two places
  // is the point here: the card and the page open with the same sentence.
  return pageMetadata({
    title: doc.title,
    description: doc.description,
    path: `/open-source/${doc.slug}`,
  });
}

export default async function OpenSourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = findDoc(slug);

  if (!doc) notFound();

  return (
    <>
      <DetailShell
        backHref="/#open-source"
        backLabel="Open source"
        // The eyebrow names the zone rather than the project. On a case study it
        // is the client's sector, which is context the heading deliberately does
        // not carry; here the heading is a repo name and the context a reader
        // needs is which half of the site they are in.
        eyebrow="Open source"
        heading={doc.title}
        reference={<SectionIndex sections={doc.sections} />}
        standfirst={doc.description}
      >
        <MdxContent code={doc.body} />
      </DetailShell>

      {/* Compact, on the same grounds as the case studies: one template, two
          fills, and the footer is furniture rather than register (#17). */}
      <ContactFooter compact />
    </>
  );
}
