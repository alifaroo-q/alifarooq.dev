import { appIcon, appIconAlt, appIconContentType } from "@/lib/app-icon";

/**
 * The browser tab and the search result (#16).
 *
 * There is deliberately no `favicon.ico` beside this. Next writes the `<link>`
 * for whichever conventions exist, and an `.ico` shipped alongside a PNG is a
 * second copy of the same mark that a browser may prefer — one more file to
 * keep matching, for browsers that have understood PNG favicons for a decade.
 */
export const alt = appIconAlt;
export const size = { width: 48, height: 48 };
export const contentType = appIconContentType;

export default function Icon() {
  return appIcon({ size: size.width, glyphRatio: 1.05 });
}
