import { academicCalculator } from "@/lib/tools/calculators/academic";
import { conversionCalculator } from "@/lib/tools/calculators/conversion";
import { launchCalculator } from "@/lib/tools/calculators/launch";
import { platformCalculator } from "@/lib/tools/calculators/platform";
import { pricingCalculator } from "@/lib/tools/calculators/pricing";
import type { Calculator, CalculatorSlug, ProducerProfile, Question } from "@/lib/tools/types";

/**
 * Single source of truth for the hub. A new calculator only needs to be added
 * here — the runner, the home cards and the cross-sell all read from this list.
 */
export const CALCULATORS: Calculator[] = [
  pricingCalculator,
  launchCalculator,
  academicCalculator,
  conversionCalculator,
  platformCalculator,
];

export const getCalculator = (slug: string) =>
  CALCULATORS.find((calculator) => calculator.slug === slug);

export const CALCULATOR_SLUGS = CALCULATORS.map((c) => c.slug);

/** Questions hidden by `showIf` are not asked and not counted as unanswered. */
export function isQuestionActive(question: Question, profile: ProducerProfile) {
  return question.showIf ? question.showIf(profile) : true;
}

export function hasAnswer(profile: ProducerProfile, question: Question) {
  const value = profile[question.field];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== "";
}

/**
 * Progressive profiling: a question is only asked when it is active, not yet
 * answered, and not explicitly marked `alwaysAsk` (used for volatile figures
 * such as the current price, which the producer may want to restate).
 */
export function pendingQuestions(calculator: Calculator, profile: ProducerProfile) {
  return calculator.steps.flatMap((step) =>
    step.questions.filter(
      (question) =>
        isQuestionActive(question, profile) &&
        (question.alwaysAsk || !hasAnswer(profile, question))
    )
  );
}

/** Fields the profile already knows for this calculator — shown as "já sabemos". */
export function knownQuestions(calculator: Calculator, profile: ProducerProfile) {
  return calculator.steps.flatMap((step) =>
    step.questions.filter(
      (question) =>
        isQuestionActive(question, profile) &&
        !question.alwaysAsk &&
        hasAnswer(profile, question)
    )
  );
}

export function completionOf(calculator: Calculator, profile: ProducerProfile) {
  const active = calculator.steps.flatMap((step) =>
    step.questions.filter((question) => isQuestionActive(question, profile))
  );
  const answered = active.filter((question) => hasAnswer(profile, question));
  return {
    answered: answered.length,
    total: active.length,
    percent: active.length ? Math.round((answered.length / active.length) * 100) : 0,
  };
}

export const CROSS_SELL_TITLES: Record<CalculatorSlug, string> = {
  precificacao: "Precificação",
  "modelo-lancamento": "Modelo de lançamento",
  "pos-graduacao": "Pós-graduação",
  conversao: "Conversão",
  plataforma: "Plataforma",
};
