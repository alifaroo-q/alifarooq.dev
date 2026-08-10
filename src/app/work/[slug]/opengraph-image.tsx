import { allCaseStudies } from "content-collections";
import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";

/**
 * The case-study fill: the anonymised sector, the decision, and the name in
 * the corner (#16).
 *
 * This is the fill the whole template exists for. A case study pasted into a
 * channel previews with ITS OWN decision rather than the site's name, which is
 * what a single site-wide image cannot do — it would make all five links look
 * like the same link.
 */
export const alt = `A case study by ${PERSON_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;

/**
 * The image route is its own route, so it needs its own params list — the
 * `generateStaticParams` in `page.tsx` does not reach it. Without this the
 * card is rendered on demand, and a card rendered on demand is a card LinkedIn
 * may cache before it has ever been looked at.
 */
export function generateStaticParams() {
  return allCaseStudies.map((doc) => ({ slug: doc.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = allCaseStudies.find((doc) => doc.slug === slug);

  // The page 404s an unknown slug and `dynamicParams = false` means one never
  // reaches here, but the collection lookup is still a `find`.
  if (!caseStudy) return new Response(null, { status: 404 });

  return new ImageResponse(
    <OgCard
      eyebrow={caseStudy.sector}
      footline={PERSON_NAME}
      footlineSize={26}
      footlineTone="label"
      headline={caseStudy.decision}
      headlineSize={58}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
