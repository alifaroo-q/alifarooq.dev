# Cloudflare DNS in front of Vercel for `alifarooq.dev`

**Ticket:** [#4](https://github.com/alifaroo-q/alifarooq.dev/issues/4) (`wayfinder:research`)
**Researched:** 2026-08-07
**Status:** Recommendation is actionable as written. Every claim below is cited to a
first-party source (Vercel docs/KB, Cloudflare developer docs, IETF RFCs). Where a
recommendation departs from a primary source, that conflict is called out explicitly.

---

## 1. Recommendation

### 1.1 The verdict, in three lines

- **Proxy: OFF.** Every Vercel-facing record is **DNS-only (grey cloud)**. Cloudflare stays the
  registrar and authoritative DNS; it does **not** sit in the request path.
- **SSL/TLS mode: not applicable**, because nothing is proxied. If you ever orange-cloud a record,
  the mode **must** be **Full** or **Full (strict)** — never Flexible.
- **Canonical host: the apex, `alifarooq.dev`.** `www.alifarooq.dev` exists and 308-redirects to it
  via Vercel's own domain redirect. (This departs from Vercel's documented default — see §3.)

### 1.2 The record set

Add all of these in the Cloudflare dashboard for the `alifarooq.dev` zone.

| # | Name | Type | Value | Proxy | TTL | Why |
|---|---|---|---|---|---|---|
| 1 | `@` | `A` | **the IP on your Vercel project's domain card** — `76.76.21.21` for most projects, newer projects may show e.g. `216.198.79.1` | **DNS only** | Auto | Apex must be an `A`; a `CNAME` at apex violates RFC 1034 §3.6.2 |
| 2 | `www` | `CNAME` | **the target on your Vercel project's domain card** — a per-project host of the form `<hash>.vercel-dns-017.com` | **DNS only** | Auto | Subdomains take a CNAME; the value is project-specific |
| 3 | `@` | `CAA` | `0 issue "letsencrypt.org"` | n/a (not proxiable) | Auto | **Only required if any other CAA record already exists on the zone.** Vercel issues via Let's Encrypt |
| 4 | `@` | `TXT` | Vercel-supplied `vc-domain-verify=...` value | n/a | Auto | **Only if** Vercel asks you to verify ownership |

**Do not add:**

- **No `AAAA` record.** Vercel states plainly: *"we do not support IPv6 yet… you won't be able to
  point an `AAAA` record to Vercel."*
- **No `ALIAS`/`ANAME` at apex.** Cloudflare does not offer an `ALIAS` record type. Cloudflare's
  equivalent is CNAME flattening (§4.2) — but flattening a DNS-only apex CNAME to Vercel's rotating
  anycast pool re-introduces the exact IP-pinning problem the `A` record already solves, with an
  extra failure mode (dangling-CNAME `NODATA`). Use the plain `A` record.
- **No `HTTPS`/SVCB record.** Vercel lists the type but nothing here needs it.

**In Vercel:** add **both** `alifarooq.dev` and `www.alifarooq.dev` to the project, then set
`www.alifarooq.dev` → **Redirect to** `alifarooq.dev` in Project Settings → Domains.

Email records are in §7 — they are additive to this table and are never proxied.

---

## 2. Constraint that decides most of this: Cloudflare Registrar pins the nameservers

Vercel's own Cloudflare guide gives one primary recommendation: **move DNS management to Vercel**,
and *"We **do not recommend** using a reverse proxy in front of Vercel."*

**That option is not available here.** `alifarooq.dev` is registered at Cloudflare Registrar, and
Cloudflare documents this as a hard restriction:

> "All domains acquired via Cloudflare Registrar use Cloudflare nameservers… You will not be able
> to change to another DNS provider's nameservers while using Cloudflare Registrar."

So the real choice is not *Cloudflare vs Vercel DNS*. It is **Cloudflare DNS-only vs Cloudflare
proxied**, with Vercel nameservers reachable only by transferring the registrar away — which is not
worth doing for a portfolio.

**DNS-only is the faithful execution of Vercel's advice under this constraint.** It gives Vercel the
whole request path (what Vercel asks for) while leaving registration and the DNS control plane at
Cloudflare (what the registrar forces). Nothing is compromised: Cloudflare's authoritative DNS is
free, fast, and anycast; the proxy is the only part Vercel objects to, and we are turning it off.

---

## 3. Apex vs `www`: the one place I disagree with Vercel

### What Vercel says

Vercel is unambiguous:

> "We recommend using the `www` subdomain as your primary domain, with a redirect from the non-`www`
> domain to it. This allows the Vercel CDN more control over incoming traffic for improved
> reliability, speed, and security."

