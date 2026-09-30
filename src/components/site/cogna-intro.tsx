import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreatorPhoto } from "@/components/site/creator-photo";
import { SectionHeading } from "@/components/site/section-heading";
import { cognaIntro } from "@/lib/content";

export function CognaIntro() {
  return (
    <section
      id="a-voomp"
      className="bg-white pb-20 pt-[22%] sm:pt-[18%] lg:pb-[86px] lg:pt-[170px]"
    >
      <div className="container-voomp grid items-center gap-16 lg:grid-cols-[561fr_655fr] lg:gap-16">
        <CreatorPhoto
          src="/images/feature-cogna.png"
          alt="Criadora gravando uma aula com celular e notebook"
        />

        <div className="max-lg:mt-16">
          <SectionHeading
            eyebrow={cognaIntro.eyebrow}
            title={cognaIntro.title}
            description={cognaIntro.description}
            descriptionClassName="max-w-[400px]"
          />
          <Button asChild variant="brand" size="pill" className="mt-8">
            <Link href={cognaIntro.cta.href}>{cognaIntro.cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
