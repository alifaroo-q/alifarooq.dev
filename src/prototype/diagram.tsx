/**
 * PROTOTYPE — throwaway. Stand-in for the checkable artifact #6 requires and
 * #9 settled the delivery of: an SVG that shares the MDX basename, read at
 * build time and inlined, so it inherits `currentColor`.
 *
 * Authored as a component here only because the content pipeline does not
 * exist yet. The point being tested is the ASSET CONSTRAINT, not the plumbing:
 *
 *   - every stroke and every glyph is `currentColor`; there is not one hex
 *   - emphasis is therefore stroke, opacity and inherited colour, never a hue
 *     baked into the asset
 *   - it must stay legible when a take inverts the ground under it
 *
 * REFINEMENT (take C): every state and every edge carries a stable `id` and a
 * set of `keys`. That is what lets the page dim the parts the current section
 * is not talking about — and it is the thing `currentColor` makes cheap, since
 * the page sets `color` on a group and the asset never learns about it.
 *
 * The cost, stated plainly: the three real SVG assets have to be AUTHORED with
 * these ids. A diagram exported from a drawing tool will not have them.
 */

const STROKE = "fill-none stroke-current";

/** Which prose section each part belongs to. Drives the scroll-linked focus. */
type PartProps = { keys: string[] };

function partAttrs(focus: string | null, keys: string[]) {
  return {
    "data-part": "",
    "data-active": focus === null || keys.includes(focus) ? "true" : "false",
  };
}

function State({
  x,
  y,
  label,
  keys,
  focus,
  terminal = false,
}: PartProps & {
  x: number;
  y: number;
  label: string;
  focus: string | null;
  terminal?: boolean;
}) {
  return (
    <g {...partAttrs(focus, keys)}>
      <rect
        x={x}
        y={y}
        width={168}
        height={46}
        className={STROKE}
        strokeWidth={terminal ? 1 : 1.5}
        strokeDasharray={terminal ? "3 3" : undefined}
      />
      <text
        x={x + 84}
        y={y + 28}
        textAnchor="middle"
        fill="currentColor"
        fontSize={13}
        fontFamily="var(--font-terminal), monospace"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * The arrowhead is drawn inline rather than as a `<marker>`, and that is not a
 * style preference. A marker's `currentColor` resolves against the MARKER's
 * inherited colour, not the referencing element's — so under the tracked focus
 * every dimmed edge kept a full-strength arrowhead. Inline, it sits in the
 * same `<g>` and dims with the rest of the edge.
 */
function Arrow({ x, y, dir }: { x: number; y: number; dir: "right" | "left" | "down" }) {
  const d =
    dir === "right"
      ? `M${x - 7},${y - 4} L${x},${y} L${x - 7},${y + 4}`
      : dir === "left"
        ? `M${x + 7},${y - 4} L${x},${y} L${x + 7},${y + 4}`
        : `M${x - 4},${y - 7} L${x},${y} L${x + 4},${y - 7}`;
  return <path d={d} className={STROKE} strokeWidth={1.2} />;
}

function Edge({
  d,
  label,
  lx,
  ly,
  keys,
  focus,
  tip,
}: PartProps & {
  d: string;
  label: string;
  lx: number;
  ly: number;
  focus: string | null;
  tip: { x: number; y: number; dir: "right" | "left" | "down" };
}) {
  return (
    <g {...partAttrs(focus, keys)}>
      <path d={d} className={STROKE} strokeWidth={1} />
      <Arrow {...tip} />
      <text
        x={lx}
        y={ly}
        textAnchor="middle"
        fill="currentColor"
        fontSize={10.5}
        opacity={0.72}
        fontFamily="var(--font-terminal), monospace"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Slot 1's artifact: the Gmail connection state machine.
 * Solid boxes are healthy states; dashed boxes are the two states where mail
 * has stopped moving. Dashes rather than red, because there is no red here —
 * see the file header.
 *
 * `focus` is a prose-section key, or null for "show the whole machine".
 */
export function GmailStateDiagram({
  className,
  focus = null,
}: {
  className?: string;
  focus?: string | null;
}) {
  return (
    <svg
      viewBox="0 0 760 300"
      className={className}
      role="img"
      aria-label="Gmail connection state machine. Connected leads to watch expiring, which leads to renewing. Renewing returns to connected on success, or falls to invalid on a revoked grant. Connected also falls to invalid when a token refresh fails. Invalid leads to disconnected, which returns to connected only after a human re-consents."
    >
      <State x={40} y={60} label="connected" focus={focus} keys={["decision"]} />
      <State x={296} y={60} label="watch expiring" focus={focus} keys={["decision"]} />
      <State x={552} y={60} label="renewing" focus={focus} keys={["decision"]} />
      <State x={552} y={210} label="invalid" terminal focus={focus} keys={["problem", "cost"]} />
      <State
        x={296}
        y={210}
        label="disconnected"
        terminal
        focus={focus}
        keys={["problem", "cost"]}
      />

      {/* the happy path, left to right */}
      <Edge
        d="M208,83 L288,83"
        tip={{ x: 288, y: 83, dir: "right" }}
        label="ttl < 24h"
        lx={248}
        ly={74}
        focus={focus}
        keys={["decision"]}
      />
      <Edge
        d="M464,83 L544,83"
        tip={{ x: 544, y: 83, dir: "right" }}
        label="renewal job"
        lx={504}
        ly={74}
        focus={focus}
        keys={["decision"]}
      />

      {/* renewed — loops back over the top */}
      <Edge
        d="M636,60 L636,28 L124,28 L124,56"
        tip={{ x: 124, y: 56, dir: "down" }}
        label="renewed"
        lx={380}
        ly={20}
        focus={focus}
        keys={["decision"]}
      />

      {/* the two ways it breaks */}
      <Edge
        d="M636,106 L636,206"
        tip={{ x: 636, y: 206, dir: "down" }}
        label="grant revoked"
        lx={698}
        ly={160}
        focus={focus}
        keys={["problem"]}
      />
      <Edge
        d="M180,106 L180,180 L588,180 L588,206"
        tip={{ x: 588, y: 206, dir: "down" }}
        label="refresh 401"
        lx={360}
        ly={172}
        focus={focus}
        keys={["problem"]}
      />
      <Edge
        d="M548,233 L468,233"
        tip={{ x: 468, y: 233, dir: "left" }}
        label="alert raised"
        lx={508}
        ly={224}
        focus={focus}
        keys={["cost"]}
      />

      {/* the only way back in is a human. Routed at x=70 so it clears the
          refresh-401 run at y=180 — no crossed edges anywhere in the graph. */}
      <Edge
        d="M296,233 L70,233 L70,110"
        tip={{ x: 70, y: 110, dir: "down" }}
        label="re-consent"
        lx={183}
        ly={250}
        focus={focus}
        keys={["cost"]}
      />
    </svg>
  );
}
