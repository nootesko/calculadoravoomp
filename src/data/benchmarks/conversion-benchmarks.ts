/**
 * MOCK — funnel benchmarks.
 *
 * Simulated data for demonstration only. Bands are keyed by ticket tier today;
 * the lookup already accepts segment and sales model so those dimensions can be
 * honoured once real data exists.
 */

export type Band = { min: number; max: number };

export type FunnelBenchmark = {
  visitToLead: Band;
  leadToSale: Band;
  checkoutToSale: Band;
  cpl: Band;
  cac: Band;
  roas: Band;
};

type TicketTier = "low" | "mid" | "high";

const BY_TICKET: Record<TicketTier, FunnelBenchmark> = {
  low: {
    visitToLead: { min: 0.2, max: 0.35 },
    leadToSale: { min: 0.03, max: 0.06 },
    checkoutToSale: { min: 0.4, max: 0.6 },
    cpl: { min: 3, max: 9 },
    cac: { min: 60, max: 160 },
    roas: { min: 2.5, max: 5 },
  },
  mid: {
    visitToLead: { min: 0.15, max: 0.3 },
    leadToSale: { min: 0.02, max: 0.03 },
    checkoutToSale: { min: 0.35, max: 0.55 },
    cpl: { min: 8, max: 25 },
    cac: { min: 250, max: 600 },
    roas: { min: 2, max: 4 },
  },
  high: {
    visitToLead: { min: 0.1, max: 0.25 },
    leadToSale: { min: 0.008, max: 0.02 },
    checkoutToSale: { min: 0.3, max: 0.5 },
    cpl: { min: 25, max: 40 },
    cac: { min: 900, max: 2_500 },
    roas: { min: 1.8, max: 3.5 },
  },
};

export function ticketTier(ticket: number): TicketTier {
  if (ticket < 500) return "low";
  if (ticket < 3_000) return "mid";
  return "high";
}

/**
 * Future signature already accepts the dimensions the blueprint calls for
 * (segment, sales model, channel); today only the ticket tier is used.
 */
export function getFunnelBenchmark(input: {
  ticket: number;
  segment?: string;
  salesModel?: string;
}): FunnelBenchmark {
  return BY_TICKET[ticketTier(input.ticket)];
}
