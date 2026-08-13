"use client";

/**
 * The site's motion, in one place.
 *
 * It reads the SAME hooks the CSS used to read — `data-enter` on a container
 * whose children arrive in reading order, `data-reveal` on a block that
 * arrives on scroll, `.section-rule` on the hairline that draws out from a
 * section label, `data-headline` on the one heading that arrives a word at a
 * time. Nothing at a call site changed, and nothing at a call site names a
 * duration, a curve or a keyframe. That rule is why this file exists as a
 * runtime rather than as a component per block: a page stays server-rendered
 * markup with attributes on it, and there is one client boundary on the site.
 *
 * WHY GSAP AND NOT THE CSS IT REPLACES. The reveals were scrubbed against
 * `animation-timeline: view()`, which is the behaviour worth keeping — a block
 * follows the reader's thumb and runs backwards when they scroll back up. The
 * property is not in Safari or Firefox, so most readers got no reveal at all
 * and the `@supports` guard was doing the work of hiding that. ScrollTrigger
 * scrubs the same way in every browser. It also buys the one thing the CSS had
 * no way to express: a timeline, where each word of the name starts before the
 * one before it has finished.
 *
 * THE THREE RULES ARE UNCHANGED, and they are still correctness rules:
 *
 * - NOTHING STARTS HIDDEN UNLESS IT CAN BE SHOWN AGAIN. Every hidden state
 *   here is set FROM JavaScript, by `gsap.from`. A browser that never runs
 *   this file gets the finished page, so the old `@supports` guard has nothing
 *   left to guard.
 * - ONLY `opacity`, `y` AND `scale`. All three compose, so a reveal costs no
 *   layout and no paint on any frame of a scroll.
 * - MOTION SETS NO COLOUR. A colour written here would beat the variables a
 *   row flip redefines and strand part of the subtree on the wrong ground.
 *
 * And all of it is inside `gsap.matchMedia("(prefers-reduced-motion:
 * no-preference)")` — stated that way round, so motion added later is off by
 * default rather than off if somebody remembered. `matchMedia` reverts every
 * tween it created when the reader turns the preference on, which is the half
 * a `reduce` block cannot do.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The scale, and it is the spacing scale's habit: named by ROLE, settled once,
 * never picked at a call site.
 *
 * `arrive` is `--ease-arrive` under another name — GSAP cannot read a CSS
 * curve, so the same four control points are written here and the two have to
 * be edited together. `rise` is steeper, and only the headline uses it: a word
 * travelling its own height needs to be slowing down for most of the trip or
 * it reads as a slide.
 *
 * The scrub range is the old `entry 5% entry 55%` translated. It ends well
 * before the block leaves the viewport for the reason the CSS gave: a range a
 * short page cannot finish strands the last block half-faded with nothing left
 * to scroll. `top 55%` is passed by anything shorter than the viewport on its
 * way up.
 */
const MOTION = {
  arrive: "cubic-bezier(0.22, 1, 0.36, 1)",
  rise: "power4.out",
  enter: 0.52,
  headline: 0.9,
  /** Four slots at 70ms, which is what the CSS staggered. */
  step: 0.07,
  scrubStart: "top 92%",
  scrubEnd: "top 55%",
  /** Seconds of catch-up. Enough to smooth a trackpad, short enough to track. */
  scrub: 0.4,
};

export function MotionRuntime() {
  useBeforePaint(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      // THE HEADLINE. One timeline, two overlapping tweens on one clock: the
      // rise and the fade start together and end apart, so a word is already
      // legible while it is still travelling. Three delays kept in step by
      // hand is the thing the CSS could only approximate.
      const words = gsap.utils.toArray<HTMLElement>(
        "[data-headline] [data-word]",
      );
      if (words.length > 0) {
        gsap
          .timeline()
          .from(words, {
            yPercent: 110,
            duration: MOTION.headline,
            ease: MOTION.rise,
            stagger: MOTION.step,
          })
          .from(
            words,
            { opacity: 0, duration: 0.5, stagger: MOTION.step },
            "<",
          );
      }

      // ARRIVING ON LOAD. The hook is on the CONTAINER and the children take
      // their delay from their position in it, for the reason the measure
      // lives on a container: a delay written on one block is a delay the next
      // block can forget, and the forgetting is silent.
      for (const container of gsap.utils.toArray<HTMLElement>("[data-enter]")) {
        gsap.from(Array.from(container.children), {
          opacity: 0,
          y: 18,
          duration: MOTION.enter,
          ease: MOTION.arrive,
          stagger: MOTION.step,
        });
      }

      // ARRIVING ON SCROLL. Scrubbed, so it runs ON the scroll rather than
      // alongside it and cannot drift out of step with the reader's thumb.
      for (const block of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
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
      }

      // The section rule draws out from under its label rather than fading in
      // with it. It is `data-reveal`'s sibling and this is the one place the
      // two are worth splitting: a hairline that grows out of a word reads as
      // the word underlining itself.
      for (const rule of gsap.utils.toArray<HTMLElement>(".section-rule")) {
        gsap.from(rule, {
          scaleX: 0,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: rule,
            start: MOTION.scrubStart,
            end: MOTION.scrubEnd,
            scrub: MOTION.scrub,
          },
        });
      }
    });

    return () => media.revert();
  }, []);

  return null;
}
