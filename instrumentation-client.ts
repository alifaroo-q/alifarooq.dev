import { initBotId } from "botid/client/core";

/**
 * Vercel BotID, client half (#24, #30).
 *
 * The third of the four invisible checks, and the only one that costs
 * anything. It is invisible on purpose: BotID Basic classifies without ever
 * showing a challenge, which is what ruled Turnstile out as the default — its
 * Managed mode can put a checkbox in front of a real human (#24, story 36).
 *
 * The path list is exact, and a route missing from it is a route BotID never
 * scores. `checkBotId()` in the handler logs a loud warning when it is asked
 * about a path that is not protected here, which is the only thing that makes
 * the mistake findable.
 *
 * `instrumentation-client.ts` runs before the app's own code, so the script is
 * in place before any form can be submitted.
 */
initBotId({
  protect: [{ path: "/api/contact", method: "POST" }],
});
