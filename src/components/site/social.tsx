import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { social } from "@/lib/content";

export function Social() {
  return (
    <section className="bg-navy pb-16 pt-16 lg:pb-[64px] lg:pt-[64px]">
      <div className="container-voomp">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <h2 className="text-h2 text-white">
            {social.title.map((line) => (
              <span key={line} className="block max-lg:inline">
                {line}{" "}
              </span>
            ))}
          </h2>
          <Button asChild variant="brand" size="pill" className="shrink-0">
            <Link href={social.cta.href}>{social.cta.label}</Link>
          </Button>
        </div>

        {/* Five reels sit side by side in Figma; exported as one strip that
            scrolls horizontally on narrow viewports. */}
        <div className="no-scrollbar mt-10 overflow-x-auto">
          <Image
            src="/images/social-strip.png"
            alt={`Reels da Voomp no Instagram, com ${social.plays.join(", ")} visualizações`}
            width={1280}
            height={353}
            sizes="1232px"
            className="h-auto w-[1232px] max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
