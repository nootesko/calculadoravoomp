import { TrendingUp } from "lucide-react";

import { getFunnelBenchmark, type Band } from "@/data/benchmarks/conversion-benchmarks";
import { MEDIA_SPEND_BRACKETS, REVENUE_BRACKETS, findBracket, midpoint, toOptions } from "@/data/ranges";
import { money, percent, range, ratio } from "@/lib/tools/format";
import { PRODUCT_TYPES, SALES_MODELS, SEGMENTS } from "@/lib/tools/options";
import { generateConversionAnalysis } from "@/lib/tools/services/analysis";
import type {
  Calculator,
  CalculatorResult,
  ProducerProfile,
  ResultMetric,
  ResultStatus,
} from "@/lib/tools/types";

/** Higher-is-better metrics compare one way; cost metrics compare the other. */
function classify(value: number, band: Band, lowerIsBetter = false): ResultStatus {
  if (!Number.isFinite(value) || value <= 0) return "info";
  if (lowerIsBetter) {
    if (value <= band.min) return "positive";
    if (value <= band.max) return "positive";
    if (value <= band.max * 1.3) return "attention";
    return "negative";
  }
  if (value >= band.max) return "positive";
  if (value >= band.min) return "positive";
  if (value >= band.min * 0.6) return "attention";
  return "negative";
}

const statusLabel = (status: ResultStatus) =>
  status === "positive"
    ? "Dentro do esperado"
    : status === "attention"
      ? "Perto do limite"
      : status === "negative"
        ? "Abaixo do esperado"
        : "Sem dados suficientes";

const costStatusLabel = (status: ResultStatus) =>
  status === "positive"
    ? "Dentro do esperado"
    : status === "attention"
      ? "Perto do limite"
      : status === "negative"
        ? "Acima do esperado"
        : "Sem dados suficientes";

