"use client";

/**
 * The site's motion, in one place.
 *
 * Markup carries `data-*` hooks and nothing else; `EFFECTS` below is the one
 * table that says what each hook does. A call site never names a duration, a
 * curve or a keyframe. That rule is why this file exists as a runtime rather
 * than as a component per block: a page stays server-rendered markup with
 * attributes on it, and there is one client boundary on the site.
 *
 * WHY GSAP. ScrollTrigger scrubs the same way in every browser, where CSS
 * `animation-timeline: view()` is missing in Safari and Firefox. It also buys
 * timelines, where each step starts before the one before it has finished.
 *
 * THE RULES, and they are correctness rules:
 *
 * - THE SERVER MARKUP IS THE FINAL STATE. Every start state is set FROM
 *   JavaScript, by `gsap.from` or `fromTo`. A browser that never runs this
 *   file, or a reader who asks for reduced motion, gets the finished page.
 * - TRANSFORMS, OPACITY AND `--lift` ONLY. `--lift` scales the paper's hard
 *   shadow (see `.paper` in globals.css), so no frame costs layout.
 * - MOTION SETS NO COLOUR. A colour written here would beat the variables a
 *   row flip redefines and strand part of the subtree on the wrong ground.
 * - THE REAL TEXT NEVER CHANGES. A number that counts or a time that rolls is
 *   an aria-hidden copy laid over the real text, so search engines and screen
 *   readers only ever see the final value.
 *
 * And all of it is inside `gsap.matchMedia("(prefers-reduced-motion:
 * no-preference)")`, stated that way round so motion added later is off by
 * default. `matchMedia` reverts every tween it created when the reader turns
 * the preference on, and runs the cleanups the effects return.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";
import { CONTACT_SENT } from "@/lib/contact-sent";

const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The scale, named by ROLE and settled once.
 *
 * `arrive` is `--ease-arrive` under another name: GSAP cannot read a CSS
 * curve, so the two have to be edited together. `rise` is steeper and only
 * the headline uses it.
 *
 * The scrub range ends well before a block leaves the viewport: a range a
 * short page cannot finish strands the last block half-faded with nothing
 * left to scroll.
 */
const MOTION = {
  arrive: "cubic-bezier(0.22, 1, 0.36, 1)",
  rise: "power4.out",
  enter: 0.52,
  headline: 0.9,
  land: 0.5,
  count: 0.8,
  roll: 0.4,
  /** 70ms a slot. The container decides how many slots there are. */
  step: 0.07,
  scrubStart: "top 92%",
  scrubEnd: "top 55%",
  /** Cards land as they come into view. */
  landAt: "top 88%",
  /** A figure or a time changes only once all of it is on screen, so the
      reader sees it happen and never a stale value at the screen's edge. */
  seenAt: "bottom bottom",
  /** Seconds of catch-up. Enough to smooth a trackpad, short enough to track. */
  scrub: 0.4,
  /** Pixels of page scroll per camel step, and how far it walks in all. */
  stride: 56,
  walk: 56,
  /** Pixels a scenery layer travels per unit of its `--depth`. */
  drift: 26,
  /** Seconds for the lighthouse beam to go round once. */
  sweep: 2.4,
};

/**
 * Lay an aria-hidden copy over `el` (CSS hides the real glyphs while it is
 * there, without touching colour) and return it with its remover.
 */
function overlay(el: HTMLElement) {
  const copy = document.createElement("span");
  copy.ariaHidden = "true";
  copy.dataset.copy = "";
  el.append(copy);
  return { copy, remove: () => copy.remove() };
}

type Effect = (el: HTMLElement) => undefined | (() => void);

