import { Rocket } from "lucide-react";

import { LAUNCH_MODELS } from "@/data/benchmarks/launch-rules";
import {
  AUDIENCE_BRACKETS,
  LEAD_BASE_BRACKETS,
  MEDIA_SPEND_BRACKETS,
  REVENUE_BRACKETS,
  findBracket,
  midpoint,
  toOptions,
} from "@/data/ranges";
import { money, percent } from "@/lib/tools/format";
import {
  EXPERT_AUTHORITY,
  RECURRENCE,
  REVENUE_HORIZONS,
  SALES_HISTORY,
  SALES_STRUCTURES,
  TEAM_STRUCTURES,
  YES_SOMETIMES_NO,
} from "@/lib/tools/options";
import { generateLaunchRecommendation } from "@/lib/tools/services/analysis";
import type { Calculator, CalculatorResult, ProducerProfile } from "@/lib/tools/types";

function ticketTierOf(profile: ProducerProfile) {
  const ticket = profile.averageTicket ?? profile.price ?? 0;
  if (ticket < 500) return "low";
  if (ticket < 3_000) return "mid";
  return "high";
}

/** Score every model against the profile and rank them. */
function rankModels(profile: ProducerProfile) {
  // Only the categorical fields the rules score against, plus one derived tier.
  const derived: Record<string, string | undefined> = {
    salesHistory: profile.salesHistory,
    mediaSpend: profile.mediaSpend,
    audienceSize: profile.audienceSize,
    leadBase: profile.leadBase,
    teamStructure: profile.teamStructure,
    salesStructure: profile.salesStructure,
    expertAuthority: profile.expertAuthority,
    revenueHorizon: profile.revenueHorizon,
    needsSalesCall: profile.needsSalesCall,
    hasRecurrence: profile.hasRecurrence,
    buyerIntent: profile.buyerIntent,
    averageTicketTier: ticketTierOf(profile),
  };

  const scored = LAUNCH_MODELS.map((model) => {
    let score = 0;
    let maxScore = 0;

    for (const [field, table] of Object.entries(model.signals)) {
      const answer = derived[field];
      const best = Math.max(...Object.values(table));
      maxScore += Math.max(best, 0);
      if (answer && table[answer] !== undefined) score += table[answer];
    }

    if (model.requiresValidation && profile.salesHistory === "nenhum") score -= 6;
    if (model.requiresTeam && profile.teamStructure === "sozinho") score -= 5;
    if (model.requiresAudience && profile.leadBase === "none") score -= 5;

    // Capped below 100: this is a directional recommendation from mocked rules,
    // and a perfect score would overstate what the scoring can actually claim.
    const compatibility = maxScore > 0
      ? Math.max(0, Math.min(95, Math.round((score / maxScore) * 100)))
      : 0;

    return { model, score, compatibility };
  });

  return scored.sort((a, b) => b.compatibility - a.compatibility);
}

const AVOID_REASONS: Record<string, string> = {
  classico:
    "ele exige verba de mídia relevante, equipe e uma audiência já aquecida — sem isso, o custo do erro fica alto demais.",
  perpetuo:
    "ele depende de um funil já validado e de investimento contínuo em mídia para se sustentar.",
  assinatura:
    "seu produto não tem natureza recorrente hoje, e recorrência forçada costuma gerar cancelamento alto.",
  evento:
    "ele demanda estrutura operacional e autoridade consolidada para justificar o investimento.",
  semente:
    "sua operação já passou do estágio de validação — o semente limitaria o teto de receita.",
  interno: "a base de leads atual ainda é pequena para sustentar uma campanha interna.",
  webinar: "ele funciona melhor com um funil pago rodando, o que ainda não é o caso.",
  desafio: "seu ticket atual é alto demais para o formato, que converte melhor em preços menores.",
  hibrido: "ele pressupõe duas operações rodando ao mesmo tempo, o que exige time estruturado.",
};

