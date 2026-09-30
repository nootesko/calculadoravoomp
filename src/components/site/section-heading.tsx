import { cn } from "@/lib/utils";

/**
 * The design repeats one heading block: an orange letterspaced eyebrow, a bold
 * multi-line title and an optional lead paragraph. Titles are authored as an
 * array of lines so the Figma line breaks survive on wide viewports and collapse
 * naturally on narrow ones.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  size = "lg",
  className,
  descriptionClassName,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: readonly string[] | string;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "lg" | "md";
  className?: string;
  /** Lets a section narrow the lead paragraph to its Figma measure. */
  descriptionClassName?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const lines = typeof title === "string" ? [title] : title;

  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}

      <Heading
        className={cn(
          "text-balance",
          size === "lg" ? "text-display" : "text-h1",
          tone === "dark" ? "text-white" : "text-ink"
        )}
      >
        {lines.map((line, i) => (
          <span key={line} className="block max-lg:inline">
            {line}
            {i < lines.length - 1 ? <span className="lg:hidden"> </span> : null}
          </span>
        ))}
      </Heading>

      {description ? (
        <p
          className={cn(
            "mt-5 max-w-[720px] text-base leading-6",
            tone === "dark" ? "text-white/70" : "text-ink-muted",
            descriptionClassName
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
