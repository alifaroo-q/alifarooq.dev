import { match } from "@zireal/result-kit";
import { checkBotId } from "botid/server";
import type { ZodError } from "zod";
import {
  type ContactResponse,
  contactSchema,
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
} from "@/lib/contact";
import { sendContactMessage } from "@/lib/send-contact-message";

/**
 * The contact route — the site's one Route Handler, and its one code seam
 * (#24, #30).
 *
 * It reads the request, so it cannot be prerendered and is not trying to be.
 * Every other route on the site is static.
 *
 * The order below is the cheap checks first: a filled honeypot costs a string
 * comparison, and a BotID verdict costs a round trip to Vercel. Nothing that
 * costs money runs before everything that is free has passed.
 *
 * **This is the one unwrap point.** `sendContactMessage` hands back a
 * `Result`; `match` opens it here and turns each branch into a response. There
 * is no other place in the codebase where a `Result` is opened, which is the
 * whole reason to have the type — the moment two callers unwrap, the error
 * branch is being handled twice and one of them is out of date.
 */
export async function POST(request: Request) {
  const body = await readJson(request);

  if (body === undefined) {
    return json({ ok: false, reason: "invalid", fieldErrors: {} }, 400);
  }

  // The two free checks. Both answer the same way, so nothing in the response
  // says which one fired — see `src/lib/contact.ts`.
  if (isAutomated(body)) return json({ ok: false, reason: "rejected" }, 403);

  if (await isBot()) return json({ ok: false, reason: "rejected" }, 403);

  // The same schema the form validated against, run again. Not because the
  // client is expected to be wrong, but because a Route Handler is reachable
  // without the form and the client's answer is not evidence.
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { ok: false, reason: "invalid", fieldErrors: fieldErrors(parsed.error) },
      400,
    );
  }

  const sent = await sendContactMessage(parsed.data);

  return match(sent, {
    ok: () => json({ ok: true }, 200),
    // Both send failures collapse to one response. The visitor's next move is
    // the `mailto:` either way, and which of Resend's two ways of saying no
    // this was is not something a form can act on. It stays in the platform
    // log, where it can be read.
    err: () => json({ ok: false, reason: "send_failed" }, 502),
  });
}

/**
 * Vercel BotID's verdict, and **it fails open**.
 *
 * `checkBotId()` reaches Vercel, so it can throw — it does so on every request
 * anywhere but a Vercel deployment, and it can do so on Vercel if the bot API
 * fails. Left to throw, that is a 500, and a visitor who has typed a message
 * loses it to an outage in the spam filter.
 *
 * So a check that cannot answer is treated as "not a bot". The cost of being
 * wrong is spam in the inbox, and the other three checks are still standing.
 * The cost the other way is a real message thrown away silently, and the
 * inbox is the system of record.
 */
async function isBot() {
  try {
    return (await checkBotId()).isBot;
  } catch {
    return false;
  }
}

/** Every response the route can give, typed by the contract the form reads. */
function json(payload: ContactResponse, status: number) {
  return Response.json(payload, { status });
}

/**
 * `undefined` for a body that is not JSON, rather than a throw. A malformed
 * body is a bad request, and letting `request.json()` reject would make it a
 * 500 — the site's fault, not the caller's.
 */
async function readJson(request: Request): Promise<Fields | undefined> {
  try {
    const parsed: unknown = await request.json();

    // The cast is the one place the raw body is opened, so every reader below
    // works from a shape rather than from `unknown`. A body that is not an
    // object at all — a bare number, a string, `null` — is not a form
    // submission, and is turned away with the malformed ones.
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Fields)
      : undefined;
  } catch {
    return undefined;
  }
}

/** The posted body, before the schema has had an opinion about it. */
type Fields = Record<string, unknown>;

/**
 * The honeypot and the timing floor.
 *
 * A missing or unreadable elapsed time counts as too fast rather than as
 * unknown. The form always sends one, so the only thing that omits it is
 * something that did not use the form.
 */
function isAutomated(fields: Fields) {
  const honeypot = fields[HONEYPOT_FIELD];

  if (honeypot !== undefined && typeof honeypot !== "string") return true;
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const elapsed = fields[ELAPSED_FIELD];

  return (
    typeof elapsed !== "number" ||
    !Number.isFinite(elapsed) ||
    elapsed < MIN_FILL_MS
  );
}

/**
 * One message per field, keyed by field name.
 *
 * Zod reports every issue it found; the form shows one message per field, so
 * the first issue on each field wins. A second line under one input while the
 * others carry none reads as that field being harder rather than as more
 * detail.
 */
function fieldErrors(error: ZodError) {
  const messages: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in messages)) {
      messages[field] = issue.message;
    }
  }

  return messages;
}
