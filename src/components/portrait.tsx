import Image from "next/image";
import { PERSON_NAME, PORTRAIT_SRC } from "@/lib/site";

/**
 * The portrait, in an arched window with the dawn sun behind it.
 *
 * The arch is the doorway shape of the old city, and the sun is a plain disc
 * that sits half behind the frame, so the photograph reads as somebody
 * standing in the morning. The image is square at 640px and shown at a fraction
 * of that, which is the retina copy; width and height are stated so the box
 * costs no layout shift.
 */
export function Portrait({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative mx-auto w-full max-w-[13rem] sm:max-w-[19rem]">
        <div
          aria-hidden="true"
          className="absolute -top-8 -left-8 size-36 rounded-full bg-[#f8d99a] ring-[10px] ring-[#fbe9c7]/70 md:size-44"
        />
        <div className="paper arch relative overflow-hidden p-0">
          <Image
            alt={PERSON_NAME}
            className="aspect-[4/5] w-full object-cover object-top"
            height={400}
            priority
            sizes="(min-width: 768px) 19rem, 80vw"
            src={PORTRAIT_SRC}
            width={320}
          />
        </div>
      </div>
    </div>
  );
}
