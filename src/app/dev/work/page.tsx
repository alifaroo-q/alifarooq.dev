import { notFound } from "next/navigation";
import { ContactFooter } from "@/components/contact-footer";
import { SiteHeader } from "@/components/site-header";
import { BackLink, WorkCase } from "@/components/work-case";
import { WorkIndex } from "@/components/work-index";
import { ENTRIES } from "@/lib/work";
import { EMPTY, ONE, WORST, WORST_CASE } from "./fixtures";

/**
 * Dev-only: the work index and a case page against the worst case, behind a
 * toggle. `?data=worst|one|empty|case`; no param is the real index. Not found
 * in production.
 */
const STATES = [
  ["demo", "Demo data"],
  ["worst", "Worst case"],
  ["one", "One"],
  ["empty", "Empty"],
  ["case", "Case page"],
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { data = "demo" } = await searchParams;
  const entries =
    data === "worst"
      ? WORST
      : data === "one"
        ? ONE
        : data === "empty"
          ? EMPTY
          : ENTRIES;
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section
          className="hour hour-morning pt-[calc(var(--spacing-header)+4rem)] pb-32"
          data-hour="morning"
        >
          <div className="wrap">
            {data === "case" ? (
              <>
                <div className="mb-10">
                  <BackLink />
                </div>
                <WorkCase job={WORST_CASE} />
              </>
            ) : (
              <h1 className="max-w-[18ch] font-bold text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.035em]">
                Everything I <em className="accent">built</em>
              </h1>
            )}
          </div>
          {data === "case" ? null : <WorkIndex entries={entries} key={data} />}
        </section>
      </main>
      <ContactFooter />
      <nav
        aria-label="Data"
        className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-lg bg-neutral-300 p-1 font-sans text-neutral-900 text-xs"
      >
        {STATES.map(([key, label]) => (
          <a
            aria-current={data === key ? "page" : undefined}
            className={`rounded-md px-3 py-2 ${data === key ? "bg-white shadow" : ""}`}
            href={`?data=${key}`}
            key={key}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
