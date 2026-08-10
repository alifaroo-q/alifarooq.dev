import { allOpenSources } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailShell } from "@/components/detail-shell";
import { MdxContent } from "@/components/mdx-content";
import { SectionIndex } from "@/components/section-index";

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

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/open-source/${doc.slug}` },
  };
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
  );
}
