import Link from "next/link";
import { ChevronsRight } from "lucide-react";

import { banner } from "@/lib/content";

export function MarqueeBanner() {
  return (
    <Link
      href={banner.href}
      className="block bg-orange py-6 text-white transition-colors hover:bg-orange-hover"
    >
      <p className="container-voomp flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-base uppercase leading-[1.2] tracking-[0.01em] sm:text-lg lg:text-xl">
        <span>{banner.lead}</span>
        <span aria-hidden>·</span>
        <strong className="font-bold">{banner.strong1}</strong>
        <span>{banner.middle}</span>
        <strong className="font-bold">{banner.strong2}</strong>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-2">
          {banner.cta}
          <ChevronsRight className="size-5" aria-hidden />
        </span>
      </p>
    </Link>
  );
}
