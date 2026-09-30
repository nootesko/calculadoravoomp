import {
  MEDIA_SPEND_BRACKETS,
  REVENUE_BRACKETS,
  TPV_BRACKETS,
  findBracket,
  midpoint,
} from "@/data/ranges";
import { CALCULATORS, completionOf } from "@/lib/tools/registry";
import type { CalculatorSlug, ProducerProfile } from "@/lib/tools/types";

/**
 * Derived commercial view of the producer. Never shown to the user — this is
 * the shape a CRM would receive once the prototype is wired to a backend.
 */
export type LeadIntelligence = {
  estimated_tpv: number;
  estimated_monthly_revenue: number;
  current_platform?: string;
  migration_potential: "alto" | "medio" | "baixo";
  academic_product_potential: "alto" | "medio" | "baixo";
  commercial_maturity: "madura" | "em-crescimento" | "inicial";
  media_maturity: "escala" | "ativa" | "inexistente";
  lead_score: number;
  calculators_completed: CalculatorSlug[];
};

export function buildLeadIntelligence(profile: ProducerProfile): LeadIntelligence {
  const revenue = midpoint(findBracket(REVENUE_BRACKETS, profile.monthlyRevenue));
  const tpv = midpoint(findBracket(TPV_BRACKETS, profile.monthlyTpv)) || revenue;
  const media = midpoint(findBracket(MEDIA_SPEND_BRACKETS, profile.mediaSpend));

  const onCompetitor = Boolean(profile.platform) && profile.platform !== "voomp";
  const highRate = (profile.platformRate ?? 0) >= 6;

  const migration_potential =
    onCompetitor && tpv >= 100_000 && highRate
      ? "alto"
      : onCompetitor && (tpv >= 50_000 || highRate)
        ? "medio"
        : "baixo";

  const academicSignals = [
    (profile.contentHours ?? 0) >= 180,
    ["profissionais", "especialistas", "empresarios", "empresas"].includes(profile.audience ?? ""),
    ["mestrado", "doutorado", "especializacao"].includes(profile.teacherEducation ?? ""),
    ["nenhuma", "propria"].includes(profile.certification ?? ""),
    profile.hasAssessments === "sim",
  ].filter(Boolean).length;

  const academic_product_potential =
    academicSignals >= 4 ? "alto" : academicSignals >= 2 ? "medio" : "baixo";

  const commercial_maturity =
    profile.salesHistory === "consistente" && revenue >= 100_000
      ? "madura"
      : revenue > 0 || profile.salesHistory === "irregular"
        ? "em-crescimento"
        : "inicial";

  const media_maturity = media >= 15_000 ? "escala" : media > 0 ? "ativa" : "inexistente";

  const calculators_completed = CALCULATORS.filter(
    (calculator) => completionOf(calculator, profile).percent === 100
  ).map((calculator) => calculator.slug);

  // Weighted ICP score. Mocked for the prototype; the weights mirror the
  // "ICP muito forte" definition in the blueprint.
  let lead_score = 0;
  if (revenue >= 500_000) lead_score += 25;
  else if (revenue >= 100_000) lead_score += 20;
  else if (revenue >= 30_000) lead_score += 12;
  else if (revenue > 0) lead_score += 5;

  if (tpv >= 300_000) lead_score += 15;
  else if (tpv >= 100_000) lead_score += 12;
  else if (tpv >= 50_000) lead_score += 6;

  if (onCompetitor) lead_score += 10;
  if (highRate) lead_score += 10;
  if (academic_product_potential === "alto") lead_score += 15;
  else if (academic_product_potential === "medio") lead_score += 7;
  if (media_maturity === "escala") lead_score += 10;
  else if (media_maturity === "ativa") lead_score += 5;
  if (commercial_maturity === "madura") lead_score += 10;
  if (profile.email) lead_score += 5;
  lead_score += calculators_completed.length * 2;

  return {
    estimated_tpv: tpv,
    estimated_monthly_revenue: revenue,
    current_platform: profile.platform,
    migration_potential,
    academic_product_potential,
    commercial_maturity,
    media_maturity,
    lead_score: Math.min(100, lead_score),
    calculators_completed,
  };
}
