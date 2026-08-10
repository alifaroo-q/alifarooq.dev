import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The share card: one template, three fills (#16).
 *
 * **The card is fixed dark, and that is a decision rather than an oversight.**
 * Following the reader is not available to it: there is no
 * `prefers-color-scheme` at build time, and the card is composited onto
 * someone else's surface anyway. It is a picture, not a UI, and it does not
 * owe the reader their theme.
 *
 * **Colours are inline here, and only here.** `globals.css` forbids an inline
 * colour because an inline value beats the variables a row flip redefines and
 * strands part of the subtree on the wrong ground. Neither half of that rule
 * applies: Satori supports no cascade, no variables and no media queries, so
 * there is nothing an inline value could beat, and nothing here ever flips.
 * The values below are #10's dark set, copied deliberately and not aliased —
 * a CSS variable cannot be read from a PNG renderer.
 *
 * **The artifact SVG is not the card, and that is the important rejection.**
 * It is the only real illustration the site owns and it already exists per
 * document, but #8 withholds the diagram behind "See the state diagram →",
 * and the withholding is what makes the click worth making. Putting it on the
 * card spends the payoff before anyone arrives, on the audience least likely
 * to click.
 */

/**
 * #10's dark ground, and the four values that sit on it.
 *
 * `GROUND` and `ACCENT` are exported because the app icon spends the same two
 * and is rendered by the same PNG renderer, which cannot read a CSS variable
 * either. Two literals of the accent is a tab that stops matching the card.
 */
export const GROUND = "#0a0a0b";
const FOREGROUND = "#edece9";
const MUTED = "#a3a19c";
const LABEL = "#807d77";
export const ACCENT = "#f2b544";

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

const [regular, medium] = await Promise.all([
  readFile(join(fontDir, "JetBrainsMono-Regular.ttf")),
  readFile(join(fontDir, "JetBrainsMono-Medium.ttf")),
]);

export const ogFonts = [
  { name: "JetBrains Mono", data: regular, style: "normal", weight: 400 },
  { name: "JetBrains Mono", data: medium, style: "normal", weight: 500 },
] as const;

/**
 * The template.
 *
 * Three slots and one full-bleed hairline, which is the whole of the layout:
 * what the page is about sits above the rule, and who or what it belongs to
 * sits below it. The fills differ only in what they put in the slots and how
 * large the headline is set.
 *
 * - **Home** — the name, then `Backend engineer` under the rule.
 * - **Case study** — the anonymised `sector` eyebrow, the `decision`, then the
 *   name small in the corner. The eyebrow is the anonymised one, so #6's
 *   checklist passes by construction: there is no path by which a client name
 *   reaches a card.
 * - **Open source** — the repo name, then the conviction line under the rule.
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
        background: GROUND,
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
              color: ACCENT,
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
      <div style={{ display: "flex", height: 1, background: ACCENT }} />

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
