import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ELAPSED_FIELD, HONEYPOT_FIELD, MIN_FILL_MS } from "@/lib/contact";

/**
 * The one test suite on the site (#30).
 *
 * It is driven as **HTTP request in, HTTP response out**. Every test builds a
 * real `Request`, calls the exported handler, and reads a real `Response`. The
 * schema, the spam checks, the service layer and the unwrap all run for real
 * on the way through.
 *
 * **Two things are faked, and both are platform edges rather than code from
 * this repo**: the Resend client and Vercel's BotID check. Each is a call out
 * of the process that a test cannot make, and each is faked at the module
 * boundary — the fake decides what the network says back, not what the route
 * does about it. Nothing written in this repo is stubbed: the schema, the two
 * invisible checks, the service layer and the unwrap all run for real. A suite
 * that stubs the schema tests the stub.
 *
 * `contactSchema` gets no test of its own, deliberately. It is reachable only
 * through this handler and through the form, so testing it separately would
 * pin a shape that nothing in the app can reach on its own. What matters about
 * it is what a bad body does to a response, which is what is asserted below.
 *
 * There are no component tests, no DOM assertions and no snapshots.
 */

const { send, checkBotId } = vi.hoisted(() => ({
  send: vi.fn(),
  checkBotId: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

vi.mock("botid/server", () => ({ checkBotId }));

const BCC = "second-mailbox@example.com";

/** A body that passes every check, so each test can break exactly one thing. */
function validBody() {
  return {
    name: "Dana Okoro",
    email: "dana@example.com",
    message: "We have a payments service that double-captures under retry.",
    [HONEYPOT_FIELD]: "",
    [ELAPSED_FIELD]: MIN_FILL_MS + 5000,
  };
}

async function post(body: unknown) {
  const { POST } = await import("./route");

  return POST(
    new Request("https://alifarooq.dev/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_BCC_EMAIL", BCC);
  send.mockReset();
  send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  checkBotId.mockReset();
  checkBotId.mockResolvedValue({ isBot: false });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("accepts a valid message", async () => {
    const response = await post(validBody());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("copies every message to the second mailbox", async () => {
    await post(validBody());

    // The inbox is the system of record, so it is hardened by a copy on a
    // different provider (#5). If this assertion ever goes, the record is one
    // account lockout from gone.
    expect(send.mock.calls[0][0]).toMatchObject({ bcc: BCC });
  });

  it("sends from the sending subdomain and replies to the submitter", async () => {
    await post(validBody());

    const payload = send.mock.calls[0][0];

    // `From:` has to be on the domain that carries the SPF, DKIM and DMARC
    // records (#4), and `Reply-To:` has to be the visitor — otherwise a reply
    // typed in the inbox goes to the site's own sending address.
    expect(payload.from).toMatch(/@send\.alifarooq\.dev>?$/u);
    expect(payload.replyTo).toBe("dana@example.com");
  });

  describe("rejects an invalid shape", () => {
    it.each([
      ["name", { name: "A" }],
      ["email", { email: "not-an-address" }],
      ["message", { message: "too short" }],
    ])("names the field when %s is wrong", async (field, override) => {
      const response = await post({ ...validBody(), ...override });

      expect(response.status).toBe(400);

      const body = await response.json();

      expect(body.ok).toBe(false);
      expect(body.reason).toBe("invalid");
      expect(Object.keys(body.fieldErrors)).toEqual([field]);
      expect(body.fieldErrors[field]).toEqual(expect.any(String));
      expect(send).not.toHaveBeenCalled();
    });

    it("reports every wrong field at once", async () => {
      const response = await post({
        ...validBody(),
        name: "",
        email: "nope",
        message: "",
      });

      const body = await response.json();

      expect(Object.keys(body.fieldErrors).toSorted()).toEqual([
        "email",
        "message",
        "name",
      ]);
    });

    it("treats a body that is not JSON as invalid", async () => {
      const response = await post("{ not json");

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "invalid",
        fieldErrors: {},
      });
      expect(send).not.toHaveBeenCalled();
    });
  });

  describe("the invisible checks", () => {
    it("rejects a filled honeypot", async () => {
      const response = await post({
        ...validBody(),
        [HONEYPOT_FIELD]: "Acme Corp",
      });

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "rejected",
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("rejects a submission that arrived too fast", async () => {
      const response = await post({
        ...validBody(),
        [ELAPSED_FIELD]: MIN_FILL_MS - 1,
      });

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "rejected",
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("rejects a submission with no elapsed time at all", async () => {
      const { [ELAPSED_FIELD]: _, ...body } = validBody();

      const response = await post(body);

      expect(response.status).toBe(403);
      expect(send).not.toHaveBeenCalled();
    });

    it("rejects a BotID verdict of bot", async () => {
      checkBotId.mockResolvedValue({ isBot: true });

      const response = await post(validBody());

      expect(response.status).toBe(403);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "rejected",
      });
      expect(send).not.toHaveBeenCalled();
    });

    it("lets a message through when the bot check itself fails", async () => {
      // `checkBotId()` throws anywhere but a Vercel deployment, and can throw
      // on one. Failing closed here would lose a real message to an outage in
      // the spam filter, and the honeypot and the timing floor are still
      // standing. See the route for the full argument.
      checkBotId.mockRejectedValue(new Error("VERCEL_OIDC_TOKEN is not set"));

      const response = await post(validBody());

      expect(response.status).toBe(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    it("tells the two rejections apart in no way a caller can read", async () => {
      const honeypot = await post({
        ...validBody(),
        [HONEYPOT_FIELD]: "Acme Corp",
      });
      const timing = await post({
        ...validBody(),
        [ELAPSED_FIELD]: 0,
      });

      expect(honeypot.status).toBe(timing.status);
      await expect(honeypot.json()).resolves.toEqual(await timing.json());
    });
  });

  describe("when the send fails", () => {
    it("turns a rejected send into a failure response", async () => {
      // Resend answers `{ data, error }` rather than throwing, so this is what
      // a refused message actually looks like.
      send.mockResolvedValue({
        data: null,
        error: { name: "validation_error", message: "Domain not verified" },
      });

      const response = await post(validBody());

      expect(response.status).toBe(502);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "send_failed",
      });
    });

    it("turns a thrown send into a failure response, not an unhandled throw", async () => {
      send.mockRejectedValue(new Error("socket hang up"));

      const response = await post(validBody());

      expect(response.status).toBe(502);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        reason: "send_failed",
      });
    });
  });
});
