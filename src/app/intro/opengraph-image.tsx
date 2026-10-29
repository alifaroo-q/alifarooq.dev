import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";

export const alt = `${PERSON_NAME} introduces himself`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Video intro"
      footline={PERSON_NAME}
      footlineSize={34}
      footlineTone="label"
      headline="Hi, I'm Ali"
      headlineSize={88}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
