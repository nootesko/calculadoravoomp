"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Clock, RotateCcw } from "lucide-react";

import {
  BulletList,
  OpportunityCard,
  ResultMetricCard,
  StatusBadge,
} from "@/components/tools/result-parts";
import { Button } from "@/components/ui/button";
import { CALCULATORS, completionOf, getCalculator } from "@/lib/tools/registry";
import { useTools } from "@/lib/tools/store";
import type { Calculator } from "@/lib/tools/types";

export function ResultScreen({
  calculator,
  onRestart,
}: {
  calculator: Calculator;
  onRestart: () => void;
}) {
  const { profile } = useTools();
  const result = useMemo(() => calculator.compute(profile), [calculator, profile]);
  const next = calculator
    .crossSell(profile, result)
    .map((slug) => getCalculator(slug))
    .filter((item): item is Calculator => Boolean(item))
    .filter((item) => completionOf(item, profile).percent < 100)
    .slice(0, 2);

  const suggestions = next.length
    ? next
    : CALCULATORS.filter((item) => item.slug !== calculator.slug).slice(0, 2);

  return (
    <div className="mt-10">
      <p className="eyebrow">Seu diagnóstico</p>
      <h1 className="mt-4 text-h1 text-ink">{result.headline}</h1>

      {/* Primary indicator */}
      <div className="mt-8 overflow-hidden rounded-brand-3xl bg-navy p-8 text-white sm:p-10">
        <p className="text-caption font-semibold uppercase tracking-[0.12em] text-white/60">
          {result.primary.label}
        </p>
        <p className="mt-3 text-display tabular-nums">{result.primary.value}</p>
        {result.primary.hint ? (
          <p className="mt-3 max-w-[46ch] text-body-sm text-white/70">{result.primary.hint}</p>
        ) : null}

        <StatusBadge status={result.status} className="mt-6 border-white/20 bg-white/10 text-white">
          {result.statusLabel}
        </StatusBadge>

        {result.secondary?.length ? (
          <dl className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
            {result.secondary.map((item) => (
              <div key={item.label}>
                <dt className="text-caption uppercase tracking-[0.12em] text-white/50">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-h3 tabular-nums text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {/* Metrics */}
      {result.metrics.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {result.metrics.map((metric) => (
            <ResultMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      ) : null}

      {/* Narrative */}
      <section className="mt-10">
        <h2 className="text-h3 text-ink">Por que chegamos nesse resultado</h2>
        <p className="mt-4 whitespace-pre-line text-body text-ink-muted">
          {stripEmphasis(result.analysis)}
        </p>
      </section>

      {/* Only split into two columns when both lists actually have content. */}
      <div
        className={
          result.positives.length && result.attentions.length
            ? "mt-8 grid gap-4 sm:grid-cols-2"
            : "mt-8 grid gap-4"
        }
      >
        <BulletList title="Pontos positivos" items={result.positives} status="positive" />
        <BulletList title="Pontos de atenção" items={result.attentions} status="attention" />
      </div>

      {result.opportunities.length ? (
        <section className="mt-10">
          <h2 className="text-h3 text-ink">Oportunidades</h2>
          <div className="mt-4 flex flex-col gap-4">
            {result.opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.title} opportunity={opportunity} />
            ))}
          </div>
        </section>
      ) : null}

      {result.disclaimer ? (
        <p className="mt-8 rounded-brand-xl border border-border bg-surface-muted p-4 text-caption text-ink-muted">
          {result.disclaimer}
        </p>
      ) : null}

      {/* Cross-sell */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-h3 text-ink">Próximo diagnóstico recomendado</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {suggestions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.slug}
                href={`/ferramentas/${item.slug}`}
                className="group rounded-brand-2xl border border-border bg-white p-6 transition-all hover:border-orange/50 hover:shadow-float"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-brand-lg bg-orange/10 text-orange">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-h5 text-ink">{item.shortName}</h3>
                <p className="mt-2 text-body-sm text-ink-muted">{item.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-orange">
                  Começar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-caption text-ink-muted">
                  <Clock className="size-3.5" aria-hidden />~{item.minutes} min
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button variant="outline" size="pill" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Refazer este diagnóstico
        </Button>
        <Button asChild variant="ghost" size="pill">
          <Link href="/ferramentas">Ver todas as ferramentas</Link>
        </Button>
      </div>
    </div>
  );
}

/** The mocked services use **bold** markers; render them as plain text for now. */
function stripEmphasis(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}
