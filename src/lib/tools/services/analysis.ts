/**
 * MOCK interpretation services.
 *
 * These functions turn structured inputs into the narrative shown on the result
 * screens. They are deliberately isolated from the scoring engines so that each
 * one can later be swapped for an API/LLM call without changing any component:
 * the engines keep producing structured data, and only the prose comes from here.
 */

import { money, percent, range } from "@/lib/tools/format";
import type { ProducerProfile, ResultStatus } from "@/lib/tools/types";

const firstNameOr = (profile: ProducerProfile, fallback: string) =>
  profile.firstName ? profile.firstName : fallback;

export function generatePricingAnalysis(input: {
  profile: ProducerProfile;
  floor: number;
  ceiling: number;
  price: number;
  status: ResultStatus;
}): string {
  const { profile, floor, ceiling, price, status } = input;
  const band = range(floor, ceiling, money);
  const product = profile.productName ? `“${profile.productName}”` : "seu produto";

  if (status === "attention") {
    return `Considerando o formato, a profundidade do conteúdo e o público que compra ${product}, a faixa de referência para um produto com esses atributos fica entre ${band}. O preço atual de ${money(price)} está abaixo desse intervalo, o que normalmente significa margem sendo deixada na mesa — especialmente porque cada venda tem o mesmo custo de aquisição independentemente do ticket.`;
  }
  if (status === "negative") {
    return `A faixa de referência para produtos com atributos semelhantes a ${product} fica entre ${band}, e o preço atual de ${money(price)} está acima disso. Preço acima da faixa não é um problema por si só, mas costuma exigir uma sustentação clara: autoridade reconhecida, prova social robusta ou uma entrega que o mercado não encontra em outro lugar.`;
  }
  if (status === "positive") {
    return `O preço de ${money(price)} está coerente com a faixa de ${band} estimada para ${product}. Isso indica que a percepção de valor e a cobrança estão alinhadas — a partir daqui, o ganho tende a vir mais de aumentar o valor entregue do que de mexer no número.`;
  }
  return `Com as informações atuais, a faixa de referência para ${product} ficaria entre ${band}. Informe o preço praticado hoje para comparar sua posição dentro desse intervalo.`;
}

export function generateLaunchRecommendation(input: {
  profile: ProducerProfile;
  model: { name: string; summary: string };
  compatibility: number;
  runnerUp?: { name: string };
  avoid?: { name: string; reason: string };
}): string {
  const { profile, model, compatibility, runnerUp, avoid } = input;
  const parts: string[] = [];

  parts.push(
    `Com ${compatibility}% de compatibilidade, **${model.name}** é o modelo que melhor conversa com o momento atual da sua operação. ${model.summary}`
  );

  if (profile.salesHistory === "consistente") {
    parts.push(
      "Seu produto já tem validação e histórico de vendas, o que permite sustentar aquisição contínua em vez de depender de picos."
    );
  } else if (profile.salesHistory === "nenhum") {
    parts.push(
      "Como o produto ainda não vendeu, a prioridade agora é validar oferta e mensagem com o menor custo possível — escalar antes disso costuma queimar caixa sem aprendizado."
    );
  }

  if (runnerUp) {
    parts.push(`Como segunda alternativa, **${runnerUp.name}** também se encaixa e pode ser testado em paralelo.`);
  }
  if (avoid) {
    parts.push(`Evitaria **${avoid.name}** neste momento: ${avoid.reason}`);
  }

  return parts.join(" ");
}

