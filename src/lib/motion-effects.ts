/**
 * The site's motion, in one place.
 *
 * Markup carries `data-*` hooks and nothing else; `EFFECTS` below is the one
 * table that says what each hook does. A call site never names a duration, a
 * curve or a keyframe. That rule is why this file exists as a runtime rather
 * than as a component per block: a page stays server-rendered markup with
 * attributes on it, and there is one client boundary on the site.
 *
 * The entrance on load (`data-enter`, `data-headline`) is CSS in globals.css,
 * not here: it must start with the first paint, and this file arrives after
 * the page is idle (see `motion-runtime.tsx`).
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
 *
 * And all of it is inside `gsap.matchMedia("(prefers-reduced-motion:
 * no-preference)")`, stated that way round so motion added later is off by
 * default. `matchMedia` reverts every tween it created when the reader turns
 * the preference on, and runs the cleanups the effects return.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CONTACT_SENT } from "@/lib/contact-sent";

gsap.registerPlugin(ScrollTrigger);

/**
 * The scale, named by ROLE and settled once.
 *
 * `arrive` is `--ease-arrive` under another name: GSAP cannot read a CSS
 * curve, so the two have to be edited together.
 *
 * The scrub range ends well before a block leaves the viewport: a range a
 * short page cannot finish strands the last block half-faded with nothing
 * left to scroll.
 */
const MOTION = {
  arrive: "cubic-bezier(0.22, 1, 0.36, 1)",
  land: 0.5,
  /** 70ms a slot. The container decides how many slots there are. */
  step: 0.07,
  scrubStart: "top 92%",
  scrubEnd: "top 75%",
  /** Cards land as they come into view. */
  landAt: "top 88%",
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

type Effect = (el: HTMLElement) => undefined | (() => void);

const EFFECTS: [selector: string, effect: Effect][] = [
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
];

/**
 * SCENERY DRIFT and THE CAMEL. Layers move against the scroll by their
 * `--depth`, so the far hills barely shift and the near shore holds still.
 * The camel walks only while the page moves: a stride frame per stretch of
 * scroll, and a few steps across the screen over the whole page. Idle scroll
 * means a still camel. At night CSS swaps in the sleeping pose.
 *
 * Both arrive after load (`late-scenery.tsx`), so this runs again each time
 * one lands, and only this: the other effects would replay.
 */
let sceneryMedia: gsap.MatchMedia | undefined;

export function startScenery() {
  sceneryMedia?.revert();
  sceneryMedia = gsap.matchMedia();
  sceneryMedia.add("(prefers-reduced-motion: no-preference)", () => {
    for (const layer of gsap.utils.toArray<HTMLElement>(
      ".scene [data-layer]",
    )) {
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
    }

    const camel = document.querySelector<HTMLElement>("[data-camel]");
    if (!camel) return;
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
  });
}

/** Starts every effect and returns the function that stops them all. */
export function startMotion() {
  const media = gsap.matchMedia();
  startScenery();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanups = EFFECTS.flatMap(([selector, effect]) =>
      gsap.utils.toArray<HTMLElement>(selector).map(effect),
    );
    return () => {
      for (const cleanup of cleanups) cleanup?.();
    };
  });

  return () => {
    media.revert();
    sceneryMedia?.revert();
  };
}
