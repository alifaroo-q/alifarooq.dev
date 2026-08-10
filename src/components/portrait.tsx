/**
 * PLACEHOLDER. #8 asked for a small photo in About — "a page that anonymises
 * every client benefits from a real face attached to it" — and the photograph
 * itself does not exist in the repo yet. This holds its place.
 *
 * Two things it has to get right, both of which survive the swap:
 *
 * - **The box is fixed in CSS, not inferred from the file.** It is the only
 *   image on the site, so it is the only thing that could shift the page as
 *   it loads, and #34 set CLS at zero rather than at the usual 0.1 allowance.
 *   A square whose size is stated in the class list reserves its own space
 *   before anything is fetched.
 * - **It sets no colour.** The drawing is `currentColor` and the frame is a
 *   token, so it reads on either ground with no second copy.
 *
 * Replacing it is a two-line change: import the file and render `next/image`
 * with the same `size-28` box and an explicit `width`/`height`. Keep both —
 * the class is what reserves the space and the attributes are what stop the
 * browser guessing at it.
 */
export function Portrait() {
  return (
    <div
      aria-hidden="true"
      className="grid size-28 shrink-0 place-items-center border border-border-strong text-foreground-label"
    >
      <svg
        aria-hidden="true"
        className="size-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 48 48"
      >
        <circle cx="24" cy="17" r="9" />
        <path d="M7 45c0-9.4 7.6-17 17-17s17 7.6 17 17" />
      </svg>
    </div>
  );
}