The mechanism is stated too: a `CNAME` is an extra DNS-level lookup rather than a hard-coded IP,
so *"Vercel can quickly steer traffic in the case of DDoS attacks or for performance
optimizations."*

### Why I still recommend the apex as canonical

Vercel undercuts its own preference in the next paragraph:

> "Vercel maximizes the reliability and performance of your apex domain if you choose to use it as
> your primary domain by leveraging the Anycast methodology… Vercel still supports geographically
> routed traffic at infinite scale if you use an A record."

So the apex is not a degraded path — it is anycast-routed at the same scale. What you give up is
Vercel's ability to *re-point* your domain by editing DNS during an incident. Weigh that against the
context in the ticket:

1. **The audience is hiring managers.** `alifarooq.dev` is the string that goes on a CV, a GitHub
   profile, an email signature, and a conference badge. `www.alifarooq.dev` is four characters of
   noise on the canonical URL, in `<link rel="canonical">`, in OG tags, and in every share.
2. **The DDoS-steering argument is a Vercel-scale concern, not a portfolio-scale one.** The scenario
   it protects against is Vercel needing to move *your* traffic off a hot IP mid-incident. A
   personal site is not a target and not a load source.
3. **The redirect direction costs the same either way.** One extra hop for whichever host is not
   canonical. Vercel notes the redirect *"is also cached on visitor's browsers"*, and it is issued as
   a `308`, which is permanent and method-preserving.
4. **The `A`-record IP is stable and documented.** Vercel publishes it on the project's domain card
   and treats that card as *"the source of truth."*

**This is a deliberate, defensible departure from a primary source, not an oversight.** If you weigh
Vercel's traffic-steering argument more heavily than the aesthetics of the canonical URL, invert the
recommendation: make `www` canonical, redirect the apex to it, and keep the exact same record set
(the apex still needs its `A` record for the redirect to be served at all). Both configurations are
supported; only the redirect direction in Vercel's dashboard changes.

### The mechanical constraint behind all of it

Both Vercel and the RFC agree on why apex needs an `A` and `www` gets a `CNAME`:

