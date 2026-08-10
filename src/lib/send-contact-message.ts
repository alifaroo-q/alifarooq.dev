import {
  andThen,
  defineError,
  defineErrors,
  type ErrorsOf,
  err,
  fromPromise,
  ok,
  type Result,
} from "@zireal/result-kit";
import { Resend } from "resend";
import type { ContactMessage } from "@/lib/contact";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * The service layer, and the whole of it (#11, #24).
 *
 * `@zireal/result-kit` is scoped to **this call and nothing else**. The one
 * thing on the site that can fail at runtime is the network hop to Resend, so
 * that is the one thing modelled as a value. Content access is not wrapped:
 * the collections are read at build time and a missing document fails
 * `next build`, so wrapping it would model a failure the content pipeline made
 * structurally impossible — a `Result` whose error branch is unreachable is a
 * branch every caller still has to write.
 *
 * Nothing here unwraps. The `Result` leaves this module intact and the Route
 * Handler is the single place it is opened, which is what "exactly one unwrap
 * point" means in practice.
 */

const sendErrors = defineErrors({
  /** Resend answered, and the answer was no. */
  rejected: defineError("send_rejected", "The provider refused the message."),
  /** Resend did not answer — DNS, socket, timeout. */
  unreachable: defineError("send_unreachable", "The provider was unreachable."),
});

export type SendContactMessageError = ErrorsOf<typeof sendErrors>;

/**
 * `From:` is on the sending subdomain, because that is where #4 put the SPF,
 * DKIM and DMARC records. Sending as the inbox address instead means the
 * apex's records have to authorise Resend, which is the arrangement #4 rejected
 * — and mail that fails DMARC is mail that lands in spam.
 *
 * The display name is what appears in the inbox list, so it says which form
 * the message came through rather than who sent it. Who sent it is `Reply-To:`.
 */
const FROM = "alifarooq.dev <contact@send.alifarooq.dev>";

/**
 * Sends one message, and returns whether it went rather than throwing if it
 * did not.
 *
 * The client is built per call rather than at module load. Its constructor
 * throws when the key is missing, and at module scope that turns an unset
 * environment variable into an import-time crash — every page that so much as
 * touches this file, taken down by a variable only this function reads.
 */
export async function sendContactMessage(
  message: ContactMessage,
): Promise<Result<string, SendContactMessageError>> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const sent = await fromPromise(
    resend.emails.send({
      from: FROM,
      to: CONTACT_EMAIL,
      // The second mailbox, on a different provider (#5). The inbox is the
      // system of record and there is no database behind it, so one lost
      // account is the whole archive unless this copy exists.
      bcc: process.env.CONTACT_BCC_EMAIL,
      // Replying from the inbox has to reach the visitor. Without this, a
      // reply goes to the sending subdomain, which nobody reads.
      replyTo: message.email,
      subject: `alifarooq.dev — ${message.name}`,
      text: body(message),
    }),
    () => sendErrors.unreachable(),
  );

  // Resend resolves with `{ data, error }` instead of rejecting, so a refusal
  // arrives on the success side of the promise and has to be moved across.
  return andThen(sent, (response) =>
    response.error ? err(sendErrors.rejected()) : ok(response.data.id),
  );
}

/**
 * Plain text, no HTML. The message is three fields and a reader who is about
 * to reply to it; an HTML part would be a second copy to keep in step, and
 * mail filters trust plain text more.
 */
function body(message: ContactMessage) {
  return [`From: ${message.name} <${message.email}>`, "", message.message].join(
    "\n",
  );
}
