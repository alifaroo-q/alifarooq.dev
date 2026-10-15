import { describe, expect, it } from "vitest";
import { characterCount, contactSchema, MESSAGE_MAX } from "./contact";

const base = { name: "Jo Lee", email: "jo@example.com" };

describe("characterCount", () => {
  it("counts an emoji and a ZWJ sequence as one character", () => {
    expect(characterCount("🚚")).toBe(1);
    expect(characterCount("👩🏽‍💻")).toBe(1);
    expect(characterCount("Ólafur")).toBe(6);
  });
});

describe("contactSchema message limit", () => {
  it("accepts 4000 emoji, which are 8000 UTF-16 units", () => {
    const message = "🚚".repeat(MESSAGE_MAX);
    expect(contactSchema.safeParse({ ...base, message }).success).toBe(true);
  });

  it("refuses one past the limit, with the message the form shows", () => {
    const message = "a".repeat(MESSAGE_MAX + 1);
    const result = contactSchema.safeParse({ ...base, message });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Shorter than 4000 characters.",
    );
  });
});
