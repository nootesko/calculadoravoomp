import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { cognaGroup } from "@/lib/content";

export function CognaGroup() {
  return (
    <section id="grupo-cogna" className="overflow-hidden bg-navy py-16 lg:pb-[81px] lg:pt-[81px]">
      <div className="container-voomp grid items-center gap-14 lg:grid-cols-[697fr_514fr] lg:gap-8">
        <div>
          <SectionHeading
            eyebrow={cognaGroup.eyebrow}
            title={cognaGroup.title}
            tone="dark"
            size="md"
          />

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {cognaGroup.stats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
              >
                <dt className="text-h3 text-white">{stat.value}</dt>
                <dd className="mt-3 text-body-sm text-white/70">{stat.description}</dd>
              </div>
            ))}
          </dl>

          <Button asChild variant="brand" size="pill" className="mt-10">
            <Link href={cognaGroup.cta.href}>{cognaGroup.cta.label}</Link>
          </Button>
        </div>

        <div className="relative lg:-mr-[10%]">
          <Image
            src="/images/cogna-orbit.png"
            alt="Marcas do Grupo Cogna orbitando a marca principal: Anhanguera, Pitágoras, Unopar, Somos, Anglo, Red Balloon e Voomp"
            width={1028}
            height={1580}
            sizes="(max-width: 1024px) 100vw, 560px"
            className="mx-auto h-auto w-full max-w-[560px]"
          />
        </div>
      </div>
    </section>
  );
}
