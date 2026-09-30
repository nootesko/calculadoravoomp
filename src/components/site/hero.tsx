import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { OrbitBackdrop } from "@/components/site/orbit-backdrop";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section id="top" className="relative bg-navy text-white">
      <OrbitBackdrop className="-top-[220px] bottom-auto h-[1155px]" />

      <div className="container-voomp relative pt-14 text-center sm:pt-[77px]">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 py-1.5 pl-1.5 pr-4 text-sm text-white/90">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange">
            <Image
              src="/logos/voomp-mark.svg"
              alt=""
              width={12}
              height={12}
              className="w-3"
            />
          </span>
          {hero.badge}
        </p>

        {/* Figma `text 5x large/leading-none/bold`: Inter Bold 48/48. */}
        <h1 className="mx-auto mt-8 max-w-[860px] text-display text-balance">
          {hero.title.map((line) => (
            <span key={line} className="block max-md:inline">
              {line}{" "}
            </span>
          ))}
        </h1>

        <Button asChild variant="brand" size="pill" className="mt-9">
          <Link href={hero.cta.href}>{hero.cta.label}</Link>
        </Button>
      </div>

      {/*
        In Figma the dashboard collage floats at y=423 inside a 715px navy band
        and is 503px tall, so ~139px (27% of the image) hangs over the white
        section below. The negative margin is a percentage of the 1059px wrapper
        so the overlap keeps its ratio at every width.
      */}
      <div className="relative mx-auto mt-10 w-full max-w-[1100px] px-4 sm:mt-12">
        <div className="relative z-20 -mb-[13%]">
          <Image
            src="/images/hero-dashboard.png"
            alt="Painel da Voomp com dashboard de vendas, checkout e relatórios"
            width={2259}
            height={1184}
            priority
            sizes="(max-width: 1140px) 100vw, 1100px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
