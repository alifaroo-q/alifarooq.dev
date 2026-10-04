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
 * The script is 38 KB and nothing on the page needs it until a form is
 * submitted, which takes a person seconds. So it starts once the page is idle
 * and stays out of the load. It is in place long before a submit.
 */
const start = () =>
  import("botid/client/core").then(({ initBotId }) =>
    initBotId({
      protect: [{ path: "/api/contact", method: "POST" }],
    }),
  );

const whenIdle = () =>
  window.requestIdleCallback
    ? window.requestIdleCallback(start, { timeout: 3000 })
    : window.setTimeout(start, 1000);

if (document.readyState === "complete") whenIdle();
else window.addEventListener("load", whenIdle, { once: true });