const EFFECTS: [selector: string, effect: Effect][] = [
  // THE HEADLINE. The rise and the fade start together and end apart, so a
  // word is already legible while it is still travelling.
  [
    "[data-headline]",
    (headline) => {
      const words = headline.querySelectorAll("[data-word]");
      gsap
        .timeline()
        .from(words, {
          yPercent: 110,
          duration: MOTION.headline,
          ease: MOTION.rise,
          stagger: MOTION.step,
        })
        .from(words, { opacity: 0, duration: 0.5, stagger: MOTION.step }, "<");
      return undefined;
    },
  ],

  // ARRIVING ON LOAD. Children take their delay from their position. The
  // headline is skipped: it has its own entrance, and a fade on top of the
  // word rise would play it twice.
  [
    "[data-enter]",
    (container) => {
      const children = [...container.children].filter(
        (child) => !child.matches("[data-headline]"),
      );
      gsap.from(children, {
        opacity: 0,
        y: 18,
        duration: MOTION.enter,
        ease: MOTION.arrive,
        stagger: MOTION.step,
      });
      return undefined;
    },
  ],

  // ARRIVING ON SCROLL. Scrubbed, so it runs on the scroll and cannot drift
  // out of step with the reader's thumb.
  [
    "[data-reveal]",
    (block) => {
      gsap.from(block, {
        opacity: 0,
        y: 26,
        scale: 0.985,
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: MOTION.scrubStart,
          end: MOTION.scrubEnd,
          scrub: MOTION.scrub,
        },
      });
      return undefined;
    },
  ],

  // THE SYSTEM DIAGRAM draws itself in reading order: each arrow, then the
  // step it points at, stamped down onto the page.
  [
    "[data-diagram]",
    (list) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          end: "top 40%",
          scrub: MOTION.scrub,
        },
      });
      for (const item of list.children) {
        const path = item.querySelector("[data-diagram-path]");
        if (path) {
          tl.fromTo(
            path,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, ease: "none" },
          );
        }
        tl.from(item.querySelector("[data-diagram-node]"), {
          y: -6,
          "--lift": 0,
          duration: 0.5,
          ease: "power3.out",
        });
      }
      return undefined;
    },
  ],

  // PAPER LANDS. Once, not scrubbed, so a card never hangs half-down. The
  // stagger runs in DOM order, which is left to right, so the stairs build.
  [
    "[data-land]",
    (group) => {
      gsap.from(group.children, {
        y: 12,
        "--lift": 0,
        duration: MOTION.land,
        ease: MOTION.arrive,
        stagger: MOTION.step,
        scrollTrigger: { trigger: group, start: MOTION.landAt, once: true },
      });
      return undefined;
    },
  ],

  // A FIGURE COUNTS UP to its real value, once, when it is seen.
  [
    "[data-count]",
    (el) => {
      const text = el.textContent ?? "";
      const decimals = text.split(".")[1]?.length ?? 0;
      const format = (n: number) =>
        n.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      const { copy, remove } = overlay(el);
      const value = { n: 0 };
      copy.textContent = format(0);
      gsap.to(value, {
        n: Number(text.replaceAll(",", "")),
        duration: MOTION.count,
        ease: "power2.out",
        onUpdate: () => {
          copy.textContent = format(value.n);
        },
        onComplete: remove,
        scrollTrigger: { trigger: el, start: MOTION.seenAt, once: true },
      });
      return remove;
    },
  ],

  // AN HOUR CUE'S TIME rolls up from the hour before it.
  [
    "[data-roll]",
    (el) => {
      const time = el.textContent ?? "";
      const before = `${String((Number(time.slice(0, 2)) + 23) % 24).padStart(2, "0")}${time.slice(2)}`;
      const { copy, remove } = overlay(el);
      const reel = document.createElement("span");
      reel.textContent = `${before}\n${time}`;
      copy.append(reel);
      gsap.to(reel, {
        yPercent: -50,
        duration: MOTION.roll,
        ease: MOTION.arrive,
        onComplete: remove,
        scrollTrigger: { trigger: el, start: MOTION.seenAt, once: true },
      });
      return remove;
    },
  ],

  // SCENERY DRIFT. Layers move against the scroll by their `--depth`, so
  // the far hills barely shift and the near shore holds still.
  [
    ".scene [data-layer]",
    (layer) => {
      const travel =
        Number(layer.style.getPropertyValue("--depth")) * MOTION.drift;
      gsap.fromTo(
        layer,
        { y: travel },
        {
          y: -travel,
          ease: "none",
          scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      return undefined;
    },
  ],

  // THE LIGHTHOUSE answers a sent message: its beam sweeps round once from
  // the lamp. It waits for the form's event, so nothing moves until then.
  [
    "[data-beam]",
    (beam) => {
      const sweep = () => {
        gsap.fromTo(
          beam,
          { rotation: 0 },
          {
            rotation: 360,
            svgOrigin: "1290 178",
            duration: MOTION.sweep,
            ease: "power1.inOut",
          },
        );
      };
      document.addEventListener(CONTACT_SENT, sweep);
      return () => document.removeEventListener(CONTACT_SENT, sweep);
    },
  ],

  // THE CAMEL walks only while the page moves: a stride frame per stretch of
  // scroll, and a few steps across the screen over the whole page. Idle
  // scroll means a still camel. At night CSS swaps in the sleeping pose.
  [
    "[data-camel]",
    (camel) => {
      gsap.fromTo(
        camel,
        { x: -MOTION.walk },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: true,
            onUpdate: (self) => {
              camel.dataset.step =
                Math.floor(self.scroll() / MOTION.stride) % 2 ? "b" : "a";
            },
          },
        },
      );
      return () => {
        delete camel.dataset.step;
      };
    },
  ],
];

export function MotionRuntime() {
  useBeforePaint(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups = EFFECTS.flatMap(([selector, effect]) =>
        gsap.utils.toArray<HTMLElement>(selector).map(effect),
      );
      return () => {
        for (const cleanup of cleanups) cleanup?.();
      };
    });

    return () => media.revert();
  }, []);

  return null;
}
