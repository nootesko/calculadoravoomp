/**
 * MOCK — pricing reference rules.
 *
 * Simulated data for demonstration only. The shape is deliberately dimensional
 * (segment · product type · audience · certification) so this file can be
 * replaced by an API response without touching the components.
 */

export type PricingBand = { floor: number; ceiling: number };

/** Starting band per product type, before any modifier. */
export const BASE_BANDS: Record<string, PricingBand> = {
  "curso-online": { floor: 297, ceiling: 997 },
  formacao: { floor: 997, ceiling: 3_500 },
  mentoria: { floor: 2_000, ceiling: 12_000 },
  comunidade: { floor: 97, ceiling: 497 },
  assinatura: { floor: 47, ceiling: 297 },
  consultoria: { floor: 3_000, ceiling: 20_000 },
  outro: { floor: 297, ceiling: 1_500 },
};

/** Multipliers applied to the base band. 1.0 = neutral. */
export const MODIFIERS = {
  audience: {
    "consumidor-final": 0.85,
    profissionais: 1.15,
    empresarios: 1.35,
    especialistas: 1.25,
    empresas: 1.5,
    estudantes: 0.75,
    outro: 1,
  } as Record<string, number>,

  buyerIntent: {
    direto: 1.25,
    parcial: 1.05,
    nao: 0.85,
  } as Record<string, number>,

  deliveryFormat: {
    gravado: 1,
    "ao-vivo": 1.2,
    hibrido: 1.15,
  } as Record<string, number>,

  caseVolume: {
    nenhum: 0.8,
    poucos: 0.95,
    diversos: 1.1,
    muitos: 1.25,
  } as Record<string, number>,

  certification: {
    nenhuma: 0.9,
    propria: 1,
    extensao: 1.25,
    "pos-graduacao": 1.6,
    outro: 1,
  } as Record<string, number>,
} as const;

/** Each selected inclusion adds this much to the ceiling multiplier. */
export const INCLUDE_BONUS: Record<string, number> = {
  comunidade: 0.05,
  suporte: 0.08,
  "mentoria-grupo": 0.12,
  "mentoria-individual": 0.2,
  materiais: 0.04,
  certificado: 0.05,
  atualizacoes: 0.05,
  eventos: 0.08,
};

/** Content volume tiers, in hours. */
export const CONTENT_DEPTH = [
  { maxHours: 5, multiplier: 0.8, label: "conteúdo curto" },
  { maxHours: 20, multiplier: 1, label: "conteúdo intermediário" },
  { maxHours: 60, multiplier: 1.15, label: "conteúdo aprofundado" },
  { maxHours: Infinity, multiplier: 1.3, label: "alta profundidade" },
];

/** Segments where buyers are historically more price sensitive. */
export const PRICE_SENSITIVE_SEGMENTS = ["estetica", "culinaria", "hobbies", "idiomas"];