function compute(profile: ProducerProfile): CalculatorResult {
  const ticket = profile.averageTicket ?? profile.price ?? 0;
  const benchmark = getFunnelBenchmark({
    ticket,
    segment: profile.segment,
    salesModel: profile.salesModel,
  });

  const visits = profile.monthlyVisits ?? 0;
  const leads = profile.monthlyLeads ?? 0;
  const checkouts = profile.checkoutsStarted ?? 0;
  const sales = profile.monthlySales ?? 0;
  const media = midpoint(findBracket(MEDIA_SPEND_BRACKETS, profile.mediaSpend));
  const revenue = sales * ticket;

  const visitToLead = visits > 0 ? leads / visits : 0;
  const leadToSale = leads > 0 ? sales / leads : 0;
  const checkoutToSale = checkouts > 0 ? sales / checkouts : 0;
  const cpl = leads > 0 && media > 0 ? media / leads : 0;
  const cac = sales > 0 && media > 0 ? media / sales : 0;
  const roas = media > 0 && revenue > 0 ? revenue / media : 0;

  const metrics: ResultMetric[] = [];

  if (visits > 0 && leads > 0) {
    const status = classify(visitToLead, benchmark.visitToLead);
    metrics.push({
      label: "Visitante → lead",
      value: ratio(visitToLead),
      reference: range(benchmark.visitToLead.min, benchmark.visitToLead.max, (n) => ratio(n)),
      status,
      statusLabel: statusLabel(status),
    });
  }

  if (leads > 0 && sales > 0) {
    const status = classify(leadToSale, benchmark.leadToSale);
    metrics.push({
      label: "Lead → venda",
      value: ratio(leadToSale),
      reference: range(benchmark.leadToSale.min, benchmark.leadToSale.max, (n) => ratio(n)),
      status,
      statusLabel: statusLabel(status),
    });
  }

  if (checkouts > 0 && sales > 0) {
    const status = classify(checkoutToSale, benchmark.checkoutToSale);
    metrics.push({
      label: "Checkout → venda",
      value: ratio(checkoutToSale, 0),
      reference: range(benchmark.checkoutToSale.min, benchmark.checkoutToSale.max, (n) => ratio(n, 0)),
      status,
      statusLabel: statusLabel(status),
    });
  }

  if (cpl > 0) {
    const status = classify(cpl, benchmark.cpl, true);
    metrics.push({
      label: "CPL",
      value: money(cpl),
      reference: range(benchmark.cpl.min, benchmark.cpl.max, money),
      status,
      statusLabel: costStatusLabel(status),
    });
  }

  if (cac > 0) {
    const status = classify(cac, benchmark.cac, true);
    metrics.push({
      label: "CAC",
      value: money(cac),
      reference: range(benchmark.cac.min, benchmark.cac.max, money),
      status,
      statusLabel: costStatusLabel(status),
    });
  }

  if (roas > 0) {
    const status = classify(roas, benchmark.roas);
    metrics.push({
      label: "ROAS",
      value: `${roas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}x`,
      reference: `${benchmark.roas.min}x — ${benchmark.roas.max}x`,
      status,
      statusLabel: statusLabel(status),
    });
  }

  // Pick the weakest stage we actually have data for. A high CPL alone does not
  // make acquisition the bottleneck — if CAC and ROAS are healthy, the traffic
  // is paying for itself and the problem lies further down the funnel.
  const cplBad = cpl > 0 && cpl > benchmark.cpl.max;
  const unitEconomicsBad =
    (cac > 0 && cac > benchmark.cac.max) || (roas > 0 && roas < benchmark.roas.min);
  const leadBad = leads > 0 && sales > 0 && leadToSale < benchmark.leadToSale.min;
  const checkoutBad = checkouts > 0 && sales > 0 && checkoutToSale < benchmark.checkoutToSale.min;

  const bottleneck =
    cplBad && unitEconomicsBad
      ? "captacao"
      : leadBad
        ? "conversao"
        : checkoutBad
          ? "checkout"
          : cplBad
            ? // CPL above reference, but CAC and ROAS still healthy: the traffic
              // is expensive yet paying for itself. Worth watching, not a gargalo.
              "cpl-isolado"
            : "indefinido";

  const hasEnoughData = metrics.length >= 2;

  const positives = metrics.filter((m) => m.status === "positive").map((m) => `${m.label}: ${m.value} — ${m.statusLabel.toLowerCase()}`);
  const attentions = metrics
    .filter((m) => m.status === "attention" || m.status === "negative")
    .map((m) => `${m.label}: ${m.value} contra referência de ${m.reference}`);

  if (!hasEnoughData) {
    attentions.push("Faltam dados de etapas do funil para uma leitura completa");
  }

  const opportunities: CalculatorResult["opportunities"] = [];
  if (bottleneck === "conversao" || bottleneck === "checkout") {
    opportunities.push({
      title: "Seu ticket pode estar limitando sua margem",
      body: "Quando o CAC aperta, subir o valor percebido costuma resolver mais rápido do que perseguir décimos de conversão.",
      cta: { label: "Fazer a calculadora de precificação", href: "/ferramentas/precificacao" },
    });
  }
  if (bottleneck === "checkout") {
    opportunities.push({
      title: "Perda concentrada no checkout",
      body: "Fricção de pagamento, ausência de Pix ou parcelamento limitado costumam explicar boa parte dessa queda. Vale revisar as condições oferecidas pela sua plataforma.",
      cta: { label: "Analisar minha plataforma", href: "/ferramentas/plataforma" },
    });
  }

  const status: ResultStatus = !hasEnoughData
    ? "info"
    : bottleneck === "indefinido"
      ? "positive"
      : "attention";

  return {
    headline:
      bottleneck === "captacao"
        ? "Seu gargalo aparente está na captação"
        : bottleneck === "conversao"
          ? "Seu gargalo aparente está na conversão do lead"
          : bottleneck === "checkout"
            ? "Seu gargalo aparente está no checkout"
            : bottleneck === "cpl-isolado"
              ? "Seu funil se sustenta, mas o lead está caro"
              : hasEnoughData
                ? "Seus indicadores estão dentro das faixas de referência"
                : "Ainda faltam dados para apontar o gargalo",
    status,
    statusLabel:
      bottleneck === "indefinido" && hasEnoughData
        ? "Funil saudável"
        : bottleneck === "cpl-isolado"
          ? "Saudável, com um ponto de atenção"
          : "Ponto de atenção identificado",
    primary: {
      label: "Conversão lead → venda",
      value: leadToSale > 0 ? ratio(leadToSale) : "—",
      hint:
        leadToSale > 0
          ? `Faixa de referência: ${range(benchmark.leadToSale.min, benchmark.leadToSale.max, (n) => ratio(n))}`
          : "Informe leads e vendas do mês",
    },
    secondary: [
      { label: "Faturamento estimado", value: revenue > 0 ? money(revenue) : "—" },
      { label: "Investimento em mídia", value: media > 0 ? money(media) : "—" },
    ],
    metrics,
    analysis: generateConversionAnalysis({ bottleneck, hasEnoughData }),
    positives,
    attentions,
    opportunities,
    disclaimer:
      "Benchmarks simulados para demonstração, organizados por faixa de ticket. Não representam dados de mercado auditados.",
  };
}

