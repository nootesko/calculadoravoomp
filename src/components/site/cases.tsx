"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeading } from "@/components/site/section-heading";
import { cases } from "@/lib/content";

export function Cases() {
  const [index, setIndex] = useState(0);
  const item = cases.items[index];
  const total = cases.items.length;

  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <section id="cases" className="bg-white py-16 lg:pb-[68px] lg:pt-[58px]">
      <div className="container-voomp">
        <SectionHeading eyebrow={cases.eyebrow} title={cases.title} />

        <figure className="mt-12 grid items-center gap-10 lg:grid-cols-[512fr_680fr] lg:gap-[88px]">
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={1024}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 512px"
            className="h-auto w-full rounded-[20px]"
          />

          <div>
            <span aria-hidden className="block font-serif text-[64px] leading-[0.6] text-orange">
              &ldquo;
            </span>

            <p className="mt-6 text-h4 text-ink">
              {item.headline}
            </p>

            <blockquote className="mt-5 text-body text-ink-muted">
              {item.quote}
            </blockquote>

            <figcaption className="mt-8 text-sm leading-[1.5] text-ink-muted">
              {item.author.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </figcaption>

            <div className="mt-8 flex gap-3">
              <NavButton label="Case anterior" disabled={total < 2} onClick={() => go(-1)}>
                <ChevronLeft className="size-4" aria-hidden />
              </NavButton>
              <NavButton label="Próximo case" disabled={total < 2} onClick={() => go(1)}>
                <ChevronRight className="size-4" aria-hidden />
              </NavButton>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}

function NavButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-orange text-orange transition-colors hover:bg-orange hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-orange"
    >
      {children}
    </button>
  );
}
