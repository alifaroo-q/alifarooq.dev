import Image from "next/image";
import { PERSON_NAME, PORTRAIT_SRC } from "@/lib/site";

/**
 * The photograph #8 asked for — "a page that anonymises every client benefits
 * from a real face attached to it".
 *
 * Three things it has to get right:
 *
 * - **The box is fixed in CSS AND in the attributes.** It is the only image on
 *   the site, so it is the only thing that could shift the page as it loads,
 *   and #34 set CLS at zero rather than at the usual 0.1 allowance. The
 *   `size-28` class reserves the space before anything is fetched; the
 *   `width`/`height` pair stops the browser guessing at the ratio. Both, not
 *   either — they answer different questions.
 * - **It sets no colour.** The frame is a token, so it reads on either ground
 *   with no second copy. The photograph itself is a photograph; it does not
 *   follow the ground and is not asked to.
 * - **The file is square and the box is square**, so `object-cover` never has
 *   anything to crop. The crop is baked into the file rather than left to CSS,
 *   because a crop chosen by `object-position` is a crop nobody can see in the
 *   asset — and the browser would still download the parts it throws away.
 *
 * `alt` carries the name rather than "photo of" or an empty string. The About
 * section never prints the name next to it, so the photograph is the only
 * thing there that says who the page is about; a screen reader that skips it
 * loses that. The name comes from `site.ts` for the usual reason — a second
 * literal of a name is one edit away from disagreeing with the first.
 *
 * The `width`/`height` are the BOX (112), not the file (640). They are what
 * `next/image` builds the `srcset` from, so declaring the file's size would
 * ask a 112px box to fetch a 640px copy and a 1920px one behind it. The file
 * stays large because the `Person` block hands the same path to a machine,
 * and that consumer wants the big one.
 *
 * `next/image` writes one inline style of its own, `color: transparent`. The
 * globals.css rule it appears to break is about a colour on an element beating
 * the variables a row flip redefines, and this element has no text and no
 * subtree to strand — so it does not.
 *
 * Not `priority`: it sits below the fold, four sections down, so the default
 * lazy load is the correct one. Marking it priority would make it compete with
 * the fold for the first bytes and buy nothing.
 */
export function Portrait() {
  return (
    <Image
      alt={PERSON_NAME}
      className="size-28 shrink-0 border border-border-strong object-cover"
      height={112}
      src={PORTRAIT_SRC}
      width={112}
    />
  );
}
