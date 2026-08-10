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

## Environment variables

| Name | What it is |
| --- | --- |
| `RESEND_API_KEY` | Resend key for the `send.alifarooq.dev` sending domain |
| `CONTACT_BCC_EMAIL` | Second mailbox, on a different provider from the primary inbox |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami Cloud Hobby, EU region |

`.env.example` carries the same list for local work.

## CI

`.github/workflows/ci.yml` runs lint and typecheck on every push to `main`
and every pull request. It deliberately does **not** build: Vercel builds
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
