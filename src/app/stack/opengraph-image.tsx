import { ImageResponse } from "next/og";
import { OgCard, ogContentType, ogFonts, ogSize } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";
import { STACK_EYEBROW, STACK_HEADING } from "@/lib/stack";

/**
 * The stack fill — the fourth of the one card template (#16).
 *
 * It takes the case study's shape rather than the open-source one: an eyebrow,
 * a sentence, and the name small in the corner. The headline here is a claim of
 * the same length and the same kind as a `decision`, so it is set at the same
 * size — a shorter number would make this one card louder than the three it
 * sits beside in a feed.
 *
 * **The twelve names are not on the card, and that is the rejection worth
 * writing down.** They are the one thing a reader might want from a preview of
 * this page, and putting them there is the same mistake as putting a case
 * study's diagram on its card: it hands over the contents to the audience least
 * likely to click, and it turns a headline into a list nobody can read at
 * preview size. What the card promises is a bounded claim; the page is where
 * the claim is itemised.
 *
 * The standfirst is not the footline either. It is the meta `description`, so
 * a preview already prints it under the image on every client that shows one —
 * the card would be repeating the line directly below it.
 */
export const alt = `${STACK_EYEBROW} — ${PERSON_NAME}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow={STACK_EYEBROW}
      footline={PERSON_NAME}
      footlineSize={26}
      footlineTone="label"
      headline={STACK_HEADING}
      headlineSize={58}
    />,
    { ...size, fonts: [...ogFonts] },
  );
}
