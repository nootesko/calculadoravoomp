import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { OrbitBackdrop } from "@/components/site/orbit-backdrop";
import { academic } from "@/lib/content";

export function Academic() {
  return (
    <section id="solucoes-academicas" className="bg-navy py-16 lg:pb-[49px] lg:pt-[48px]">
      <div className="container-voomp">
        <SectionHeading
          eyebrow={academic.eyebrow}
          title={academic.title}
          description={academic.description}
          tone="dark"
        />

        <div className="relative mt-14 overflow-hidden rounded-[20px] border border-white/10 px-6 py-16 text-center sm:py-20">
          <OrbitBackdrop
            dots={[
              { x: 13, y: 26 },
              { x: 29, y: 82, bright: true },
              { x: 5, y: 60 },
              { x: 78, y: 24, bright: true },
              { x: 92, y: 66 },
            ]}
          />
          <div className="relative">
            <h3 className="text-h2 text-white">
              {academic.cta.title.map((line) => (
                <span key={line} className="block max-sm:inline">
                  {line}{" "}
                </span>
              ))}
            </h3>
            <Button asChild variant="brand" size="pill" className="mt-7">
              <Link href={academic.cta.href}>{academic.cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
