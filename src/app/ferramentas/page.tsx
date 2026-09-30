import Image from "next/image";
import Link from "next/link";

import { CalculatorFooter } from "@/components/tools/calculator-footer";
import { CalculatorList } from "@/components/tools/calculator-list";

/**
 * No site chrome here, same as inside the tools: a centred logo, the intro and
 * the list. On desktop the intro stays put on the left while the list scrolls
 * on the right. The only footer is the commercial-use disclosure.
 */
export default function FerramentasPage() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <header className="flex justify-center px-5 pt-8 sm:pt-10">
        <Link href="/" aria-label="Voomp — página inicial" className="rounded-brand-md focus-brand">
          <Image
            src="/logos/voomp.svg"
            alt="Voomp"
            width={129}
            height={34}
            priority
            className="h-8 w-auto"
          />
        </Link>
      </header>

      <div className="container-voomp pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <h1 className="max-w-[20ch] text-h1 text-balance text-ink">
              Entenda melhor o seu negócio antes de tomar a próxima decisão.
            </h1>
            <p className="mt-5 max-w-[44ch] text-body text-ink-muted">
              Calculadoras e diagnósticos gratuitos para quem vende conhecimento online.
            </p>
            <p className="mt-3 max-w-[44ch] text-body-sm text-ink-muted/80">
              Suas respostas ficam salvas neste navegador e valem para todas as ferramentas.
            </p>
          </div>

          <CalculatorList />
        </div>

        <CalculatorFooter />
      </div>
    </main>
  );
}
