import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { OrbitBackdrop } from "@/components/site/orbit-backdrop";
import { pricing } from "@/lib/content";

export function Pricing() {
  return (
    <section id="precos" className="bg-navy py-16 lg:pb-[57px] lg:pt-[60px]">
      <div className="container-voomp">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          description={pricing.description}
          tone="dark"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.price}
              className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 pb-7"
            >
              <TierIcon name={tier.icon} />
              <p className="mt-8 text-[28px] font-bold leading-none text-white sm:text-[32px]">
                {tier.price}
              </p>
              <p className="mt-3 text-sm text-white/60">{tier.note}</p>
            </div>
          ))}
        </div>

        {/* "Descubra agora quanto você pode ganhar" CTA panel. */}
        <div className="relative mt-8 overflow-hidden rounded-[20px] border border-white/10 px-6 py-16 text-center sm:py-20">
          <OrbitBackdrop
            dots={[
              { x: 17, y: 22 },
              { x: 32, y: 78, bright: true },
              { x: 6, y: 55 },
              { x: 74, y: 30, bright: true },
              { x: 88, y: 70 },
            ]}
          />
          <div className="relative">
            <h3 className="text-h2 text-white">
              {pricing.cta.title.map((line) => (
                <span key={line} className="block max-sm:inline">
                  {line}{" "}
                </span>
              ))}
            </h3>
            <Button asChild variant="brand" size="pill" className="mt-7">
              <Link href={pricing.cta.href}>{pricing.cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TierIcon({ name }: { name: string }) {
  if (name === "award") {
    // Exported from Figma (`Ativo 3 1`) — the other two are Font Awesome glyphs
    // in the design, matched here with the closest Lucide line icons.
    return (
      <Image
        src="/icons/pricing-award.svg"
        alt=""
        width={30}
        height={41}
        className="h-10 w-auto"
      />
    );
  }
  const Icon = name === "cap" ? GraduationCap : Ticket;
  return <Icon className="size-9 text-orange" strokeWidth={1.5} aria-hidden />;
}
