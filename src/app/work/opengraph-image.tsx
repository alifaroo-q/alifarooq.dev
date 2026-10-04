import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";

export const alt = `What ${PERSON_NAME} built`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Work"
      footline={PERSON_NAME}
      footlineSize={34}
      footlineTone="label"
      headline="Everything I built"
      headlineSize={88}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
