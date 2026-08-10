import { allCaseStudies } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtifactFigure } from "@/components/artifact-figure";
import { ContactFooter } from "@/components/contact-footer";
import { DetailShell } from "@/components/detail-shell";
import { MdxContent } from "@/components/mdx-content";

// Every case study is known at build time, so every one of them is prerendered
// and nothing else is reachable: `dynamicParams = false` 404s an unknown slug
// with no runtime render, and `dynamic = "error"` makes an accidental dynamic
// read a build failure rather than a silent switch to server rendering (#3).
export const dynamicParams = false;
export const dynamic = "error";

export function generateStaticParams() {
  return allCaseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

function findCaseStudy(slug: string) {
  return allCaseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = findCaseStudy(slug);

  if (!caseStudy) return {};

  // `decision` is the heading, the h1 and the title — one string, so the tab
  // and the page cannot drift (#9).
  return {
    title: caseStudy.decision,
    description: caseStudy.description,
    alternates: { canonical: `/work/${caseStudy.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = findCaseStudy(slug);

  if (!caseStudy) notFound();

  return (
    <>
      <DetailShell
        backHref="/#work"
        backLabel="Work"
        eyebrow={caseStudy.sector}
        heading={caseStudy.decision}
        reference={
          <ArtifactFigure
            artifactLabel={caseStudy.artifactLabel}
            svg={caseStudy.artifactSvg}
          />
        }
        standfirst={caseStudy.constraint}
      >
        <MdxContent code={caseStudy.body} />
      </DetailShell>

      {/* Compact, because this is the end of an argument the reader followed
          on purpose — #8 called it the highest-intent moment on the site, and
          the thing it needs least is another introduction. */}
      <ContactFooter compact />
    </>
  );
}
