import { Tag } from "lucide-react";

import {
  BASE_BANDS,
  CONTENT_DEPTH,
  INCLUDE_BONUS,
  MODIFIERS,
  PRICE_SENSITIVE_SEGMENTS,
} from "@/data/benchmarks/pricing-rules";
import { STUDENT_BRACKETS, toOptions } from "@/data/ranges";
import { money, range } from "@/lib/tools/format";
import {
  AUDIENCES,
  BUYER_INTENT,
  CASE_VOLUMES,
  CERTIFICATIONS,
  DELIVERY_FORMATS,
  INCLUDES,
  PRICING_BASIS,
  PRODUCT_TYPES,
  SEGMENTS,
} from "@/lib/tools/options";
import { generatePricingAnalysis } from "@/lib/tools/services/analysis";
import type { Calculator, CalculatorResult, ProducerProfile } from "@/lib/tools/types";

function estimateBand(profile: ProducerProfile) {
  const base = BASE_BANDS[profile.productType ?? "outro"] ?? BASE_BANDS.outro;

  const multiplier =
    (MODIFIERS.audience[profile.audience ?? "outro"] ?? 1) *
    (MODIFIERS.buyerIntent[profile.buyerIntent ?? "parcial"] ?? 1) *
    (MODIFIERS.deliveryFormat[profile.deliveryFormat ?? "gravado"] ?? 1) *
    (MODIFIERS.caseVolume[profile.caseVolume ?? "poucos"] ?? 1) *
    (MODIFIERS.certification[profile.certification ?? "propria"] ?? 1);

  const depth =
    CONTENT_DEPTH.find((tier) => (profile.contentHours ?? 0) <= tier.maxHours) ??
    CONTENT_DEPTH[CONTENT_DEPTH.length - 1];

  const includeBonus = (profile.includes ?? []).reduce(
    (total, item) => total + (INCLUDE_BONUS[item] ?? 0),
    0
  );

  const floor = base.floor * multiplier * depth.multiplier;
  const ceiling = base.ceiling * multiplier * depth.multiplier * (1 + includeBonus);

  return { floor, ceiling, depth };
}

function compute(profile: ProducerProfile): CalculatorResult {
  const { floor, ceiling, depth } = estimateBand(profile);
  const price = profile.price ?? 0;

  const below = price > 0 && price < floor;
  const above = price > ceiling;
  const inside = !below && !above && price > 0;

  const positives: string[] = [];
  const attentions: string[] = [];

  if (["profissionais", "empresarios", "especialistas", "empresas"].includes(profile.audience ?? ""))
    positives.push("Público profissional, que costuma tolerar tickets mais altos");
  if (profile.buyerIntent === "direto")
    positives.push("O comprador usa o conteúdo para ganhar dinheiro — retorno percebido é direto");
  if ((profile.includes ?? []).includes("suporte")) positives.push("Suporte incluso na entrega");
  if ((profile.includes ?? []).some((i) => i.startsWith("mentoria")))
    positives.push("Acompanhamento por mentoria eleva bastante o valor percebido");
  if (depth.multiplier >= 1.15) positives.push(`Alta profundidade (${depth.label})`);
  if (["diversos", "muitos"].includes(profile.caseVolume ?? ""))
    positives.push("Prova social consolidada com cases de alunos");
  if (["extensao", "pos-graduacao"].includes(profile.certification ?? ""))
    positives.push("Certificação reconhecida, que sustenta um ticket superior");

  if (["nenhum", "poucos"].includes(profile.caseVolume ?? ""))
    attentions.push("Pouca prova social documentada");
  if (profile.buyerIntent === "nao")
    attentions.push("Público compra por interesse pessoal, mais sensível a preço");
  if (PRICE_SENSITIVE_SEGMENTS.includes(profile.segment ?? ""))
    attentions.push("Segmento historicamente mais sensível a preço");
  if (profile.pricingBasis === "intuicao")
    attentions.push("O preço atual foi definido por intuição, sem teste ou referência");
  if ((profile.contentHours ?? 0) > 0 && (profile.contentHours ?? 0) < 5)
    attentions.push("Volume de conteúdo curto limita a percepção de profundidade");
  if (profile.certification === "nenhuma")
    attentions.push("Sem nenhuma certificação ao final, a entrega perde um elemento de valor");

  const status = below ? "attention" : above ? "negative" : inside ? "positive" : "info";
  const statusLabel = below
    ? "Abaixo da faixa estimada"
    : above
      ? "Acima da faixa estimada"
      : inside
        ? "Dentro da faixa estimada"
        : "Dados insuficientes";

  const opportunities: CalculatorResult["opportunities"] = [];
  if (["nenhuma", "propria"].includes(profile.certification ?? "")) {
    opportunities.push({
      title: "Seu curso possui apenas certificado próprio",
      body: "Dependendo da estrutura, ele pode ter potencial para se tornar um produto acadêmico com certificação reconhecida — o que costuma sustentar um ticket bem mais alto.",
      cta: {
        label: "Descobrir se meu curso pode virar uma pós-graduação",
        href: "/ferramentas/pos-graduacao",
      },
    });
  }
  if (below) {
    opportunities.push({
      title: "Existe espaço para revisar o preço",
      body: `Pelos atributos que você descreveu, a faixa de referência começa em ${money(floor)}. Um reposicionamento gradual, acompanhado de teste, tende a ser mais seguro que um salto direto.`,
    });
  }
  if (above) {
    opportunities.push({
      title: "O preço está acima da faixa de referência",
      body: "Isso não é necessariamente um erro — mas normalmente exige prova social forte, autoridade consolidada ou uma entrega que justifique a diferença.",
    });
  }

  return {
    headline: inside
      ? "Seu preço está coerente com os atributos do produto"
      : below
        ? "Seu produto parece estar abaixo do que poderia cobrar"
        : above
          ? "Seu preço está acima da faixa estimada para esse perfil"
          : "Informe o preço atual para comparar com a faixa",
    status,
    statusLabel,
    primary: {
      label: "Faixa estimada",
      value: range(floor, ceiling, money),
      hint: "Referência preliminar, não um valor definitivo",
    },
    secondary: [{ label: "Preço atual", value: price > 0 ? money(price) : "—" }],
    metrics: [
      {
        label: "Preço atual",
        value: price > 0 ? money(price) : "—",
        reference: range(floor, ceiling, money),
        status,
        statusLabel,
      },
      {
        label: "Profundidade do conteúdo",
        value: profile.contentHours ? `${profile.contentHours}h` : "—",
        reference: depth.label,
        status: depth.multiplier >= 1.15 ? "positive" : "info",
        statusLabel: depth.multiplier >= 1.15 ? "Favorece o preço" : "Neutro",
      },
      {
        label: "Prova social",
        value: CASE_VOLUMES.find((c) => c.value === profile.caseVolume)?.label ?? "—",
        status: ["diversos", "muitos"].includes(profile.caseVolume ?? "") ? "positive" : "attention",
        statusLabel: ["diversos", "muitos"].includes(profile.caseVolume ?? "")
          ? "Sustenta o preço"
          : "Limita o preço",
      },
      {
        label: "Certificação",
        value: CERTIFICATIONS.find((c) => c.value === profile.certification)?.label ?? "—",
        status: ["extensao", "pos-graduacao"].includes(profile.certification ?? "")
          ? "positive"
          : "attention",
        statusLabel: ["extensao", "pos-graduacao"].includes(profile.certification ?? "")
          ? "Diferencial forte"
          : "Oportunidade",
      },
    ],
    analysis: generatePricingAnalysis({ profile, floor, ceiling, price, status }),
    positives,
    attentions,
    opportunities,
    disclaimer:
      "Faixa estimada a partir de regras simuladas para demonstração. Não representa uma recomendação definitiva de preço.",
  };
}

