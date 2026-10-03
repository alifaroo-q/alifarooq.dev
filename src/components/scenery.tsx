import type { CSSProperties, ReactNode } from "react";

/**
 * The scenery: one band of landscape at the foot of each hour.
 *
 * All of it is drawn here, in SVG, from primitives. None of it is a picture and
 * none of it is copied from anywhere; the only thing borrowed from the sites
 * that inspired the page is the idea that the scenery changes as you scroll.
 *
 * Every band shares one 1440 by 400 canvas and is cropped, never squashed, on a
 * narrow screen (`xMidYMax slice`), so the shore stays on the ground and the
 * sky is what gets trimmed. The height is fixed in CSS (`.scene svg`), which is
 * what keeps layout shift at zero: the box is known before a path is parsed.
 *
 * Colours are literals here and not tokens on purpose. They belong to the
 * hour's light, not to the interface: the dhow's sail is not "background", and
 * flipping a token must never repaint a lighthouse.
 */

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Scene({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="scene">
      <svg
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1440 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </div>
  );
}

/** A layer that drifts against the scroll; `depth` 0 holds still. */
function Layer({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <g data-layer="" style={{ "--depth": depth } as CSSProperties}>
      {children}
    </g>
  );
}

/**
 * A run of buildings along a baseline. Heights and widths come from a seeded
 * generator, so the skyline is different per band and identical on every
 * render, which is what keeps the server and client markup the same.
 */
function Skyline({
  seed,
  base,
  minH,
  maxH,
  fill,
  windows,
}: {
  seed: number;
  base: number;
  minH: number;
  maxH: number;
  fill: string;
  windows?: string;
}) {
  const r = rng(seed);
  const blocks: ReactNode[] = [];
  const lights: ReactNode[] = [];
  let x = -14;
  while (x < 1450) {
    const w = 30 + r() * 50;
    const h = minH + r() * (maxH - minH);
    const top = base - h;
    blocks.push(
      <rect fill={fill} height={400 - top} key={x} width={w} x={x} y={top} />,
    );
    if (windows) {
      for (let wy = top + 14; wy < base - 8; wy += 18) {
        for (let wx = x + 7; wx < x + w - 9; wx += 14) {
          if (r() > 0.62) {
            lights.push(
              <rect
                fill={windows}
                height="6"
                key={`${wx}-${wy}`}
                width="5"
                x={wx}
                y={wy}
              />,
            );
          }
        }
      }
    }
    x += w + r() * 5;
  }
  return (
    <>
      {blocks}
      {lights}
    </>
  );
}

