# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, equal weight (confirmed):

- **Hiring managers and engineering leads.** They arrive from a resume or LinkedIn profile and are deciding whether to interview Ali Farooq. The home page is written for this reader. It runs in this order: the fold, Work, How I work, Tools, About, Contact. The nav links Work, How I work, Tools, About and Contact.
- **Prospective clients.** They are deciding whether to hire Ali for contract or project work. The contact form and the address in the fold and footer are their path.

## Product Purpose

A personal portfolio and proof-of-work site for Ali Farooq, a software engineer based in Karachi, Pakistan, currently "Open to remote roles". Success is a visitor deciding to get in touch, or to open the resume, after checking the claims against the evidence on the page.

The site is one page. Surfaces in the codebase:

- Home (`src/app/page.tsx`)
- A contact form (`/api/contact`, Resend, with BotID)
- A built resume (`resume/` → `public/resume.pdf`)

## Positioning

Confirmed by the user (2026-10-03): the angle is "AI builder". The page must prove "AI full-stack engineer" in ten seconds by leading with AI systems shipped (the AI voice caller, the email assistant with search and a person who approves), not with coding assistants. The headline is "I build full-stack products with *AI* inside them." The sentence under it names two years at Zenkoders and the 7,000 inbound leads a month that go through the AI caller.

The one title is "AI full-stack engineer" (`PERSON_ROLE`): the fold, the page title, the share card and the `Person` block all print it. Under the headline sits the name line ("Ali Farooq · AI full-stack engineer", with a small portrait on a phone), then the sentence, then a Proof strip that names three systems (AI voice caller, email assistant, restaurant voice AI), each with one figure and a link into Work. The restaurant link opens its card's detail. The primary CTA follows, inside the first 844px on a 390px phone, and the status row comes after it. Every sentence restates something already on the site or resume; no new claims.

## Availability

Based in Karachi, UTC+5, with flexible working hours. Open to remote roles in the United States, Australia, the Middle East and Europe. These live in `src/lib/site.ts` (`BASE_LOCATION`, `BASE_UTC`, `REMOTE_REGIONS`).

Open: `resume/resume.html` still says "Backend Engineer, AI Workflow Automation and Integrations" and `resume.pdf` is built locally and committed, so the resume has not been updated to match.

## Operating Context

- Visitors skim first. The site is one page, and the resume holds the dated detail for readers who want more.
- Most of the work is client work and cannot link to code. As of 2026-10-02 the user chose to name clients. Work names HCPA, Voxena, Mach 1, Tenley, Numlix, MyCFO, Billy's Garage and MarkRegistry. The new resume (`public/resume.pdf`, supplied by the user) names Numlix, Mach 1, Voxena and Billy's Garage.
- A resume PDF is built from `resume/resume.html` by `pnpm resume:build`.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 4, `@base-ui/react`, GSAP motion. There is no MDX or content system; the home copy lives in `page.tsx`. Package manager is pnpm, Node 24.
- CI gates that design work must not break: JS bundle budget (`budget:js`), Lighthouse report (`budget:perf`), a11y scan (`budget:a11y`) and a prose check (`pnpm prose`). The prose check encodes the house voice.
- Colour is applied only through tokens in `globals.css`; components set no raw colour values.
- Work leads with two flagship chapters (AI caller, email assistant), each with a step-by-step system diagram and a detail card that folds shut below 768px. The caller draws its diagram as a row under the text; the email assistant stands its diagram as a column beside the text. Every job leads with a "Result" line. The rest of the client work (the restaurant voice AI among it) is a row of compact cards whose detail opens on demand, then a list of smaller jobs and result-kit.
- Tools is three groups of flat hairline tags: "AI I ship", "The stack under it" and "AI I build with", then the agent skills Ali wrote, each a plain line on what it does followed by its slug in mono. A tag has a mono Simple Icons mark where one exists. The tags state no skill levels.
- Motion is one registry: markup carries `data-*` hooks and `EFFECTS` in `src/components/motion-runtime.tsx` says what each hook does, all inside `prefers-reduced-motion: no-preference`.
- Contact: `hello@alifarooq.dev`, which the user will forward to `alifarooq122@gmail.com` (set up at the mail/DNS provider, not in this repo). The resume prints the gmail address directly. GitHub `alifaroo-q`; LinkedIn `alifarooqdev`.

## Brand Commitments

- Person name "Ali Farooq"; site name is the domain `alifarooq.dev`.
- Voice: the user asked (2026-10-02) for the voice to be reworked site-wide, warmer and plainer than the incumbent terse register. First person. `scripts/prose-check.mjs` still gates it (banned AI-tell words, reversals, em dashes are counted), so new copy must pass it.
- Visual replacement is authorised. The user named https://omarsarfraz.net/ as the model: an illustrated scroll-journey with cream hard-shadow cards, italic accent words in headings, a pixel mascot and scenery that changes per section. Take the language, not the artwork; every illustration here is original. The scenery world is a day on the Karachi coast, dawn to night.
- Thirteen vendored Simple Icons marks (`src/lib/brand-marks.ts`) and a portrait (`public/profile-image.jpg`).

## Evidence on Hand

- The Proof strip and the flagship chapters, with their figures: 7,000 inbound leads a month through the AI caller, 31 to 49 bookings a week from its SMS follow-up, 40 to 50 emails a day per consultant.
- Client words: two outcome quotes, unedited and credited by client name only. The HCPA quote sits under the AI caller, the Numlix quote on the Numlix card. There is no separate Client words section.
- The About caravan: the gold medal (2024) and the Excellence in Work award (2026).
- Resume at `public/resume.pdf`.
- Not on hand, so future work must not fabricate them: more testimonials than the quotes on hand (two shown, two thank-you notes left out), quotes credited to a named person, traffic or revenue metrics, press.

## Product Principles

1. Evidence outranks assertion. Every claim should sit near something a reader can check or open.
2. State the cost, not the label. Copy names what a decision cost or where it bit, not what a tool is for.
3. Serve two readers without splitting the page. Hiring and client visitors reach the same evidence and the same contact action.
4. Stay inside the performance and accessibility budgets. A change that breaks a CI gate is a defect.

## Accessibility & Inclusion

WCAG AA is the required standard (confirmed). Interactive targets are at least 44px, matching the action class in `site.ts`. Motion must honour `prefers-reduced-motion`.
