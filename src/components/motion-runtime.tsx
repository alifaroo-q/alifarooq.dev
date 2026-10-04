"use client";

import { useEffect } from "react";
import { SCENERY_READY } from "@/lib/scenery-ready";

/**
 * Loads the scroll motion once the page is idle. GSAP and ScrollTrigger are
 * about 50 KB and none of what they do is on screen at load, so they stay out
 * of the first paint's way. The load entrance is CSS. See `lib/motion-effects`.
 */
export function MotionRuntime() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;
    let rescene: (() => void) | undefined;
    const onScenery = () => rescene?.();
    const start = () => {
      import("@/lib/motion-effects").then(({ startMotion, startScenery }) => {
        if (cancelled) return;
        stop = startMotion();
        rescene = startScenery;
      });
    };
    document.addEventListener(SCENERY_READY, onScenery);
    const idle = window.requestIdleCallback ?? ((run) => setTimeout(run, 200));
    const handle = idle(start, { timeout: 2000 });
    return () => {
      cancelled = true;
      document.removeEventListener(SCENERY_READY, onScenery);
      (window.cancelIdleCallback ?? clearTimeout)(handle);
      stop?.();
    };
  }, []);

  return null;
}
