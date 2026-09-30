"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CALCULATORS, completionOf } from "@/lib/tools/registry";
import { useTools } from "@/lib/tools/store";
import type { Calculator } from "@/lib/tools/types";

/**
 * The hub home is a single list: one row per calculator, separated by
 * hairlines, no cards. Each row carries its own status (not started, in
 * progress, done), so there is no separate "your diagnostics" panel to keep
 * in sync. Reads the registry on the client so calculator definitions — which
 * carry functions and icon components — never cross the server boundary.
 */
export function CalculatorList() {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {CALCULATORS.map((calculator) => (
        <li key={calculator.slug}>
          <CalculatorRow calculator={calculator} />
        </li>
      ))}
    </ul>
  );
}

function CalculatorRow({ calculator }: { calculator: Calculator }) {
  const { profile, ready } = useTools();
  const progress = ready ? completionOf(calculator, profile) : null;
  const Icon = calculator.icon;

  const state =
    progress && progress.percent === 100
      ? "done"
      : progress && progress.percent > 0
        ? "started"
        : "new";

  const action =
    state === "done" ? "Ver resultado" : state === "started" ? "Continuar" : "Começar";

  const detail =
    state === "done"
      ? "Concluído"
      : state === "started" && progress
        ? `${progress.answered} de ${progress.total} respondidas`
        : `${calculator.minutes} min`;

  return (
    <Link
      href={`/ferramentas/${calculator.slug}`}
      className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 rounded-brand-md py-6 focus-brand sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-7"
    >
      <Icon
        className="mt-0.5 size-5 text-ink-muted transition-colors group-hover:text-orange"
        aria-hidden
      />

      <div className="min-w-0">
        <h2 className="text-h5 text-ink transition-colors group-hover:text-orange">
          {calculator.name}
        </h2>
        <p className="mt-1 max-w-[52ch] text-body-sm text-ink-muted">{calculator.tagline}</p>
      </div>

      <div className="col-start-2 mt-3 flex items-baseline gap-3 sm:col-start-3 sm:mt-0 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-body-sm font-semibold text-orange">
          {action}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
        <span className="whitespace-nowrap text-caption tabular-nums text-ink-muted">
          {detail}
        </span>
      </div>
    </Link>
  );
}
