/**
 * The hour whose section crosses the line `y` pixels below the top of the
 * viewport, or undefined when none does. The hour watcher runs it once on
 * mount, so the nav is right before the observer reports its first change.
 */
export function hourAt(
  hours: readonly { hour?: string; top: number; bottom: number }[],
  y: number,
) {
  return hours.find((h) => h.top <= y && h.bottom > y)?.hour;
}
