import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The design system adds semantic font sizes (`text-display`, `text-h1`, …).
 * tailwind-merge does not know them, so it would classify `text-display` and
 * `text-ink` as the same `text-*` group and drop the size — silently rendering
 * headings at body size. Registering them here keeps size and colour separate.
 */
const FONT_SIZES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "body-lg",
  "body",
  "body-sm",
  "caption",
  "metric",
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