/** A date palm: a leaning trunk and a crown of fronds. */
function Palm({
  x,
  y,
  scale = 1,
  lean = 1,
  trunk,
  frond,
}: {
  x: number;
  y: number;
  scale?: number;
  lean?: number;
  trunk: string;
  frond: string;
}) {
  const fronds = [-150, -120, -88, -55, -25, 8, 40];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * lean} ${scale})`}>
      <g data-sway="">
        <path
          d="M0 0 C6 -50 2 -100 14 -150"
          fill="none"
          stroke={trunk}
          strokeLinecap="round"
          strokeWidth="9"
        />
        <g transform="translate(14 -150)">
          {fronds.map((angle) => (
            <path
              d="M0 0 C 26 -26 62 -22 92 4 C 62 -8 28 -6 0 0Z"
              fill={frond}
              key={angle}
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
      </g>
    </g>
  );
}

/** A camel in silhouette, facing right, on a 100 by 70 box. */
function CamelSilhouette({
  x,
  y,
  scale,
  fill,
}: {
  x: number;
  y: number;
  scale: number;
  fill: string;
}) {
  return (
    <g fill={fill} transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="46" cy="38" rx="26" ry="12" />
      <path d="M34 32 Q45 8 58 30Z" />
      <path d="M64 36 Q78 32 80 14 L90 16 Q88 40 70 48Z" />
      <path d="M80 14 Q92 6 99 15 L97 23 Q89 20 85 25Z" />
      <rect height="26" width="5" x="26" y="44" />
      <rect height="26" width="5" x="36" y="46" />
      <rect height="26" width="5" x="57" y="46" />
      <rect height="26" width="5" x="67" y="44" />
      <path d="M22 34 Q10 42 14 56" fill="none" stroke={fill} strokeWidth="3" />
    </g>
  );
}

/* --------------------------------------------------------------------------
   Dawn: a shore, a dhow, a few palms.
   -------------------------------------------------------------------------- */

export function Shore() {
  return (
    <Scene>
      <Layer depth={0.15}>
        <rect fill="#a6cdc0" height="190" width="1440" y="215" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            fill="#fff1d6"
            height="3"
            key={i}
            opacity={0.85 - i * 0.12}
            rx="1.5"
            width={110 - i * 16}
            x={250 + i * 8}
            y={222 + i * 9}
          />
        ))}
      </Layer>
      <Layer depth={0.35}>
        <g data-bob="">
          <path d="M985 236 H1090 L1074 252 H1002Z" fill="#10333d" />
          <path
            d="M1044 232 V164 L1092 230Z"
            fill="#fffaf0"
            stroke="#10333d"
            strokeWidth="2.5"
          />
          <path
            d="M1038 232 V176 L1012 230Z"
            fill="#f2b93b"
            stroke="#10333d"
            strokeWidth="2.5"
          />
          <path d="M1041 164 V236" stroke="#10333d" strokeWidth="3" />
        </g>
      </Layer>
      <Layer depth={0.6}>
        <path
          d="M0 272 C130 258 250 284 380 272 S620 258 760 273 S980 286 1120 271 S1330 258 1440 270 V400 H0Z"
          fill="#74b4b0"
        />
      </Layer>
      <Layer depth={0.85}>
        <path
          d="M0 312 C170 296 310 326 470 310 S770 296 920 314 S1210 326 1440 302 V400 H0Z"
          fill="#439096"
        />
        <path
          d="M0 312 C170 296 310 326 470 310 S770 296 920 314 S1210 326 1440 302"
          fill="none"
          stroke="#fffaf0"
          strokeDasharray="14 18"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </Layer>
      <path
        d="M0 352 C210 338 430 360 650 352 S1030 336 1210 343 S1380 354 1440 346 V400 H0Z"
        fill="#f1d8a4"
      />
      <path
        d="M0 352 C210 338 430 360 650 352 S1030 336 1210 343 S1380 354 1440 346"
        fill="none"
        stroke="#d9b87a"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <ellipse cx="190" cy="378" fill="#dcbd82" rx="16" ry="4" />
      <ellipse cx="226" cy="385" fill="#dcbd82" rx="9" ry="3" />
      <ellipse cx="880" cy="380" fill="#dcbd82" rx="20" ry="4" />
      <Palm
        frond="#2f7a62"
        lean={-1}
        scale={0.85}
        trunk="#6b4a2a"
        x={1230}
        y={372}
      />
      <Palm frond="#3f9a74" scale={1} trunk="#6b4a2a" x={1330} y={380} />
    </Scene>
  );
}

/** Clouds for the dawn sky: three soft shapes on their own slow clocks. */
export function Clouds() {
  const clouds = [
    { top: "2%", scale: 1, duration: "150s", delay: "-20s", opacity: 0.55 },
    { top: "72%", scale: 0.7, duration: "190s", delay: "-110s", opacity: 0.5 },
    { top: "80%", scale: 0.55, duration: "230s", delay: "-60s", opacity: 0.45 },
  ];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {clouds.map((c) => (
        <svg
          aria-hidden="true"
          className="absolute left-0 h-auto w-44"
          data-cloud=""
          focusable="false"
          key={c.top}
          style={{
            top: c.top,
            scale: String(c.scale),
            opacity: c.opacity,
            animationDuration: c.duration,
            animationDelay: c.delay,
          }}
          viewBox="0 0 176 56"
        >
          <path
            d="M14 48 C0 48 0 28 16 28 C16 12 40 6 52 20 C60 4 92 6 96 24 C110 14 134 20 134 36 C152 34 164 48 148 50 Z"
            fill="#fffaf0"
          />
        </svg>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Morning: the fish harbour. Boats hauled up on the sand, crates, gulls.
   -------------------------------------------------------------------------- */

/** A wooden fishing boat, side on, prow to the right, keel at the origin. */
function Boat({
  x,
  y,
  scale = 1,
  flip = false,
  hull,
  band,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  hull: string;
  band: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      <path
        d="M-6 -44 L4 -34 H128 L162 -70 L170 -66 L146 -14 Q138 0 116 0 H22 Q4 0 -2 -24Z"
        fill={hull}
        stroke="#10333d"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path d="M2 -30 H132 L127 -21 H6Z" fill={band} />
      <path
        d="M16 -10 H120 M40 -27 v6 M70 -27 v6 M100 -27 v6"
        fill="none"
        stroke="#10333d"
        strokeWidth="2"
      />
      <rect
        fill="#fffaf0"
        height="20"
        stroke="#10333d"
        strokeWidth="2"
        width="34"
        x="30"
        y="-54"
      />
      <path
        d="M86 -34 V-108 M86 -100 L118 -40"
        stroke="#10333d"
        strokeWidth="3"
      />
    </g>
  );
}

/** A gull as two arcs. */
function Gull({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d={`M${x} ${y} q${7 * s} ${-8 * s} ${14 * s} 0 q${7 * s} ${-8 * s} ${14 * s} 0`}
      fill="none"
      stroke="#10333d"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
  );
}

/** A fish crate, slats and all. */
function Crate({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        fill={fill}
        height="22"
        stroke="#10333d"
        strokeWidth="2"
        width="38"
        y="-22"
      />
      <path d="M0 -11 H38" stroke="#10333d" strokeWidth="1.5" />
      <path d="M5 -22 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0" fill="#c9d6d2" />
    </g>
  );
}

export function FishMarket() {
  return (
    <Scene>
      <Layer depth={0.15}>
        <rect fill="#bfdcd8" height="180" width="1440" y="225" />
        <g fill="#7fa9ae">
          <path
            d="M120 240 H260 L248 252 H132Z M170 240 V196 M210 240 V204"
            stroke="#7fa9ae"
            strokeWidth="3"
          />
          <path
            d="M1010 238 H1180 L1166 252 H1022Z M1060 238 V188 M1120 238 V198"
            stroke="#7fa9ae"
            strokeWidth="3"
          />
          <path
            d="M1240 244 H1330 L1320 254 H1250Z M1284 244 V214"
            stroke="#7fa9ae"
            strokeWidth="3"
          />
        </g>
        {[0, 1, 2].map((i) => (
          <rect
            fill="#fffaf0"
            height="3"
            key={i}
            opacity={0.7 - i * 0.15}
            rx="1.5"
            width={90 - i * 20}
            x={560 + i * 30}
            y={236 + i * 10}
          />
        ))}
      </Layer>
      <Layer depth={0.3}>
        <Gull x={420} y={140} />
        <Gull s={0.8} x={470} y={118} />
        <Gull s={0.7} x={880} y={150} />
        <Gull s={1.1} x={940} y={104} />
      </Layer>
      <Layer depth={0.5}>
        <path
          d="M0 284 C160 274 320 292 520 282 S900 270 1100 286 S1340 278 1440 282 V400 H0Z"
          fill="#8cc2bd"
        />
        <path
          d="M0 284 C160 274 320 292 520 282 S900 270 1100 286 S1340 278 1440 282"
          fill="none"
          stroke="#fffaf0"
          strokeDasharray="12 20"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </Layer>
      <Layer depth={0.8}>
        <path
          d="M0 318 C220 306 420 326 660 316 S1120 304 1440 320 V400 H0Z"
          fill="#ead2a0"
        />
        <Boat band="#2e8f98" hull="#f2b93b" scale={0.9} x={150} y={330} />
        <Boat band="#c24e2c" flip hull="#fffaf0" scale={0.8} x={1300} y={326} />
      </Layer>
      <path
        d="M0 352 C210 342 440 362 690 354 S1140 340 1440 352 V400 H0Z"
        fill="#e2c38a"
      />
      <path
        d="M0 352 C210 342 440 362 690 354 S1140 340 1440 352"
        fill="none"
        stroke="#cfa767"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <Boat band="#f2b93b" hull="#d9573a" scale={1.15} x={760} y={384} />
      <Crate fill="#2e8f98" x={560} y={384} />
      <Crate fill="#2e8f98" x={600} y={386} />
      <Crate fill="#f6e6c4" x={580} y={364} />
      <Crate fill="#d9573a" x={1010} y={388} />
      <path
        d="M440 390 q20 -14 46 -2 q-20 8 -46 2Z"
        fill="#10333d"
        opacity="0.25"
      />
      <ellipse cx="320" cy="384" fill="#cfa767" rx="16" ry="4" />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   Noon: the port. Skyline, a dome, gantry cranes, containers, a cargo ship.
   -------------------------------------------------------------------------- */

function Crane({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 292) scale(${scale})`}>
      <path
        d="M0 0 L8 -150 H20 L28 0 Z M52 0 L60 -150 H72 L80 0Z"
        fill="#10333d"
      />
      <path d="M-90 -150 H190 V-166 H-90Z" fill="#c24e2c" />
      <path
        d="M-90 -150 L-60 -170 H190"
        fill="none"
        stroke="#10333d"
        strokeWidth="3"
      />
      <path
        d="M0 -150 L66 -200 L132 -150"
        fill="none"
        stroke="#10333d"
        strokeWidth="3.5"
      />
      <rect fill="#10333d" height="14" width="22" x="130" y="-136" />
      <path d="M141 -136 V-150" stroke="#10333d" strokeWidth="2" />
    </g>
  );
}

