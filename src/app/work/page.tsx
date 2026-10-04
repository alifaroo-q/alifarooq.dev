import type { Metadata } from "next";
import { ContactFooter } from "@/components/contact-footer";
import { LateScene } from "@/components/late-scenery";
import { SiteHeader } from "@/components/site-header";
import { WorkIndex } from "@/components/work-index";
import { pageMetadata } from "@/lib/metadata";
import { ENTRIES } from "@/lib/work";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Everything I built: two AI systems, client products at Zenkoders, and a few things of my own.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section
          className="hour hour-morning pt-[calc(var(--spacing-header)+4rem)] pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="morning"
        >
          <div className="wrap">
            <h1 className="max-w-[18ch] font-bold text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.035em]">
              Everything I <em className="accent">built</em>
            </h1>
            <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.6vw,1.1875rem)] text-foreground-muted">
              {ENTRIES.length} projects since August 2024. Client work at
              Zenkoders, and a few things of my own.
            </p>
          </div>
          <WorkIndex entries={ENTRIES} />
          <LateScene name="fishMarket" />
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
