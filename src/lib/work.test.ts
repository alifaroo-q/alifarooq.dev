import { describe, expect, it } from "vitest";
import {
  CASES,
  ENTRIES,
  FLAGSHIPS,
  findCase,
  SMALL_JOBS,
  slugOf,
  stackTools,
  workHref,
} from "./work";

describe("work", () => {
  it("gives every job with a page its own slug", () => {
    const slugs = CASES.map(slugOf);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const job of CASES) {
      expect(findCase(slugOf(job))).toBe(job);
    }
  });

  it("finds nothing for a slug that has no page", () => {
    expect(findCase("billys")).toBeUndefined();
    expect(findCase("job-hcpa-voice-agent")).toBeUndefined();
  });

  it("lists every job once in the index, flagships first", () => {
    expect(ENTRIES).toHaveLength(CASES.length + SMALL_JOBS.length);
    expect(ENTRIES.slice(0, FLAGSHIPS.length).map((e) => e.id)).toEqual(
      FLAGSHIPS.map((f) => f.id),
    );
    expect(new Set(ENTRIES.map((e) => e.id)).size).toBe(ENTRIES.length);
  });

  it("links a job with a page to /work/<slug> and one without to its row", () => {
    expect(workHref("job-hcpa-voice-agent")).toBe("/work/hcpa-voice-agent");
    expect(workHref("job-billys")).toBe("/work#job-billys");
  });

  it("throws on an id that is not a project", () => {
    expect(() => workHref("job-nope")).toThrow();
  });
});

describe("stackTools", () => {
  it("splits on commas and keeps a parenthesised group whole", () => {
    expect(
      stackTools("NestJS, Postgres, AWS (ECS Fargate, RDS), Next.js"),
    ).toEqual(["NestJS", "Postgres", "AWS (ECS Fargate, RDS)", "Next.js"]);
  });
});
