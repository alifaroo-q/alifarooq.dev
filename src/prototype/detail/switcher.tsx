"use client";

/**
 * PROTOTYPE — throwaway. Two axes, because #17 asks two questions:
 *   ?variant=A|B|C   — where the diagram sits
 *   ?page=work|oss   — whether the two page kinds survive the same treatment
 * Never ships.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const DETAIL_VARIANTS = [
  { key: "A", name: "Artifact first" },
  { key: "B", name: "The turn" },
  { key: "C", name: "Sticky reference" },
] as const;

export function DetailSwitcher({ current, page }: { current: string; page: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const index = Math.max(
    0,
    DETAIL_VARIANTS.findIndex((v) => v.key === current),
  );

  function push(next: Record<string, string>) {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) q.set(k, v);
    router.replace(`/detail?${q.toString()}`, { scroll: false });
  }

  function go(step: number) {
    push({
      variant: DETAIL_VARIANTS[(index + step + DETAIL_VARIANTS.length) % DETAIL_VARIANTS.length].key,
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black px-1.5 py-1.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-white/20"
      style={{ fontFamily: "var(--font-plex-mono), monospace" }}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous variant"
        className="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-white/15"
      >
        ←
      </button>
      <span className="px-2 text-xs whitespace-nowrap tabular-nums">
        {DETAIL_VARIANTS[index].key} — {DETAIL_VARIANTS[index].name}
        <span className="ml-2 text-white/40">
          {index + 1}/{DETAIL_VARIANTS.length}
        </span>
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next variant"
        className="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-white/15"
      >
        →
      </button>

      <span aria-hidden className="mx-1 h-4 w-px bg-white/20" />

      {[
        ["work", "Case study"],
        ["oss", "drizzle-tx"],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => push({ page: key })}
          className={`rounded-full px-2.5 py-1 text-xs ${
            page === key ? "bg-white text-black" : "text-white/70 hover:bg-white/15"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
