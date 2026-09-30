import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updates } from "@/lib/content";

export function Updates() {
  return (
    <section id="updates" className="bg-white py-16 lg:py-[96px]">
      <div className="container-voomp grid items-center gap-12 lg:grid-cols-[561fr_607fr] lg:gap-[88px]">
        <Image
          src="/images/updates-phone.png"
          alt="Voomp Updates aberto no celular, com o relatório de status de assinatura"
          width={1122}
          height={1064}
          sizes="(max-width: 1024px) 100vw, 561px"
          className="h-auto w-full rounded-[20px]"
        />

        <div>
          <p className="eyebrow">{updates.eyebrow}</p>
          <h2 className="mt-4 text-h1 text-ink">
            {updates.title.map((line) => (
              <span key={line} className="block max-lg:inline">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[520px] text-body text-ink-muted">
            {updates.description}
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {updates.items.map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-orange/40">
                  <Check className="size-4 text-orange" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-base font-medium text-ink">{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant="brand" size="pill" className="mt-9">
            <Link href={updates.cta.href}>{updates.cta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
