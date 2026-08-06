# Contact form and analytics for `alifarooq.dev`

**Ticket:** [#5](https://github.com/alifaroo-q/alifarooq.dev/issues/5) (`wayfinder:research`)
**Researched:** 2026-08-07
**Depends on:** [#4 — Cloudflare DNS in front of Vercel](./cloudflare-vercel-dns.md) (apex canonical, every record
DNS-only / grey cloud, no proxying)
**Status:** Actionable as written. Every claim is cited to a first-party source (vendor docs, vendor
pricing pages, EUR-Lex, or bytes fetched directly off the vendor's own CDN). Composed conclusions
are tagged **[INFERENCE]**. Gaps are in §9.

---

## 1. Recommendation

- **Form:** a **Vercel route handler + [Resend](https://resend.com/pricing)**, sending from a
  `send.alifarooq.dev` subdomain to one mailbox you own. Free tier is 3,000 emails/month and 100/day
  — roughly two orders of magnitude more than "tens of submissions a year" needs.
- **Spam:** **honeypot field + minimum-fill-time check + Vercel BotID (Basic) + a WAF rate-limit rule
  keyed on IP.** All four are completely invisible to a human. No Turnstile, no CAPTCHA.
- **Retention:** **the inbox is the system of record**, hardened by (a) `Reply-To:` the submitter,
  (b) a **BCC to a second mailbox on a different provider**, and (c) Resend's 30-day log as a
  short-window recovery net. No database, no Blob.
- **Analytics:** **Umami Cloud (free Hobby plan)** — 2.3 KB gzipped, no cookies, and it is the only
  free option here with a documented **funnel report** that takes URLs *and* custom events as ordered
  steps, which is exactly the home → case study → contact question. Optionally keep **Vercel Web
  Analytics** on alongside it for free as a sanity check on totals.
- **Consent banner:** **not required** — see §7 for the actual reasoning, which is not "no cookies
  therefore no consent".
- **Year one cost: $0.** Every component above sits inside a permanent free tier at this traffic
  level. Plainly: you do not need to pay for any of this.

---

## 2. Form: the options

### 2.1 Route handler + email API

| Provider | Free tier | First paid tier | Deliverability posture, brand-new domain | DNS records required |
|---|---|---|---|---|
| **Resend** | **"3,000"** emails/mo, **"limited to 100 emails per day"**, **"1 domain"**, **"30-day data retention"** ([pricing](https://resend.com/pricing)) | $20/mo for 50,000 ([pricing](https://resend.com/pricing)) | Sends over Amazon SES infrastructure (its own SPF example is `v=spf1 include:amazonses.com ~all`); explicitly recommends subdomain isolation ([domains](https://resend.com/docs/dashboard/domains/introduction)) | MX + SPF TXT on `send`, DKIM TXT on `resend._domainkey`, DMARC TXT on `_dmarc` ([Cloudflare guide](https://resend.com/docs/dashboard/domains/cloudflare), [DMARC](https://resend.com/docs/dashboard/domains/dmarc)) |
| **Postmark** | **"100 emails/month"** with no expiration ([pricing](https://postmarkapp.com/pricing)) | $15/mo Basic, 10,000/mo ([pricing](https://postmarkapp.com/pricing)) | Strongest transactional reputation of the four; enforces separate transactional/broadcast streams. Retains **"45 days"** of full message content by default, extendable **"up to 365 days"** from $5/mo ([pricing](https://postmarkapp.com/pricing)) | DKIM TXT + Return-Path CNAME — hostname default **"`pm_bounces`"**, value **"`pm.mtasv.net`"** ([verify a domain](https://postmarkapp.com/support/article/1046-how-do-i-verify-a-domain)) |
| **Amazon SES** | New-account credits only: **"up to $200 in AWS Free Tier credits"**, free plan runs **"6 months after account creation"** ([pricing](https://aws.amazon.com/ses/pricing/)) | À la carte **"$0.10 / 1,000 emails"** ([pricing](https://aws.amazon.com/ses/pricing/)) | Cheapest per unit by a wide margin, but you own the sandbox-exit request, the reputation dashboard, and the bounce/complaint handling | SPF, DKIM (3 CNAMEs via Easy DKIM), MAIL FROM MX+SPF, DMARC |
| **Mailgun** | **"$0/mo"** with **"100 emails/day included"** ([pricing](https://www.mailgun.com/pricing/)) | **"$15/mo"** Basic, **"10,000 emails/mo included"** ([pricing](https://www.mailgun.com/pricing/)) | Comparable to SES in posture; shared-IP pools on low tiers | SPF, DKIM TXT, tracking CNAME, MX pair for the sending subdomain |

**Every one of these free tiers is enormous relative to the requirement.** Tens of submissions per
year is ~2–3 emails per month. Even Postmark's 100/month free plan — the tightest free tier in the
table — leaves 97% headroom. Cost is not a differentiator here; nothing else should be decided by it.

**Why Resend over Postmark.** Postmark is the better pure-deliverability product and its 45-day
message archive is a genuinely useful second copy (§4). Resend wins on three things that matter more
in this specific shape:

1. **First-party Next.js ergonomics.** A route handler calling `resend.emails.send()` is four lines.
   No SMTP, no stream configuration, no approval queue before the first send.
2. **Headroom that never has to be revisited.** 3,000/month vs 100/month. If the form is ever reused
   for a newsletter confirmation, an OSS-page enquiry, or anything else, Resend does not need a
   plan change.
3. **The DNS shape is simpler under the #4 constraint.** Resend needs one MX and three TXT records
   on a subdomain, all DNS-only by type. Postmark's Return-Path is a **CNAME**, which in Cloudflare
   is a proxiable record type that must be explicitly grey-clouded — one more place to get #4's
   "everything DNS-only" rule wrong.

**Deliverability from a zero-reputation domain — the honest framing.** The usual new-domain
deliverability anxiety is about *bulk* sending to *strangers*. This form does neither. It sends
**one message, to one mailbox that you own and control**, a handful of times a year. **[INFERENCE]**
Composing (a) Resend's own recommendation that you *"send your emails from one or more subdomains…
instead of your root domain to isolate your sending reputation"*
([domains](https://resend.com/docs/dashboard/domains/introduction)) with (b) the fact that the sole
recipient is a mailbox you administer: the residual risk is not "will it be delivered" but "will it
be spam-foldered on first receipt", and that is fixable in thirty seconds with a receiving-side
filter rule that allowlists `From: *@send.alifarooq.dev`. Do that on day one, before the first real
submission.

Three sending rules that matter more than the provider choice:

- **`From:` is always your own domain** — e.g. `Contact form <form@send.alifarooq.dev>`. Never the
  submitter's address; that is a forged `From:` and will fail your own DMARC.
- **`Reply-To:` is the submitter's address.** This is what makes the inbox usable: hit reply and you
  are talking to the recruiter directly, from your real mail account, with its own established
  reputation. The transactional provider is never in the reply path.
- **Publish DMARC at `p=none` first.** Resend's own guidance is to start at
  `"v=DMARC1; p=none; rua=mailto:dmarcreports@example.com;"` and that it is *"best practice to use
  `quarantine` or `reject`, but only do this once you know your messages are delivering and fully
  passing DMARC"* ([DMARC](https://resend.com/docs/dashboard/domains/dmarc)).

### 2.2 Hosted form services

| Service | Free tier | Where submissions live | Notes |
|---|---|---|---|
| **Web3Forms** | **"250 submissions per month"** ([web3forms.com](https://web3forms.com/)) | **"securely stored for 30 days (free plans) or 1 year (pro plans)"**, on AWS, **"encrypted at rest"** ([web3forms.com](https://web3forms.com/)) | No account key secrecy needed — *"The Access Key is not a secret API Key. it can be Public"*. Ships a documented honeypot (`name="botcheck"`). Says *"We are GDPR friendly"* but does not commit to an EU region |
| **Formspree** | **"50 per month on the Free tier"**, unlimited forms, up to two notification emails, **30 days** submission history ([account limits](https://help.formspree.io/articles/account-management/account-limits)) | Formspree-hosted, 30-day archive on free; paid plans get *"longer data retention, file upload storage"* ([account limits](https://help.formspree.io/articles/account-management/account-limits)) | US company; residency not stated on the limits page |
| **Basin** | **1 form**, **50 submissions/mo**, **30-day** data retention, 100MB files ([pricing](https://usebasin.com/pricing)) | Basin-hosted | Cheapest paid tier $12.50/mo. Publishes a `/gdpr` page but the pricing page does not state server location |
| **Netlify Forms** | — | Netlify-hosted | **Not usable here.** Netlify Forms works by scanning *Netlify deploys*: *"Starting with your next site deploy, Netlify will automatically scan your deploys for forms that require submission handling"* ([setup](https://docs.netlify.com/manage/forms/setup/)). The site deploys to Vercel, so there is no Netlify deploy to scan. Ruled out on mechanics, not on price |

**Why not a hosted form service.** They are genuinely fine, and Web3Forms in particular is a
defensible zero-effort answer (250/mo free, honeypot built in, no DNS at all). Three reasons the
route handler wins:

1. **Spam control is yours.** With a hosted service you get whatever spam filtering the vendor ships.
   With a route handler you compose honeypot + timing + BotID + IP rate limiting (§3) and can tune
   any of them. #4's decision to leave every record unproxied is what makes the IP-keyed layer work
   at all — that is a capability paid for in ticket #4 and it would be wasted here.
2. **No third party in the data path.** A hosted form service is a processor holding recruiter names
   and email addresses for 30 days in an unspecified region. The route handler keeps the data in
   exactly two places you already control: Resend's 30-day log and your mailbox.
3. **The DNS work is not avoided anyway.** You will want SPF/DKIM/DMARC on the domain regardless, the
   moment you send any mail as `@alifarooq.dev`.

---

## 3. Spam protection with no user-facing CAPTCHA

Sorted by how invisible each is to a real human.

| Technique | Genuinely invisible to a human? | Cost | Notes |
|---|---|---|---|
| **Honeypot field** | **Yes, fully.** Zero network cost, zero render cost | $0 | A visually hidden input a human never focuses. Web3Forms ships exactly this pattern: `<input type="checkbox" name="botcheck" class="hidden" style="display: none;">` ([web3forms.com](https://web3forms.com/)). Hide with CSS off-screen positioning, not `display:none` alone, and label it plausibly (`company`, `website`) so naive bots fill it |
| **Timing / minimum fill duration** | **Yes, fully** | $0 | Stamp a signed timestamp into the form at render, reject submissions faster than ~3s. Purely server-side judgement, no user-visible surface |
| **Vercel BotID (Basic)** | **Yes** — Vercel calls it *"an invisible CAPTCHA that protects against sophisticated bots without showing visible challenges or requiring user action"* ([BotID](https://vercel.com/docs/botid)) | **Free.** *"Basic … is provided free of charge for all plans"* ([BotID](https://vercel.com/docs/botid)) | Client-side challenge solved by the browser, verified server-side via `checkBotId()`. Deep Analysis (Kasada) is **Pro-only at $1/1000 calls** — not needed, and note *"Calling the `checkBotId()` function in your code triggers BotID Deep Analysis charges"*, so leave Deep Analysis unconfigured |
| **WAF rate limiting keyed on IP** | **Yes** | Free on Hobby, **"1,000,000 Allowed requests"** included ([WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)) | Hobby gets **1 rate-limit rule per project**, counting keys **"IP, JA4 Digest"**, fixed window, min 10s / max 10min. One rule is exactly enough: `POST /api/contact` → 3 requests / 10 min per IP → Deny. Caveat from the docs: *"Rate limit counters are tracked on a per-region basis"* |
| **Cloudflare Turnstile — Invisible mode** | **Yes** — *"Runs challenges completely in the background with no visible widget or loading indicators"* ([widget modes](https://developers.cloudflare.com/turnstile/concepts/widget/)) | Free: **"Up to 20 widgets"**, **"10 hostnames per widget"** ([plans](https://developers.cloudflare.com/turnstile/plans/)) | **Works without Cloudflare proxying** — confirmed at the source: *"Turnstile is designed to be an independent service. You can use Turnstile on any website, regardless of whether it is proxied through the Cloudflare network"* ([get started](https://developers.cloudflare.com/turnstile/get-started/)). So #4's grey-cloud decision does **not** rule it out |
| **Cloudflare Turnstile — Non-interactive mode** | **No interaction, but not invisible** — *"Displays visible widget with loading spinner"* ([widget modes](https://developers.cloudflare.com/turnstile/concepts/widget/)) | Free | A visible box appears. Not a CAPTCHA, but it is user-facing chrome |
| **Cloudflare Turnstile — Managed mode** | **No.** *"Automatically chooses between non-interactive or checkbox challenge based on visitor risk level"* ([widget modes](https://developers.cloudflare.com/turnstile/concepts/widget/)) | Free | Some real humans will be shown a checkbox. This is the mode most people mean by "Turnstile", and it violates the "no CAPTCHA in front of the user" constraint. **Do not use Managed mode here** |

**Recommended stack: honeypot + timing + BotID Basic + one IP rate-limit rule.** That is four
independent layers, all invisible, all $0, and none of them adds a third-party script the user's
browser must fetch before the form works.

**Turnstile is the escape hatch, not the default.** If real spam ever gets through all four layers,
add Turnstile in **Invisible** mode — never Managed. The reason it is not the default is bundle and
request cost: it adds a cross-origin script fetch and a challenge round-trip to a page whose whole
point is being fast, to defend against a threat that has not yet materialised.

**On IP-based rate limiting specifically.** This is only viable because of #4. With every record
grey-clouded, no Cloudflare edge sits between the visitor and Vercel, so the IP Vercel's WAF counts
against *is the client IP*. Had the apex been orange-clouded, the WAF would be counting Cloudflare
edge IPs and the rule would be worthless — or worse, would rate-limit a whole Cloudflare PoP's worth
of visitors as one key. **[INFERENCE]**, composed from #4's no-proxy decision and Vercel's documented
IP counting key.

---

## 4. Retention when there is no database

The question "where do submissions live" has a real answer here, and it is **the inbox**. But an
inbox is a single point of failure, so the design has to say what happens when it fails.

### What each layer gives you

| Layer | Durability | Cost | What it survives |
|---|---|---|---|
| **Delivery mailbox** (system of record) | As durable as your mail provider — effectively permanent, searchable, backed up | $0 | Everything except: the message being spam-foldered, or you deleting it |
| **BCC to a second mailbox on a different provider** | Same | $0 | Provider-level loss, single-inbox misfiling, accidental deletion |
| **Resend logs** | **"30-day data retention"** on free ([pricing](https://resend.com/pricing)) | $0 | A message lost in the first 30 days. Nothing after that |
| **Postmark archive** (if you chose Postmark) | **"45 days"** default, **"up to 365 days"** from $5/mo ([pricing](https://postmarkapp.com/pricing)) | $0–$5/mo | Meaningfully longer recovery window than Resend |
| **Vercel Blob** | Durable object storage; *"Vercel Blob is free for Hobby users within the usage limits"* ([Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)) | $0 at this volume | Everything — but see below |

### What breaks if the single delivery email is lost

You never learn a recruiter tried to reach you. There is no retry, no queue, no "unread" state
anywhere else. **That is the actual risk, and it is a real one** — it is silent, and you would not
know to go looking. Resend's 30-day log is a partial answer, but only if you happen to notice inside
30 days, and it stores the message record, not a queryable submissions table.

**The cheap durable copy is not a database — it is a BCC.** Add a second recipient on a different
mail provider (e.g. primary on your custom-domain mailbox, BCC to a personal Gmail). Cost: $0.
Configuration: one extra array element in the Resend call. It converts "single point of failure" into
"two independent providers would both have to fail or both spam-folder the same message", which for
a message with correct SPF/DKIM/DMARC alignment is a negligible probability. This is the single
highest-leverage line of code in the whole feature.

**Vercel Blob is available and I am recommending against it.** Appending a JSON object per submission
to a Blob store is free at this volume, durable, and outside the mail path entirely. The reason not
to: it creates a data store with no reader. Nothing renders it, nothing alerts on it, nothing prunes
it, and it silently accumulates recruiter names and email addresses as personal data with no
retention policy and no deletion path — which is a *worse* GDPR posture than an inbox you actually
read. Ruled out on the same grounds v1 ruled out a database: **there is no consumer for the data.**
Revisit only if a submissions view ever gets built.

**If you want a longer recovery window than 30 days without adding storage:** switch the email API to
Postmark and use its 45-day archive, or pay $5/mo for 365-day retention. **[INFERENCE]**, composed
from Postmark's documented retention add-on and the absence of any comparable option on Resend's free
tier. At tens of submissions a year the BCC is cheaper and strictly more reliable, so this is a
fallback, not a recommendation.

---

## 5. DNS records Resend needs

Additive to the #4 record table. **Every record here is unproxiable by type** — Cloudflare does not
offer proxying for `MX` or `TXT` — so #4's "everything DNS-only / grey cloud" rule holds trivially
for all four. Resend's Cloudflare guide states the DKIM record's proxy status explicitly as
**"DNS Only (disabled)"** ([Cloudflare guide](https://resend.com/docs/dashboard/domains/cloudflare)).

| # | Name | Type | Value | Priority | Proxy | TTL | Why |
|---|---|---|---|---|---|---|---|
| 5 | `send` | `MX` | **the value Resend shows on the domain card** (e.g. `feedback-smtp.<region>.amazonses.com`) | `10` | n/a (not proxiable) | Auto | Custom MAIL FROM / bounce handling for the sending subdomain |
| 6 | `send` | `TXT` | **the value Resend shows** — of the form `v=spf1 include:amazonses.com ~all` | — | n/a | Auto | SPF for the sending subdomain |
| 7 | `resend._domainkey` | `TXT` | **the long public key Resend shows** (`p=MIGfMA0…`) | — | **DNS only** | Auto | DKIM signing key |
| 8 | `_dmarc` | `TXT` | `v=DMARC1; p=none; rua=mailto:<your-address>;` | — | n/a | Auto | DMARC. Start at `p=none`; tighten to `quarantine`/`reject` only after reports show alignment |

**Two mechanical notes, both from Resend's own Cloudflare guide:**

- *"Omit your domain from the record values in Resend when you paste. Instead of `send.example.com`,
  paste only `send`."* Cloudflare appends the zone automatically; pasting the FQDN produces
  `send.alifarooq.dev.alifarooq.dev`.
- *"Do not use the same priority for multiple records."* Only relevant if you add another MX on the
  same host.

**DMARC placement.** Record 8 sits at `_dmarc.alifarooq.dev` (the organisational domain), not
`_dmarc.send.alifarooq.dev`. A DMARC record at the organisational domain covers subdomains that
have no record of their own, so one record protects both the sending subdomain and the apex.

**Do not put an MX on the apex** unless you actually want to receive mail at `@alifarooq.dev`. The
apex in #4's table carries the `A` record for the site; adding a sending MX there would defeat the
subdomain reputation isolation Resend recommends.

---

## 6. Analytics: the options

### 6.1 The measured facts

Script sizes were fetched directly from each vendor's CDN on 2026-08-07 (`curl`, with and without
`Accept-Encoding: gzip`), not taken from marketing copy.

| Tool | Cost at this traffic | Script, raw / gzip | Cookies | Path-level pageviews | Custom events | Ordered funnel |
|---|---|---|---|---|---|---|
| **Umami Cloud (Hobby)** | **$0** — *"Umami Cloud's Hobby plan is completely free. Great for personal projects and low traffic websites"* ([FAQ](https://docs.umami.is/docs/cloud/faq)) | 4,717 B / **2,301 B** (`cloud.umami.is/script.js`) | **No** — *"Umami does not use cookies or collect any personally identifiable information"* ([umami.is/pricing](https://umami.is/pricing)) | Yes | **Yes** — `umami.track('Signup button')` ([track events](https://docs.umami.is/docs/track-events)) | **Yes** — funnel report takes steps of type **URL or Event**, in required order ([funnel](https://docs.umami.is/docs/funnel)) |
| **Vercel Web Analytics (Hobby)** | **$0** — *"50,000 events / month included"*, 1-month reporting window ([pricing](https://vercel.com/docs/analytics/limits-and-pricing)) | 2,495 B / **1,271 B** (`va.vercel-scripts.com/v1/script.js`) | **No** — *"without using any third-party cookies, instead end users are identified by a hash created from the incoming request"* ([privacy](https://vercel.com/docs/analytics/privacy-policy)) | Yes, incl. **Dynamic Path** (`/blog/[slug]`) ([privacy](https://vercel.com/docs/analytics/privacy-policy)) | **No on Hobby.** The plan table lists Custom Events as **"-"** for Hobby, "Included" for Pro ([pricing](https://vercel.com/docs/analytics/limits-and-pricing)) | **No funnel view documented on any plan** |
| **Plausible Cloud** | **$9/mo** Starter (10k pageviews); **no free tier** — *"Sign up for 30-day free trial"* ([plausible.io](https://plausible.io/#pricing)). Funnels need **Business, $19/mo** | 2,841 B / **1,283 B** (`plausible.io/js/script.js`) | **No** — *"We don't use cookies, we don't generate persistent identifiers"* ([data policy](https://plausible.io/data-policy)) | Yes | **Yes** — `plausible('Signup')` ([custom event goals](https://plausible.io/docs/custom-event-goals)) | **Yes, Business plan only** — *"Funnel analysis is a Business plan feature"*, steps are *"pageview goals and custom event goals"*, *"minimum of 2 steps and a maximum of 8"* ([funnel analysis](https://plausible.io/docs/funnel-analysis)) |
| **Cloudflare Web Analytics** | **$0** — *"Privacy-first, lightweight, accurate web analytics—for free"* ([product page](https://www.cloudflare.com/web-analytics/)) | 31,612 B / **11,364 B** (`static.cloudflareinsights.com/beacon.min.js`) — **~5–9× every other option** | **No** — *"does not use any client-side state, such as cookies or localStorage"* and *"we don't 'fingerprint' individuals"* ([product page](https://www.cloudflare.com/web-analytics/)) | Yes | **Not documented** (see §9) | **No** |
| **Fathom** | **$45/mo** at the lowest tier shown, *"Up to 500,000 pageviews"*; **no free tier** — *"Do you have a lower/free option? Nope"* ([pricing](https://usefathom.com/pricing)) | 6,905 B / **2,071 B** (`cdn.usefathom.com/script.js`) | No — *"No cookies & GDPR compliant"* ([pricing](https://usefathom.com/pricing)) | Yes | Yes — *"Track conversions, revenue, and custom events on every plan. No extra fees"* ([pricing](https://usefathom.com/pricing)) | Not documented |
| **GoatCounter (hosted)** | **$0** — *"GoatCounter.com is currently offered for free for reasonable public usage"* ([goatcounter.com](https://www.goatcounter.com/)) | 9,213 B / **3,385 B** (`gc.zgo.at/count.js`) | **No** — *"Identify unique visits without cookies or persistently storing any personal data"* ([goatcounter.com](https://www.goatcounter.com/)) | Yes | Yes (event paths) | **No** |
| **Simple Analytics** | Paid only | 7,515 B / **3,885 B** (`scripts.simpleanalyticscdn.com/latest.js`) | No | Yes | Yes | Not documented |
| **Plausible CE / Umami self-hosted** | **$0 licence**, but needs a host + Postgres/ClickHouse | same scripts as cloud | No | Yes | Yes | Yes (Umami: *"Self-hosting is always free"* with every feature — [umami.is/pricing](https://umami.is/pricing)) |

### 6.2 The question that actually matters

> *Do people who land on the home page open a case study detail page, and do they reach the contact
> section?*

This decomposes into two very different measurement problems:

**(a) "Open a case study detail page"** is a *page view on a distinct path*. Every tool in the table
answers this. It needs no custom events at all — `/case-studies/[slug]` is a real navigation.

**(b) "Reach the contact section"** is **not a page view.** The site is *"one dense home page"* — the
contact section is a scroll position on `/`, not a URL. Nothing in an out-of-the-box pageview tracker
can see it. It requires firing an arbitrary client-side event from an `IntersectionObserver` on the
contact section, e.g. `umami.track('contact-section-viewed')`.

**(c) The word "who" makes it a sequence, not two counts.** "Do people who land on the home page open
a case study" is a per-visitor ordered relationship. Two independent aggregate counters cannot
distinguish "40% of home-page visitors clicked through" from "the case-study pages get all their
traffic from Google and nobody clicks through from home at all". That distinction is the entire
point of the question, and it needs a funnel/journey view.

Per tool:

- **Umami Cloud (free): answers all three.** Custom events via `umami.track()`
  ([track events](https://docs.umami.is/docs/track-events)); funnel report whose steps are
  *"specific URLs, events, and URL wildcards"* evaluated *"in a required order"*, reporting *"the
  counts of users that reach each URL or event and the drop off rate from the previous step"*
  ([funnel](https://docs.umami.is/docs/funnel)). The funnel is literally
  `/` → `/case-studies/*` → event `contact-section-viewed`. This is the only free tool in the table
  that expresses the sequence.
- **Vercel Web Analytics on Hobby: answers (a) only.** Custom Events are marked **"-"** on Hobby
  ([pricing](https://vercel.com/docs/analytics/limits-and-pricing)), so (b) is impossible without
  upgrading to Pro; and I found no funnel or user-journey view documented on *any* Vercel plan, so
  (c) is unavailable even on Pro. The `track()` API and its `beforeSend` redaction hook are
  well-documented ([custom events](https://vercel.com/docs/analytics/custom-events)) — the gate is
  purely commercial. **[INFERENCE]:** to get (b) from Vercel you must reach Pro at $20/user/mo, and
  even then (c) stays unanswered — which is why Vercel Analytics is a supplement here, not the
  primary.
- **Plausible: answers all three, at $19/mo.** Funnels are Business-tier
  ([funnel analysis](https://plausible.io/docs/funnel-analysis)). Excellent product, wrong price for
  a portfolio that will see four-figure annual pageviews.
- **Cloudflare Web Analytics, GoatCounter: answer (a), not (c).** Neither documents a funnel.
  GoatCounter can record event paths, so (b) is reachable, but the sequence is not. Cloudflare's
  beacon is also **11.4 KB gzipped** — nine times Vercel's and five times Umami's — which is a lot of
  bytes to spend on a tool that cannot answer the question.
- **Fathom, Simple Analytics: cost more than Plausible, without a documented funnel.** Out.

### 6.3 Recommendation and why

**Umami Cloud on the free Hobby plan, plus Vercel Web Analytics kept on for free.**

1. **It is the only free option that answers the actual question**, including the ordered funnel and
   the arbitrary scroll-visibility event.
2. **2.3 KB gzipped**, one script tag, no cookies, no consent banner.
3. **Self-hosting is a real exit**, not a marketing claim: *"Umami is open-source and can be
   self-hosted for free"* ([umami.is/pricing](https://umami.is/pricing)). If the free cloud tier ever
   changes, the same schema and dashboard run on your own Postgres with no data migration and no
   re-instrumentation.
4. **Keep Vercel Web Analytics on anyway.** It is free within 50,000 events/month on Hobby, it is
   1.3 KB gzipped, it is one `<Analytics />` component, and it needs zero configuration to give
   path-level pageviews with Next.js dynamic-path grouping. It costs ~1 KB to have a second,
   independent number to sanity-check Umami against — and if Umami is ever blocked by a visitor's
   ad-blocker list, Vercel's first-party-served intake is more likely to survive. **[INFERENCE]**,
   from Vercel's documented Resilient Intake (*"generates a random seed at build time… does not
   depend on a single predictable URL path for data collection"* —
   [privacy](https://vercel.com/docs/analytics/privacy-policy)) vs Umami's fixed
   `cloud.umami.is/script.js` origin.

**Instrumentation needed on the site (three things):**

- `<script defer src="https://cloud.umami.is/script.js" data-website-id="…">` in the root layout.
- An `IntersectionObserver` on the contact section firing `umami.track('contact-section-viewed')`
  once per page load (guard it — the observer will fire repeatedly on scroll-up/scroll-down).
- Optionally `umami.track('case-study-open', { slug })` on the case-study card click, so the funnel
  can distinguish "clicked through from home" from "arrived from search".

---

## 7. Is a cookie consent banner required?

**No.** But "no cookies therefore no consent" is a non-sequitur, and the vendors all state it that
way, so here is the actual reasoning.

**The rule is not about cookies.** ePrivacy Article 5(3), as amended by 2009/136/EC, is written in
terms of *terminal equipment*, not cookies:

> *"Member States shall ensure that the storing of information, or the gaining of access to
> information already stored, in the terminal equipment of a subscriber or user is only allowed on
> condition that the subscriber or user concerned has given his or her consent…"*
> — [Directive 2002/58/EC, consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219)

`localStorage`, `sessionStorage`, IndexedDB, and reading device characteristics for fingerprinting
are all *"storing of information, or the gaining of access to information already stored"*. A tool
can be cookie-free and still trip Article 5(3). The exemption is narrow:

> *"This shall not prevent any technical storage or access for the sole purpose of carrying out the
> transmission of a communication over an electronic communications network, or as strictly necessary
> in order for the provider of an information society service explicitly requested by the subscriber
> or user to provide the service."*

**Why this configuration clears it.** The Article 5(3) trigger is *client-side storage or access*.
Neither recommended tool does any:

- **Umami:** *"Umami does not use cookies or collect any personally identifiable information. This
  means you can use Umami without a cookie consent banner"*
  ([umami.is/pricing](https://umami.is/pricing)).
- **Vercel:** *"without using any third-party cookies, instead end users are identified by a hash
  created from the incoming request"*, and *"The lifespan of a visitor session is not stored
  permanently, it is automatically discarded after 24 hours"*
  ([privacy](https://vercel.com/docs/analytics/privacy-policy)).

That last one is the interesting case and worth being precise about. Vercel derives its visitor
identifier **server-side, from the incoming request** — it does not write anything to, or read
anything from, the browser. **[INFERENCE]:** composing that mechanism with the text of Article 5(3),
Vercel Web Analytics does not perform *"storing of information, or the gaining of access to
information already stored, in the terminal equipment"*, and therefore falls outside Article 5(3)
entirely rather than needing its exemption. Whether hashing request headers constitutes
*fingerprinting* is a separate and less settled question — see §9.

**GDPR is a separate axis from ePrivacy, and it is also fine here.** Article 5(3) governs the *access
to the device*; GDPR governs any *personal data* that results. Vercel states *"no personal
identifiers that track and cross-check end users' data across different applications or websites, are
collected"* and *"The recording of data points… is anonymous"*
([privacy](https://vercel.com/docs/analytics/privacy-policy)); Umami states *"All data is anonymized"*
([umami.is/pricing](https://umami.is/pricing)).

**What I am confident about vs not:**

- **Confident:** no consent banner is required for this pairing, because neither tool reads or writes
  the visitor's device.
- **Confident:** the reasoning is *"no device access"*, not *"no cookies"*. If a future component
  writes an analytics ID to `localStorage`, the analysis flips and a banner becomes necessary even
  with zero cookies.
- **Less confident:** the vendors' own blanket *"you do not need a cookie banner"* claims are
  marketing statements about their product in isolation, not legal advice about your deployment.
  They are correct here because the deployment is simple.
- **One thing that genuinely would need consent:** none of this touches the *contact form*. The form
  processes personal data (name, email, message) under GDPR, but that is Article 6(1)(b)/(f)
  processing, not Article 5(3) storage — it needs a short privacy note near the form saying what you
  do with the message and for how long you keep it. It does **not** need a consent checkbox.

**Data residency, for completeness:** Umami Cloud servers are *"located in the US and EU"*
([umami.is/pricing](https://umami.is/pricing)) — the region is not selectable per the pricing FAQ, so
if EU-only residency ever becomes a requirement, Plausible is the drop-in answer (*"All visitor data
is securely processed and stored in the EU on infrastructure owned by European companies"*,
*"Visitor data does not leave the EU"* — [data policy](https://plausible.io/data-policy)) at $19/mo
for funnels, or self-host Umami in an EU region for the cost of a VPS.

---

## 8. Rough cost, year one

| Component | Plan | Cost/mo | Cost/yr |
|---|---|---|---|
| Resend | Free (3,000/mo, 100/day, 1 domain) | $0 | **$0** |
| Vercel hosting | Hobby | $0 | **$0** |
| Vercel BotID (Basic) | Free on all plans | $0 | **$0** |
| Vercel WAF rate limiting | Hobby, 1 rule, 1M allowed requests included | $0 | **$0** |
| Umami Cloud | Hobby (free) | $0 | **$0** |
| Vercel Web Analytics | Hobby, 50,000 events/mo | $0 | **$0** |
| BCC mailbox | Existing personal account | $0 | **$0** |
| | | | **$0 / year** |

**Say it plainly: the free tiers are not merely sufficient, they are absurdly oversized for this.**
Tens of submissions a year against a 3,000/month allowance is ~0.1% utilisation. A portfolio seen by
hiring managers will not approach 50,000 analytics events in a month.

**What it would cost if any assumption breaks:**

| Trigger | Response | Cost |
|---|---|---|
| Want EU-only analytics residency + funnels | Plausible Business | **$19/mo → $228/yr** |
| Want a >30-day recoverable message archive | Postmark + 365-day retention add-on | **$5/mo → $60/yr** |
| Spam survives all four invisible layers | Turnstile, Invisible mode | **$0** (free tier: 20 widgets) |
| Sophisticated bot attack on the form | Vercel Pro + BotID Deep Analysis | **$20/user/mo + $1/1000 calls** |
| Traffic exceeds Vercel's 50,000 events/mo on Hobby | Collection pauses (Hobby cannot buy overage) — Umami keeps collecting | **$0**, degraded |

---

## 9. Not settled from primary sources

1. **Umami Cloud Hobby's numeric limits.** `umami.is/pricing` renders its plan table client-side; the
   server HTML contains only the FAQ JSON-LD, which confirms the Hobby plan *"is completely free"*
   and that usage is *"measured by counting pageviews… plus any custom events or custom event
   properties stored"*, but **not the events/month cap, website count, or data-retention window**.
   `docs.umami.is/docs/cloud/pricing` 404s. **This is the single biggest gap in the recommendation.**
   Verify in the signup flow before committing. Mitigation: the recommendation deliberately keeps
   Vercel Web Analytics running in parallel, so if Umami's free cap turns out to be tight, page-view
   data is not lost while you decide.
2. **Turnstile's siteverify request cap.** The [plans page](https://developers.cloudflare.com/turnstile/plans/)
   documents widgets (20) and hostnames-per-widget (10) but states no siteverify limit; a
   1,000,000/month figure circulates in Cloudflare's community forum, which is not a primary source.
   Irrelevant at this volume, but do not quote the number.
3. **Whether Cloudflare Web Analytics supports custom events.** The docs index at
   `developers.cloudflare.com/web-analytics/` and its `data-metrics/` page describe high-level
   metrics, page load time, and Core Web Vitals, and never mention custom events or funnels.
   `data-origin-and-collection/` 404s. Absence of documentation is suggestive, not proof. It does not
   change the recommendation — the 11.4 KB beacon rules it out on weight regardless.
4. **Whether Plausible's cheapest Starter plan ($9/mo) includes custom event goals.** The
   [subscription plans doc](https://plausible.io/docs/subscription-plans) describes Starter as *"one
   site, solo use"* and Business as needing *"funnels, user journeys, revenue tracking, custom
   properties"*, which implies custom *events* are on all plans and only custom *properties* and
   funnels are gated — but it is an implication, not a statement. The
   [custom event goals doc](https://plausible.io/docs/custom-event-goals) says only that events
   *"count towards your billable monthly pageviews"*. Does not affect the recommendation, since
   funnels are unambiguously Business-tier.
5. **Fathom's true entry price.** The pricing page's server-rendered HTML shows only
   *"Up to 500,000 pageviews / $45 /month"*; the tier slider (`100k 500k 2M 10M 25M+`) is
   client-side, so a cheaper 100k tier may exist that I could not read. Immaterial — there is no free
   tier either way (*"Do you have a lower/free option? Nope"*).
6. **Vercel Blob's Hobby included allowances.** [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
   states Blob *"is free for Hobby users within the usage limits"* but the linked pricing table
   renders regional values dynamically and `/docs/limits` does not restate them. The
   figures in Vercel's worked example (5 GB storage, 100K simple ops, 10K advanced ops, 100 GB
   transfer "included") appear to be Pro allowances, not Hobby. Immaterial — Blob is ruled out on
   design grounds in §4, not cost.
7. **Whether Vercel Web Analytics has any funnel or user-journey view on Pro.** I found none across
   the analytics docs; the Events panel is described only as drill-down by event name and custom data
   property ([custom events](https://vercel.com/docs/analytics/custom-events)). I am fairly confident
   there is no funnel view, but I cannot prove a negative from documentation.
8. **Whether hashing request headers to identify a visitor counts as "fingerprinting" under EDPB
   guidance.** Vercel's *"hash created from the incoming request"* is server-side and so, on my
   reading, outside Article 5(3) — but I could not retrieve authoritative regulator guidance to
   confirm. CNIL's audience-measurement exemption pages returned 404 on both URLs I tried, and I did
   not want to cite a secondary summary of them. The conclusion in §7 does not depend on this: Umami
   does not touch the device at all, so the pairing is safe even if the Vercel analysis is wrong.
9. **Postmark's exact DNS record values.** [Domain verification](https://postmarkapp.com/support/article/1046-how-do-i-verify-a-domain)
   confirms the record *shapes* (DKIM TXT, Return-Path CNAME → `pm.mtasv.net`, default host
   `pm_bounces`) but the DKIM value is account-specific and the canonical DNS-configuration article
   URL 404s. Only relevant if you choose Postmark over Resend.
10. **Formspree's paid pricing.** `formspree.io/plans` renders entirely client-side and returns an
    empty shell to a plain fetch. Free-tier limits are confirmed from the help centre; paid prices
    are not. Immaterial — hosted form services are not recommended.
