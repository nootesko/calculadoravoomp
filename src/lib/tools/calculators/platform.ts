import { Wallet } from "lucide-react";

import {
  PAYMENT_METHOD_NOTES,
  PLATFORMS,
  RATE_BY_TPV,
} from "@/data/benchmarks/platform-benchmarks";
import { TPV_BRACKETS, bracketLabel, findBracket, midpoint, toOptions } from "@/data/ranges";
import { money, percent } from "@/lib/tools/format";
import { CUSTOM_DEAL, PAYMENT_METHODS, YES_NO } from "@/lib/tools/options";
import { generatePlatformAnalysis } from "@/lib/tools/services/analysis";
import type { Calculator, CalculatorResult, ProducerProfile, ResultStatus } from "@/lib/tools/types";

function compute(profile: ProducerProfile): CalculatorResult {
  const tpvBracket = findBracket(TPV_BRACKETS, profile.monthlyTpv);
  const tpv = midpoint(tpvBracket);
  const ticket = profile.averageTicket ?? profile.price ?? 0;

  const transactions =
    profile.transactionCount ?? (ticket > 0 && tpv > 0 ? Math.round(tpv / ticket) : 0);

  const percentRate = profile.platformRate ?? 0;
  const fixedFee = profile.hasFixedFee === "sim" ? (profile.fixedFee ?? 0) : 0;
  const withdrawalFee = profile.hasWithdrawalFee === "sim" ? (profile.withdrawalFee ?? 0) : 0;

  // Effective rate = percentage + fixed fee spread over the ticket + withdrawals.
  const fixedAsPercent = ticket > 0 ? (fixedFee / ticket) * 100 : 0;
  const withdrawalAsPercent = tpv > 0 ? ((withdrawalFee * 4) / tpv) * 100 : 0;
  const effectiveRate = percentRate + fixedAsPercent + withdrawalAsPercent;

  const band = RATE_BY_TPV[profile.monthlyTpv ?? "10-50k"] ?? RATE_BY_TPV["10-50k"];

  const monthlyCost = (tpv * effectiveRate) / 100;
  const annualCost = monthlyCost * 12;

  // Compared straight against the band for the TPV. The payment mix and the
  // absence of a custom deal are reported as signals below, never used to widen
  // the ceiling — doing that would let a bad deal excuse itself.
  const gap = Math.max(0, effectiveRate - band.max);
  const annualImpact = (tpv * gap * 12) / 100;

  const status: ResultStatus =
    effectiveRate <= 0
      ? "info"
      : gap > 1
        ? "negative"
        : gap > 0
          ? "attention"
          : "positive";

  const statusLabel =
    status === "negative"
      ? "Bem acima da faixa"
      : status === "attention"
        ? "Levemente acima da faixa"
        : status === "positive"
          ? "Dentro da faixa"
          : "Dados insuficientes";

  const positives: string[] = [];
  const attentions: string[] = [];

  if (profile.customDeal === "sim") positives.push("Você já tem uma negociação personalizada");
  if (status === "positive") positives.push("Taxa efetiva compatível com o volume transacionado");
  if (tpv >= 100_000) positives.push("Volume alto o suficiente para abrir negociação de taxa");

  if (profile.customDeal === "nao")
    attentions.push("Sem negociação personalizada, você provavelmente está na tabela padrão");
  if (profile.customDeal === "nao-sei")
    attentions.push("Não saber se existe negociação personalizada normalmente significa que não existe");
  if (fixedFee > 0 && ticket > 0 && fixedAsPercent > 0.5)
    attentions.push(
      `A taxa fixa de ${money(fixedFee)} representa ${percent(fixedAsPercent)} do seu ticket — peso relevante`
    );
  if (withdrawalFee > 0) attentions.push("Taxa de saque cobrada a cada retirada corrói a margem no acumulado");
  if (profile.mainPaymentMethod && PAYMENT_METHOD_NOTES[profile.mainPaymentMethod]) {
    const note = PAYMENT_METHOD_NOTES[profile.mainPaymentMethod];
    if (["parcelado", "boleto"].includes(profile.mainPaymentMethod)) attentions.push(note);
    else positives.push(note);
  }
  if (gap > 0)
    attentions.push(`Diferença de ${percent(gap)} ponto percentual em relação à faixa de referência`);

  const opportunities: CalculatorResult["opportunities"] = [];
  if (gap > 0) {
    opportunities.push({
      title: "Quero avaliar minha operação com a Voomp",
      body: `Uma diferença de ${percent(gap)} sobre um TPV de ${money(tpv)} por mês representa cerca de ${money(annualImpact)} por ano. Vale colocar sua operação lado a lado com o que a Voomp consegue oferecer.`,
      cta: { label: "Quero avaliar minha operação com a Voomp", href: "#criar-conta" },
    });
  }
  if (tpv >= 100_000) {
    opportunities.push({
      title: "Sua operação já movimenta um volume significativo",
      body: "Nesse patamar, pequenos ganhos de conversão têm impacto financeiro maior que reduções de taxa. Vale olhar as duas coisas juntas.",
      cta: { label: "Ver se minha conversão está dentro do esperado", href: "/ferramentas/conversao" },
    });
  }

  return {
    headline:
      status === "negative" || status === "attention"
        ? "Sua negociação parece estar acima da faixa esperada"
        : status === "positive"
          ? "Sua negociação está dentro da faixa esperada"
          : "Informe suas taxas para comparar",
    status,
    statusLabel,
    primary: {
      label: "Taxa efetiva aproximada",
      value: effectiveRate > 0 ? percent(effectiveRate) : "—",
      hint: `Faixa de referência para ${bracketLabel(TPV_BRACKETS, profile.monthlyTpv)}: ${percent(band.min)} — ${percent(band.max)}`,
    },
    secondary: [
      { label: "Custo mensal estimado", value: monthlyCost > 0 ? money(monthlyCost) : "—" },
      { label: "Custo anual estimado", value: annualCost > 0 ? money(annualCost) : "—" },
    ],
    metrics: [
      {
        label: "Taxa efetiva",
        value: effectiveRate > 0 ? percent(effectiveRate) : "—",
        reference: `${percent(band.min)} — ${percent(band.max)}`,
        status,
        statusLabel,
      },
      {
        label: "Diferença potencial",
        value: gap > 0 ? `${percent(gap)} p.p.` : "Nenhuma",
        status: gap > 0 ? "negative" : "positive",
        statusLabel: gap > 0 ? "Acima da faixa" : "Sem diferença",
      },
      {
        label: "Impacto anual estimado",
        value: annualImpact > 0 ? money(annualImpact) : money(0),
        status: annualImpact > 0 ? "negative" : "positive",
        statusLabel: annualImpact > 0 ? "Deixado na mesa" : "Sem perda aparente",
        hint: "Projeção de 12 meses sobre o TPV informado",
      },
      {
        label: "Transações por mês",
        value: transactions > 0 ? transactions.toLocaleString("pt-BR") : "—",
        status: "info",
        statusLabel: profile.transactionCount ? "Informado" : "Estimado por TPV ÷ ticket",
      },
    ],
    analysis: generatePlatformAnalysis({
      effectiveRate,
      bandMin: band.min,
      bandMax: band.max,
      annualImpact,
      status,
      tpvLabel: bracketLabel(TPV_BRACKETS, profile.monthlyTpv),
    }),
    positives,
    attentions,
    opportunities,
    disclaimer:
      "Faixas de negociação simuladas para demonstração, referentes a operações de porte semelhante. Não representam tabelas publicadas de nenhuma plataforma.",
  };
}

