/**
 * Shared bracket vocabularies. Answers are stored as the bracket `value`, and
 * the numeric midpoint is what the result engines reason with — so a producer
 * never has to type an exact revenue figure.
 */

export type Bracket = { value: string; label: string; min: number; max: number };

export const midpoint = (bracket?: Bracket) =>
  bracket ? (bracket.max === Infinity ? bracket.min * 1.5 : (bracket.min + bracket.max) / 2) : 0;

export const findBracket = (list: Bracket[], value?: string) =>
  list.find((item) => item.value === value);

export const REVENUE_BRACKETS: Bracket[] = [
  { value: "none", label: "Ainda não vendo", min: 0, max: 0 },
  { value: "0-10k", label: "Até R$ 10 mil", min: 0, max: 10_000 },
  { value: "10-30k", label: "R$ 10 mil a R$ 30 mil", min: 10_000, max: 30_000 },
  { value: "30-50k", label: "R$ 30 mil a R$ 50 mil", min: 30_000, max: 50_000 },
  { value: "50-100k", label: "R$ 50 mil a R$ 100 mil", min: 50_000, max: 100_000 },
  { value: "100-300k", label: "R$ 100 mil a R$ 300 mil", min: 100_000, max: 300_000 },
  { value: "300-500k", label: "R$ 300 mil a R$ 500 mil", min: 300_000, max: 500_000 },
  { value: "500k-1m", label: "R$ 500 mil a R$ 1 milhão", min: 500_000, max: 1_000_000 },
  { value: "1m+", label: "Mais de R$ 1 milhão", min: 1_000_000, max: Infinity },
];

export const TPV_BRACKETS: Bracket[] = [
  { value: "0-10k", label: "Até R$ 10 mil", min: 0, max: 10_000 },
  { value: "10-50k", label: "R$ 10 mil a R$ 50 mil", min: 10_000, max: 50_000 },
  { value: "50-100k", label: "R$ 50 mil a R$ 100 mil", min: 50_000, max: 100_000 },
  { value: "100-300k", label: "R$ 100 mil a R$ 300 mil", min: 100_000, max: 300_000 },
  { value: "300k-1m", label: "R$ 300 mil a R$ 1 milhão", min: 300_000, max: 1_000_000 },
  { value: "1m+", label: "Mais de R$ 1 milhão", min: 1_000_000, max: Infinity },
];

export const MEDIA_SPEND_BRACKETS: Bracket[] = [
  { value: "none", label: "Não invisto", min: 0, max: 0 },
  { value: "0-5k", label: "Até R$ 5 mil", min: 0, max: 5_000 },
  { value: "5-15k", label: "R$ 5 mil a R$ 15 mil", min: 5_000, max: 15_000 },
  { value: "15-50k", label: "R$ 15 mil a R$ 50 mil", min: 15_000, max: 50_000 },
  { value: "50-150k", label: "R$ 50 mil a R$ 150 mil", min: 50_000, max: 150_000 },
  { value: "150k+", label: "Mais de R$ 150 mil", min: 150_000, max: Infinity },
];

export const AUDIENCE_BRACKETS: Bracket[] = [
  { value: "0-1k", label: "Até 1 mil seguidores", min: 0, max: 1_000 },
  { value: "1-10k", label: "1 mil a 10 mil", min: 1_000, max: 10_000 },
  { value: "10-50k", label: "10 mil a 50 mil", min: 10_000, max: 50_000 },
  { value: "50-200k", label: "50 mil a 200 mil", min: 50_000, max: 200_000 },
  { value: "200k+", label: "Mais de 200 mil", min: 200_000, max: Infinity },
];

export const LEAD_BASE_BRACKETS: Bracket[] = [
  { value: "none", label: "Não tenho base", min: 0, max: 0 },
  { value: "0-1k", label: "Até 1 mil contatos", min: 0, max: 1_000 },
  { value: "1-10k", label: "1 mil a 10 mil", min: 1_000, max: 10_000 },
  { value: "10-50k", label: "10 mil a 50 mil", min: 10_000, max: 50_000 },
  { value: "50k+", label: "Mais de 50 mil", min: 50_000, max: Infinity },
];

export const STUDENT_BRACKETS: Bracket[] = [
  { value: "0", label: "Nenhum ainda", min: 0, max: 0 },
  { value: "1-100", label: "Até 100", min: 1, max: 100 },
  { value: "100-500", label: "100 a 500", min: 100, max: 500 },
  { value: "500-2000", label: "500 a 2 mil", min: 500, max: 2_000 },
  { value: "2000+", label: "Mais de 2 mil", min: 2_000, max: Infinity },
];

export const bracketLabel = (list: Bracket[], value?: string) =>
  findBracket(list, value)?.label ?? "—";

export const toOptions = (list: Bracket[]) =>
  list.map(({ value, label }) => ({ value, label }));
