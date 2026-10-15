import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactFooter } from "@/components/contact-footer";
import { LateScene } from "@/components/late-scenery";
import { SiteHeader } from "@/components/site-header";
import { BackLink, NextCase, WorkCase } from "@/components/work-case";
import { pageMetadata } from "@/lib/metadata";
import {
  CASES,
  caseHref,
  caseSub,
  caseTitle,
  findCase,
  slugOf,
} from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((job) => ({ slug: slugOf(job) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = findCase((await params).slug);
  if (!job) {
    return {};
  }
  return pageMetadata({
    title: `${caseTitle(job)}, ${caseSub(job)}`,
    description: job.result,
    path: caseHref(job),
  });
}

export default async function CasePage({ params }: Props) {
  const job = findCase((await params).slug);
  if (!job) {
    notFound();
  }
  const next = CASES[(CASES.indexOf(job) + 1) % CASES.length];
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section
          className="hour hour-morning pt-[calc(var(--spacing-header)+2rem)] pb-[calc(var(--scene-h)+6.5rem)] md:pb-[calc(var(--scene-h)*0.8+6rem)]"
          data-hour="morning"
        >
          <div className="wrap">
            <div className="mb-10">
              <BackLink />
            </div>
            <WorkCase job={job} />
            <NextCase next={next} />
          </div>
          <LateScene name="fishMarket" />
        </section>
      </main>
      <ContactFooter />
    </>
  );
}
