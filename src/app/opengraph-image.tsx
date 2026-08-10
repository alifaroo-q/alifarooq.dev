import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME, PERSON_ROLE } from "@/lib/site";

/**
 * The home fill: the name, and the role under the rule (#16).
 *
 * Nothing else. The positioning sentence is not on the card for the same
 * reason the home description gives it up — it is 195 characters and a card
 * shows one clause of it, which is worse than not attempting it.
 */
export const alt = `${PERSON_NAME} — ${PERSON_ROLE}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    <OgCard
      footline={PERSON_ROLE}
      footlineSize={34}
      footlineTone="muted"
      headline={PERSON_NAME}
      headlineSize={120}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
