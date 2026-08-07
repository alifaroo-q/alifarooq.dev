"use client";

/** PROTOTYPE — throwaway. Floating variant switcher. Never ships. */

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const VARIANTS = [
  { key: "A", name: "Terminal" },
  { key: "B", name: "Editorial" },
  { key: "C", name: "Product-minimal" },
  { key: "D", name: "Spec document" },
] as const;

export function PrototypeSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const index = Math.max(
    0,
    VARIANTS.findIndex((v) => v.key === current),
  );

  function go(step: number) {
    const next = VARIANTS[(index + step + VARIANTS.length) % VARIANTS.length];
    const q = new URLSearchParams(params.toString());
    q.set("variant", next.key);
    router.replace(`/?${q.toString()}`, { scroll: false });
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
        onClick={() => go(-1)}
        aria-label="Previous variant"
        className="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-white/15"
      >
        ←
      </button>
      <span className="px-2 text-xs whitespace-nowrap tabular-nums">
        {VARIANTS[index].key} — {VARIANTS[index].name}
        <span className="ml-2 text-white/40">
          {index + 1}/{VARIANTS.length}
        </span>
      </span>
      <button
        onClick={() => go(1)}
        aria-label="Next variant"
        className="grid h-7 w-7 place-items-center rounded-full text-sm hover:bg-white/15"
      >
        →
      </button>
    </div>
  );
}
