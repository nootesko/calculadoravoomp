import { SectionHeading } from "@/components/site/section-heading";
import { support } from "@/lib/content";

export function Support() {
  return (
    <section id="suporte" className="bg-white pt-16 lg:pt-[57px]">
      <div className="container-voomp">
        <SectionHeading
          eyebrow={support.eyebrow}
          title={support.title}
          description={support.description}
        />
      </div>
    </section>
  );
}
