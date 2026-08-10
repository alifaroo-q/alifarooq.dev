import { ImageResponse } from "next/og";
import { ACCENT, GROUND, ogFonts } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";

/**
 * The app icon: one lowercase `a`, amber, on the dark ground.
 *
 * **Why a letter and not the site's mark.** The site has one piece of
 * ornament, the full-bleed accent hairline, and it is the wrong thing to
 * shrink: at the 16px a tab strip actually renders, a 1px rule is a smudge and
 * a 48px rule is a dash that identifies nothing. A letterform is the only mark
 * on the site that stays a mark at that size.
 *
 * **One letter, not two.** `af` fits the 48px tile and turns to mush at 16,
 * which is the size that decides whether a reader finds the tab again.
 *
 * **It is fixed dark, like the share card and for the same reason.** An icon
 * is composited onto browser chrome, a bookmark bar or a home screen — none of
 * which is this site's ground, and none of which it can read. A `prefers-
 * color-scheme` SVG favicon could flip, but it would then be a second design
 * to keep matching the card, and Safari and every home screen would still get
 * the PNG. The `globals.css` rule against inline colour does not reach here:
 * see the header of `og-card.tsx`, this is the same renderer, with no cascade,
 * no variables and nothing that ever flips.
 *
 * **48, not 32.** Search results and the tab strip both take the largest
 * square offered and scale down; the smaller tile only removes the choice.
 *
 * `padding` is the one thing the two callers disagree on. iOS masks the corners
 * off an `apple-icon`, so its glyph has to sit inside that mask; a browser tab
 * crops nothing and every pixel spent on margin is one taken off the letter.
 */
export function appIcon({
  size,
  glyphRatio,
}: {
  size: number;
  /** Font size as a share of the tile. Above 1 is normal and not a mistake:
      `a` has no ascender and no descender, so the ink is roughly half the em
      and a font sized to the tile draws a letter half its height. */
  glyphRatio: number;
}) {
  const fontSize = Math.round(size * glyphRatio);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: GROUND,
        color: ACCENT,
        fontFamily: "JetBrains Mono",
        fontWeight: 500,
        fontSize,
        // Centring the LINE box does not centre the ink. Everything under the
        // baseline is reserved and this letter uses none of it, so a centred
        // line sits low by about a sixth of the em. `lineHeight: 1` makes the
        // box the em, and the padding lifts the ink by half of what it adds.
        //
        // Both are measured off the built PNGs, not guessed: the 48 tile ends
        // up with 9 clear above the `a` and 10 below, the 180 with 43 and 44.
        lineHeight: 1,
        paddingBottom: Math.round(fontSize * 0.175),
      }}
    >
      a
    </div>,
    { width: size, height: size, fonts: [...ogFonts] },
  );
}

/** The tab's tooltip and the home-screen label both read this. */
export const appIconAlt = PERSON_NAME;
export const appIconContentType = "image/png";
