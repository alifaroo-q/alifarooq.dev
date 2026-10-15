import { Cue } from "@/components/cue";
import { LateScene } from "@/components/late-scenery";
import { SiteHeader } from "@/components/site-header";
import { ACTION_CLASS } from "@/lib/site";

/**
 * Any address the site has no page for. It keeps the header, the sky and the
 * way back, so a mistyped link still lands somewhere that reads as the site.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section
          className="hour hour-morning pt-[calc(var(--spacing-header)+4rem)] pb-[calc(var(--scene-h)+6.5rem)]"
          data-hour="morning"
        >
          <div className="wrap">
            <h1 className="max-w-[18ch] font-bold text-[clamp(2.25rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.035em]">
              That page is <em className="accent">not here</em>
            </h1>
            <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.6vw,1.1875rem)] text-foreground-muted">
              The link may be old, or mistyped. The work is where it was.
            </p>
            <div className="mt-figure flex flex-wrap gap-x-6 gap-y-figure">
              <a className={ACTION_CLASS} href="/">
                <Cue label="Back to the start →" />
              </a>
              <a
                className="pill min-h-11 gap-3 px-4 py-2 font-semibold text-sm"
                href="/work"
              >
                <Cue label="See the work →" />
              </a>
            </div>
          </div>
          <LateScene name="fishMarket" />
        </section>
      </main>
    </>
  );
}