function compute(profile: ProducerProfile): CalculatorResult {
  const ranked = rankModels(profile);
  const best = ranked[0];
  const runnerUp = ranked[1];
  const worst = ranked[ranked.length - 1];

  const revenue = midpoint(findBracket(REVENUE_BRACKETS, profile.monthlyRevenue));
  const media = midpoint(findBracket(MEDIA_SPEND_BRACKETS, profile.mediaSpend));

  const positives: string[] = [];
  const attentions: string[] = [];

  if (profile.salesHistory === "consistente") positives.push("Produto validado, com vendas recorrentes");
  if (profile.expertAuthority === "alta") positives.push("Autoridade consolidada do expert");
  if (["10-50k", "50k+"].includes(profile.leadBase ?? "")) positives.push("Base de leads própria relevante");
  if (profile.teamStructure === "estruturada") positives.push("Equipe estruturada para operar campanhas");
  if (media >= 15_000) positives.push("Investimento em mídia já em escala");
  if (profile.hasRecurrence === "sim") positives.push("Produto com natureza recorrente");

  if (profile.salesHistory === "nenhum") attentions.push("Produto ainda sem validação de venda");
  if (profile.teamStructure === "sozinho") attentions.push("Operação centrada em uma pessoa só");
  if (profile.mediaSpend === "none") attentions.push("Sem investimento em mídia, o alcance depende só do orgânico");
  if (profile.leadBase === "none") attentions.push("Sem base de leads própria para acionar");
  if (profile.expertAuthority === "baixa") attentions.push("Autoridade do expert ainda em construção");
  if (profile.needsSalesCall === "sim" && profile.salesStructure === "nenhuma")
    attentions.push("A venda exige conversa, mas não existe time comercial para atender");

  return {
    headline: `Modelo mais indicado: ${best.model.name}`,
    status: best.compatibility >= 70 ? "positive" : best.compatibility >= 45 ? "attention" : "info",
    statusLabel: `${best.compatibility}% de compatibilidade`,
    primary: {
      label: "Modelo mais indicado",
      value: best.model.name,
      hint: best.model.summary,
    },
    secondary: [
      { label: "Segunda alternativa", value: runnerUp.model.name },
      { label: "Evitaria neste momento", value: worst.model.name },
    ],
    metrics: [
      {
        label: "Compatibilidade",
        value: percent(best.compatibility, 0),
        status: best.compatibility >= 70 ? "positive" : "attention",
        statusLabel: best.compatibility >= 70 ? "Alta aderência" : "Aderência parcial",
      },
      {
        label: "Faturamento mensal",
        value: revenue > 0 ? money(revenue) : "—",
        status: "info",
        statusLabel: "Faixa informada",
      },
      {
        label: "Investimento em mídia",
        value: media > 0 ? money(media) : "Não investe",
        status: media > 0 ? "info" : "attention",
        statusLabel: media > 0 ? "Faixa informada" : "Limita o alcance",
      },
      {
        label: "Maturidade comercial",
        value:
          profile.salesHistory === "consistente"
            ? "Validado"
            : profile.salesHistory === "irregular"
              ? "Em validação"
              : "Pré-validação",
        status: profile.salesHistory === "consistente" ? "positive" : "attention",
        statusLabel: profile.salesHistory === "consistente" ? "Pode escalar" : "Priorize validar",
      },
    ],
    analysis: generateLaunchRecommendation({
      profile,
      model: best.model,
      compatibility: best.compatibility,
      runnerUp: runnerUp.model,
      avoid: {
        name: worst.model.name,
        reason: AVOID_REASONS[worst.model.id] ?? "o momento da operação ainda não sustenta esse formato.",
      },
    }),
    positives,
    attentions,
    opportunities: [
      {
        title: "O modelo escolhido depende da margem que sobra",
        body: "Qualquer estratégia de aquisição fica mais confortável quando a taxa da plataforma é menor. Vale checar quanto da sua receita está indo para taxas hoje.",
        cta: { label: "Analisar minha negociação de plataforma", href: "/ferramentas/plataforma" },
      },
    ],
    disclaimer:
      "Recomendação gerada por regras simuladas para demonstração, a partir das respostas informadas.",
  };
}

export const launchCalculator: Calculator = {
  slug: "modelo-lancamento",
  name: "Qual o melhor modelo de lançamento para seu negócio?",
  shortName: "Modelo de lançamento",
  tagline: "Descubra qual estratégia comercial faz mais sentido para o seu momento.",
  description:
    "Descubra qual estratégia comercial faz mais sentido de acordo com seu produto, audiência, ticket, maturidade e estrutura.",
  minutes: 4,
  icon: Rocket,
  steps: [
    {
      id: "validacao",
      title: "Validação do produto",
      subtitle: "Antes de escolher a estratégia, precisamos saber onde você está.",
      questions: [
        { field: "salesHistory", kind: "select", label: "Seu produto já vende?", options: SALES_HISTORY },
        { field: "monthlyRevenue", kind: "select", label: "Quanto sua operação fatura por mês?", options: toOptions(REVENUE_BRACKETS), columns: 2 },
      ],
    },
    {
      id: "ticket",
      title: "Ticket e volume",
      questions: [
        { field: "averageTicket", kind: "money", label: "Qual seu ticket médio?" },
        { field: "monthlySales", kind: "number", label: "Quantas vendas por mês, em média?", min: 0, optional: true },
      ],
    },
    {
      id: "audiencia",
      title: "Audiência e base",
      questions: [
        { field: "audienceSize", kind: "select", label: "Qual o tamanho da sua audiência somada?", help: "Instagram, YouTube, TikTok e demais canais", options: toOptions(AUDIENCE_BRACKETS), columns: 2 },
        { field: "leadBase", kind: "select", label: "E a base de leads (e-mail e WhatsApp)?", options: toOptions(LEAD_BASE_BRACKETS), columns: 2 },
        { field: "expertAuthority", kind: "select", label: "Como você avalia a autoridade do expert no mercado?", options: EXPERT_AUTHORITY },
      ],
    },
    {
      id: "estrutura",
      title: "Estrutura disponível",
      questions: [
        { field: "mediaSpend", kind: "select", label: "Quanto você investe em mídia por mês?", options: toOptions(MEDIA_SPEND_BRACKETS), columns: 2 },
        { field: "teamStructure", kind: "select", label: "Como é sua equipe hoje?", options: TEAM_STRUCTURES },
        { field: "salesStructure", kind: "select", label: "E a estrutura comercial?", options: SALES_STRUCTURES },
      ],
    },
    {
      id: "estrategia",
      title: "Objetivo e formato da venda",
      questions: [
        { field: "revenueHorizon", kind: "select", label: "Em quanto tempo você precisa gerar receita?", options: REVENUE_HORIZONS },
        { field: "needsSalesCall", kind: "select", label: "A venda exige conversa com um vendedor?", options: YES_SOMETIMES_NO },
        { field: "hasRecurrence", kind: "select", label: "O produto tem (ou poderia ter) recorrência?", options: RECURRENCE },
      ],
    },
  ],
  compute,
  crossSell: (profile) =>
    (profile.platformRate ?? 0) > 0 ? ["conversao", "precificacao"] : ["plataforma", "conversao"],
};