export const platformCalculator: Calculator = {
  slug: "plataforma",
  name: "Você está pagando demais para sua plataforma?",
  shortName: "Plataforma",
  tagline: "Compare sua negociação com operações semelhantes à sua.",
  description:
    "Compare as taxas atuais da sua operação com faixas de negociação configuradas para operações semelhantes.",
  minutes: 3,
  icon: Wallet,
  steps: [
    {
      id: "plataforma",
      title: "Sua plataforma",
      questions: [
        { field: "platform", kind: "select", label: "Qual plataforma você usa hoje?", options: PLATFORMS, columns: 2 },
        { field: "monthlyTpv", kind: "select", label: "Quanto você transaciona por mês?", options: toOptions(TPV_BRACKETS), columns: 2 },
      ],
    },
    {
      id: "volume",
      title: "Volume da operação",
      questions: [
        { field: "averageTicket", kind: "money", label: "Qual seu ticket médio?" },
        { field: "transactionCount", kind: "number", label: "Quantas transações por mês, aproximadamente?", min: 0, optional: true, help: "Se não souber, calculamos pelo TPV e ticket" },
      ],
    },
    {
      id: "taxas",
      title: "Suas taxas",
      subtitle: "É aqui que a conta realmente se forma.",
      questions: [
        { field: "platformRate", kind: "percent", label: "Qual taxa percentual você paga por venda?", alwaysAsk: true },
        { field: "hasFixedFee", kind: "select", label: "Existe taxa fixa por transação?", options: YES_NO, columns: 2 },
        { field: "fixedFee", kind: "money", label: "Qual o valor da taxa fixa?", showIf: (p) => p.hasFixedFee === "sim" },
      ],
    },
    {
      id: "saque",
      title: "Saque e negociação",
      questions: [
        { field: "hasWithdrawalFee", kind: "select", label: "Existe taxa de saque?", options: YES_NO, columns: 2 },
        { field: "withdrawalFee", kind: "money", label: "Qual o valor por saque?", showIf: (p) => p.hasWithdrawalFee === "sim" },
        { field: "customDeal", kind: "select", label: "Você possui negociação personalizada?", options: CUSTOM_DEAL, columns: 3 },
      ],
    },
    {
      id: "pagamento",
      title: "Meio de pagamento",
      questions: [
        { field: "mainPaymentMethod", kind: "select", label: "Qual o principal meio de pagamento dos seus clientes?", options: PAYMENT_METHODS, columns: 2 },
      ],
    },
  ],
  compute,
  crossSell: () => ["conversao", "precificacao"],
};
