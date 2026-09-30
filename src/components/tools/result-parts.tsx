import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ResultMetric, ResultOpportunity, ResultStatus } from "@/lib/tools/types";

/**
 * Status is always communicated three ways — icon, label and colour — so the
 * result never depends on colour alone.
 */
const STATUS: Record<
  ResultStatus,
  { icon: LucideIcon; text: string; bg: string; border: string; ring: string }
> = {
  positive: {
    icon: CheckCircle2,
    text: "text-positive",
    bg: "bg-positive-soft",
    border: "border-positive/25",
    ring: "bg-positive",
  },
  attention: {
    icon: AlertTriangle,
    text: "text-attention",
    bg: "bg-attention-soft",
    border: "border-attention/25",
    ring: "bg-attention",
  },
  negative: {
    icon: XCircle,
    text: "text-negative",
    bg: "bg-negative-soft",
    border: "border-negative/25",
    ring: "bg-negative",
  },
  info: {
    icon: Info,
    text: "text-info",
    bg: "bg-info-soft",
    border: "border-info/25",
    ring: "bg-info",
  },
};

export function StatusBadge({
  status,
  children,
  className,
}: {
  status: ResultStatus;
  children: React.ReactNode;
  className?: string;
}) {
  const style = STATUS[status];
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-caption font-semibold",
        style.bg,
        style.border,
        style.text,
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

export function ResultMetricCard({ metric }: { metric: ResultMetric }) {
  const style = STATUS[metric.status];
  return (
    <div className="relative overflow-hidden rounded-brand-2xl border border-border bg-white p-5">
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", style.ring)} />
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {metric.label}
      </p>
      <p className="mt-3 text-metric tabular-nums text-ink">{metric.value}</p>
      {metric.reference ? (
        <p className="mt-2 text-caption text-ink-muted">Referência: {metric.reference}</p>
      ) : null}
      <StatusBadge status={metric.status} className="mt-4">
        {metric.statusLabel}
      </StatusBadge>
      {metric.hint ? <p className="mt-3 text-caption text-ink-muted">{metric.hint}</p> : null}
    </div>
  );
}

export function BulletList({
  title,
  items,
  status,
}: {
  title: string;
  items: string[];
  status: ResultStatus;
}) {
  if (!items.length) return null;
  const style = STATUS[status];
  const Icon = style.icon;

  return (
    <div className="rounded-brand-2xl border border-border bg-white p-6">
      <h3 className="text-h5 text-ink">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body-sm text-ink-muted">
            <Icon className={cn("mt-0.5 size-4 shrink-0", style.text)} aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: ResultOpportunity }) {
  return (
    <div className="rounded-brand-2xl border border-orange/25 bg-orange/[0.04] p-6">
      <h3 className="text-h5 text-ink">{opportunity.title}</h3>
      <p className="mt-2 text-body-sm text-ink-muted">{opportunity.body}</p>
      {opportunity.cta ? (
        <Button asChild variant="brand" size="pill" className="mt-5">
          <Link href={opportunity.cta.href}>
            {opportunity.cta.label}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
