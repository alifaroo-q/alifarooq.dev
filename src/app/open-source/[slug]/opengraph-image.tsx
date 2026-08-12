import { allOpenSources } from "content-collections";
import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { OPEN_SOURCE_CONVICTION, PERSON_NAME } from "@/lib/site";

/**
 * The open-source fill: the repo name, and the conviction under the rule
 * (#16).
 *
 * The conviction rather than the document's own `description`, because the
 * card has to say why the repo exists to somebody who has never heard of it,
 * and the conviction is the sentence that does that. No npm scope appears
 * here and none may (#22) — the repo is named, not installed.
 */
export const alt = `An open-source project by ${PERSON_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;

/** Its own params list, for the reason the case-study card gives. */
export function generateStaticParams() {
  return allOpenSources.map((doc) => ({ slug: doc.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = allOpenSources.find((entry) => entry.slug === slug);

  if (!doc) return new Response(null, { status: 404 });

  return new ImageResponse(
    <OgCard
      footline={OPEN_SOURCE_CONVICTION}
      footlineSize={28}
      footlineTone="muted"
      headline={doc.title}
      headlineSize={120}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