export const conversionCalculator: Calculator = {
  slug: "conversao",
  name: "Sua taxa de conversão está dentro do esperado?",
  shortName: "Conversão",
  tagline: "Compare cada etapa do seu funil com faixas de referência.",
  description:
    "Compare os indicadores da sua operação com benchmarks configurados por segmento, ticket e modelo de venda.",
  minutes: 4,
  icon: TrendingUp,
  steps: [
    {
      id: "operacao",
      title: "Sua operação",
      questions: [
        { field: "segment", kind: "select", label: "Qual é o segmento?", options: SEGMENTS, columns: 3 },
        { field: "productType", kind: "select", label: "Que tipo de produto você vende?", options: PRODUCT_TYPES, columns: 2 },
        { field: "salesModel", kind: "select", label: "Qual seu modelo de vendas hoje?", options: SALES_MODELS, columns: 2 },
      ],
    },
    {
      id: "receita",
      title: "Receita e mídia",
      questions: [
        { field: "averageTicket", kind: "money", label: "Qual seu ticket médio?" },
        { field: "monthlyRevenue", kind: "select", label: "Quanto sua operação fatura por mês?", options: toOptions(REVENUE_BRACKETS), columns: 2 },
        { field: "mediaSpend", kind: "select", label: "Quanto investe em mídia por mês?", options: toOptions(MEDIA_SPEND_BRACKETS), columns: 2 },
      ],
    },
    {
      id: "topo",
      title: "Topo do funil",
      subtitle: "Se não souber o número exato, uma boa estimativa já ajuda.",
      questions: [
        { field: "monthlyVisits", kind: "number", label: "Visitas mensais na página de venda", min: 0, placeholder: "12000" },
        { field: "monthlyLeads", kind: "number", label: "Leads gerados por mês", min: 0, placeholder: "1000" },
        { field: "qualifiedLeads", kind: "number", label: "Leads qualificados por mês", min: 0, optional: true, help: "Deixe em branco se não acompanha" },
      ],
    },
    {
      id: "fundo",
      title: "Fundo do funil",
      questions: [
        { field: "checkoutsStarted", kind: "number", label: "Checkouts iniciados por mês", min: 0, placeholder: "210" },
        { field: "monthlySales", kind: "number", label: "Vendas realizadas por mês", min: 0, placeholder: "100", alwaysAsk: true },
      ],
    },
  ],
  compute,
  crossSell: (profile) =>
    (profile.platformRate ?? 0) > 0 ? ["precificacao", "modelo-lancamento"] : ["plataforma", "precificacao"],
};

export { percent };
