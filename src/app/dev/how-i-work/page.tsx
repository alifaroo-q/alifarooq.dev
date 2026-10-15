import { notFound } from "next/navigation";
import { HowIWork } from "@/components/how-i-work";
import { EMPTY, ONE, WORST } from "./fixtures";

/**
 * Dev-only: the How I work section against the worst case, behind a toggle.
 * `?data=worst|one|empty`; no param is the real copy. Not found in production.
 */
const STATES = [
  ["demo", "Demo data"],
  ["worst", "Worst case"],
  ["one", "One"],
  ["empty", "Empty"],
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { data = "demo" } = await searchParams;
  const content =
    data === "worst"
      ? WORST
      : data === "one"
        ? ONE
        : data === "empty"
          ? EMPTY
          : undefined;
  return (
    <main className="hour hour-noon pt-12 pb-32" id="main">
      <HowIWork content={content} key={data} />
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
    </main>
  );
}
