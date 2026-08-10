# Deploy

Vercel Hobby, GitHub integration, production branch `main`. DNS stays at
Cloudflare: Cloudflare Registrar pins the nameservers, so moving DNS to Vercel
would need a registrar transfer.

## Steps that need a person at a dashboard

An agent cannot do these. Work through them once, in order.

1. **Create the Vercel project** on the Hobby plan and connect it to
   `alifaroo-q/alifarooq.dev` through the GitHub integration. Set the
   production branch to `main`.
2. **Add the environment variables** below to Production, Preview and
   Development. Add them even where the value is not known yet — an empty
   variable that exists is easier to fill in than a missing one is to find.
3. **Leave every DNS record DNS-only (grey cloud).** Proxying breaks four
   separate things: Vercel overwrites `X-Forwarded-For`, which kills the
   contact form's IP rate limit; Flexible SSL plus Vercel's 308 is a
   redirect loop; proxied records break certificate issuance, and can break
   renewal silently months later; and analytics collapses every visitor onto
   a handful of Cloudflare edge locations.
4. **Read the apex `A` value and the `www` `CNAME` target off the Vercel
   domain card** at setup time. Do not copy them from any document,
   including this one.
5. **Check CAA records with `dig`, never the dashboard.** Cloudflare adds
   records that the interface does not show.

The apex is canonical and `www` redirects to it with a 308.

## The contact form's four checks

Two of them are in the repo and two are not. Both halves have to be in place
or the form is protected by less than it looks.

In the repo, and covered by `src/app/api/contact/route.test.ts`:

1. **Honeypot** — a `company` field nobody can see and a form-filler fills.
2. **Timing floor** — a submission faster than three seconds from the moment
   the form loaded.

At a dashboard, and nothing in the repo can tell whether they are done:

3. **Vercel BotID.** The package is wired in three places — `next.config.ts`,
   `instrumentation-client.ts` and the route's `checkBotId()`. Basic needs no
   dashboard step and works on Hobby. **Deep Analysis is a paid plan feature
   and is not enabled**: Project → Firewall → Configure is where it would go.
   Outside production `checkBotId()` returns a human verdict and logs a
   warning, so the check is only real once deployed.
4. **One IP-keyed WAF rate-limit rule**, added under Project → Firewall. It
   works only because step 3 in the list above left DNS unproxied — proxied,
   every visitor arrives as a Cloudflare edge IP and the rule keys them all
   together.

## The inbox

One more rule, on the receiving side rather than the sending one:

- **An allowlist filter in the inbox, from day one.** Everything the form
   sends arrives `From: contact@send.alifarooq.dev`, so one rule on that
   address files it where it will be read. Without it the first message from
   a new sending domain is the one that lands in spam, and the inbox is the
   system of record. The `CONTACT_BCC_EMAIL` mailbox needs the same rule.

## Environment variables

| Name | What it is |
| --- | --- |
| `RESEND_API_KEY` | Resend key for the `send.alifarooq.dev` sending domain |
| `CONTACT_BCC_EMAIL` | Second mailbox, on a different provider from the primary inbox |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami Cloud Hobby, EU region |

`.env.example` carries the same list for local work.

## CI

`.github/workflows/ci.yml` runs lint, typecheck and the test suite on every
push to `main` and every pull request. It deliberately does **not** build:
Vercel builds
every push and will not promote a failure, so a second build only doubles
the minutes to re-prove something already blocked on.

`pnpm typecheck` runs `pnpm content` first, and that is load-bearing rather
than tidy. `tsconfig.json` maps the bare specifier `content-collections` at
`.content-collections/generated`, which is generated and gitignored, so a
fresh checkout has no types for it and `tsc` fails on the import in
`src/app/work/[slug]/page.tsx`. CI is always a fresh checkout. This is what
broke the job when the content pipeline landed.

Generating also runs the collection's `transform`, which is where the two
content guarantees live — a missing diagram and a bad frontmatter field both
fail there. So the job keeps those guarantees without being promoted to a
full build. `scripts/generate-content-types.mjs` has to collect the builder's
`_error` events and exit non-zero itself: `build()` resolves on a failed
document and merely drops it, which would leave both guarantees green here
and only red on Vercel.

Promote this job to a full build only if something breaks that lives outside
the collection's `transform`.

The performance and accessibility checks are a **separate** job. They need a
running site, so they run after deploy against the Vercel preview. That job
is not written yet.
