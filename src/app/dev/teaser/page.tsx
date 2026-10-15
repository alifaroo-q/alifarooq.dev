import { notFound } from "next/navigation";
import { Cue } from "@/components/cue";
import { NextCase } from "@/components/work-case";
import { WorkTeaser } from "@/components/work-teaser";
import { CASES } from "@/lib/work";
import { COMPOUND, CUE_LABELS, EMPTY, LONG, ONE, WORST } from "./fixtures";

/**
 * Dev-only: the home work teaser, the case page's "Next" pill and the `Cue`
 * label parser against the worst case, behind a toggle. `?data=worst|one|empty`;
 * no param is the real flagships. Not found in production.
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
  const flagships =
    data === "worst"
      ? WORST
      : data === "one"
        ? ONE
        : data === "empty"
          ? EMPTY
          : undefined;
  const total = flagships ? 40 : undefined;
  const next = data === "worst" ? COMPOUND : data === "one" ? LONG : CASES[0];
  return (
    <main className="hour hour-morning pt-12 pb-32" id="main">
      <WorkTeaser flagships={flagships} total={total} key={data} />
      <div className="wrap">
        <NextCase next={next} />
        <ul className="mt-section grid gap-3">
          {CUE_LABELS.map((label) => (
            <li key={label}>
              <a className="ink-link font-semibold" href="#main">
                <Cue label={label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
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
