"use client";

/**
 * PROTOTYPE — throwaway. Take C's refinement: the pinned reference TRACKS the
 * section being read.
 *
 * The original C pinned the diagram and left it inert, which made it wallpaper
 * with good intentions — the reader still had to work out for themselves which
 * part of the machine the current paragraph was about. Here the sections drive
 * it: the parts the current section is not talking about drop back, and the
 * parts it is talking about take the accent.
 *
 * Two constraints this is deliberately built inside:
 *
 *   #10 — no colour is ever set inline. The focus state is CSS on `.c-ref`,
 *         keyed off `data-active`, and the SVG asset stays hex-free. This is
 *         `currentColor` earning its keep rather than merely being tolerated.
 *
 *   The reader who does not run JavaScript, or who has not scrolled yet, gets
 *   `focus = null`, which renders the WHOLE machine undimmed. The scroll
 *   linkage is an enhancement on a diagram that is already complete without it.
 */

import { useEffect, useState } from "react";

/**
 * Reports which section is under the reading line. The band is 22%–45% down
 * the viewport: high enough that the active section is the one being read,
 * not the one just entering from the bottom.
 */
export function useActiveSection(keys: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = keys
      .map((k) => document.getElementById(`section-${k}`))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const inBand = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const key = e.target.id.replace("section-", "");
          if (e.isIntersecting) inBand.add(key);
          else inBand.delete(key);
        }
        // Topmost section in the band wins; if the band is empty (a long
        // section straddling it) the previous answer stands.
        const next = keys.find((k) => inBand.has(k));
        if (next) setActive(next);
      },
      { rootMargin: "-22% 0px -55% 0px", threshold: 0 },
    );

    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, [keys]);

  return active;
}

/**
 * The pinned column. `data-focus` is what the CSS in globals.css reads; it is
 * on the wrapper rather than on the SVG so the section index can use the same
 * mechanism on the drizzle-tx page, where there is no diagram to dim.
 */
export function StickyReference({
  active,
  children,
}: {
  active: string | null;
  children: React.ReactNode;
}) {
  return (
    <div
      className="c-ref lg:sticky lg:top-[4.5rem]"
      data-focus={active ?? undefined}
      data-tracking={active === null ? "false" : "true"}
    >
      {children}
    </div>
  );
}
