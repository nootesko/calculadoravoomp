"use client";

import Image from "next/image";
import { useRef } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { entrepreneurs } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Figma shows an overflowing card rail that bleeds past the right edge of the
 * container. Implemented as a drag/scroll rail so the extra cards stay reachable.
 */
export function Entrepreneurs() {
  const rail = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white py-14 lg:py-[22px]">
      <div className="container-voomp">
        <SectionHeading eyebrow={entrepreneurs.eyebrow} title={entrepreneurs.title} />
      </div>

      <div
        ref={rail}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto scroll-smooth px-5 pb-6 sm:px-8 lg:mt-16 lg:pl-12 xl:pl-[max(80px,calc((100vw-1440px)/2+80px))]"
      >
        {entrepreneurs.people.map((person) => (
          <figure
            key={person.name}
            className={cn(
              "relative shrink-0 snap-start overflow-hidden rounded-[20px] bg-navy",
              person.featured
                ? "aspect-[388/524] w-[280px] sm:w-[388px]"
                : "aspect-[288/424] w-[220px] sm:w-[288px]"
            )}
          >
            {/*
              The name and @handle are baked into the Figma card artwork, so the
              exported card is used as-is and the caption is mirrored for
              assistive tech instead of being drawn twice.
            */}
            <Image
              src={person.image}
              alt={person.handle ? `${person.name} — ${person.handle}` : person.name}
              width={person.featured ? 776 : 576}
              height={person.featured ? 1048 : 848}
              sizes="(max-width: 640px) 280px, 388px"
              className="size-full object-cover"
            />
            <figcaption className="sr-only">
              {person.name}
              {person.handle ? ` (${person.handle})` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
