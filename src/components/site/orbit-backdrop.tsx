import { cn } from "@/lib/utils";

/**
 * The dark sections in Figma share one decoration: two concentric hairline
 * circles (`Ellipse 3` 1155px and `Ellipse 2` 703px, stroke #4F6B95 @ 30%)
 * plus a handful of tiny glowing dots. Rebuilt in CSS so it scales fluidly.
 */
export function OrbitBackdrop({
  className,
  dots = DEFAULT_DOTS,
}: {
  className?: string;
  /** Percentage positions of the small glowing dots. */
  dots?: readonly { x: number; y: number; size?: number; bright?: boolean }[];
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute left-1/2 top-1/2 aspect-square w-[1155px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4F6B95]/30" />
      <div className="absolute left-1/2 top-1/2 aspect-square w-[703px] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4F6B95]/30" />

      {dots.map((dot, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full", dot.bright ? "bg-orange" : "bg-white/70")}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size ?? 3,
            height: dot.size ?? 3,
            boxShadow: dot.bright
              ? "0 0 12px 2px rgba(249,115,22,0.55)"
              : "0 0 10px 2px rgba(255,255,255,0.35)",
          }}
        />
      ))}
    </div>
  );
}

const DEFAULT_DOTS = [
  { x: 9, y: 55 },
  { x: 24, y: 31 },
  { x: 36, y: 63, bright: true },
  { x: 71, y: 21 },
  { x: 87, y: 60, bright: true },
  { x: 95, y: 15, size: 5 },
] as const;
