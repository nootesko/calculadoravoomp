import Link from "next/link";

/**
 * Present on every screen of every tool, per the blueprint: the commercial use
 * of the data is disclosed plainly, kept visually secondary but never hidden.
 */
export function CalculatorFooter() {
  return (
    <footer className="mt-16 border-t border-border pt-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
        <span>Essas informações podem ser usadas para prospecção comercial.</span>
        <Link href="#privacidade" className="underline underline-offset-2 hover:text-ink">
          Política de Privacidade
        </Link>
      </p>
    </footer>
  );
}
