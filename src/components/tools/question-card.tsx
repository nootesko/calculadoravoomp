"use client";

import { useId } from "react";

import {
  MoneyInput,
  MultiSelectCards,
  NumberStepper,
  PercentInput,
  SelectCards,
  TextInput,
} from "@/components/tools/fields";
import type { ProducerProfile, Question } from "@/lib/tools/types";

/**
 * One question, alone on the screen. The label is the visual anchor, so it is
 * typeset as a heading rather than a form label.
 */
export function QuestionCard({
  question,
  profile,
  onAnswer,
  sectionLabel,
}: {
  question: Question;
  profile: ProducerProfile;
  onAnswer: (field: keyof ProducerProfile, value: unknown) => void;
  sectionLabel?: string;
}) {
  const id = useId();
  const headingId = `${id}-label`;
  const value = profile[question.field];
  const isInput = ["money", "percent", "number", "text"].includes(question.kind);

  // `role=group` + `aria-labelledby` instead of fieldset/legend, so the question
  // can be a real <h1>: it is the only heading on the screen, and screen readers
  // still announce it as the group label for the controls below.
  return (
    <div role="group" aria-labelledby={headingId}>
      {sectionLabel ? <p className="eyebrow animate-rise">{sectionLabel}</p> : null}

      <h1
        id={headingId}
        style={{ animationDelay: "60ms" }}
        className="mt-4 animate-rise text-h1 text-ink"
      >
        {question.label}
        {question.optional ? (
          <span className="ml-3 align-middle text-body-sm font-normal text-ink-muted">
            opcional
          </span>
        ) : null}
      </h1>

      {question.help ? (
        <p
          style={{ animationDelay: "110ms" }}
          className="mt-3 animate-rise text-body text-ink-muted"
        >
          {question.help}
        </p>
      ) : null}

      <div className="mt-8">
        {question.kind === "select" && question.options ? (
          <SelectCards
            name={id}
            options={question.options}
            value={value as string | undefined}
            columns={question.columns}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}

        {question.kind === "multiselect" && question.options ? (
          <MultiSelectCards
            name={id}
            options={question.options}
            value={value as string[] | undefined}
            columns={question.columns}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}

        {question.kind === "money" ? (
          <MoneyInput
            id={id}
            autoFocus={isInput}
            value={value as number | undefined}
            placeholder={question.placeholder}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}

        {question.kind === "percent" ? (
          <PercentInput
            id={id}
            autoFocus={isInput}
            value={value as number | undefined}
            placeholder={question.placeholder}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}

        {question.kind === "number" ? (
          <NumberStepper
            id={id}
            autoFocus={isInput}
            value={value as number | undefined}
            unit={question.unit}
            min={question.min}
            placeholder={question.placeholder}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}

        {question.kind === "text" ? (
          <TextInput
            id={id}
            autoFocus={isInput}
            value={value as string | undefined}
            placeholder={question.placeholder}
            onChange={(next) => onAnswer(question.field, next)}
          />
        ) : null}
      </div>

      {question.kind === "multiselect" ? (
        <p
          style={{ animationDelay: "160ms" }}
          className="mt-4 animate-rise text-caption text-ink-muted"
        >
          Selecione quantas quiser.
        </p>
      ) : null}
    </div>
  );
}