> "the DNS [RFC1034](https://www.ietf.org/rfc/rfc1034.txt) (section 3.6.2) states that `If a CNAME
> RR is present at a node, no other data should be present`. Because an apex domain requires `NS`
> records and usually some other records, such as `MX`… adding a `CNAME` at the zone apex would
> violate this rule."

This is why the apex row in §1.2 is an `A` record and the `www` row is a `CNAME`. It is not a style
choice.

---

## 4. Proxy ON vs DNS-only: what actually breaks

This is the heart of the ticket. Below, each item is the mechanism, then the consequence.

### 4.1 Real client IPs — the worst breakage, and it is unfixable on a Hobby/Pro plan

This is the single finding that should settle the decision.

**Cloudflare's side:** when a record is proxied, the origin's TCP peer is a Cloudflare edge server,
not the visitor. Cloudflare passes the true IP in the `CF-Connecting-IP` header (and appends to
`X-Forwarded-For`).

**Vercel's side:** Vercel does not read `CF-Connecting-IP`, and actively destroys `X-Forwarded-For`:

> "If you are trying to use Vercel behind a proxy, we currently **overwrite** the `X-Forwarded-For`
> header and **do not forward external IPs**. This restriction is in place to prevent IP spoofing."

Restoring the real IP requires the **Trusted Proxy** feature, which Vercel gates to **Enterprise**:
*"Enterprise customers can purchase and enable a trusted proxy to allow your custom
`X-Forwarded-For` IP."*

**Consequences, all at once:**

- `x-forwarded-for`, `x-real-ip`, and `x-vercel-forwarded-for` all become a **Cloudflare edge IP**,
  identical for thousands of distinct visitors.
- Every `x-vercel-ip-*` header (`-country`, `-city`, `-latitude`, `-timezone`, …) geolocates the
  **Cloudflare PoP**, not the visitor.
- Any IP-based rate limiting in the contact-form route handler collapses: all traffic looks like a
  handful of IPs, so you either rate-limit the whole world together or you disable it.

### 4.2 Vercel Analytics accuracy — a direct casualty of 4.1

Vercel documents how visitors are counted:

> "Instead of relying on cookies… **visitors are identified by a hash created from the incoming
> request.** … The generated hash is valid for a single day."

If the incoming request's IP is a Cloudflare edge IP shared across many real people, the
distinguishing input to that hash is gone. The documented consequences follow directly:

- **Unique visitor counts collapse.** Many real visitors hash to the same identity and are counted
  once. Bounce rate, which is derived from sessions (*"a group of page views by the same visitor"*),
  is corrupted by the same mechanism.
- **The Countries / cities panel becomes a map of Cloudflare's PoP footprint**, since panels break
  down by *"the country, OS, and device or browser of your visitors"* and country comes from IP.

Vercel does not publish a sentence saying "Cloudflare proxy breaks Analytics." This conclusion is
**composed from two first-party facts** — the hash-from-request identification model and the
documented `X-Forwarded-For` overwrite. Both citations are above; flagged as inference in §8.

Separately, enabling Analytics *"will add new routes (scoped at `/_vercel/insights/*` and
`/<unique-path>/*`)"*. These are first-party paths on your own domain, so a Cloudflare proxy will
pass them through — the beacon still fires. The damage is to the **content** of the events, not
their delivery.

### 4.3 SSL mode and redirect loops — a real, documented, instant outage

Vercel forces HTTPS and says so:

> "The CDN automatically forwards any HTTP requests to your deployment to HTTPS using the `308`
> status code… **HTTPS redirection is an industry standard and can't be disabled.**"

Cloudflare's Flexible mode does the opposite:

> "Cloudflare sends unencrypted requests to your origin server over HTTP. **Redirect loops will occur
> if your origin server automatically redirects all HTTP requests to HTTPS.**"

Those two sentences are a guaranteed infinite loop. Vercel has a first-party KB article for exactly
this pairing, confirming the cause (*"Cloudflare will send requests from their servers to your
Vercel deployment using HTTP instead of HTTPS"*) and the fix:

> **"Set the 'SSL/TLS' option in Cloudflare to 'Full'."**

Cloudflare independently recommends the same class of setting: *"Cloudflare strongly recommends
using Full or Full (strict) modes to prevent malicious connections to your origin."*

**Consequence if wrong:** the entire site returns `ERR_TOO_MANY_REDIRECTS`. Not degraded — down.
For a portfolio a hiring manager opens once, this is the worst possible failure. **DNS-only removes
the setting from the system entirely, which is why it is the safer configuration.**

`Full (strict)` also works and is stricter: Vercel serves a publicly-trusted Let's Encrypt
certificate, so origin certificate validation succeeds. **If** you proxy, use `Full (strict)`; the
Vercel KB's `Full` is the floor, not the ceiling.

### 4.4 Certificate issuance — a chicken-and-egg trap

Vercel issues via Let's Encrypt using **HTTP-01** for all non-wildcard domains:

> "For all non-wildcard domains, we use the HTTP-01 challenge method and **providing the request can
> make it to Vercel**, then our infrastructure will deal with it."

Two failure modes appear when the proxy is on:

1. **Verification.** Vercel checks the domain resolves to its own `A`/`CNAME` value (*"Is your
   custom domain pointed to the provided Vercel `CNAME`/`A` record correctly? You can check it by
   using `dig`"*). A proxied record makes `dig` return **Cloudflare anycast IPs**, because
   *"when a record is proxied, DNS queries return Cloudflare's anycast IP addresses instead of your
   actual origin IP."* Vercel sees an IP that is not its own and reports **Invalid Configuration**.
2. **The challenge path.** `/.well-known` *"is reserved and cannot be redirected or rewritten"* on
   Vercel — but on the Cloudflare side, any Page Rule, Redirect Rule, "Always Use HTTPS", or
   Flexible-mode loop that touches `/.well-known/acme-challenge/*` will break issuance and, later,
   silent renewal. A cert that issued fine in month one can fail to renew in month three.

**Consequence:** at best a fiddly bootstrap (grey-cloud → wait for cert → orange-cloud); at worst a
certificate that silently fails to renew and takes the site down months later with a browser
interstitial. DNS-only makes issuance and renewal work the way Vercel designed them.

**CAA interaction:** Vercel requires `0 issue "letsencrypt.org"` *"if other CAA records already
exist on your domain."* Cloudflare complicates this — with Universal SSL enabled it **injects its
own CAA records** (including `0 issue "letsencrypt.org"`, plus `pki.goog`, `ssl.com`, `sectigo.com`)
which *"will not appear in the Cloudflare dashboard"* but are served. In practice Let's Encrypt is
usually already permitted, but this is invisible in the UI. **Verify with `dig`, not the dashboard**
(§6).

### 4.5 Double caching and ISR / stale-while-revalidate

Both layers do cache, and they honour overlapping directives.

- **Vercel** requires `s-maxage=N`, optionally with `stale-while-revalidate=Z`, to cache function
  responses at the CDN, and exposes state via `x-vercel-cache`.
- **Cloudflare** *"does not cache HTML or JSON by default"* — it caches by file extension. It
  **does** honour `stale-while-revalidate` and `stale-if-error` on all plans (Free through
  Enterprise).

Consequences:

- **The good news for MDX pages:** ISR-rendered HTML is not cached by Cloudflare by default, so the
  common fear — Cloudflare pinning a stale MDX page after you publish — **does not happen out of the
  box.** It happens the moment someone enables a "Cache Everything" Page Rule or Cache Rule, which
  is a popular thing to do and a footgun here.
- **Asymmetric invalidation.** When ISR revalidates, Vercel refreshes *its* cache. Cloudflare has no
  idea and holds its own copy for its own TTL. Publishing a post then means purging **two** caches,
  and only one of them has a "Deploy" button.
- **`stale-if-error` diverges.** Vercel *"doesn't currently support using `proxy-revalidate` and
  `stale-if-error` for server-side caching"*, while Cloudflare **does** honour it. So the same
  header behaves differently at each hop.
- **A header-precedence mismatch.** Vercel implements RFC 9213 targeted headers `CDN-Cache-Control`
  and `Vercel-CDN-Cache-Control`, and explicitly ships `CDN-Cache-Control` *"to other CDNs."*
  Cloudflare's documented targeted header is spelled **`Cloudflare-CDN-Cache-Control`** — and
  Cloudflare's own docs do not describe support for the generic `CDN-Cache-Control`. **Sources
  conflict / are silent here; do not assume `CDN-Cache-Control` steers Cloudflare** (flagged in §8).
- **A silent stripping rule worth knowing regardless of proxy:** *"If you set `Cache-Control`
  without a `CDN-Cache-Control`, the Vercel CDN strips `s-maxage` and `stale-while-revalidate` from
  the response before sending it to the browser."*

With DNS-only, exactly one cache exists, ISR invalidation is authoritative, and `x-vercel-cache`
tells the whole truth.

### 4.6 Vercel's platform protections are degraded

Vercel's guide states a reverse proxy *"prevent[s] the Vercel Firewall and our threat intelligence
products from working to their full potential"*, and that with Bot Protection enabled a proxy
*"significantly degrades detection accuracy and performance"* — legitimate users get incorrectly
challenged, and proxy IP rotation triggers repeated challenges. This is the same root cause as §4.1:
Vercel cannot see who is actually connecting.

### 4.7 What you would actually gain from proxying: close to nothing here

Honest accounting, since the ticket asks for a defended recommendation and not a menu:

- **DDoS absorption** — Vercel already provides this, and the proxy *degrades* Vercel's own firewall.
- **Origin IP hiding** — Cloudflare frames DNS-only as exposing *"your origin IP addresses… to
  anyone who queries the record."* For Vercel that "origin IP" is a **shared anycast address**
  (`76.76.21.21` is *"a general-purpose anycast address"*) fronting Vercel's whole network. There is
  nothing to hide.
- **Edge caching** — Vercel's CDN already caches globally, and Cloudflare does not cache HTML by
  default anyway (§4.5).
- **WAF / analytics** — duplicates what Vercel provides, less accurately (§4.1, §4.2).

The proxy costs real client IPs, correct Analytics, single-source caching, and a whole class of TLS
outages. It buys features you already have. **Grey cloud.**

---

## 5. If you proxy anyway — the minimum-damage configuration

Not recommended. Recorded so the trade-off is explicit and so a future change is not made blind.

1. **Bootstrap grey.** Set records DNS-only, add both domains in Vercel, wait for status to go valid
   and the certificate to issue. Only then orange-cloud.
2. **SSL/TLS mode → `Full (strict)`.** Never `Flexible` (§4.3). Vercel's KB says `Full`; `Full
   (strict)` is strictly better and works because Vercel serves a public Let's Encrypt cert.
3. **Never enable "Cache Everything"** on any rule matching HTML (§4.5).
4. **Exempt `/.well-known/acme-challenge/*`** from every redirect rule, Page Rule, and WAF rule, so
   renewal keeps working (§4.4).
5. **Accept that client IPs, geolocation, and Analytics uniques are wrong** unless you are on Vercel
   Enterprise with Trusted Proxy (§4.1). There is no workaround below that tier.
6. **Keep the `www` CNAME grey** if Vercel ever needs to re-verify it.

---

## 6. Verification commands

```bash
# Apex must return the exact IP from the Vercel domain card — NOT a Cloudflare 104.x/172.x anycast IP
dig +short A alifarooq.dev

# www must return the per-project Vercel target, then its IPs
dig +short CNAME www.alifarooq.dev
dig +short A     www.alifarooq.dev

# Must be empty — Vercel does not support IPv6
dig +short AAAA alifarooq.dev

# Cloudflare injects CAA records invisible in the dashboard; letsencrypt.org must be permitted
dig +short CAA alifarooq.dev

# Redirect must be a single 308 to the apex, with no loop
curl -sSIL https://www.alifarooq.dev | grep -Ei '^(HTTP/|location:)'

# Cache state on an MDX page: expect HIT / STALE / MISS / PRERENDER, and no cf-cache-status
curl -sSI https://alifarooq.dev/ | grep -Ei '^(x-vercel-cache|cache-control|cf-cache-status|server):'
```

The presence of **any** `cf-cache-status` or `cf-ray` header in that last command means a record is
still orange-clouded.

Vercel additionally recommends [Let's Debug](https://letsdebug.net) for certificate issuance
problems and [DNSViz](https://dnsviz.net/) for DNS/DNSSEC misconfiguration.

### Cutover hygiene

Vercel's documented practice, worth following since this is a live domain:

> "Ideally, about 24 hours in advance of changes, you should shorten the DNS TTL to 60s. Once it's
> propagated, you can then change the DNS record to Vercel."

Nameserver changes take *"up to 24–48 hours"*; plain record changes propagate much faster. Nothing
here changes nameservers, so expect minutes, not days.

---

## 7. Email deliverability

The contact form is a Vercel route handler calling an ESP's API. **No mail ever touches Vercel's
network**, so none of this interacts with §1–§6 except in one direction: these records must exist so
that mail *claiming* to be from `alifarooq.dev` authenticates.

Vercel is explicit that it is not in this business: *"Vercel does not provide a mail service for
domains purchased with or transferred into it."* All mail records live at Cloudflare, and **all of
them are forced DNS-only** — Cloudflare permits proxying on `A`, `AAAA`, and `CNAME` only:
*"Other record types (such as MX or TXT) are always DNS-only."* There is nothing to misconfigure
with the orange cloud here.

### 7.1 Provider-agnostic requirements

Three records, in this order of importance:

| Purpose | Name | Type | Value |
|---|---|---|---|
| **SPF** on the sending domain | the ESP's sending domain (see §7.2) | `TXT` | `v=spf1 include:<esp-include> ~all` |
| **DKIM** | `<selector>._domainkey` | `TXT` or `CNAME` (ESP-specific) | ESP-supplied public key |
| **DMARC** | `_dmarc` | `TXT` | `v=DMARC1; p=none; rua=mailto:you@example.com` |

**SPF (RFC 7208) — the two rules that actually bite:**

1. **Never publish two SPF records on one name.** §3.2: *"A domain name MUST NOT have multiple
   records that would cause an authorization check to select more than one record."* §4.5: more than
   one record *"produces the `permerror` result."* A `permerror` is **worse than having no SPF at
   all**, because DMARC treats it as a failure. Merge includes into a single `v=spf1` string.
   (Records on *different* names — apex vs a sending subdomain — are not duplicates and are fine.)
2. **The 10-lookup cap.** §4.6.4: implementations *"MUST limit the total number of those terms to 10…
   If this limit is exceeded, the implementation MUST return `permerror`."* `include`, `a`, `mx`,
   `ptr`, `exists`, and `redirect` count; `ip4`, `ip6`, `all` do not. One ESP include is 1–3
   lookups, so there is headroom — but stacking an ESP + Cloudflare Email Routing + Google Workspace
   on one record starts eating it.

Note the asymmetry: **no SPF record yields `none`** (inconclusive — DMARC can still pass on DKIM
alone), whereas a wrong one yields `fail` or `permerror`. A bad SPF record is actively harmful; a
missing one merely forfeits a signal.

**DKIM (RFC 6376):** §3.6.2.1 defines the lookup — a `d=` of `example.com` and `s=` of `foo.bar`
queries `foo.bar._domainkey.example.com`. §3.6.2.2 defines `TXT` as the only record type. ESPs that
hand you a **CNAME** for the selector (SES, SendGrid) rely on ordinary CNAME-following to reach a
TXT at their end; this works universally but is **not** described in the RFC (flagged in §8).

**DMARC (RFC 7489):** start at `p=none` with `rua=` and read the aggregate reports for 2–4 weeks,
then move to `p=reject`. `p=reject` is the correct **end state** for a portfolio precisely because
there are no legacy senders to break — the only thing that can fail is your own misconfiguration,
which the `p=none` monitoring window is there to catch.

**Alignment is the part people get wrong.** DMARC passes only if SPF or DKIM passes *and* the
passing identifier aligns with the `From:` domain. §3.1.2: relaxed SPF alignment requires only that
*"the SPF-authenticated domain and RFC5322.From domain… have the same Organizational Domain"*;
strict requires *"an exact DNS domain match."*

> **Concrete consequence:** if you send `From: hello@alifarooq.dev` but your ESP's envelope sender
> is on `send.alifarooq.dev`, **relaxed alignment (the default) passes and strict fails.** So
> **do not set `aspf=s` or `adkim=s`** while using an ESP sending subdomain. Leave both at their
> relaxed defaults.

### 7.2 What the common providers require

| ESP | DKIM | Sending-domain records |
|---|---|---|
| **Resend** | raw `TXT` at `resend._domainkey` | Recommends a **subdomain**: *"We recommend sending your emails from one or more subdomains (e.g., `updates.example.com`) instead of your root domain."* Needs `MX` `10 feedback-smtp.<region>.amazonses.com` **and** `TXT v=spf1 include:amazonses.com ~all` on that subdomain. Region must match your Resend region |
| **Amazon SES** | 3× `CNAME` → `<token>.dkim.amazonses.com` (Easy DKIM), or one `TXT` (BYODKIM) | Custom MAIL FROM needs exactly one `MX`; *"If the MAIL FROM domain has multiple MX records, the custom MAIL FROM setup with Amazon SES will fail"* |
| **Postmark** | raw `TXT` at `<timestamp>pm._domainkey` | Return-Path `CNAME` |
| **SendGrid** | 2× `CNAME` at `s1._domainkey` / `s2._domainkey` | plus an `em####` subdomain `CNAME` (Automated Security on, the default) |

Resend is the likely pick given the stack, and its subdomain model is the right shape anyway: it
isolates sending reputation from the apex, and it keeps the ESP's `MX` off the apex so it cannot
collide with inbound mail.

### 7.3 Do you need `MX`? Only for receiving — and for bounces

**`MX` is not consulted when sending.** It is a receiving-side record. Two caveats:

- **Resend/SES need an `MX` on the sending subdomain** to receive bounce and complaint
  notifications: SES *"requires you to set up an MX record so that your domain can receive the
  bounce and complaint notifications that email providers send you."* That is the `send.` `MX` in
  the table above, not an apex `MX`.
- **To receive at `hello@alifarooq.dev`**, Cloudflare Email Routing is free and adds three apex `MX`
  records (`route1/2/3.mx.cloudflare.net`, priorities *"assigned automatically by Cloudflare"*) plus
  `v=spf1 include:_spf.mx.cloudflare.net ~all`. **If you already have an apex SPF record, merge the
  include — do not add a second record** (§7.1). Note Email Routing is forward-only:
  *"Email Routing does not support sending or replying from your Cloudflare domain."*

Because the ESP's records sit on `send.` and Email Routing's sit on the apex, the two coexist
without conflict.

### 7.4 Cloudflare-specific email gotchas

- **The proxy cannot break mail here.** `MX`/`TXT` are unproxiable by type. The classic failure —
  an `MX` pointing at a proxied hostname, where *"mail delivery to that hostname would normally fail
  because the Cloudflare proxy does not handle SMTP"* — cannot occur, because you self-host no mail
  server and both `MX` sets point at third parties. Cloudflare additionally auto-inserts `_dc-mx`
  records to bypass the proxy in that scenario.
- **Enter names relative to the zone.** In Cloudflare type `send` and `resend._domainkey`, not the
  FQDN — Cloudflare appends the zone. The classic symptom is an `MX` value rendering as
  `feedback-smtp.us-east-1.amazonses.com.alifarooq.dev`; Resend's fix is to *"add a trailing period
  at the end of the record value."*
- **No wildcard `TXT`** on a mail-bearing zone — it can shadow SPF/DKIM lookups.

### 7.5 Gmail / Yahoo bulk-sender rules: you are exempt, do it anyway

Google's threshold is **5,000+ messages per day to Gmail accounts**; below that only the "all
senders" tier applies — SPF **or** DKIM, valid forward/reverse DNS on the sending IPs (the ESP's
job), TLS, and a spam rate under **0.3%**. The bulk-only requirements (SPF **and** DKIM, a DMARC
record, From-alignment, one-click unsubscribe) do not formally bind a contact form.

**Implement SPF + DKIM + DMARC regardless.** At contact-form volume you have no sending reputation
to absorb an authentication failure, so the alignment problems these records prevent are exactly
the ones that land a hiring-manager reply in spam. The records cost nothing and there is no
downside.

---

## 8. What I could not settle from primary sources

Listed so nothing above is mistaken for a documented fact when it is an inference.

1. **"Cloudflare proxy degrades Vercel Analytics" is composed, not quoted.** Vercel documents
   (a) that visitors are *"identified by a hash created from the incoming request"* and (b) that it
   *"overwrite[s] the `X-Forwarded-For` header and do[es] not forward external IPs"* behind a proxy.
   Vercel never joins these two sentences into a statement about Analytics. The conclusion in §4.2
   follows necessarily from both, but **no single first-party sentence asserts it**, and Vercel does
   not publish the hash's exact inputs — so the *magnitude* of the undercount is unquantified.
2. **`CDN-Cache-Control` vs `Cloudflare-CDN-Cache-Control`.** Vercel implements RFC 9213 targeted
   headers and says `CDN-Cache-Control` is forwarded *"to other CDNs."* Cloudflare's cache-control
   documentation describes **`Cloudflare-CDN-Cache-Control`** and does not describe support for the
   generic `CDN-Cache-Control`. **The sources do not agree, and neither addresses the other.** Do
   not assume `CDN-Cache-Control` steers Cloudflare; test empirically if you ever proxy.
3. **Cloudflare's docs never spell out the Flexible-mode redirect loop on the SSL-modes page.** The
   `ssl-modes/flexible/` page only alludes to redirect loops. The explicit mechanism comes from
   Cloudflare's `too-many-redirects` troubleshooting page and Vercel's KB article — both
   first-party, but on troubleshooting pages rather than the reference docs. The conclusion is
   solid; its location is not where you would look first.
4. **The exact apex `A` IP is not knowable from documentation.** Vercel documents both
   `76.76.21.21` and `216.198.79.1` and states *"The card is the source of truth, so use whatever it
   displays."* **§1.2 row 1 must be filled in from the dashboard**; no doc can supply it. Same for
   the `www` `CNAME` target, which is per-project (`<hash>.vercel-dns-017.com`).
5. **Cloudflare does not document whether it interferes with third-party ACME HTTP-01.**
   Cloudflare's DCV page covers only Cloudflare-issued certificates. The §4.4 renewal risk is
   reasoned from the general behaviour of redirect rules and "Always Use HTTPS", **not** from a
   documented Cloudflare/Vercel interaction. It is a reason for caution, not a proven failure.
6. **DKIM-by-CNAME is not sanctioned by RFC 6376**, which defines only `TXT` at
   `<selector>._domainkey`. SES and SendGrid's CNAME delegation works by ordinary DNS resolution
   semantics; no spec blesses it.
7. **Yahoo publishes no numeric bulk-sender threshold.** The widely-cited 5,000/day figure is
   **Google's**. Do not assume Yahoo matches it.
8. **"Having no `MX` harms deliverability" is folklore.** No Google, Yahoo, AWS, or Cloudflare
   document supports it. It is not a reason to add an apex `MX`.
9. **Cloudflare Email Routing's `MX` priority values are undocumented** — the docs say only
   *"assigned automatically."*
10. **Staleness check:** every Vercel doc cited carries a `last_updated` between 2025-12-13 and
    2026-07-23, so all are current as of 2026-08-07. The oldest is `request-headers`
    (**2025-12-13**) — which is the source for the Trusted-Proxy/`X-Forwarded-For` claim in §4.1,
    the load-bearing fact for the whole recommendation. It is ~8 months old. **If Vercel ever ships
    trusted-proxy support below Enterprise, §4.1 and §4.2 weaken and the proxy-off verdict deserves
    a re-read.** Nothing else here is time-sensitive.

---

## 9. Sources

All first-party. Fetched 2026-08-07.

**Vercel — domains, DNS, TLS**
- [Adding & Configuring a Custom Domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain) — apex→`A`, subdomain→`CNAME`, per-project `vercel-dns-017.com` targets *(updated 2026-02-27)*
- [Deploying & Redirecting Domains](https://vercel.com/docs/domains/deploying-and-redirecting) — the `www`-primary recommendation, the RFC 1034 rationale, apex anycast support *(2026-07-23)*
- [Working with DNS](https://vercel.com/docs/domains/working-with-dns) — record types, `ALIAS` semantics, `76.76.21.21`, TTL guidance *(2026-06-08)*
- [Managing DNS Records](https://vercel.com/docs/domains/managing-dns-records) — record fields, presets, migration *(2026-02-27)*
- [Troubleshooting domains](https://vercel.com/docs/domains/troubleshooting) — IPv6 unsupported, RFC 1034 §3.6.2 quote, CAA, `_acme-challenge`, `/.well-known` reserved, no mail service *(2026-07-20)*
- [Working with SSL Certificates](https://vercel.com/docs/domains/working-with-ssl) — Let's Encrypt, HTTP-01 vs DNS-01 *(2026-06-08)*
- [Encryption and TLS](https://vercel.com/docs/cdn-security/encryption) — forced HTTP→HTTPS `308`, cannot be disabled; HSTS *(2026-07-02)*
- [Can I use my domain on Vercel with A records?](https://vercel.com/kb/guide/a-record-and-caa-with-vercel) (KB) — `76.76.21.21` vs `216.198.79.1`, "the card is the source of truth"

**Vercel — proxy, headers, caching, analytics**
- [Cloudflare with Vercel](https://vercel.com/guides/cloudflare-with-vercel) — *"We do not recommend using a reverse proxy in front of Vercel"*; firewall/bot-protection degradation
- [Resolving `err_too_many_redirects` with a Cloudflare proxy](https://vercel.com/kb/guide/resolve-err-too-many-redirects-when-using-cloudflare-proxy-with-vercel) (KB) — cause and the "set SSL/TLS to Full" fix
- [Request headers](https://vercel.com/docs/headers/request-headers) — **`X-Forwarded-For` overwritten behind a proxy**; Trusted Proxy is Enterprise; `x-vercel-ip-*` *(2025-12-13)*
- [Vercel CDN Cache](https://vercel.com/docs/caching/cdn-cache) — `s-maxage`/`stale-while-revalidate`, RFC 9213 targeted headers, `stale-if-error` unsupported, cacheability criteria *(2026-04-07)*
- [Vercel Web Analytics](https://vercel.com/docs/analytics) — **hash-from-incoming-request visitor identification**; panels; bot filtering *(2026-07-15)*
- [Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart) — `/_vercel/insights/*` routes *(2026-06-08)*

**Cloudflare**
- [Register a domain (Registrar)](https://developers.cloudflare.com/registrar/get-started/register-domain/) — **cannot change to another provider's nameservers**
- [Proxied DNS records](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/) / [Proxy status](https://developers.cloudflare.com/dns/proxy-status/) — only `A`/`AAAA`/`CNAME` proxiable; proxied queries return Cloudflare anycast IPs
- [CNAME flattening](https://developers.cloudflare.com/dns/cname-flattening/) and [set-up](https://developers.cloudflare.com/dns/cname-flattening/set-up-cname-flattening/) — apex flattening on by default; dangling-CNAME `NODATA`; Error 1014
- [SSL/TLS encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/) — mode definitions; *"strongly recommends using Full or Full (strict)"*
- [Flexible mode](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/flexible/) — HTTP to origin; port 443 only
- [Too many redirects](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/) — **the loop mechanism and fix**
- [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) — *"does not cache HTML or JSON by default"*
- [Cache-Control directives](https://developers.cloudflare.com/cache/concepts/cache-control/) — `stale-while-revalidate`/`stale-if-error` on all plans; `Cloudflare-CDN-Cache-Control`
- [Universal SSL](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/) and [CAA records](https://developers.cloudflare.com/ssl/edge-certificates/caa-records/) — auto-injected CAA incl. `letsencrypt.org`, invisible in the dashboard
- [Email Routing DNS records](https://developers.cloudflare.com/email-routing/setup/email-routing-dns-records/) · [postmaster](https://developers.cloudflare.com/email-routing/postmaster/) · [email records](https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/)

**RFCs**
- [RFC 1034 §3.6.2](https://www.ietf.org/rfc/rfc1034.txt) — no other data alongside a `CNAME` (why apex needs `A`)
- [RFC 7208](https://datatracker.ietf.org/doc/html/rfc7208) — SPF; §3.2 & §4.5 single-record rule, §4.6.4 ten-lookup limit, §2.6 result codes
- [RFC 6376](https://datatracker.ietf.org/doc/html/rfc6376) — DKIM; §3.6.2.1 selector lookup, §3.6.2.2 `TXT` only
- [RFC 7489](https://datatracker.ietf.org/doc/html/rfc7489) — DMARC; §3.1 alignment, §6.3 tags
- [RFC 9213](https://httpwg.org/specs/rfc9213.html) — targeted cache-control headers

**ESPs**
- [Resend — domains](https://resend.com/docs/dashboard/domains/introduction) · [Route 53 guide](https://resend.com/docs/knowledge-base/route53) · [verification troubleshooting](https://resend.com/docs/knowledge-base/what-if-my-domain-is-not-verifying)
- [SES — Easy DKIM](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-easy.html) · [custom MAIL FROM](https://docs.aws.amazon.com/ses/latest/dg/mail-from.html)
- [Postmark — DKIM](https://postmarkapp.com/support/article/setting-up-dkim-for-your-domain) · [SendGrid — domain authentication](https://www.twilio.com/docs/sendgrid/ui/account-and-settings/how-to-set-up-domain-authentication)

**Mailbox providers**
- [Google — Email sender guidelines](https://support.google.com/a/answer/81126) — 5,000/day bulk threshold, 0.3% spam rate
- [Yahoo — Sender best practices](https://senders.yahooinc.com/best-practices/)
