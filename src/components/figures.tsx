/** The figures that count up when seen. Each is a result a reader should notice. */
const COUNTED = /\b(7,000|31|49|28\.9|0\.5)\b/;

/**
 * A line of copy with its headline figures marked for the count-up in the
 * motion runtime. The figure's text is the real value; nothing here animates.
 */
export function Figures({ text }: { text: string }) {
  return text.split(COUNTED).map((part, i) =>
    i % 2 ? (
      <span data-count="" key={part}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
