import Image from "next/image";

import { gamification } from "@/lib/content";

export function Gamification() {
  return (
    <section className="bg-white pb-8 pt-4">
      <div className="container-voomp">
        {/*
          Figma: a 1280px navy panel with the level rail floating on top of it
          at x=-33 / width 1506 — the cards deliberately spill past both edges
          of the panel, so the rail is not clipped by it.
        */}
        <div className="rounded-[24px] bg-navy pb-14 pt-14 lg:pb-[47px] lg:pt-[64px]">
          <div className="px-6 sm:px-10 lg:px-16">
            <p className="eyebrow mb-4">{gamification.eyebrow}</p>
            <h2 className="text-h1 text-white">
              {gamification.title}
            </h2>
            <p className="mt-4 max-w-[820px] text-body text-white/70">
              {gamification.description}
            </p>
          </div>

          <div className="no-scrollbar mt-10 overflow-x-auto max-lg:-mx-[3%] lg:-mx-[6%]">
            <Image
              src={gamification.image}
              alt={gamification.imageAlt}
              width={2880}
              height={928}
              sizes="(max-width: 1440px) 1506px, 1506px"
              className="h-auto w-[1506px] max-w-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
