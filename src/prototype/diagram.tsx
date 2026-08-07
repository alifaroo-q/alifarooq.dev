/**
 * PROTOTYPE — throwaway. Stand-in for the checkable artifact #6 requires and
 * #9 settled the delivery of: an SVG that shares the MDX basename, read at
 * build time and inlined, so it inherits `currentColor`.
 *
 * Authored as a component here only because the content pipeline does not
 * exist yet. The point being tested is the ASSET CONSTRAINT, not the plumbing:
 *
 *   - every stroke and every glyph is `currentColor`; there is not one hex
 *   - emphasis is therefore stroke and opacity, never hue
 *   - it must stay legible when a take inverts the ground under it
 *
 * That last rule is the one #10 already paid for once. A diagram authored on
 * a dark ground with a light stroke is a diagram that vanishes the moment the
 * page it sits on is printed, inverted, or read in light mode.
 */

const BOX = "fill-none stroke-current";

function State({
  x,
  y,
  label,
  terminal = false,
}: {
  x: number;
  y: number;
  label: string;
  terminal?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={168}
        height={46}
        className={BOX}
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

function Edge({ d, label, lx, ly }: { d: string; label: string; lx: number; ly: number }) {
  return (
    <g>
      <path d={d} className={BOX} strokeWidth={1} markerEnd="url(#arrow)" />
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
 */
export function GmailStateDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 300"
      className={className}
      role="img"
      aria-label="Gmail connection state machine. Connected leads to watch expiring, which leads to renewing. Renewing returns to connected on success, or falls to invalid on a revoked grant. Connected also falls to invalid when a token refresh fails. Invalid leads to disconnected, which returns to connected only after a human re-consents."
    >
      <defs>
        <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8" className={BOX} strokeWidth={1.2} />
        </marker>
      </defs>

      <State x={40} y={60} label="connected" />
      <State x={296} y={60} label="watch expiring" />
      <State x={552} y={60} label="renewing" />
      <State x={552} y={210} label="invalid" terminal />
      <State x={296} y={210} label="disconnected" terminal />

      {/* the happy path, left to right */}
      <Edge d="M208,83 L288,83" label="ttl < 24h" lx={248} ly={74} />
      <Edge d="M464,83 L544,83" label="renewal job" lx={504} ly={74} />

      {/* renewed — loops back over the top */}
      <Edge d="M636,60 L636,28 L124,28 L124,56" label="renewed" lx={380} ly={20} />

      {/* the two ways it breaks */}
      <Edge d="M636,106 L636,206" label="grant revoked" lx={698} ly={160} />
      <Edge d="M180,106 L180,180 L588,180 L588,206" label="refresh 401" lx={360} ly={172} />
      <Edge d="M548,233 L468,233" label="alert raised" lx={508} ly={224} />

      {/* the only way back in is a human. Routed at x=70 so it clears the
          refresh-401 run at y=180 — no crossed edges anywhere in the graph. */}
      <Edge d="M296,233 L70,233 L70,110" label="re-consent" lx={183} ly={250} />
    </svg>
  );
}
