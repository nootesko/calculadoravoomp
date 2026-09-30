import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { platform } from "@/lib/content";

export function Platform() {
  return (
    <section id="plataforma" className="relative overflow-hidden bg-navy py-16 lg:py-24">
      {/* Figma places the hairline ellipses off to the right of this band. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[214px] left-[768px] aspect-square w-[1155px] max-w-none rounded-full border border-[#4F6B95]/30" />
        <div className="absolute top-[13px] left-[994px] aspect-square w-[703px] max-w-none rounded-full border border-[#4F6B95]/30" />
      </div>

      <div className="container-voomp relative grid items-center gap-14 lg:grid-cols-[655fr_561fr] lg:gap-6">
        <div>
          <SectionHeading
            eyebrow={platform.eyebrow}
            title={platform.title}
            tone="dark"
            size="md"
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {platform.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-h3 text-white">{card.title}</h3>
                <p className="mt-3 text-body-sm text-white/70">{card.description}</p>
              </div>
            ))}
          </div>

          <Button asChild variant="brand" size="pill" className="mt-10">
            <Link href={platform.cta.href}>{platform.cta.label}</Link>
          </Button>
        </div>

        {/*
          Figma places this mockup at x=1511 of a 1440px frame, so it bleeds off
          the right edge of the viewport. The negative margin reproduces that.
        */}
        <div className="relative lg:-mr-[28%]">
          <Image
            src="/images/platform-mockup.png"
            alt="Dashboard da Voomp aberto no navegador, com menu lateral e relatórios de vendas"
            width={1422}
            height={1370}
            sizes="(max-width: 1024px) 100vw, 780px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
