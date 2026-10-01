# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, equal weight (confirmed):

- **Hiring managers and engineering leads.** They arrive from a resume or LinkedIn profile and are deciding whether to interview Ali Farooq for a backend role. The home page is written for this reader, in the order fold → Work → Open source → About → Contact.
- **Prospective clients.** They are deciding whether to hire Ali for contract or project work. The contact form and the address in the fold and footer are their path.

Engineers who open the open-source pages from GitHub are a secondary reader of the same material.

## Product Purpose

A personal portfolio and proof-of-work site for Ali Farooq, a software engineer based in Karachi, Pakistan, currently "Open to backend roles". Success is a visitor deciding to get in touch, or to open the resume, after checking the claims against the evidence on the page.

Surfaces in the codebase:

- Home (`src/app/page.tsx`)
- Three case studies (`/work/[slug]`)
- Two open-source write-ups (`/open-source/[slug]`)
- A stack page (`/stack`)
- A contact form (`/api/contact`, Resend, with BotID)
- A built resume (`resume/` → `public/resume.pdf`)

## Positioning

Confirmed by the user (2026-10-02): Ali works as a backend engineer, software engineer, AI product engineer and full-stack engineer, and the site says all four. The umbrella title is "Software engineer" (page title, share card). The four titles are printed in the fold and as "Four ways I work" in About, each tied to a case study or the stack page. Every sentence restates something already on the site or resume; no new claims.

The headline stays about outcome ("I build software that keeps working when things break"), which is true across all four titles.

## Availability

Based in Karachi, UTC+5, with flexible working hours. Open to remote roles in the United States, Australia, the Middle East and Europe. These live in `src/lib/site.ts` (`BASE_LOCATION`, `BASE_UTC`, `REMOTE_REGIONS`).

Open: `resume/resume.html` still says "Backend Engineer, AI Workflow Automation and Integrations" and `resume.pdf` is built locally and committed, so the resume has not been updated to match.

## Operating Context

- Visitors skim first. The case studies and open-source pages are the depth layer for readers who have decided to look closer.
- The case studies cover client work and cannot link to code. As of 2026-10-02 the user chose to name clients: Numlix (money rule) and Billy's Garage (transaction handle). The healthcare consultancy case study stays anonymous at the user's choice. The new resume (`public/resume.pdf`, supplied by the user) names Numlix, Mach 1, Voxena and Billy's Garage. The open-source repos carry the verifiability load and read after the claims they back.
- A resume PDF is built from `resume/resume.html` by `pnpm resume:build`.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 4, `@base-ui/react`, GSAP motion, content-collections MDX for case studies and open-source pages. Package manager is pnpm, Node 24.
- CI gates that design work must not break: JS bundle budget (`budget:js`), Lighthouse report (`budget:perf`), a11y scan (`budget:a11y`) and a prose check (`pnpm prose`). The prose check encodes the house voice.
- Colour is applied only through tokens in `globals.css`; components set no raw colour values.
- The stack page lists at most twelve items, each with a sentence naming its cost rather than its use. The page states no skill levels.
- No npm scope is printed on the home page. Packages are cited by repo name and GitHub URL.
- Contact: `hello@alifarooq.dev`, which the user will forward to `alifarooq122@gmail.com` (set up at the mail/DNS provider, not in this repo). The resume prints the gmail address directly. GitHub `alifaroo-q`; LinkedIn `alifarooqdev`.

## Brand Commitments

- Person name "Ali Farooq"; site name is the domain `alifarooq.dev`.
- Voice: the user asked (2026-10-02) for the voice to be reworked site-wide, warmer and plainer than the incumbent terse register. First person. `scripts/prose-check.mjs` still gates it (banned AI-tell words, reversals, em dashes are counted), so new copy must pass it.
- Visual replacement is authorised. The user named https://omarsarfraz.net/ as the model: an illustrated scroll-journey with cream hard-shadow cards, italic accent words in headings, a pixel mascot and scenery that changes per section. Take the language, not the artwork; every illustration here is original. The scenery world is a day on the Karachi coast, dawn to night.
- Six vendored brand marks (`src/lib/brand-marks.ts`) and a portrait (`public/profile-image.jpg`).

## Evidence on Hand

- Three case studies in `content/case-studies/*.mdx`, each with an SVG artifact.
- Two open-source write-ups in `content/open-source/` (`drizzle-tx`, `result-kit`), backed by public GitHub repos.
- Resume at `public/resume.pdf`.
- Not on hand, so future work must not fabricate them: testimonials, named clients, traffic or revenue metrics, awards, press.

## Product Principles

1. Evidence outranks assertion. Every claim should sit near something a reader can check or open.
2. State the cost, not the label. Copy names what a decision cost or where it bit, not what a tool is for.
3. Serve two readers without splitting the page. Hiring and client visitors reach the same evidence and the same contact action.
4. Stay inside the performance and accessibility budgets. A change that breaks a CI gate is a defect.

## Accessibility & Inclusion

WCAG AA is the required standard (confirmed). Interactive targets are at least 44px, matching the action class in `site.ts`. Motion must honour `prefers-reduced-motion`.
