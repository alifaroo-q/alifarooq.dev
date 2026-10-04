import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";
import { CASES, caseSub, caseTitle, findCase, slugOf } from "@/lib/work";

export const alt = `A project by ${PERSON_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return CASES.map((job) => ({ slug: slugOf(job) }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const job = findCase((await params).slug);
  if (!job) {
    throw new Error("No case page for this slug.");
  }
  return new ImageResponse(
    <OgCard
      eyebrow={caseSub(job)}
      footline={PERSON_NAME}
      footlineSize={34}
      footlineTone="label"
      headline={caseTitle(job)}
      headlineSize={100}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
