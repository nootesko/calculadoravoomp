/**
 * MOCK — go-to-market model scoring.
 *
 * Simulated data for demonstration only. Each model declares weighted signals;
 * the engine scores every model against the profile and ranks them, so adding a
 * new model is a data change rather than a code change.
 */

export type LaunchModel = {
  id: string;
  name: string;
  summary: string;
  /** Profile field → { answer value → points }. */
  signals: Record<string, Record<string, number>>;
  /** Applied when the operation has no sales history at all. */
  requiresValidation?: boolean;
  requiresTeam?: boolean;
  requiresAudience?: boolean;
};

export const LAUNCH_MODELS: LaunchModel[] = [
  {
    id: "perpetuo",
    name: "Perpétuo",
    summary:
      "Aquisição contínua com oferta sempre disponível, sustentada por mídia paga e um funil estável.",
    requiresValidation: true,
    signals: {
      salesHistory: { consistente: 3, irregular: 1, nenhum: -3 },
      mediaSpend: { "15-50k": 3, "50-150k": 3, "150k+": 3, "5-15k": 2, "0-5k": 1, none: -3 },
      averageTicketTier: { low: 2, mid: 3, high: 0 },
      needsSalesCall: { nao: 3, "as-vezes": 1, sim: -2 },
      teamStructure: { estruturada: 2, enxuta: 1, sozinho: 0 },
    },
  },
  {
    id: "semente",
    name: "Lançamento semente",
    summary:
      "Validação com uma audiência pequena, entrega ao vivo e investimento mínimo em mídia.",
    signals: {
      salesHistory: { nenhum: 3, irregular: 2, consistente: -1 },
      mediaSpend: { none: 3, "0-5k": 2, "5-15k": 0, "15-50k": -2, "50-150k": -3, "150k+": -3 },
      audienceSize: { "0-1k": 3, "1-10k": 2, "10-50k": 0, "50-200k": -1, "200k+": -2 },
      teamStructure: { sozinho: 2, enxuta: 1, estruturada: -1 },
    },
  },
  {
    id: "interno",
    name: "Lançamento interno",
    summary:
      "Campanha para a base própria de leads e alunos, sem depender de aquisição fria.",
    requiresAudience: true,
    signals: {
      leadBase: { "10-50k": 3, "50k+": 3, "1-10k": 2, "0-1k": 0, none: -3 },
      salesHistory: { consistente: 2, irregular: 2, nenhum: 0 },
      mediaSpend: { none: 2, "0-5k": 2, "5-15k": 1, "15-50k": 0 },
      averageTicketTier: { mid: 2, high: 2, low: 1 },
    },
  },
  {
    id: "classico",
    name: "Lançamento clássico",
    summary:
      "Campanha com captação paga, sequência de conteúdo e carrinho aberto por poucos dias.",
    requiresValidation: true,
    requiresTeam: true,
    signals: {
      mediaSpend: { "50-150k": 3, "150k+": 3, "15-50k": 2, "5-15k": 0, "0-5k": -2, none: -3 },
      teamStructure: { estruturada: 3, enxuta: 0, sozinho: -3 },
      expertAuthority: { alta: 3, media: 1, baixa: -2 },
      salesHistory: { consistente: 2, irregular: 0, nenhum: -3 },
      audienceSize: { "200k+": 2, "50-200k": 2, "10-50k": 1, "1-10k": -1, "0-1k": -2 },
    },
  },
  {
    id: "webinar",
    name: "Webinar perpétuo",
    summary:
      "Apresentação gravada ou ao vivo rodando de forma contínua, com oferta ao final.",
    signals: {
      averageTicketTier: { mid: 3, high: 2, low: 1 },
      mediaSpend: { "5-15k": 2, "15-50k": 3, "50-150k": 2, "0-5k": 1, none: -2 },
      needsSalesCall: { nao: 2, "as-vezes": 2, sim: 0 },
      salesHistory: { consistente: 2, irregular: 1, nenhum: -1 },
    },
  },
  {
    id: "evento",
    name: "Evento (online ou presencial)",
    summary:
      "Encontro concentrado que gera pico de receita e fortalece autoridade da marca.",
    signals: {
      expertAuthority: { alta: 3, media: 1, baixa: -2 },
      averageTicketTier: { high: 3, mid: 1, low: -1 },
      teamStructure: { estruturada: 2, enxuta: 0, sozinho: -2 },
      revenueHorizon: { "3-6-meses": 2, "6-meses+": 2, "ate-30-dias": -2 },
    },
  },
  {
    id: "desafio",
    name: "Desafio",
    summary:
      "Sequência curta de tarefas práticas que aquece a audiência antes da oferta.",
    signals: {
      averageTicketTier: { low: 3, mid: 2, high: -1 },
      audienceSize: { "10-50k": 2, "50-200k": 2, "1-10k": 2, "200k+": 1 },
      mediaSpend: { "0-5k": 2, "5-15k": 2, "15-50k": 1, none: 1 },
      buyerIntent: { direto: 2, parcial: 1, nao: 0 },
    },
  },
  {
    id: "assinatura",
    name: "Assinatura / recorrência",
    summary:
      "Receita previsível baseada em entrega contínua e retenção da base de alunos.",
    signals: {
      hasRecurrence: { sim: 4, "pode-ter": 2, nao: -4 },
      averageTicketTier: { low: 3, mid: 1, high: -2 },
      salesHistory: { consistente: 2, irregular: 1, nenhum: 0 },
      revenueHorizon: { "6-meses+": 2, "3-6-meses": 1, "ate-30-dias": -2 },
    },
  },
  {
    id: "hibrido",
    name: "Estratégia híbrida",
    summary:
      "Aquisição perpétua como base, com campanhas periódicas funcionando como acelerador.",
    requiresValidation: true,
    signals: {
      salesHistory: { consistente: 3, irregular: 1, nenhum: -3 },
      mediaSpend: { "15-50k": 2, "50-150k": 3, "150k+": 3, "5-15k": 1 },
      teamStructure: { estruturada: 3, enxuta: 1, sozinho: -2 },
      leadBase: { "10-50k": 2, "50k+": 3, "1-10k": 1 },
    },
  },
];
