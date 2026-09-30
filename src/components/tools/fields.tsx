"use client";

import { useId } from "react";
import { Check, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/lib/tools/types";

/**
 * Interaction primitives for the diagnostics. All of them are real form
 * controls under the hood (radio / checkbox / input) so keyboard navigation and
 * screen readers work; the card look and the motion sit on top of that.
 */

const CARD_BASE =
  "group relative flex cursor-pointer items-center gap-4 rounded-brand-xl border bg-white p-4 text-left" +
  " transition-[border-color,box-shadow,transform,background-color] duration-200" +
  " hover:border-orange/60 hover:shadow-card active:scale-[0.99]" +
  " has-focus-visible:ring-3 has-focus-visible:ring-orange/40";
const CARD_ON = "border-orange bg-orange/[0.05] shadow-card";
const CARD_OFF = "border-border";

/** Entrance stagger — capped so long option lists never feel slow. */
const delayOf = (index: number) => ({ animationDelay: `${Math.min(index, 8) * 45}ms` });

function Indicator({ checked, round }: { checked: boolean; round?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center border transition-colors duration-200",
        round ? "rounded-full" : "rounded-brand-sm",
        checked ? "border-orange bg-orange text-white" : "border-[#d4d4d8] bg-white"
      )}
    >
      {checked ? <Check className="size-3 animate-check" strokeWidth={3} /> : null}
    </span>
  );
}

/** The keyboard hint shown on the right of each card (1-9 selects). */
function Hotkey({ index }: { index: number }) {
  if (index > 8) return null;
  return (
    <span
      aria-hidden
      className="ml-auto hidden size-6 shrink-0 items-center justify-center rounded-brand-sm border border-border text-caption text-ink-muted/70 transition-colors group-hover:border-orange/40 group-hover:text-orange sm:flex"
    >
      {index + 1}
    </span>
  );
}

export function SelectCards({
  name,
  options,
  value,
  onChange,
  columns = 1,
}: {
  name: string;
  options: QuestionOption[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {options.map((option, index) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            style={delayOf(index)}
            className={cn(CARD_BASE, "animate-rise", checked ? CARD_ON : CARD_OFF)}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <Indicator checked={checked} round />
            <span className="min-w-0">
              <span className="block text-body-sm font-semibold text-ink">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-caption text-ink-muted">{option.description}</span>
              ) : null}
            </span>
            <Hotkey index={index} />
          </label>
        );
      })}
    </div>
  );
}

export function MultiSelectCards({
  name,
  options,
  value = [],
  onChange,
  columns = 2,
}: {
  name: string;
  options: QuestionOption[];
  value?: string[];
  onChange: (value: string[]) => void;
  columns?: 1 | 2 | 3;
}) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);

  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {options.map((option, index) => {
        const checked = value.includes(option.value);
        return (
          <label
            key={option.value}
            style={delayOf(index)}
            className={cn(CARD_BASE, "animate-rise", checked ? CARD_ON : CARD_OFF)}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => toggle(option.value)}
              className="sr-only"
            />
            <Indicator checked={checked} />
            <span className="min-w-0">
              <span className="block text-body-sm font-semibold text-ink">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-caption text-ink-muted">{option.description}</span>
              ) : null}
            </span>
            <Hotkey index={index} />
          </label>
        );
      })}
    </div>
  );
}

const INPUT_BASE =
  "h-16 w-full rounded-brand-xl border border-border bg-white px-5 text-h3 text-ink transition-colors duration-200" +
  " placeholder:font-normal placeholder:text-ink-muted/50 focus-brand focus-visible:border-orange";

export function MoneyInput({
  value,
  onChange,
  placeholder,
  id,
  autoFocus,
}: {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative animate-rise">
      <span
        aria-hidden
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-h3 font-normal text-ink-muted"
      >
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        value={value === undefined ? "" : value.toLocaleString("pt-BR")}
        placeholder={placeholder ?? "0"}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "");
          onChange(digits ? Number(digits) : undefined);
        }}
        className={cn(INPUT_BASE, "pl-14 tabular-nums")}
      />
    </div>
  );
}

export function PercentInput({
  value,
  onChange,
  placeholder,
  id,
  autoFocus,
}: {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  id?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative animate-rise">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        value={value === undefined ? "" : String(value).replace(".", ",")}
        placeholder={placeholder ?? "0,0"}
        onChange={(event) => {
          const raw = event.target.value.replace(",", ".").replace(/[^\d.]/g, "");
          onChange(raw === "" ? undefined : Number(raw));
        }}
        className={cn(INPUT_BASE, "pr-14 tabular-nums")}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-h3 font-normal text-ink-muted"
      >
        %
      </span>
    </div>
  );
}

export function NumberStepper({
  value,
  onChange,
  unit,
  placeholder,
  min = 0,
  id,
  autoFocus,
}: {
  value?: number;
  onChange: (value: number | undefined) => void;
  unit?: string;
  placeholder?: string;
  min?: number;
  id?: string;
  autoFocus?: boolean;
}) {
  const step = (delta: number) => onChange(Math.max(min, (value ?? 0) + delta));

  return (
    <div className="flex animate-rise items-stretch gap-2">
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Diminuir"
        className="flex size-16 shrink-0 items-center justify-center rounded-brand-xl border border-border bg-white text-ink transition-all duration-200 hover:border-orange hover:text-orange active:scale-95 focus-brand"
      >
        <Minus className="size-5" aria-hidden />
      </button>
      <div className="relative flex-1">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoFocus={autoFocus}
          value={value === undefined ? "" : value.toLocaleString("pt-BR")}
          placeholder={placeholder}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            onChange(digits ? Number(digits) : undefined);
          }}
          className={cn(INPUT_BASE, "text-center tabular-nums", unit && "pr-20")}
        />
        {unit ? (
          <span
            aria-hidden
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-body-sm text-ink-muted"
          >
            {unit}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Aumentar"
        className="flex size-16 shrink-0 items-center justify-center rounded-brand-xl border border-border bg-white text-ink transition-all duration-200 hover:border-orange hover:text-orange active:scale-95 focus-brand"
      >
        <Plus className="size-5" aria-hidden />
      </button>
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  id,
  autoComplete,
  autoFocus,
  className,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const fallbackId = useId();
  return (
    <input
      id={id ?? fallbackId}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={cn(INPUT_BASE, className)}
    />
  );
}
