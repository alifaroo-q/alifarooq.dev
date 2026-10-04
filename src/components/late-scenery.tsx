"use client";

import { useEffect, useRef } from "react";
import type { SceneName } from "@/lib/scene-names";
import { SCENERY_READY } from "@/lib/scenery-ready";

/**
 * The scenery below the fold, fetched and inserted as its section nears.
 *
 * Together the bands are about 140 KB of SVG. Rendered with the page they ride
 * in the HTML twice (markup and React payload) and React walks every node at
 * hydration. Drawn by React after load they cost far more (a 3.8 s task on a
 * throttled phone). Inserted as one HTML string the browser's own parser does
 * it in a few milliseconds. They are decoration with a fixed box (`.scene` in
 * globals.css), so a late arrival moves nothing. The dawn band stays in the
 * page: it is on screen at load. The camel is one too, and a phone never asks
 * for it. See `app/scenes/[name]/route.tsx`.
 */
export function LateScene({
  name,
  minWidth = 0,
}: {
  name: SceneName;
  /** Skip the fetch below this viewport width, in px. */
  minWidth?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const abort = new AbortController();
    let handle = 0;
    let watcher: IntersectionObserver | undefined;

    const draw = async () => {
      try {
        const response = await fetch(`/scenes/${name}`, {
          signal: abort.signal,
        });
        if (!response.ok) return;
        element.innerHTML = await response.text();
        document.dispatchEvent(new Event(SCENERY_READY));
      } catch {
        // Decoration. A band that does not arrive leaves the sky.
      }
    };

    // Wait until the page is idle, then until the section that owns the band
    // is within half a screen of the viewport. A section is taller than a
    // screen and the band sits at its foot, so it lands well before it is seen.
    const whenNear = () => {
      if (!window.matchMedia(`(min-width: ${minWidth}px)`).matches) return;
      const section = element.parentElement;
      if (!section) return;
      watcher = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          watcher?.disconnect();
          draw();
        },
        { rootMargin: "50% 0px" },
      );
      watcher.observe(section);
    };
    const whenIdle = () => {
      handle = window.requestIdleCallback
        ? window.requestIdleCallback(whenNear, { timeout: 2500 })
        : window.setTimeout(whenNear, 300);
    };

    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      abort.abort();
      watcher?.disconnect();
      window.removeEventListener("load", whenIdle);
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
      element.replaceChildren();
    };
  }, [name, minWidth]);

  return <div ref={host} style={{ display: "contents" }} />;
}
