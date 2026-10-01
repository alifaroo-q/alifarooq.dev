import { ImageResponse } from "next/og";
import { CORAL, GROUND, ogFonts } from "@/lib/og-card";
import { PERSON_NAME } from "@/lib/site";

/**
 * The app icon: the header's own wordmark, "af" and a coral full stop, on a
 * cream paper card with a hard ink shadow, set on the dawn sky.
 *
 * It is the same mark the floating bar wears on a phone, so the tab, the
 * home-screen tile and the page agree. At 16px the card edge and the shadow
 * blur into a frame, and what is left is two bold letters and a dot, which is
 * all the mark ever was.
 *
 * It is fixed in colour, like the share card, and for the same reason: an icon
 * is composited onto browser chrome and home screens the site cannot read, and
 * Satori has no cascade or variables. The values are copied from `globals.css`.
 *
 * `inset` is the margin between the tile and the card, and it also has to hold
 * the shadow. iOS masks the corners off an `apple-icon`, so that caller leaves
 * more room; a browser tab crops nothing and wants the card as large as it can
 * be.
 */
export function appIcon({
  size,
  glyphRatio,
  inset,
}: {
  size: number;
  /** Font size as a share of the tile. */
  glyphRatio: number;
  /** Margin around the card as a share of the tile. */
  inset: number;
}) {
  const fontSize = Math.round(size * glyphRatio);
  const margin = Math.round(size * inset);
  const border = Math.max(2, Math.round(size * 0.05));
  const shadow = Math.max(2, Math.round(size * 0.07));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#f6c9a6",
        padding: margin,
        paddingRight: margin + shadow,
        paddingBottom: margin + shadow,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fffaf0",
          color: GROUND,
          border: `${border}px solid ${GROUND}`,
          borderRadius: Math.round(size * 0.06),
          boxShadow: `${shadow}px ${shadow}px 0 ${GROUND}`,
          fontFamily: "Bricolage Grotesque",
          fontWeight: 700,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          paddingBottom: Math.round(fontSize * 0.06),
        }}
      >
        af<span style={{ color: CORAL }}>.</span>
      </div>
    </div>,
    { width: size, height: size, fonts: [...ogFonts] },
  );
}

/** The tab's tooltip and the home-screen label both read this. */
export const appIconAlt = PERSON_NAME;
export const appIconContentType = "image/png";
