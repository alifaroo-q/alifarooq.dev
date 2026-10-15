import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PERSON_NAME } from "@/lib/site";

/**
 * The share card: one template, three fills (#16).
 *
 * The card is the dawn sky from the top of the home page: peach to cream, deep
 * sea ink for type, a coral eyebrow. It is a picture composited onto someone
 * else's surface, so it does not follow the reader's theme and does not need
 * to.
 *
 * Colours are inline here, and only here. Satori supports no cascade, no
 * variables and no media queries, so a token cannot reach it and nothing here
 * ever flips. The values are copied from `globals.css`, not aliased.
 *
 * The artifact SVG is not the card. It already exists per document, but the
 * home page withholds the diagram behind "See the state diagram", and the
 * withholding is what makes the click worth making. Putting it on the card
 * spends the payoff before anyone arrives.
 */

/**
 * The ink and the saffron the app icon spends: a saffron letter on deep sea.
 *
 * `GROUND` and `ACCENT` are exported because the icon is rendered by the same
 * PNG renderer, which cannot read a CSS variable either. Two literals of the
 * accent is a tab that stops matching the card.
 */
export const GROUND = "#10333d";
const FOREGROUND = "#10333d";
const MUTED = "#34545d";
const LABEL = "#3f5f68";
export const ACCENT = "#f2b93b";
export const CORAL = "#c24e2c";
const SKY = "linear-gradient(180deg, #f6c9a6 0%, #fbe6c8 100%)";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * The two cuts the site ships, read from disk rather than fetched.
 *
 * `next/font/google` downloads a `woff2`, which Satori cannot read, and the
 * file it writes is content-hashed into `.next` with no stable path. So the
 * `ttf`s are committed. They are read once per module load, not once per
 * card, and every card is generated at build: nothing in these routes reads a
 * request, so `process.cwd()` is the repo root of the build.
 */
const fontDir = join(process.cwd(), "assets/fonts");

const [regular, medium, bricolage] = await Promise.all([
  readFile(join(fontDir, "JetBrainsMono-Regular.ttf")),
  readFile(join(fontDir, "JetBrainsMono-Medium.ttf")),
  readFile(join(fontDir, "BricolageGrotesque-Bold.woff")),
]);

export const ogFonts = [
  { name: "JetBrains Mono", data: regular, style: "normal", weight: 400 },
  { name: "JetBrains Mono", data: medium, style: "normal", weight: 500 },
  {
    name: "Bricolage Grotesque",
    data: bricolage,
    style: "normal",
    weight: 700,
  },
] as const;

// The card's text is set in a monospace face, 0.6em to a character, in a box
// 1040px wide (1200 less the 80px padding each side). Satori does no
// shrink-to-fit, so the fit is done here from those two numbers.
const BOX_WIDTH = 1040;
const ADVANCE = 0.6;
const LINE_HEIGHT = 1.1;
// What the headline may take: the card less the rule, the footline's box and,
// when there is an eyebrow, its line and margin.
const HEADLINE_HEIGHT = 440;
const HEADLINE_HEIGHT_WITH_EYEBROW = 390;
const MIN_SIZE = 44;
const EYEBROW_CHARS = 56;

/** Scripts whose shaping the renderer cannot do: it throws, and no card is made. */
const UNSHAPEABLE =
  /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/u;
// The emoji glyph is fetched from a CDN at render time, which makes the build
// depend on the network for one picture.
const EMOJI = /\p{Extended_Pictographic}|\u200D|\uFE0F/gu;

/** Text the renderer can set, or `undefined` when none of it can be. */
function printable(text: string | undefined) {
  if (!text || UNSHAPEABLE.test(text)) return undefined;
  return text.replace(EMOJI, "").replace(/\s+/g, " ").trim() || undefined;
}

