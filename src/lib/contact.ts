import { z } from "zod";

/**
 * The contact form's contract, in one place.
 *
 * **One schema, two readers.** The form validates against `contactSchema` and
 * so does the Route Handler — the same object, imported twice, not two schemas
 * that happen to agree (#11, #24). Two schemas that agree are two schemas that
 * agree *today*: the next field added to one of them is a client that posts a
 * body the server rejects, with no compile step in between to say so.
 *
 * The messages are the ones a visitor reads next to the field they got wrong
 * (#24, story 30), so they say what the field wants rather than naming a rule.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "A name, so a reply can be addressed to someone.")
    .max(80, "Shorter than 80 characters."),
  email: z
    .email("An address a reply can actually reach.")
    .max(160, "Shorter than 160 characters."),
  message: z
    .string()
    .trim()
    .min(20, "A little more than this — 20 characters at least.")
    .max(4000, "Shorter than 4000 characters."),
});

export type ContactMessage = z.infer<typeof contactSchema>;

// The two spam checks the handler runs itself, and the reason they are not
// fields on the schema above.
//
// Neither is a rule about a *message*. The schema says what a readable message
// looks like, and a visitor who trips one of its rules is shown what to fix.
// These two say what an automated submission looks like, and nothing about
// them is ever shown: a bot that learns which check caught it is a bot that
// gets past the next one. Folding them into `contactSchema` would put a rule
// with no field and no message next to three that have both.
//
// They are the cheap half of #24's four invisible checks. Vercel BotID is the
// third, and the WAF rate-limit rule is the fourth and lives outside the repo.
// All four are invisible on purpose — a Turnstile challenge can show a real
// human a checkbox, which is the one thing #24 ruled out (story 36).

/**
 * The honeypot. A field a person never sees and a form-filler always fills.
 *
 * It is named for something plausible rather than `honeypot`, because the
 * name is the whole trick: a bot reads the name and decides the field is
 * worth completing.
 */
export const HONEYPOT_FIELD = "company";

/**
 * The floor on how long a submission may take, in milliseconds.
 *
 * Three seconds is under what it takes to type the 20-character minimum above,
 * and far over what a script spends. The number is deliberately loose — the
 * cost of a false positive here is a real message silently refused, and this
 * check is one of four rather than the only one.
 */
export const MIN_FILL_MS = 3000;

/** The name of the elapsed-time value the form posts alongside the message. */
export const ELAPSED_FIELD = "elapsedMs";

/**
 * What the Route Handler answers, and the only thing the form knows about it.
 *
 * Every rejection that is not a validation failure collapses to one shape and
 * one status. A honeypot hit, a submission that arrived too fast and a BotID
 * verdict are indistinguishable in the response on purpose.
 */
export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid";
      /** Keyed by field name, so the form can put each message where it belongs. */
      fieldErrors: Partial<Record<keyof ContactMessage, string>>;
    }
  | { ok: false; reason: "rejected" }
  | { ok: false; reason: "send_failed" };
