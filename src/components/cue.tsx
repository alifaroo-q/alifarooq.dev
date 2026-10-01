const TRAILING_ARROW = /\s*([→↗↘↓>]+)\s*$/u;

const ROTATE: Record<string, number> = {
  "→": 0,
  ">": 0,
  "↘": 45,
  "↓": 90,
  "↗": -45,
};

/**
 * One drawn arrow, in one stroke weight, used wherever a link points somewhere.
 * It replaces typed arrow characters, whose weight and size change with the
 * font. `dir` is the rotation from pointing right; it is decorative and hidden
 * from assistive tech.
 */
export function Arrow({
  dir = 0,
  className,
}: {
  dir?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      style={{ rotate: `${dir}deg`, verticalAlign: "-0.125em" }}
      viewBox="0 0 16 16"
      width="1em"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/**
 * A call to action whose trailing arrow is drawn separately, so it can lean
 * toward where the link goes. The words before it are the label.
 */
export function Cue({ label }: { label: string }) {
  const arrow = TRAILING_ARROW.exec(label);
  if (!arrow) {
    return label;
  }
  const dir = ROTATE[arrow[1]] ?? 0;
  return (
    <>
      {label.slice(0, arrow.index)}{" "}
      <span
        aria-hidden="true"
        className="cue-arrow"
        data-dir={dir === 90 || dir === 45 ? "down" : undefined}
      >
        <Arrow dir={dir} />
      </span>
    </>
  );
}
