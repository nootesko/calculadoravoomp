import Image from "next/image";
import { Play } from "lucide-react";

import { cognaIntro } from "@/lib/content";
import { cn } from "@/lib/utils";

const { overlay } = cognaIntro;

/**
 * Two sections reuse the same treatment: a creator photo with a floating
 * "Validado Oficialmente" badge and a course-progress card. Percentages come
 * from the Figma group `1171274774` measured against the 561×458 photo slot.
 */
export function CreatorPhoto({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        width={1122}
        height={916}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 561px"
        className="h-auto w-full rounded-[20px]"
      />

      {/* Frame 47505 — exported from Figma so the lockup stays pixel-accurate. */}
      <Image
        src="/icons/badge-validado.svg"
        alt={overlay.badge.join(" ")}
        width={175}
        height={64}
        className="absolute left-[52%] top-[36%] w-[46%] drop-shadow-[0_10px_15px_rgba(0,0,0,0.08)] sm:left-[75%] sm:top-[52%] sm:w-[31%]"
      />

      {/* Frame 1171275380 — rebuilt in markup so the copy stays real text. */}
      <div className="absolute left-[24%] top-[70%] flex w-[74%] items-center gap-3 rounded-xl bg-white p-3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] sm:left-[39%] sm:w-[56%]">
        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-navy">
          <Image
            src={src}
            alt=""
            width={1122}
            height={916}
            aria-hidden
            className="absolute inset-0 size-full object-cover object-[38%_28%]"
          />
          <Play className="relative size-4 fill-white text-white" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-[1.25] text-ink">
            {overlay.card.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">{overlay.card.subtitle}</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-orange"
              style={{ width: `${overlay.card.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