/** Lines `text` takes at `size`, breaking at spaces and after a hyphen or slash. */
function lineCount(text: string, size: number) {
  const perLine = Math.max(1, Math.floor(BOX_WIDTH / (size * ADVANCE)));
  let lines = 1;
  let used = 0;
  for (const token of text.split(/(?<=[-/])|\s+/u)) {
    const remaining = token.length;
    if (used > 0 && used + 1 + remaining <= perLine) {
      used += 1 + remaining;
      continue;
    }
    if (used > 0) lines++;
    // The renderer does not break inside a word, so a word wider than the box
    // does not fit at this size at all.
    if (remaining > perLine) return Number.POSITIVE_INFINITY;
    used = remaining;
  }
  return lines;
}

/** The largest size, at most `max`, at which the headline fits the box. */
function fitHeadline(text: string, max: number, height: number) {
  for (let size = max; size >= MIN_SIZE; size -= 4) {
    if (lineCount(text, size) * size * LINE_HEIGHT <= height) {
      return { text, size, breakAnywhere: false };
    }
  }
  // Nothing fits: break anywhere and cut it, rather than let it run off the card.
  const perLine = Math.floor(BOX_WIDTH / (MIN_SIZE * ADVANCE));
  const lines = Math.floor(height / (MIN_SIZE * LINE_HEIGHT));
  const cut =
    text.length > perLine * lines
      ? `${text.slice(0, perLine * lines - 1).trimEnd()}…`
      : text;
  return { text: cut, size: MIN_SIZE, breakAnywhere: true };
}

/**
 * The template.
 *
 * Three slots and one full-bleed hairline, which is the whole of the layout:
 * what the page is about sits above the rule, and who or what it belongs to
 * sits below it. The fills differ only in what they put in the slots and how
 * large the headline is set.
 *
 * The home card fills it with the name, then the umbrella role under the rule.
 */
export function OgCard({
  eyebrow: eyebrowIn,
  headline: headlineIn,
  headlineSize: maxSize,
  footline: footlineIn,
  footlineSize,
  footlineTone,
}: {
  eyebrow?: string;
  headline: string;
  /** Set per fill: a ten-character name and a fifty-character decision cannot
      share a size without one of them wrapping to four lines or floating. */
  headlineSize: number;
  footline: string;
  footlineSize: number;
  /** `muted` is body copy under the rule; `label` is the byline in the corner,
      which is a caption and must not compete with the headline above it. */
  footlineTone: "muted" | "label";
}) {
  const eyebrowText = printable(eyebrowIn);
  const eyebrow =
    eyebrowText && eyebrowText.length > EYEBROW_CHARS
      ? `${eyebrowText.slice(0, EYEBROW_CHARS - 1).trimEnd()}…`
      : eyebrowText;
  // A headline that cannot be set falls back to the name rather than failing
  // the whole card, which is a shared link with no preview.
  const {
    text: headline,
    size: headlineSize,
    breakAnywhere,
  } = fitHeadline(
    printable(headlineIn) ?? PERSON_NAME,
    maxSize,
    eyebrow ? HEADLINE_HEIGHT_WITH_EYEBROW : HEADLINE_HEIGHT,
  );
  const footline = printable(footlineIn) ?? "";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: SKY,
        color: FOREGROUND,
        fontFamily: "JetBrains Mono",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          // Centred in the space above the rule rather than sitting on it.
          // Bottom-aligned left the top third of every card empty, and a
          // preview is cropped from the top on some clients.
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              color: CORAL,
              fontSize: 24,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontSize: headlineSize,
            wordBreak: breakAnywhere ? "break-all" : "normal",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {headline}
        </div>
      </div>

      {/* The one hairline, running edge to edge rather than boxing anything —
          the same rule the site draws, in the one colour the card spends. */}
      <div style={{ display: "flex", height: 4, background: FOREGROUND }} />

      <div
        style={{
          display: "flex",
          padding: "48px 80px",
          color: footlineTone === "muted" ? MUTED : LABEL,
          fontSize: footlineSize,
          lineHeight: 1.45,
        }}
      >
        {footline}
      </div>
    </div>
  );
}
