"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { nav } from "@/lib/content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="container-voomp flex h-[72px] items-center justify-between gap-3 2xl:gap-6">
        <Link href="#top" className="shrink-0" aria-label="Voomp — página inicial">
          <Image
            src="/logos/voomp.svg"
            alt="Voomp"
            width={129}
            height={34}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Principal">
          {nav.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-2.5 text-base font-medium text-[#18181b] transition-colors hover:text-orange 2xl:px-4"
            >
              {link.label}
              {link.hasMenu ? (
                <ChevronDown className="size-4 text-[#18181b]/70" aria-hidden />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="brandGhost"
            size="pill"
            className="max-sm:hidden font-medium"
          >
            <Link href={nav.login.href}>{nav.login.label}</Link>
          </Button>
          <Button asChild variant="brand" size="pill" className="font-medium">
            <Link href={nav.signup.href}>{nav.signup.label}</Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="ml-1 flex size-10 items-center justify-center rounded-md text-ink xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-border bg-white xl:hidden">
          <nav className="container-voomp flex flex-col py-2" aria-label="Principal (mobile)">
            {nav.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3 text-base font-medium text-[#18181b]"
              >
                {link.label}
                {link.hasMenu ? <ChevronDown className="size-4" aria-hidden /> : null}
              </Link>
            ))}
            <Link
              href={nav.login.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-orange sm:hidden"
            >
              {nav.login.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
