# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, equal weight (confirmed):

- **Hiring managers and engineering leads.** They arrive from a resume or LinkedIn profile and are deciding whether to interview Ali Farooq. The home page is written for this reader. It runs in this order: the fold, Full-stack, Data, Cloud and CI/CD, AI, About, Contact.
- **Prospective clients.** They are deciding whether to hire Ali for contract or project work. The contact form and the address in the fold and footer are their path.

## Product Purpose

A personal portfolio and proof-of-work site for Ali Farooq, a software engineer based in Karachi, Pakistan, currently "Open to remote roles". Success is a visitor deciding to get in touch, or to open the resume, after checking the claims against the evidence on the page.

The site is one page. Surfaces in the codebase:

- Home (`src/app/page.tsx`)
- A contact form (`/api/contact`, Resend, with BotID)
- A built resume (`resume/` → `public/resume.pdf`)

## Positioning

Confirmed by the user (2026-10-03): the angle is full-stack and AI. The headline is "I build full-stack products with *AI* inside them." The sentence under it is "Two years of client products at Zenkoders. Next.js on the front, NestJS and Postgres behind it, shipped on AWS, with LLM features and agents on top." The title line reads "Software engineer / full-stack and AI product".

The umbrella title is still "Software engineer" (page title, share card). Ali works as a backend engineer, software engineer, AI product engineer and full-stack engineer (confirmed 2026-10-02). The four titles are printed as "Four ways I work" in About. Each links to the stack hour that backs it: Backend to Data, Software to Cloud, AI product to AI, Full-stack to Full-stack. Every sentence restates something already on the site or resume; no new claims.

## Availability

Based in Karachi, UTC+5, with flexible working hours. Open to remote roles in the United States, Australia, the Middle East and Europe. These live in `src/lib/site.ts` (`BASE_LOCATION`, `BASE_UTC`, `REMOTE_REGIONS`).

Open: `resume/resume.html` still says "Backend Engineer, AI Workflow Automation and Integrations" and `resume.pdf` is built locally and committed, so the resume has not been updated to match.

## Operating Context

- Visitors skim first. The site is one page, and the resume holds the dated detail for readers who want more.
- Most of the work is client work and cannot link to code. As of 2026-10-02 the user chose to name clients. About names Numlix, Mach 1 and Voxena. The new resume (`public/resume.pdf`, supplied by the user) names Numlix, Mach 1, Voxena and Billy's Garage.
- A resume PDF is built from `resume/resume.html` by `pnpm resume:build`.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 4, `@base-ui/react`, GSAP motion. There is no MDX or content system; the home copy lives in `page.tsx`. Package manager is pnpm, Node 24.
- CI gates that design work must not break: JS bundle budget (`budget:js`), Lighthouse report (`budget:perf`), a11y scan (`budget:a11y`) and a prose check (`pnpm prose`). The prose check encodes the house voice.
- Colour is applied only through tokens in `globals.css`; components set no raw colour values.
- The stack is four hours on the home page: Full-stack at 08:30, Data at 12:00, Cloud and CI/CD at 16:30, AI at 17:45. Each hour has one line and a row of paper chips. A chip has a mono Simple Icons mark, except concepts such as LLMs, Agents and CI/CD, which have none. The hours state no skill levels.
- Contact: `hello@alifarooq.dev`, which the user will forward to `alifarooq122@gmail.com` (set up at the mail/DNS provider, not in this repo). The resume prints the gmail address directly. GitHub `alifaroo-q`; LinkedIn `alifarooqdev`.

## Brand Commitments

- Person name "Ali Farooq"; site name is the domain `alifarooq.dev`.
- Voice: the user asked (2026-10-02) for the voice to be reworked site-wide, warmer and plainer than the incumbent terse register. First person. `scripts/prose-check.mjs` still gates it (banned AI-tell words, reversals, em dashes are counted), so new copy must pass it.
- Visual replacement is authorised. The user named https://omarsarfraz.net/ as the model: an illustrated scroll-journey with cream hard-shadow cards, italic accent words in headings, a pixel mascot and scenery that changes per section. Take the language, not the artwork; every illustration here is original. The scenery world is a day on the Karachi coast, dawn to night.
- Thirteen vendored Simple Icons marks (`src/lib/brand-marks.ts`) and a portrait (`public/profile-image.jpg`).

## Evidence on Hand

- The Zenkoders row in About, with two figures: 7,000 inbound leads a month booked against a calendar, and 100 consultants drafting email through it.
- Resume at `public/resume.pdf`.
- Not on hand, so future work must not fabricate them: testimonials, traffic or revenue metrics, awards, press.

## Product Principles

1. Evidence outranks assertion. Every claim should sit near something a reader can check or open.
2. State the cost, not the label. Copy names what a decision cost or where it bit, not what a tool is for.
3. Serve two readers without splitting the page. Hiring and client visitors reach the same evidence and the same contact action.
4. Stay inside the performance and accessibility budgets. A change that breaks a CI gate is a defect.

## Accessibility & Inclusion

WCAG AA is the required standard (confirmed). Interactive targets are at least 44px, matching the action class in `site.ts`. Motion must honour `prefers-reduced-motion`.
