import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  eyebrow,
  headline,
  headlineSize,
  footline,
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
