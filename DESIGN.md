---
name: alifarooq.dev
description: One day on the Karachi coast, dawn to night, as a scroll-journey portfolio of cut-paper cards with hard ink shadows.
colors:
  ink: "#10333d"
  paper: "#fffaf0"
  cream: "#fbefd8"
  coral: "#c24e2c"
  saffron: "#f2b93b"
  sea: "#0b6673"
  foreground-muted: "#34545d"
  foreground-label: "#3f5f68"
  border-sand: "#c9bfa8"
  error: "#a82a1c"
  sky-dawn-a: "#f6c9a6"
  sky-dawn-b: "#fbe6c8"
  sky-morning-a: "#cfe6ea"
  sky-morning-b: "#f5ecd6"
  sky-noon-a: "#cde9e6"
  sky-noon-b: "#e9f5ec"
  sky-golden-a: "#f4d98f"
  sky-golden-b: "#f3c783"
  sky-evening-a: "#f4c39a"
  sky-evening-b: "#e9a690"
  sky-dusk-a: "#eeb89f"
  sky-dusk-b: "#d89aa3"
  sky-night-a: "#12304a"
  sky-night-b: "#0a1a2b"
  dusk-accent: "#6b1f42"
  camel: "#e3b564"
  camel-shade: "#bf8d43"
  caravan: "#e2a95a"
  caravan-ghost: "#f3d9c9"
  trail: "#f1c9a6"
  sun: "#f8d99a"
  sun-glow: "#fbe9c7"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6.2vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  accent:
    fontFamily: "Spectral, Georgia, serif"
    fontWeight: 400
    letterSpacing: "0"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  paper: "4px"
  arch: "999px"
  pill: "999px"
spacing:
  tight: "0.75rem"
  flow: "1.25rem"
  figure: "1.75rem"
  group: "3rem"
  section: "5rem"
  header: "5.25rem"
  measure: "36rem"
  wrap: "76rem"
components:
  paper-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "24px"
  key-button:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "12px 20px"
    height: "44px"
  key-button-night:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.ink}"
  portrait-arch:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.arch}"
  tool-chip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "10px 16px"
  hour-cue:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  site-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    height: "56px"
---

# Design System: alifarooq.dev

## Overview

**Creative North Star: "One Day on the Karachi Coast"**

The page is a clock. Scrolling carries the reader from dawn through morning, noon, golden hour and evening to dusk and night, and each section is a different hour with its own sky gradient and a band of hand-built SVG scenery in that hour's light: shoreline and dhow, a fish harbour with boats, crates and gulls, port cranes and skyline, dunes and palms, the Sea View promenade with a ferris wheel and stalls, a dusk beach with camels, a night harbour with a lighthouse and stars. There is no light/dark switch; the dark half of the day is the Contact section and is met by scrolling.

Everything that carries content is cut paper: a sand card, a 2px ink border, a hard offset ink shadow with no blur, and corners of 4px. Cards sit on the sky and stay legible on every hour because a card re-declares its own ink and paper tokens. Headings are bold grotesque with a single italic serif word in coral. A pixel camel walks the beach and lies down to sleep at night. The voice is warm and plain, and the page is illustrated, not decorated: scenery is behind the content and never read.

**Key Characteristics:**
- Hour-of-the-day grounds: six sky gradients, one per section, night flips the ink.
- Hard-shadow paper cards, no blur anywhere, press-down hover. Labels that are not controls are flat chips with a hairline.
- One saffron primary action per view.
- One italic serif accent word per heading.
- Original SVG scenery, drifting on scroll by depth; a pixel camel mascot.
- Colour only through tokens in `globals.css`; components name roles, ancestors supply values.

## Colors

A coastal day: sun-warmed grounds, deep sea-ink for everything that must be read, saffron and coral as the two warm voices, sea teal for links.

