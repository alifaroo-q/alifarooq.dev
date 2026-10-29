import type { Metadata } from "next";
import { ContactFooter } from "@/components/contact-footer";
import { LateScene } from "@/components/late-scenery";
import { SiteHeader } from "@/components/site-header";
import { INTRO_TRANSCRIPT, INTRO_VIDEO } from "@/lib/intro";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL, RESUME_HREF } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Intro",
    description:
      "A short video introduction: who I am, what I have built and what I am looking for.",
    path: "/intro",
  }),
  // Nothing worth indexing until the video is in.
  ...(INTRO_VIDEO ? {} : { robots: { index: false } }),
};

export default function IntroPage() {
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
              Hi, I'm <em className="accent">Ali</em>
            </h1>
            <p className="mt-flow max-w-measure text-[clamp(1.0625rem,1.6vw,1.1875rem)] text-foreground-muted">
              A minute and a half on who I am, what I have built and what I am
              looking for.
            </p>

            <div className="paper mt-group aspect-video w-full max-w-4xl overflow-hidden">
              {INTRO_VIDEO ? (
                <video
                  className="size-full bg-ink"
                  controls
                  playsInline
                  poster={INTRO_VIDEO.poster}
                  preload="metadata"
                  src={INTRO_VIDEO.src}
                >
                  <track
                    default
                    kind="captions"
                    label="English"
                    src={INTRO_VIDEO.captions}
                    srcLang="en"
                  />
                </video>
              ) : (
                <div className="grid size-full place-items-center p-6 text-center">
                  <p className="max-w-[28ch] font-bold font-display text-xl">
                    The video is on its way.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-group flex flex-wrap items-center gap-x-6 gap-y-3">
              <a className="key" href={`mailto:${CONTACT_EMAIL}`}>
                Say hello
              </a>
              <a className="hit ink-link font-semibold" href="/work">
                See the work
              </a>
              <a className="hit ink-link font-semibold" href={RESUME_HREF}>
                Read the resume
              </a>
            </div>

            {INTRO_VIDEO && (
              <details className="mt-group max-w-measure">
                <summary className="hit cursor-pointer font-semibold">
                  Read the transcript
                </summary>
                <div className="mt-flow space-y-4">
                  {INTRO_TRANSCRIPT.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
          <LateScene name="fishMarket" />
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
