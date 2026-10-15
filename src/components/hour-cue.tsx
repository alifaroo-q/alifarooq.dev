import { Cue } from "@/components/cue";

/** The line on the scenery that names the next hour and links to it. */
export function HourCue({
  href,
  time,
  label,
}: {
  href: string;
  time: string;
  label: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--scene-h)+0.25rem)] z-10 flex justify-center md:bottom-6">
      <a
        className="pill pointer-events-auto min-h-11 max-w-[calc(100%-2rem)] gap-3 px-4 py-2 text-center text-sm"
        href={href}
      >
        <span className="font-mono text-foreground-label text-xs">{time}</span>
        <span className="font-semibold">
          <Cue label={label} />
        </span>
      </a>
    </div>
  );
}
