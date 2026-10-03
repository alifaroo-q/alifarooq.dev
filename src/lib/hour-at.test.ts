import { describe, expect, it } from "vitest";
import { hourAt } from "./hour-at";

const page = [
  { hour: "dawn", top: -2400, bottom: -1200 },
  { hour: "morning", top: -1200, bottom: 420 },
  { hour: "noon", top: 420, bottom: 3000 },
];

describe("hourAt", () => {
  it("names the section under the line, not the first one on the page", () => {
    expect(hourAt(page, 400)).toBe("morning");
  });
  it("hands a boundary to the section that starts there", () => {
    expect(hourAt(page, 420)).toBe("noon");
  });
  it("is undefined when no section crosses the line", () => {
    expect(hourAt(page, 5000)).toBeUndefined();
  });
});