### Primary
- **Saffron Key** (#f2b93b): the one primary button (`.key`), selection highlight, and the night-time accent. Always carries ink text.

### Secondary
- **Coral Accent** (#c24e2c): the italic accent word, focus rings, caret, the dot after the wordmark, nav underline, active field label. Large text and non-text marks only.
- **Sea Teal** (#0b6673): links, card cue lines, the live availability dot. This is `--accent` by day; at night `--accent` becomes saffron.

### Neutral
- **Deep Sea Ink** (#10333d): all text on day grounds, every border, every card shadow, and the page background behind the night.
- **Sand Paper** (#fffaf0): card surface and the lightest tone.
- **Cream** (#fbefd8): default body background and the night's text colour.
- **Muted Ink** (#34545d) and **Label Ink** (#3f5f68): secondary text and small labels, tinted from the ink and never grey; both clear 4.5:1 on the day skies. Evening and dusk step both darker (#1f3d47, #234049).
- **Sand Border** (#c9bfa8): hairlines inside cards.
- **Error Brick** (#a82a1c): form errors only.

### Illustration
The mascot and the caravan have their own fills: camel tan (#e3b564) and its shade (#bf8d43), caravan tan (#e2a95a), the ghost camel (#f3d9c9) and the dusk trail (#f1c9a6). The portrait's dawn sun is #f8d99a with a #fbe9c7 glow. All are tokens in `globals.css`.

### Skies
Dawn peach (#f6c9a6 to #fbe6c8), morning pale blue (#cfe6ea to #f5ecd6), noon pale aqua (#cde9e6 to #e9f5ec), golden amber (#f4d98f to #f3c783), evening apricot (#f4c39a to #e9a690), dusk rose-plum (#eeb89f to #d89aa3), night navy (#12304a to #0a1a2b). The accent word on dusk is plum (#6b1f42); at night it is saffron. Each pair is a `--sky-<hour>-a/b` token; the sections read them, and so does the strip behind the fixed header, which takes the `-a` tone of the hour in view.

### Named Rules
**The Token Rule.** Nothing outside `globals.css` sets a colour in a component. Components say `text-foreground` or `bg-background`; the value comes from whichever ancestor last redefined the token (an `.hour-*` section, or a `.paper` card).
**The Hour Owns The Ink Rule.** Only the night flips text to cream. A paper card flips it back to day ink, so a card reads the same on peach and on navy.
**The Two Warm Voices Rule.** Saffron means act; coral means the one word to look at. Neither is used as a fill for large areas.

## Typography

**Display Font:** Bricolage Grotesque (600/700/800, with system sans fallback)
**Body Font:** Hanken Grotesk (400/500/600)
**Accent Font:** Spectral italic (400/500), headings' accent word only
**Label/Mono Font:** JetBrains Mono (400/500), times printed on the scenery, coordinates, code

**Character:** A friendly, slightly quirky grotesque for the claim, a quiet humanist body for the reading, and one serif italic to change voice on the word the heading turns on.

### Hierarchy
- **Display** (800, clamp(2.5rem, 6.2vw, 4.75rem), 1.02, -0.035em): the home h1 only, max 16ch.
- **Headline** (700, clamp(2.125rem, 5vw, 3.75rem), 1.04, -0.03em): section h2, max 18-20ch.
- **Title** (700, clamp(1.375rem, 2.2vw, 1.75rem), 1.15, tight): card h3.
- **Body** (400, 17px / 1.0625rem, 1.65): reading text, capped by the 36rem measure (about 62 characters). Lead paragraphs under headings run clamp(1.0625rem, 1.6vw, 1.1875rem) in Muted Ink.
- **Label** (mono 400, 12px / 0.75rem, 1.4): hour times (06:10, 12:00), coordinates, card sub-lines. Sentence-case digits and words as shipped, not tracked uppercase.

### Named Rules
**The One Italic Rule.** Each heading has at most one accent word, a real `em.accent` in Spectral italic coral. A second italic word in the same heading is wrong.
**The Measure On The Container Rule.** Width is set as `max-w-measure` on the column, so every block shares one right edge.

## Layout

One `.wrap` container (max 76rem, 24px side padding, 40px from 768px). Sections are full-bleed hours stacked vertically, in this order: the fold (dawn), Work (morning), How I work (noon), Tools (golden), a Sea View scenery band with no content (evening), About (dusk) and Contact (night); each pads its top by 5rem (`section`) and its foot by roughly 0.8 of the scenery height plus 5rem so content never sits on the water. The fold is `min-h-svh`, a two-column grid (19rem portrait, fluid text) from 1024px. Below 1024px the arch portrait is hidden and a 40px round portrait sits on the name line under the h1; the dawn caption moves under the status row. Tools is three groups of wrapping chip rows, 0.75rem apart and 1rem from 768px. Work leads with two flagship chapters, two columns from 1024px, then compact cards three-up at large, stretched to one height so their disclosures line up. How I work's five steps climb as stairs from 768px and run as a sideways snap row on a phone. About is three caravan stops, three-up from 768px. Gaps between cards are 2rem, widening to 2.5rem at large. Spacing is named, with more above a heading than below: tight 0.75rem, flow 1.25rem, figure 1.75rem, group 3rem, section 5rem. The floating header is 56px tall at top 12px; anchors clear it with `scroll-margin-top: 5.25rem`, and section headings with 5.25rem plus 1.5rem. Scenery band height is `clamp(14rem, 24vw, 22rem)`, fixed so it costs no layout shift. Interactive targets are 44px or more.

## Elevation & Depth

Depth is hard, never soft. Surfaces lift by a flat offset shadow in ink with zero blur; the skies and scenery supply atmosphere by colour and parallax, not by shadow.

### Shadow Vocabulary
- **Card** (`box-shadow: 6px 6px 0 0 var(--shadow-ink)`): every `.paper`.
- **Key** (`4px 4px 0 0 ink`; hover `6px 6px`; pressed `1px 1px`).
- **Small pill** (`3px 3px 0 0` on the hour cue).
- **Chip** (none): a label that is not a control stays flat, so a hard shadow always means "press me" or "this is a card".
- **Flat paper** (none, `.paper.flat`): a diagram step keeps the paper border and drops the shadow, because it is neither a card nor a control.
- **Night** (`--shadow-ink: cream`): a dark shadow vanishes on navy, so paper at night casts a cream one. The fixed header does the same while the night is in view.

### Named Rules
**The Hard Shadow Rule.** Shadows are offset, solid and blurless, and they move on press. A blurred or glowing shadow does not belong to this world.

## Shapes

Cut paper: 4px corners on cards, buttons, inputs and the header. Two deliberate silhouettes break it: the portrait's doorway arch (999px top corners, 4px bottom) and full-round dots and hour cues. Borders are 2px ink on every raised object. Scenery is flat-filled SVG shapes with no outlines beyond occasional ink strokes.

## Components

### Buttons
- **Shape:** 4px radius, 2px ink border, min-height 44px.
- **Primary (`.key`):** saffron with ink text, padding 12px 20px, weight 600, hard 4px shadow. Hover lifts (-2px, 6px shadow); active presses in. Disabled drops to a sand fill with no shadow.
- **Text link (`.ink-link`):** 2px underline at 35% of current colour, full on hover; the secondary action beside the key ("Say hello").
- **Focus:** 3px coral outline, 3px offset, on every interactive element.

### Cards / Containers
- **`.paper`:** Sand Paper fill, ink text, 2px ink border, 4px radius, 6px hard shadow. Padding 24px, 28-32px from 768px. Redefines the tokens so contents read as day ink on any hour. Linked cards use hover/press motion.

### Chips
- **`.chip`:** a label that is not a control: no fill, a 1px hairline at 40% of the text colour, 4px radius, no shadow, normal weight. Used for tool tags and the remote regions at night.
- **Tool chip:** a `.chip` per tool, 14px body text, with a 16px mono Simple Icons mark before the name that takes `currentColor`. Tools with no mark (Vapi, Twilio, pgvector, BullMQ, Vision model) show the name only. The marks live in `src/lib/brand-marks.ts`.

### Work
- **Proof strip:** one `.paper` card in the fold, three cells (AI voice caller, email assistant, restaurant voice AI), each a link into Work with one figure under it. The restaurant link targets the card's detail, so the browser opens the closed `<details>` around it.
- **Flagship chapter:** title, client, a labelled Result line in italic serif, a short paragraph, an optional client quote, then the system as flat paper steps joined by drawn arrows. The `diagram` field picks the shape: `row` runs across under the text, `column` stands beside it (both are a column on a phone). The role, what was built and the stack sit in a paper `<details>` card that is shut below 768px and always open above it, with no script.
- **Compact card:** a `.paper` card per remaining client job, a Result line first, an optional client quote, and a "Role and what I built" disclosure.
- **Client quote:** an unedited quote under a 2px ink rule, credited by client name, on the job it backs.

### Inputs / Fields
- Shadcn input and textarea restyled to the tokens: ink border, 4px radius, coral label on focus-within, error brick for failure. They sit inside a `.paper` card at night.

### Navigation
- **Header:** a fixed `.paper` bar, 56px high: lower-case wordmark with a coral dot ("af." on mobile), Work, How I work ("How" on mobile), Tools, About, Contact, and a resume link with a drawn arrow ("CV" on mobile). Every link is a box at least 44px wide and tall. The link for the hour in view gets a 3px coral underline (`html[data-hour]` written by the hour watcher, on mount and on every change); hover does the same.

### Hour Cue
- A full-round paper pill riding the foot of each scenery band: a mono time, then a semibold label naming the next hour with a drawn arrow. It is the section-to-section link.

### Scenery And Mascot
- **Scenery:** one SVG band per hour, in layers carrying `data-layer` and a `--depth`; layers drift against scroll by depth times 26px, scrubbed by ScrollTrigger in the motion runtime. Clouds, twinkling stars, swaying palms, bobbing dhow and a pulsing lighthouse beam are slow and decorative, hidden from assistive tech. Night stars sit only where there is no text: a strip above the Contact heading and the open sky over the harbour. When a message is sent, the beam sweeps round once (`[data-beam]` in `EFFECTS`, fired by the form's `contact:sent` event).
- **Camel:** a pixel sprite built from rects (ink, tan, shadow-tan, coral), two-step walk by day that only steps while the page scrolls, lying with floating z's at night. It is hidden below 640px, where text runs the full width, and drawn at 55% until 1600px, so it walks in the side margin without crossing the cards. Motion honours `prefers-reduced-motion`; all of it is off in that mode.
- **Motion registry:** markup carries `data-*` hooks (`data-land`, `data-diagram`, `data-count`, `data-roll`, `data-camel`, scenery layers) and `EFFECTS` in `src/components/motion-runtime.tsx` is the one table that says what each does. Server markup is the final state; every effect sits inside `prefers-reduced-motion: no-preference`.

## Do's and Don'ts

### Do:
- **Do** colour only through tokens; let `.hour-*` and `.paper` supply the values.
- **Do** give every raised object a 2px ink border and a hard blurless offset shadow.
- **Do** put one saffron `.key` per view, and one coral italic word per heading.
- **Do** end each hour with a scenery band and an hour cue that names the next hour.
- **Do** keep text on a sky at 4.5:1 or better; use the step-down tones at dusk.
- **Do** turn off every animation and view transition under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** blur shadows, add glows, or use radii above 4px on cards (the arch and chips are the only exceptions).
- **Don't** add a light/dark switch; night is a section.
- **Don't** use the italic serif for anything except a heading's one accent word and short captions.
- **Don't** put scenery in front of content, or let content sit on the water.

## Known drift (not canonized)

- The scenery SVGs (`src/components/scenery.tsx`) still carry raw hex fills against the Token Rule. They are art and tolerable. The camel, caravan and portrait sun now use tokens.
- The direction contract named slightly different hexes (paper #fbf5e6, saffron #f0b53c, coral #e0664a) and "tiny uppercase chapter labels"; the build uses the values above and mono labels are sentence-case times.
