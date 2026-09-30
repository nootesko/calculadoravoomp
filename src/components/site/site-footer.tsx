"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronUp, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InstagramIcon,
  LinkedinIcon,
  SpotifyIcon,
  YoutubeIcon,
} from "@/components/site/social-icons";
import { footer } from "@/lib/content";

const ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  spotify: SpotifyIcon,
} as const;

export function SiteFooter() {
  return (
    <footer className="bg-navy pb-16 pt-16 text-white lg:pb-[96px] lg:pt-[96px]">
      <div className="container-voomp">
        <div className="grid gap-10 lg:grid-cols-4">
          <Link href="#top" aria-label="Voomp — voltar ao topo">
            <Image
              src="/logos/voomp-white.svg"
              alt="Voomp"
              width={136}
              height={37}
              className="h-[37px] w-auto"
            />
          </Link>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-h5 text-white">{column.title}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex items-center gap-4 lg:items-start lg:justify-end">
            <Link
              href={footer.login.href}
              className="text-sm font-medium text-orange transition-colors hover:text-orange-hover"
            >
              {footer.login.label}
            </Link>
            <Button asChild variant="brand" size="pill" className="font-medium">
              <Link href={footer.signup.href}>{footer.signup.label}</Link>
            </Button>
          </div>
        </div>

        <hr className="my-14 border-white/10" />

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-base text-white/60">{footer.tagline}</p>
          <ul className="flex gap-3">
            {footer.socials.map((item) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS];
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-orange hover:text-orange"
                  >
                    <Icon className="size-4" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <hr className="my-14 border-white/10" />

        <div className="flex flex-col items-center justify-between gap-6 text-sm text-white/60 sm:flex-row">
          <p>{footer.copyright}</p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 text-white transition-opacity hover:opacity-80"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-orange">
              <ChevronUp className="size-4 text-white" aria-hidden />
            </span>
            {footer.backToTop}
          </button>

          <p className="flex items-center gap-1.5 text-center">
            {footer.madeWith.before}
            <Heart className="size-4 fill-white text-white" aria-hidden />
            <span className="sr-only">amor</span>
            {footer.madeWith.after}
          </p>
        </div>
      </div>
    </footer>
  );
}
