"use client";

import { useEffect, useState } from "react";
import { Arrow } from "@/components/cue";
import { Built, LABEL, Meta, Quote } from "@/components/work-parts";
import type { Entry } from "@/lib/work";

/**
 * The work index: every project as a row, and beside the list a card that
 * previews the row the pointer or focus is on. A row is a link, so the preview
 * is an extra and not the only way to the detail. Below 1024px there is no
 * room for it, so each row carries its result line instead.
 */
function Preview({ entry }: { entry: Entry }) {
  const job = entry.job;
  return (
    <div className="paper flex flex-col p-8">
      {job ? (
        <Meta job={job} />
      ) : (
        <p className={LABEL}>
          {entry.sub} · {entry.years}
        </p>
      )}
      <p className="mt-2 font-bold font-display text-4xl leading-none tracking-[-0.03em]">
        {entry.title}
      </p>
      <p className="mt-1 text-foreground-muted">{entry.sub}</p>
      <p className="mt-5 font-serif text-xl italic leading-snug">
        {entry.result}
      </p>
      {job ? (
        <>
          <p className="mt-5 text-foreground-muted">{job.about}</p>
          <div className="mt-4 text-foreground-muted text-sm">
            <Built built={job.built} />
          </div>
          <p className="mt-4 font-mono text-foreground-muted text-xs">
            {job.stack}
          </p>
          <Quote className="mt-5" job={job} />
        </>
      ) : null}
      {entry.href ? (
        <p className="mt-6 font-semibold text-accent">
          {job ? "Open the case study" : "Open on GitHub"}{" "}
          <Arrow className="inline" />
        </p>
      ) : (
        <p className="mt-6 text-foreground-muted text-sm">
          A small job. It has no page of its own.
        </p>
      )}
    </div>
  );
}

function Row({ entry }: { entry: Entry }) {
  const inner = (
    <>
      <span className="flex items-baseline justify-between gap-4 px-2">
        <span className="font-bold font-display text-xl tracking-tight">
          {entry.title}{" "}
          <span className="font-normal text-foreground-muted text-sm">
            {entry.sub}
          </span>
        </span>
        <span className={LABEL}>{entry.years}</span>
      </span>
      <span className="mt-1 block px-2 text-foreground-muted text-sm lg:sr-only">
        {entry.result}
      </span>
    </>
  );
  return entry.href ? (
    <a className="block py-3" href={entry.href}>
      {inner}
    </a>
  ) : (
    <div className="py-3">{inner}</div>
  );
}

export function WorkIndex({ entries }: { entries: readonly Entry[] }) {
  const [activeId, setActiveId] = useState(entries[0].id);
  const active = entries.find((e) => e.id === activeId) ?? entries[0];

  // A link to `/work#job-x` lands on its row, so the preview follows the hash.
  // It runs after hydration, since the server cannot see the hash.
  useEffect(() => {
    const follow = () => {
      const id = window.location.hash.slice(1);
      if (entries.some((e) => e.id === id)) {
        setActiveId(id);
      }
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [entries]);
  return (
    <div className="wrap mt-group grid items-start gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <ul>
        {entries.map((entry) => (
          <li
            className={`border-ink border-t-2 last:border-b-2 ${entry.id === activeId ? "bg-paper" : ""}`}
            id={entry.id}
            key={entry.id}
            onFocus={() => setActiveId(entry.id)}
            onMouseEnter={() => setActiveId(entry.id)}
          >
            <Row entry={entry} />
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="sticky top-28 hidden lg:block">
        <Preview entry={active} />
      </div>
    </div>
  );
}
