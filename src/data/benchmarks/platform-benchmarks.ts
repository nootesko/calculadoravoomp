/**
 * MOCK — platform fee reference bands.
 *
 * Simulated data for demonstration only. These are illustrative negotiation
 * ranges for operations of a similar size — they are NOT published rates of any
 * named platform, and the UI must never present them as such.
 */

export type RateBand = { min: number; max: number };

export const PLATFORMS = [
  { value: "hotmart", label: "Hotmart" },
  { value: "kiwify", label: "Kiwify" },
  { value: "eduzz", label: "Eduzz" },
  { value: "cakto", label: "Cakto" },
  { value: "monetizze", label: "Monetizze" },
  { value: "herospark", label: "HeroSpark" },
  { value: "voomp", label: "Voomp" },
  { value: "outra", label: "Outra" },
];

/** Negotiated percentage band by monthly TPV bracket. */
export const RATE_BY_TPV: Record<string, RateBand> = {
  "0-10k": { min: 8.0, max: 10.0 },
  "10-50k": { min: 7.0, max: 9.0 },
  "50-100k": { min: 6.0, max: 8.0 },
  "100-300k": { min: 4.9, max: 6.5 },
  "300k-1m": { min: 3.9, max: 5.5 },
  "1m+": { min: 3.0, max: 4.5 },
};

/** Typical fixed fee charged per transaction, in BRL. */
export const FIXED_FEE_REFERENCE: RateBand = { min: 0.5, max: 2.5 };

/**
 * Narrative signals only. The payment mix already shows up inside the rate the
 * producer actually pays, so it is never added to the reference band — it is
 * used to explain *why* an effective rate sits where it does.
 */
export const PAYMENT_METHOD_NOTES: Record<string, string> = {
  pix: "Predominância de Pix costuma reduzir o custo médio por transação",
  "cartao-vista": "Cartão à vista tem custo intermediário",
  parcelado: "Predominância de cartão parcelado eleva o custo efetivo da operação",
  boleto: "Boleto tem custo baixo, mas costuma reduzir a conversão",
  misto: "Mix equilibrado de meios de pagamento",
};
