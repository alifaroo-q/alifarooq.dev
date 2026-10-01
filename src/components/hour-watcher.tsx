"use client";

import { useEffect } from "react";

/**
 * Writes the hour the reader is in onto <html> as `data-hour`.
 *
 * It is the whole of the page's scroll state: the nav lights its link from it
 * and the mascot falls asleep from it, both in CSS, so neither component needs
 * to be a client component or to know the other exists. An hour counts as the
 * current one while it crosses the middle of the viewport.
 */
export function HourWatcher() {
  useEffect(() => {
    const hours = document.querySelectorAll<HTMLElement>("body [data-hour]");
    if (hours.length === 0) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            root.dataset.hour = (entry.target as HTMLElement).dataset.hour;
          }
        }
      },
      { rootMargin: "-48% 0px -50% 0px" },
    );
    for (const hour of hours) observer.observe(hour);
    return () => {
      observer.disconnect();
      delete root.dataset.hour;
    };
  }, []);
  return null;
}
