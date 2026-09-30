"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { features, featuresIntro, type Feature } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Features() {
  const [active, setActive] = useState<string>(featuresIntro.filters[0]);
  const visible =
    active === featuresIntro.filters[0]
      ? features
      : features.filter((feature) => feature.filter === active);

  return (
    <section id="recursos" className="bg-white py-16 lg:py-[55px]">
      <div className="container-voomp">
        <SectionHeading eyebrow={featuresIntro.eyebrow} title={featuresIntro.title} />

        <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar recursos">
          {featuresIntro.filters.map((filter) => {
            const selected = filter === active;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(filter)}
                className={cn(
                  "h-9 rounded-full border px-4 text-sm transition-colors",
                  selected
                    ? "border-orange bg-orange font-medium text-white"
                    : "border-[#d4d4d8] bg-white text-ink hover:border-orange hover:text-orange"
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        {visible.map((feature) => (
          <FeatureBlock key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureBlock({ feature }: { feature: Feature }) {
  const illustration = (
    <div className="relative">
      <Image
        src={feature.image}
        alt={feature.imageAlt}
        width={1122}
        height={916}
        sizes="(max-width: 1024px) 100vw, 561px"
        className="h-auto w-full rounded-[20px]"
      />
    </div>
  );

  const copy = (
    <div>
      <p className="eyebrow">{feature.eyebrow}</p>
      <h3 className="mt-4 text-h1 text-ink">
        {feature.title.map((line) => (
          <span key={line} className="block max-lg:inline">
            {line}{" "}
          </span>
        ))}
      </h3>

      <ul className="mt-7 flex flex-col gap-3.5">
        {feature.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-body text-[#374151]">
            <Check className="mt-0.5 size-4 shrink-0 text-ink" aria-hidden strokeWidth={2.5} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant="brand" size="pill" className="mt-8">
        <Link href={feature.cta.href}>{feature.cta.label}</Link>
      </Button>
    </div>
  );

  const imageFirst = feature.imageSide === "left";

  return (
    <div
      className={cn(
        "container-voomp grid items-center gap-12 py-12 lg:gap-16 lg:py-[62px]",
        imageFirst ? "lg:grid-cols-[561fr_655fr]" : "lg:grid-cols-[655fr_561fr]"
      )}
    >
      {/* The illustration always leads on mobile; on desktop it takes its Figma side. */}
      <div className={imageFirst ? undefined : "lg:order-2"}>{illustration}</div>
      <div className={imageFirst ? undefined : "lg:order-1"}>{copy}</div>
    </div>
  );
}
