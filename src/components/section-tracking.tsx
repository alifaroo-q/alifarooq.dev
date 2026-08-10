"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * The reading band, as two fractions of the viewport.
 *
 * The band is the strip where a reader's eye is — above the middle of the
 * screen, not on it. 0.22 and 0.45 put it between 22% and 45% down the
 * window: 202px at 1440x877.
 *
 * This is the number #26 called the one nobody had watched. The prototype's
 * -22% / -55% is where it started and where it stayed, and these are the
 * measurements that kept it. Each band was replayed over the first case
 * study's real geometry — where each handover falls, and where the incoming
 * heading sits on screen when it does:
 *
 *   BAND         HANDOVER AT      LAST SECTION GETS
 *   22% / 45%    heading at 37%   154px of 1323   <- kept
 *   40% / 60%    heading at 53%   299px           dimmed at scroll 0
 *   30% / 55%    heading at 46%   233px           dimmed by scroll 42
 *   15% / 40%    heading at 31%   102px
 *   10% / 30%    heading at 23%    36px
 *
 * Two things rule the others out. A band on or below the centre line is
 * already covering the first section before the reader has touched the
 * wheel, so the complete diagram — the state #26 asks the page to open in —
 * lasts 42px or none at all. A band near the top hands over while the
 * previous section is still the one being read, and leaves the last section
 * 36px of page to own the band in.
 *
 * 22% / 45% is the only one that holds the untracked state for 130px of
 * scroll and still gives the last section a sixth of a screen.
 */
const BAND_TOP = 0.22;
const BAND_BOTTOM = 0.45;

/**
 * `rootMargin` is derived from the band rather than written beside it, so the
 * strip the observer watches and the strip the tie-break measures cannot
 * drift apart.
 *
 * Two more numbers are drawn from the band and are NOT derived, because they
 * are Tailwind classes and there is nowhere to compute them: the section
 * floor in `mdx-content.tsx` is twice the band, and the tail room in
 * `detail-shell.tsx` is what the last handover needs after it. Retuning the
 * band means revisiting both.
 */
const ROOT_MARGIN = `-${BAND_TOP * 100}% 0% -${(1 - BAND_BOTTOM) * 100}% 0%`;

/**
 * The observer fires on a membership change, and while two sections share the
 * band there is no membership change to fire on — so the handover between
 * them would arrive late, at the moment the outgoing section left the band
 * entirely. Graded steps are what make it arrive on time.
 *
 * What matters is the STEP, not the count: 5% of a section's height is a
 * callback every 21px of scroll at the 421px sections this page has, which
 * puts a handover within 11px of where it belongs. The steps above the band's
 * share of a section — 202 of 421, so roughly half of them — can never be
 * reached and cost nothing; listing the full range is what keeps the step
 * size right for a section of any height.
 */
const THRESHOLDS = Array.from({ length: 21 }, (_, step) => step / 20);

// The `lg` breakpoint, and the same number the column collapses at. Below it
// there is no second column to track against — the reader has already had the
// diagram, once, up top and undimmed.
const DESKTOP = "(min-width: 64rem)";

/**
 * Section tracking: the diagram stops illustrating the page and becomes its
 * second column of argument (#26).
 *
 * The parts the section in view is not talking about dim; the parts it is
 * talking about take the accent. The mapping is the SVG's own
 * `data-sections`, so nothing here knows what a state machine is and no
 * lookup table sits between the asset and the prose.
 *
 * Three things are load-bearing:
 *
 * - **The untracked state is the complete diagram.** Nothing is dimmed until
 *   this effect runs and a section reaches the band, so a reader with no
 *   JavaScript, or one who has not scrolled, gets the whole machine. That is
 *   the fallback, and it is a finished state rather than a degraded one.
 * - **Dimming is opacity, never a second grey.** A grey is a colour, and a
 *   colour set here would beat the variables a ground flip redefines and
 *   strand the drawing on the wrong ground. Opacity survives the flip.
 * - **Nothing here sets a colour.** This toggles `data-state`; `globals.css`
 *   owns what focused and dimmed look like, including honouring
 *   `prefers-reduced-motion`.
 */
export function SectionTracking({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktop = window.matchMedia(DESKTOP);
    let stop: (() => void) | undefined;

    const start = () => {
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-section]"),
      );
      const parts = Array.from(
        root.querySelectorAll<SVGElement>("[data-part]"),
      );
      if (sections.length === 0 || parts.length === 0) return;

      const partsFor = (section: string) =>
        parts.filter((part) =>
          (part.dataset.sections ?? "").split(/\s+/u).includes(section),
        );

      let active: string | undefined;

      /** Back to the complete machine — the state the page opens in. */
      const clear = () => {
        if (active === undefined) return;
        active = undefined;
        for (const part of parts) part.removeAttribute("data-state");
      };

      const setActive = (section: string) => {
        if (section === active) return;
        active = section;

        const named = partsFor(section);

        // A section that names no part shows the whole machine rather than
        // dimming all of it. A blank-looking diagram would read as a bug to
        // the reader and hide the real one — a heading renamed on one side of
        // the mapping and not the other — from whoever renamed it.
        if (named.length === 0) {
          for (const part of parts) part.removeAttribute("data-state");
          return;
        }

        for (const part of parts) {
          part.dataset.state = named.includes(part) ? "focus" : "dim";
        }
      };

      const inBand = new Set<Element>();

      /** How much of the band this section covers, in pixels. */
      const share = (section: HTMLElement) => {
        const box = section.getBoundingClientRect();
        const top = window.innerHeight * BAND_TOP;
        const bottom = window.innerHeight * BAND_BOTTOM;
        return Math.min(box.bottom, bottom) - Math.max(box.top, top);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          }

          // The section that owns most of the band wins, and reading order
          // breaks a tie. Taking the first one in the band instead would
          // hand the page's LAST section a fight it can never win: at the
          // bottom of the page the one before it still clips the top of the
          // band, and the reader would finish the argument watching the
          // previous section's parts.
          let current: HTMLElement | undefined;
          let best = 0;

          for (const section of sections) {
            if (!inBand.has(section)) continue;
            const covered = share(section);
            if (covered > best) {
              best = covered;
              current = section;
            }
          }

          if (current?.dataset.section) {
            setActive(current.dataset.section);
            return;
          }

          // The band is empty, and where it is empty decides what that means.
          // Scrolled back above the first section the reader is at the head of
          // the page again, and the page's opening state is the complete
          // machine — so it comes back. Everywhere else an empty band is a gap
          // between two sections, and the last one read stays lit rather than
          // the diagram flashing whole on the way past.
          const top = window.innerHeight * BAND_TOP;
          const started = sections.some(
            (section) => section.getBoundingClientRect().top <= top,
          );
          if (!started) clear();
        },
        { rootMargin: ROOT_MARGIN, threshold: THRESHOLDS },
      );

      for (const section of sections) observer.observe(section);

      // The flag the stylesheet keys off, set only once the observer is live.
      root.dataset.tracking = "";

      stop = () => {
        observer.disconnect();
        inBand.clear();
        clear();
        root.removeAttribute("data-tracking");
      };
    };

    // Desktop-only, and it stays that way across a resize: crossing the
    // breakpoint downwards tears the tracking down and returns the diagram to
    // the complete state the phone reader gets.
    const sync = () => {
      stop?.();
      stop = undefined;
      if (desktop.matches) start();
    };

    sync();
    desktop.addEventListener("change", sync);

    return () => {
      desktop.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <main className={className} id={id} ref={rootRef}>
      {children}
    </main>
  );
}