export function generateAcademicAssessment(input: {
  profile: ProducerProfile;
  score: number;
  level: string;
  gaps: string[];
}): string {
  const { profile, score, level, gaps } = input;
  const course = profile.productName ? `“${profile.productName}”` : "seu curso";

  const opening =
    level === "ALTO"
      ? `${course} apresenta características que justificam uma análise acadêmica mais detalhada.`
      : level === "MÉDIO"
        ? `${course} tem uma base aproveitável, mas ainda existem lacunas relevantes antes de uma avaliação acadêmica.`
        : `Na configuração atual, ${course} ainda está distante da estrutura esperada para um programa de pós-graduação.`;

  const detail =
    gaps.length > 0
      ? ` Os pontos que mais pesam hoje: ${gaps.slice(0, 3).join("; ")}.`
      : " Os critérios avaliados nesta triagem preliminar foram atendidos de forma consistente.";

  return `${opening} O índice preliminar ficou em ${score} de 100, o que classifica o potencial como ${level}.${detail} Vale reforçar que essa é uma triagem inicial baseada em estrutura, e não uma avaliação regulatória.`;
}

export function generateConversionAnalysis(input: {
  bottleneck: "captacao" | "conversao" | "checkout" | "cpl-isolado" | "indefinido";
  hasEnoughData: boolean;
}): string {
  if (!input.hasEnoughData) {
    return "Ainda não há dados suficientes para apontar um gargalo com segurança. Preencher visitas, leads e checkouts iniciados permite comparar cada etapa do funil separadamente, em vez de olhar apenas o resultado final.";
  }
  switch (input.bottleneck) {
    case "captacao":
      return "Seu principal gargalo aparentemente está na captação: o custo por lead está acima da faixa de referência para operações semelhantes. Antes de mexer na oferta, vale revisar criativos, segmentação e a página de captura — é ali que o custo se forma.";
    case "cpl-isolado":
      return "Seu custo por lead está acima da faixa de referência, mas o CAC e o ROAS seguem saudáveis — ou seja, o lead é caro e mesmo assim se paga, porque a conversão de lead para venda está bem acima do esperado. Isso não caracteriza um gargalo. O ponto de atenção é que a operação depende dessa conversão alta: se ela cair, o custo do topo passa a doer rápido.";
    case "conversao":
      return "Seu principal gargalo aparentemente não está na captação, mas na transformação do lead em cliente. Você consegue trazer gente para dentro a um custo razoável, e a perda acontece depois — normalmente em aquecimento, oferta ou timing da apresentação de vendas.";
    case "checkout":
      return "A captação e o interesse estão funcionando: as pessoas chegam ao checkout. A perda está concentrada no momento final da compra, o que costuma apontar para fricção de pagamento, falta de opções de parcelamento ou quebra de confiança na última tela.";
    default:
      return "Os indicadores estão dentro das faixas de referência nas etapas medidas. Nesse cenário, o crescimento tende a vir mais de volume de tráfego e de aumento de ticket do que de otimização de conversão.";
  }
}

export function generatePlatformAnalysis(input: {
  effectiveRate: number;
  bandMin: number;
  bandMax: number;
  annualImpact: number;
  status: ResultStatus;
  tpvLabel: string;
}): string {
  const { effectiveRate, bandMin, bandMax, annualImpact, status, tpvLabel } = input;
  const band = `${percent(bandMin)} — ${percent(bandMax)}`;

  if (status === "negative" || status === "attention") {
    return `Somando percentual, taxa fixa e saque, sua taxa efetiva aproximada é de ${percent(effectiveRate)}. Para operações na faixa de ${tpvLabel}, o intervalo negociado costuma ficar entre ${band}. A diferença parece pequena olhando o percentual, mas no acumulado de doze meses representa cerca de ${money(annualImpact)} — dinheiro que sai da operação sem contrapartida em produto ou audiência.`;
  }
  if (status === "positive") {
    return `Sua taxa efetiva aproximada é de ${percent(effectiveRate)}, dentro do intervalo de ${band} que costuma ser praticado em operações na faixa de ${tpvLabel}. A negociação atual parece adequada ao seu volume — o ponto de atenção passa a ser revisá-la conforme o TPV cresce, já que as faixas melhoram com escala.`;
  }
  return `Com os dados informados, a taxa efetiva aproximada é de ${percent(effectiveRate)}. Informar taxa fixa e taxa de saque deixa a comparação com o intervalo de ${band} bem mais precisa.`;
}

export { firstNameOr };
