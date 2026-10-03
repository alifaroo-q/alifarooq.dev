"use client";

import { useEffect } from "react";
import { hourAt } from "@/lib/hour-at";

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
    const now = hourAt(
      [...hours].map((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        return { hour: el.dataset.hour, top, bottom };
      }),
      window.innerHeight * 0.49,
    );
    if (now) root.dataset.hour = now;
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