function Containers({
  x,
  y,
  cols,
  rows,
  palette,
  seed,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  palette: string[];
  seed: number;
}) {
  const r = rng(seed);
  const boxes: ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      boxes.push(
        <rect
          fill={palette[Math.floor(r() * palette.length)]}
          height="17"
          key={`${row}-${col}`}
          stroke="#10333d"
          strokeWidth="1.5"
          width="40"
          x={x + col * 41}
          y={y - (row + 1) * 18}
        />,
      );
    }
  }
  return <>{boxes}</>;
}

export function Port() {
  const palette = ["#d9573a", "#f2b93b", "#2e8f98", "#1e4f63", "#f6e6c4"];
  return (
    <Scene>
      <Layer depth={0.2}>
        <Skyline base={262} fill="#b9dad8" maxH={120} minH={40} seed={11} />
      </Layer>
      <Layer depth={0.45}>
        <Skyline base={290} fill="#86bbbf" maxH={92} minH={26} seed={29} />
        <g fill="#86bbbf">
          <path d="M520 290 V232 Q520 200 548 200 Q576 200 576 232 V290Z" />
          <rect height="46" width="6" x="500" y="244" />
          <rect height="46" width="6" x="590" y="244" />
          <path d="M503 244 l3 -16 l3 16Z M593 244 l3 -16 l3 16Z" />
        </g>
      </Layer>
      <Layer depth={0.7}>
        <Crane scale={1.05} x={170} />
        <Crane scale={0.9} x={820} />
        <g>
          <path d="M1040 318 H1380 L1346 344 H1074Z" fill="#10333d" />
          <rect
            fill="#f6e6c4"
            height="26"
            stroke="#10333d"
            strokeWidth="2"
            width="44"
            x="1296"
            y="292"
          />
          <Containers
            cols={7}
            palette={palette}
            rows={2}
            seed={5}
            x={1062}
            y={318}
          />
        </g>
      </Layer>
      <Layer depth={0.9}>
        <Containers
          cols={9}
          palette={palette}
          rows={3}
          seed={3}
          x={36}
          y={346}
        />
        <Containers
          cols={6}
          palette={palette}
          rows={2}
          seed={8}
          x={560}
          y={346}
        />
      </Layer>
      <path
        d="M0 346 C240 336 460 356 720 348 S1180 334 1440 348 V400 H0Z"
        fill="#4f9ea6"
      />
      <path
        d="M0 346 C240 336 460 356 720 348 S1180 334 1440 348"
        fill="none"
        stroke="#fffaf0"
        strokeDasharray="12 16"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M0 376 C200 368 420 384 700 376 S1200 366 1440 378 V400 H0Z"
        fill="#3b8991"
      />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   Golden hour: dunes and date palms.
   -------------------------------------------------------------------------- */

export function Dunes() {
  return (
    <Scene>
      <Layer depth={0.2}>
        <path
          d="M0 250 C160 200 320 210 470 250 S740 290 920 240 S1250 190 1440 245 V400 H0Z"
          fill="#ecc16f"
        />
      </Layer>
      <Layer depth={0.5}>
        <path
          d="M0 300 C140 262 330 268 520 302 S860 330 1030 288 S1320 258 1440 296 V400 H0Z"
          fill="#dba552"
        />
        <path
          d="M520 302 C700 318 860 330 1030 288"
          fill="none"
          stroke="#c48b3c"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </Layer>
      <Layer depth={0.8}>
        <path
          d="M0 346 C220 316 430 326 640 350 S1080 372 1260 336 S1390 322 1440 334 V400 H0Z"
          fill="#c68a3f"
        />
        <Palm frond="#2f6b4a" scale={0.8} trunk="#6a4524" x={210} y={346} />
        <Palm
          frond="#3a7d56"
          lean={-1}
          scale={1}
          trunk="#6a4524"
          x={1090}
          y={368}
        />
        <Palm frond="#2f6b4a" scale={0.65} trunk="#6a4524" x={1190} y={352} />
      </Layer>
      <path
        d="M0 380 C300 366 560 388 820 378 S1240 366 1440 380 V400 H0Z"
        fill="#a9722f"
      />
      <path
        d="M120 372 q40 -6 80 0 M640 386 q50 -7 100 0 M1180 378 q40 -6 80 0"
        fill="none"
        stroke="#c48b3c"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   Dusk: the sun going into the sea, and a line of camels on the sand.
   -------------------------------------------------------------------------- */

export function Dusk() {
  return (
    <Scene>
      <Layer depth={0.15}>
        <circle cx="720" cy="255" fill="#f8d8a2" r="120" opacity="0.45" />
        <circle cx="720" cy="255" fill="#fbe7b8" r="84" />
        <rect fill="#b4698a" height="150" width="1440" y="255" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            fill="#fbe7b8"
            height="3"
            key={i}
            opacity={0.8 - i * 0.15}
            rx="1.5"
            width={150 - i * 28}
            x={645 + i * 14}
            y={266 + i * 10}
          />
        ))}
      </Layer>
      <Layer depth={0.45}>
        <path
          d="M0 292 C180 280 320 300 520 290 S900 278 1100 292 S1360 284 1440 290 V400 H0Z"
          fill="#8d5c88"
        />
      </Layer>
      <Layer depth={0.75}>
        <path
          d="M0 322 C200 310 400 332 640 320 S1080 308 1260 324 S1390 320 1440 318 V400 H0Z"
          fill="#684f7e"
        />
        <path
          d="M0 322 C200 310 400 332 640 320 S1080 308 1260 324 S1390 320 1440 318"
          fill="none"
          stroke="#f1c9a6"
          strokeDasharray="10 16"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </Layer>
      <path
        d="M0 352 C230 340 470 362 720 354 S1160 338 1440 352 V400 H0Z"
        fill="#48395e"
      />
      <g data-bob="">
        <CamelSilhouette fill="#251a38" scale={0.9} x={300} y={296} />
        <CamelSilhouette fill="#251a38" scale={1.05} x={410} y={288} />
        <CamelSilhouette fill="#251a38" scale={0.8} x={530} y={302} />
      </g>
      <Palm
        frond="#251a38"
        lean={-1}
        scale={0.95}
        trunk="#251a38"
        x={1250}
        y={372}
      />
    </Scene>
  );
}

/* --------------------------------------------------------------------------
   Night: stars, a moon, a harbour with a lit skyline and a lighthouse.
   -------------------------------------------------------------------------- */

/** The night sky. Fixed positions from a seed, so it never reshuffles. */
export function Stars() {
  const r = rng(77);
  const stars = Array.from({ length: 70 }, (_, i) => ({
    key: i,
    x: r() * 100,
    y: r() * 62,
    size: r() > 0.86 ? 3 : 2,
    twinkle: r() > 0.55,
    delay: `${(r() * 3).toFixed(2)}s`,
  }));
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {stars.map((s) => (
        <span
          className="absolute rounded-full bg-[#fbefd8]"
          data-twinkle={s.twinkle ? "" : undefined}
          key={s.key}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
      <svg
        aria-hidden="true"
        className="absolute top-6 right-[8%] h-auto w-14 md:top-[7%] md:w-24"
        focusable="false"
        viewBox="0 0 100 100"
      >
        <path d="M62 8 A42 42 0 1 0 62 92 A56 56 0 0 1 62 8Z" fill="#fbefd8" />
      </svg>
    </div>
  );
}

export function Harbour() {
  return (
    <Scene>
      <Layer depth={0.2}>
        <Skyline
          base={290}
          fill="#173a52"
          maxH={90}
          minH={24}
          seed={41}
          windows="#f2b93b"
        />
      </Layer>
      <Layer depth={0.45}>
        <g transform="translate(-300 0)">
          <path d="M1262 330 L1274 190 H1306 L1318 330Z" fill="#fbefd8" />
          <path
            d="M1268 262 H1312 L1314 278 H1266Z M1272 214 H1308 L1310 228 H1270Z"
            fill="#c24e2c"
          />
          <rect fill="#10333d" height="18" width="40" x="1270" y="170" />
          <rect fill="#f2b93b" height="14" width="30" x="1275" y="172" />
          <path d="M1268 170 H1312 L1290 148Z" fill="#c24e2c" />
          <defs>
            <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0">
              <stop offset="0" stopColor="#f2b93b" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f2b93b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M1290 178 L760 132 L760 224Z"
            data-beam=""
            fill="url(#beam)"
          />
          <path d="M1196 332 Q1290 308 1384 332 V342 H1196Z" fill="#0d2234" />
        </g>
      </Layer>
      <Layer depth={0.7}>
        <path
          d="M0 322 C200 312 420 330 680 320 S1100 310 1440 324 V400 H0Z"
          fill="#0f2c43"
        />
      </Layer>
      <path
        d="M0 356 C250 346 500 366 760 358 S1180 344 1440 358 V400 H0Z"
        fill="#09182a"
      />
      <path
        d="M1020 376 h60 M1060 386 h40 M1100 368 h34"
        fill="none"
        stroke="#fbefd8"
        strokeLinecap="round"
        strokeWidth="3"
        opacity="0.35"
      />

      <g data-bob="" transform="translate(250 0)">
        <path
          d="M262 338 H362 L346 358 H278Z"
          fill="#e0664a"
          stroke="#fbefd8"
          strokeWidth="2"
        />
        <path d="M312 338 V262 L366 336Z" fill="#fbefd8" />
        <path d="M306 338 V274 L272 336Z" fill="#f2b93b" />
        <circle cx="270" cy="332" fill="#f2b93b" r="3.5" />
      </g>
    </Scene>
  );
}