export const pricingCalculator: Calculator = {
  slug: "precificacao",
  name: "Calculadora de precificação de produto",
  shortName: "Precificação",
  tagline: "Descubra se seu produto está barato, caro ou dentro de uma faixa coerente.",
  description:
    "Descubra se o preço atual do seu infoproduto faz sentido para seu público, produto e modelo de negócio.",
  minutes: 3,
  icon: Tag,
  steps: [
    {
      id: "produto",
      title: "Seu produto",
      subtitle: "Vamos começar entendendo o que você vende.",
      questions: [
        { field: "productType", kind: "select", label: "Qual produto você vende?", options: PRODUCT_TYPES, columns: 2 },
        { field: "segment", kind: "select", label: "Qual é o segmento?", options: SEGMENTS, columns: 3 },
        { field: "productName", kind: "text", label: "Qual o nome do produto?", placeholder: "Ex.: Formação em Gestão Clínica", optional: true },
      ],
    },
    {
      id: "publico",
      title: "Seu público",
      questions: [
        { field: "audience", kind: "select", label: "Para quem esse produto é vendido?", options: AUDIENCES, columns: 2 },
        {
          field: "buyerIntent",
          kind: "select",
          label: "O comprador usa esse conhecimento para ganhar dinheiro ou melhorar profissionalmente?",
          options: BUYER_INTENT,
        },
      ],
    },
    {
      id: "entrega",
      title: "Como você entrega",
      questions: [
        { field: "deliveryFormat", kind: "select", label: "Qual é o formato?", options: DELIVERY_FORMATS, columns: 3 },
        {
          field: "contentHours",
          kind: "number",
          label: "Carga aproximada de conteúdo",
          unit: "horas",
          placeholder: "40",
          min: 0,
        },
        { field: "includes", kind: "multiselect", label: "O que está incluso?", options: INCLUDES, columns: 2, optional: true },
      ],
    },
    {
      id: "autoridade",
      title: "Autoridade e prova",
      questions: [
        { field: "studentCount", kind: "select", label: "Quantos alunos já compraram?", options: toOptions(STUDENT_BRACKETS), columns: 2 },
        { field: "caseVolume", kind: "select", label: "Existem cases ou resultados de alunos?", options: CASE_VOLUMES, columns: 2 },
      ],
    },
    {
      id: "preco",
      title: "Preço atual",
      questions: [
        { field: "price", kind: "money", label: "Quanto custa atualmente?", alwaysAsk: true },
        { field: "pricingBasis", kind: "select", label: "Como você chegou a esse preço?", options: PRICING_BASIS, columns: 2 },
      ],
    },
    {
      id: "certificacao",
      title: "Certificação",
      subtitle: "Esse ponto costuma ser o que mais muda a percepção de valor.",
      questions: [
        {
          field: "certification",
          kind: "select",
          label: "Ao concluir, qual certificação seu aluno recebe?",
          options: CERTIFICATIONS,
          columns: 2,
        },
      ],
    },
  ],
  compute,
  crossSell: (profile) =>
    ["nenhuma", "propria"].includes(profile.certification ?? "")
      ? ["pos-graduacao", "conversao"]
      : ["conversao", "plataforma"],
};
