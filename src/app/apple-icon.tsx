import { appIcon, appIconAlt, appIconContentType } from "@/lib/app-icon";

/**
 * The home-screen tile. 180 is the size iOS asks for and the only one it does
 * not resample.
 *
 * The glyph is smaller than the tab's share of the tile because iOS rounds the
 * corners off this one, and a letter sized to the square loses its edges to
 * the mask.
 */
export const alt = appIconAlt;
export const size = { width: 180, height: 180 };
export const contentType = appIconContentType;

export default function AppleIcon() {
  return appIcon({ size: size.width, glyphRatio: 0.9 });
}
