"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Pencil } from "lucide-react";

import { LeadCapture } from "@/components/tools/lead-capture";
import { QuestionCard } from "@/components/tools/question-card";
import { ResultScreen } from "@/components/tools/result-screen";
import { ToolShell } from "@/components/tools/tool-shell";
import { Button } from "@/components/ui/button";
import { getCalculator, hasAnswer, isQuestionActive } from "@/lib/tools/registry";
import { useTools } from "@/lib/tools/store";
import type { ProducerProfile, Question } from "@/lib/tools/types";

type Phase = "intro" | "questions" | "capture" | "result";

/** A question plus the step it belongs to, so the screen can show its context. */
type FlatQuestion = { question: Question; sectionLabel: string };

/** Time the selection is visible before a single-choice question moves on. */
const AUTO_ADVANCE_MS = 420;

export function CalculatorRunner({ slug }: { slug: string }) {
  const calculator = getCalculator(slug)!;
  const router = useRouter();
  const { profile, ready, setAnswers, setProgress, clearFields } = useTools();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const autoAdvance = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answer = useCallback(
    (field: keyof ProducerProfile, value: unknown) =>
      setAnswers({ [field]: value } as ProducerProfile),
    [setAnswers]
  );

  // One flat list with EVERY question the tool asks — nothing is removed just
  // because it was answered elsewhere. Progressive profiling shows up as where
  // the run *starts*, not as missing screens, so `Voltar` can always walk back
  // through the answers we already have and let the producer change them.
  const flat: FlatQuestion[] = useMemo(
    () =>
      calculator.steps.flatMap((step) =>
        step.questions
          .filter((question) => isQuestionActive(question, profile))
          .map((question) => ({ question, sectionLabel: step.title }))
      ),
    [calculator.steps, profile]
  );

  /** Questions already filled in by earlier diagnostics. */
  const known = useMemo(
    () =>
      flat.filter(
        ({ question }) => !question.alwaysAsk && hasAnswer(profile, question)
      ),
    [flat, profile]
  );

  /** First question still needing an answer; -1 when the tool is fully covered. */
  const resumeIndex = useMemo(
    () =>
      flat.findIndex(
        ({ question }) =>
          question.alwaysAsk || (!question.optional && !hasAnswer(profile, question))
      ),
    [flat, profile]
  );

  const current = flat[index];
  const total = flat.length;
  const answered = current ? hasAnswer(profile, current.question) : false;
  const canAdvance = current ? current.question.optional || answered : false;
  const needsContact = !profile.firstName || !profile.email || !profile.whatsapp;

  const clearAutoAdvance = () => {
    if (autoAdvance.current) {
      clearTimeout(autoAdvance.current);
      autoAdvance.current = null;
    }
  };

  const goNext = useCallback(() => {
    clearAutoAdvance();
    setDirection("forward");
    if (index < total - 1) {
      const next = index + 1;
      setIndex(next);
      setProgress(calculator.slug, {
        stepIndex: next,
        completed: false,
        answered: next,
        total,
      });
      return;
    }
    setPhase(needsContact ? "capture" : "result");
    setProgress(calculator.slug, {
      stepIndex: total,
      completed: !needsContact,
      answered: total,
      total,
    });
  }, [index, total, needsContact, calculator.slug, setProgress]);

  const goBack = useCallback(() => {
    clearAutoAdvance();
    setDirection("back");
    if (index > 0) setIndex(index - 1);
    else setPhase("intro");
  }, [index]);

  // Single-choice questions move on by themselves, just late enough for the
  // selection to register visually. Any other interaction cancels it.
  const answerAndMaybeAdvance = useCallback(
    (field: keyof ProducerProfile, value: unknown) => {
      answer(field, value);
      if (current?.question.kind === "select") {
        clearAutoAdvance();
        autoAdvance.current = setTimeout(goNext, AUTO_ADVANCE_MS);
      }
    },
    [answer, current, goNext]
  );

  useEffect(() => clearAutoAdvance, [index]);

  // Keyboard: 1-9 picks an option, Enter advances.
  useEffect(() => {
    if (phase !== "questions" || !current) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (event.key === "Enter" && canAdvance) {
        event.preventDefault();
        goNext();
        return;
      }
      if (typing) return;

      const digit = Number(event.key);
      const options = current.question.options;
      if (!options || !Number.isInteger(digit) || digit < 1 || digit > options.length) return;

      event.preventDefault();
      const picked = options[digit - 1].value;
      if (current.question.kind === "select") {
        answerAndMaybeAdvance(current.question.field, picked);
      } else if (current.question.kind === "multiselect") {
        const currentValue = (profile[current.question.field] as string[] | undefined) ?? [];
        answer(
          current.question.field,
          currentValue.includes(picked)
            ? currentValue.filter((v) => v !== picked)
            : [...currentValue, picked]
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, current, canAdvance, goNext, answer, answerAndMaybeAdvance, profile]);

  const start = (at: number) => {
    setIndex(Math.max(0, Math.min(at, total - 1)));
    setDirection("forward");
    setPhase("questions");
  };

  const finish = () => {
    setPhase("result");
    setProgress(calculator.slug, {
      stepIndex: total,
      completed: true,
      answered: total,
      total,
    });
  };

  const leave = () => router.push("/ferramentas");
  const enterAnimation = direction === "forward" ? "animate-step-in" : "animate-step-in-back";
  const Icon = calculator.icon;

  if (!ready) {
    return (
      <ToolShell>
        <div className="h-2 w-40 animate-pulse rounded-full bg-[#e4e4e7]" />
      </ToolShell>
    );
  }

  // ---- Intro -------------------------------------------------------------
  if (phase === "intro") {
    const covered = resumeIndex === -1;
    return (
      <ToolShell
        onClose={leave}
        // The commercial-use notice lives here, on the screen before any answer
        // is given — not repeated on every question.
        disclosure
        footer={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="brand"
              size="pill-lg"
              onClick={() => (covered ? setPhase(needsContact ? "capture" : "result") : start(resumeIndex))}
            >
              {covered ? "Ver diagnóstico" : known.length > 0 ? "Continuar" : "Começar"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            {covered ? (
              <Button variant="outline" size="pill-lg" onClick={() => start(0)}>
                <Pencil className="size-4" aria-hidden />
                Revisar respostas
              </Button>
            ) : null}
          </div>
        }
      >
        <div className="animate-rise">
          <span className="inline-flex size-14 items-center justify-center rounded-brand-2xl bg-orange/10 text-orange">
            <Icon className="size-7" aria-hidden />
          </span>
        </div>

        <h1 style={{ animationDelay: "60ms" }} className="mt-7 animate-rise text-display text-ink">
          {calculator.name}
        </h1>
        <p
          style={{ animationDelay: "110ms" }}
          className="mt-5 animate-rise text-body-lg text-ink-muted"
        >
          {calculator.description}
        </p>

        <p
          style={{ animationDelay: "160ms" }}
          className="mt-7 inline-flex animate-rise items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-caption text-ink-muted"
        >
          <Clock className="size-3.5" aria-hidden />~{calculator.minutes} minutos · uma pergunta por
          vez
        </p>

        {known.length > 0 ? (
          <div
            style={{ animationDelay: "210ms" }}
            className="mt-8 animate-rise rounded-brand-2xl border border-border bg-surface-muted p-6"
          >
            <p className="flex items-center gap-2 text-h5 text-ink">
              <Check className="size-4 text-positive" aria-hidden />
              Já sabemos algumas coisas sobre sua operação.
            </p>
            <p className="mt-2 text-body-sm text-ink-muted">
              {covered ? (
                <>
                  As {total} perguntas já estão preenchidas por outros diagnósticos. Você pode ver o
                  resultado agora ou revisar as respostas.
                </>
              ) : (
                <>
                  Suas respostas de outros diagnósticos já estão preenchidas. Vamos retomar da{" "}
                  <strong className="font-semibold text-ink">
                    pergunta {resumeIndex + 1} de {total}
                  </strong>{" "}
                  — e você pode voltar para revisar qualquer uma.
                </>
              )}
            </p>
          </div>
        ) : null}

      </ToolShell>
    );
  }

  // ---- Questions ---------------------------------------------------------
  if (phase === "questions" && current) {
    return (
      <ToolShell
        // Answering nudges the bar forward before the screen changes, so the
        // action registers even on questions that do not auto-advance.
        progress={((index + (answered ? 1 : 0)) / total) * 100}
        resetScrollKey={index}
        onClose={leave}
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="pill-lg" onClick={goBack} className="max-sm:px-3">
              <ArrowLeft className="size-4" aria-hidden />
              Voltar
            </Button>

            <p
              aria-live="polite"
              className="shrink-0 whitespace-nowrap text-caption tabular-nums text-ink-muted"
            >
              {index + 1} de {total}
            </p>

            <Button
              variant="brand"
              size="pill-lg"
              onClick={goNext}
              disabled={!canAdvance}
              className={canAdvance ? "animate-pop" : undefined}
            >
              {index === total - 1 ? "Ver diagnóstico" : "Prosseguir"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        }
      >
        <div key={index} className={enterAnimation}>
          <QuestionCard
            question={current.question}
            sectionLabel={current.sectionLabel}
            profile={profile}
            onAnswer={answerAndMaybeAdvance}
          />
        </div>
      </ToolShell>
    );
  }

  // Only reachable if a calculator declares no active questions at all.
  if (phase === "questions" && !current) {
    return (
      <ToolShell
        onClose={leave}
        footer={
          <Button
            variant="brand"
            size="pill-lg"
            className="self-start"
            onClick={() => setPhase(needsContact ? "capture" : "result")}
          >
            Ver diagnóstico
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        }
      >
        <h1 className="animate-rise text-h1 text-ink">
          Você já respondeu tudo o que precisamos.
        </h1>
      </ToolShell>
    );
  }

  // ---- Contact capture ---------------------------------------------------
  if (phase === "capture") {
    return (
      <ToolShell progress={100} onClose={leave}>
        <div className="animate-step-in">
          <LeadCapture
            profile={profile}
            onAnswer={answer}
            onSubmit={finish}
            onBack={() => {
              setDirection("back");
              setPhase("questions");
              setIndex(Math.max(0, total - 1));
            }}
          />
        </div>
      </ToolShell>
    );
  }

  // ---- Result ------------------------------------------------------------
  return (
    <ToolShell scrollable onClose={leave}>
      <ResultScreen
        calculator={calculator}
        onRestart={() => {
          clearFields(
            calculator.steps
              .flatMap((step) => step.questions)
              .filter((question) => question.alwaysAsk)
              .map((question) => question.field)
          );
          setDirection("forward");
          setPhase("intro");
          setIndex(0);
        }}
      />
    </ToolShell>
  );
}
