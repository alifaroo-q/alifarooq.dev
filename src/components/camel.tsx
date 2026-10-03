/**
 * The mascot: a pixel camel, the kind that walks the beach at Sea View.
 *
 * It is one sprite drawn from a grid of characters, so a pixel is a `rect` and
 * the whole thing is about 60 rects of markup with no image to fetch. It is
 * awake until the page reaches night, when CSS swaps it for the lying-down pose
 * (`html[data-hour="night"]`), and it is decoration only: hidden from assistive
 * tech and unable to take a click. Below 640px the text runs the full width,
 * so a fixed sprite would sit on words; it stays off there. It is drawn small
 * until the side margin is wide enough to hold it at full size and still walk
 * without crossing the cards (1600px).
 *
 * Rows are written without trailing dots and padded to the grid width, so a
 * row can be edited without recounting it.
 */

const WIDTH = 22;
const CELL = 5;

const FILLS: Record<string, string> = {
  k: "fill-ink",
  b: "fill-camel",
  s: "fill-camel-shade",
  c: "fill-coral",
};

const BODY = [
  "................kkkkk",
  "...............kbbbbbk",
  "...............kbbkbbk",
  "..............kbbbbbbk",
  "..............kbbbkkk",
  ".....kkk.....kbbk",
  "....kbbbk....kbbk",
  "...kbccccbbbbbbbk",
  "..kbbccccbbbbbbbbk",
  "..kbbbbbbbbbbbbbbk",
  "..kbbbbbbbbbbbbbbk",
  "..kssbbbbbbbbbbbssk",
  "...kkkkkkkkkkkkkkk",
];

const LEGS_A = [
  "...kbk.kbk....kbk.kbk",
  "...kbk.kbk....kbk.kbk",
  "...kbk.kbk....kbk.kbk",
  "...kkk.kkk....kkk.kkk",
];

const LEGS_B = [
  "....kbk.kbk..kbk.kbk",
  "....kbk.kbk..kbk.kbk",
  "....kbk.kbk..kbk.kbk",
  "....kkk.kkk..kkk.kkk",
];

function Sprite({ rows }: { rows: string[] }) {
  const cells: { x: number; y: number; fill: string }[] = [];
  rows.forEach((row, y) => {
    for (const [x, ch] of [...row.padEnd(WIDTH, ".")].entries()) {
      if (ch !== ".") cells.push({ x, y, fill: FILLS[ch] });
    }
  });
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={rows.length * CELL}
      shapeRendering="crispEdges"
      viewBox={`0 0 ${WIDTH} ${rows.length}`}
      width={WIDTH * CELL}
    >
      {cells.map((c) => (
        <rect
          className={c.fill}
          height="1"
          key={`${c.x}-${c.y}`}
          width="1"
          x={c.x}
          y={c.y}
        />
      ))}
    </svg>
  );
}

export function Camel() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-2 bottom-2 z-20 hidden origin-bottom-right scale-[0.55] sm:block min-[1600px]:right-5 min-[1600px]:bottom-4 min-[1600px]:scale-100"
      data-camel=""
    >
      <div className="relative" data-pose="awake">
        <div data-stride="a">
          <Sprite rows={[...BODY, ...LEGS_A]} />
        </div>
        <div className="absolute inset-0" data-stride="b">
          <Sprite rows={[...BODY, ...LEGS_B]} />
        </div>
      </div>
      <div className="relative" data-pose="sleep">
        <Sprite rows={BODY} />
        <span
          className="absolute -top-4 left-20 font-mono text-cream text-xs"
          data-zzz=""
        >
          z z z
        </span>
      </div>
    </div>
  );
}
