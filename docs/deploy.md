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

## Analytics

Two counters run side by side. **Umami Cloud Hobby** carries the one question
the site was built to answer, and **Vercel Web Analytics** stays on because it
is free and is the fallback if Umami's free plan turns out to have a cap.

### Steps that need a person at a dashboard

1. **Sign up at `cloud.umami.is/signup`** and verify the email with the
   six-digit code.
2. **Select the EU data region.** It is a mandatory setup step and is not the
   kind of thing to change later, so choose it deliberately. EU is the
   stricter default and costs nothing.
3. **Add `alifarooq.dev` as the website.** The free plan allows exactly one
   website — `www` is a 308 to the apex, so one is enough, but a second domain
   later is a paid step, not a free one.
4. **Copy the website id** off the website's Edit screen into
   `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Production, Preview and Development. The
   repo does not use the tracking-code snippet from that screen — the script
   is rendered by `src/components/analytics.tsx` — but the **host** in the
   snippet is worth a glance. If it is not `cloud.umami.is`, change
   `UMAMI_SCRIPT_URL` in `src/lib/analytics.ts` to match.
5. **Build the funnel**, under the website's Funnel report:

   | Step | Type | Value |
   | --- | --- | --- |
   | 1 | URL | `/` |
   | 2 | URL | `/work/*` |
   | 3 | Event | `contact_reached` |

   Steps must be completed in this order, and navigation in between does not
   break the sequence.

6. **Set the funnel `Window` to 30 minutes.** It is a required field — the
   longest gap allowed between two steps — and it is a real decision, so here
   is the reasoning rather than the number alone. The sequence is one sitting:
   land on the home page, open a case study, read it, reach the foot. The case
   studies are long-form and a careful read is ten to fifteen minutes, so
   anything under twenty would drop the readers the funnel most wants to
   count. Thirty covers a full read and a pause, and still excludes the tab
   left open until tomorrow, which is not the same visitor arriving at a
   decision.

7. **Walk the funnel once by hand** on the deployed site — home, then a case
   study, then scroll to the contact section — and check all three steps
   report. The Hobby plan has **no API**, so the dashboard is the only place
   these numbers can be read, and this walk-through is the only verification
   there is.

### What is in the repo

- `src/lib/analytics.ts` — the script URL and `trackContactReached()`.
- `src/components/analytics.tsx` — both scripts, in the root layout.
- `src/components/contact-form-slot.tsx` — the `IntersectionObserver` that
  hydrates the form and fires `contact_reached`. One observer, two targets: a
  lead box a viewport above the slot starts the download, and the slot itself
  reports contact as reached. The event carries the page it fired on, without
  which the funnel cannot tell a reader who arrived at contact from a case
  study apart from one who scrolled past it on the home page. If the tracker
  has not arrived yet — a reload parked at the footer, or a `#contact` link
  followed straight in — the event waits up to three seconds for it rather
  than being dropped.

**No event is tested.** They are fire-and-forget, there is no readable result,
and the free tier has no API to read them back.

### No consent banner

The reasoning is **no device access** under ePrivacy Art. 5(3), not "no
cookies" and not Umami's own weaker claim. Umami's tracker writes nothing to
the device — it reads one opt-out key, `umami.disabled`, that only a site
owner sets — and Vercel derives its identifier server-side and discards it
after 24 hours.

**The flip condition:** the day anything writes an analytics id to
`localStorage`, this decision is void and a banner is owed. That includes a
tracker upgrade that turns caching on.

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
