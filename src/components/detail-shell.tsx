import type { ReactNode } from "react";
import { Arrow } from "@/components/cue";
import { Clouds } from "@/components/scenery";
import { SectionTracking } from "@/components/section-tracking";
import { SiteHeader } from "@/components/site-header";
import { PERSON_NAME } from "@/lib/site";

/**
 * The page shell for the case studies, the open-source write-ups and the stack.
 *
 * It wears the same floating bar as the home page and sits at noon, a calm
 * sky, so a long read has nothing moving behind it but a few clouds. Two
 * columns on a wide screen: the reading column on the left, and on the right
 * a sticky "reference" card (a diagram, or the index of a list) that stays in
 * view while the prose scrolls. On a narrow screen the reference comes first
 * and the prose follows.
 *
 * The `SectionTracking` wrapper is the page's `main`. It dims the parts of the
 * reference that the section on screen does not name; see its own header.
 */
export function DetailShell({
  eyebrow,
  heading,
  standfirst,
  backLabel,
  backHref,
  reference,
  children,
}: {
  eyebrow: string;
  heading: string;
  standfirst: string;
  backLabel: string;
  backHref: string;
  reference: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader name={PERSON_NAME} resumeHref="/resume.pdf" />
      <div className="hour hour-noon">
        <Clouds />
        <div
          className="wrap pt-[calc(var(--spacing-header)+3rem)] pb-14"
          data-enter
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="pill min-h-11 gap-2 px-3.5 py-1.5 font-semibold text-sm"
              href={backHref}
            >
              <Arrow dir={180} /> {backLabel}
            </a>
            <span className="rounded-[1.1rem] border-2 border-ink bg-saffron px-3 py-1 font-medium text-ink text-xs leading-snug">
              {eyebrow}
            </span>
          </div>
          <h1 className="mt-figure max-w-[22ch] font-extrabold text-[clamp(2rem,5.2vw,3.75rem)] leading-[1.06] tracking-[-0.03em]">
            {heading}
          </h1>
          <p className="mt-figure max-w-measure text-[clamp(1.0625rem,1.7vw,1.25rem)] text-foreground-muted leading-[1.6]">
            {standfirst}
          </p>
        </div>
        <SectionTracking
          className="wrap grid grid-cols-1 pb-section lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14"
          id="main"
        >
          <div className="order-2 py-10 lg:order-1 lg:pb-[33svh]">
            <div className="max-w-measure">{children}</div>
          </div>
          <div className="order-1 pt-2 pb-6 lg:order-2">
            <div className="lg:sticky lg:top-header">{reference}</div>
          </div>
        </SectionTracking>
      </div>
    </>
  );
}
