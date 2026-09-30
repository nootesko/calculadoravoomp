"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * The full-screen frame every tool screen sits inside: Voomp logo, an optional
 * progress rail, the content, and the footer actions. Deliberately has no site
 * navigation — the only way out is the discreet close control.
 */
export function ToolShell({
  progress,
  onClose,
  children,
  footer,
  scrollable = false,
  resetScrollKey,
  disclosure = false,
}: {
  /** 0–100. Omit to hide the rail (intro and result screens). */
  progress?: number;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  /** Change this to scroll back to the top — e.g. when the question changes. */
  resetScrollKey?: string | number;
  /**
   * Shows the commercial-use notice. Only the first screen of a tool sets this;
   * repeating it on every question was noise.
   */
  disclosure?: boolean;
}) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [resetScrollKey]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Progress rail, pinned to the very top edge. */}
      <div className="h-1 w-full shrink-0 bg-[#f1f1f3]">
        {progress !== undefined ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label="Progresso do diagnóstico"
            className="h-full bg-orange transition-[width] duration-500 ease-[var(--ease-out-brand)]"
            style={{ width: `${progress}%` }}
          />
        ) : null}
      </div>

      <header className="flex shrink-0 items-center justify-between px-5 py-5 sm:px-8">
        <Image
          src="/logos/voomp.svg"
          alt="Voomp"
          width={129}
          height={34}
          priority
          className="h-7 w-auto sm:h-8"
        />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-caption text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-brand"
          >
            Sair
          </button>
        ) : (
          <Link
            href="/ferramentas"
            className="rounded-full px-3 py-1.5 text-caption text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-brand"
          >
            Sair
          </Link>
        )}
      </header>

      {/*
        `my-auto` rather than `items-center`: it centres the content when there
        is room, but lets it start at the top once it is taller than the
        viewport — otherwise a long list of options pushes the question itself
        above the scroll area, out of reach.
      */}
      <main
        ref={mainRef}
        className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <div
          className={`mx-auto w-full px-5 py-8 sm:px-8 ${
            scrollable ? "max-w-[880px]" : "my-auto max-w-[720px]"
          }`}
        >
          {children}
        </div>
      </main>

      {footer || disclosure ? (
        <footer className="shrink-0 border-t border-border bg-white px-5 py-4 sm:px-8">
          <div
            className={`mx-auto flex w-full flex-col gap-3 ${scrollable ? "max-w-[880px]" : "max-w-[720px]"}`}
          >
            {footer}
            {disclosure ? (
              <p className="text-caption text-ink-muted/80">
                Essas informações podem ser usadas para prospecção comercial.{" "}
                <Link href="#privacidade" className="underline underline-offset-2 hover:text-ink">
                  Política de Privacidade
                </Link>
              </p>
            ) : null}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
