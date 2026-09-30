import type { LucideIcon } from "lucide-react";

/**
 * One unified profile for the producer, enriched progressively as they move
 * through the tools. Every question in every calculator writes into a field
 * declared here, which is what makes progressive profiling possible: a question
 * whose field is already filled is skipped on the next tool.
 */
export type ProducerProfile = {
  // ---- Identification (asked late, right before a result) ----
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  company?: string;
  handle?: string;
  role?: string;

  // ---- Business ----
  segment?: string;
  productType?: string;
  productName?: string;
  audience?: string;
  audienceModel?: string;
  buyerIntent?: string;
  productCount?: string;
  studentCount?: string;
  monthlyRevenue?: string;
  monthlySales?: number;
  price?: number;
  averageTicket?: number;
  pricingBasis?: string;

  // ---- Delivery ----
  deliveryFormat?: string;
  contentHours?: number;
  moduleCount?: number;
  lessonCount?: number;
  includes?: string[];
  materials?: string[];
  hasGuestTeachers?: string;
  teacherEducation?: string;
  hasAssessments?: string;
  hasFinalProject?: string;
  educationalGoal?: string;
  courseExists?: string;

  // ---- Proof / authority ----
  caseVolume?: string;
  expertAuthority?: string;
  salesHistory?: string;

  // ---- Certification ----
  certification?: string;

  // ---- Go-to-market ----
  salesModel?: string;
  mediaSpend?: string;
  audienceSize?: string;
  leadBase?: string;
  teamStructure?: string;
  salesStructure?: string;
  revenueHorizon?: string;
  needsSalesCall?: string;
  hasRecurrence?: string;

  // ---- Funnel metrics ----
  monthlyVisits?: number;
  monthlyLeads?: number;
  qualifiedLeads?: number;
  checkoutsStarted?: number;

  // ---- Platform ----
  platform?: string;
  monthlyTpv?: string;
  transactionCount?: number;
  platformRate?: number;
  hasFixedFee?: string;
  fixedFee?: number;
  hasWithdrawalFee?: string;
  withdrawalFee?: number;
  customDeal?: string;
  mainPaymentMethod?: string;
};

export type ProfileField = keyof ProducerProfile;

export type QuestionOption = {
  value: string;
  label: string;
  description?: string;
};

export type QuestionKind =
  | "select"
  | "multiselect"
  | "chips"
  | "money"
  | "percent"
  | "number"
  | "text"
  | "range"
  | "toggle";

export type Question = {
  /** The `ProducerProfile` field this question fills. */
  field: ProfileField;
  kind: QuestionKind;
  label: string;
  help?: string;
  placeholder?: string;
  options?: QuestionOption[];
  /** Two columns of cards on desktop instead of one, for short option sets. */
  columns?: 1 | 2 | 3;
  optional?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Hide the question unless the profile satisfies this predicate. */
  showIf?: (profile: ProducerProfile) => boolean;
  /** Ask again even when the field already has a value (e.g. current price). */
  alwaysAsk?: boolean;
};

export type CalculatorStep = {
  id: string;
  title: string;
  subtitle?: string;
  questions: Question[];
};

export type ResultStatus = "positive" | "attention" | "negative" | "info";

export type ResultMetric = {
  label: string;
  value: string;
  reference?: string;
  status: ResultStatus;
  statusLabel: string;
  hint?: string;
};

export type ResultOpportunity = {
  title: string;
  body: string;
  cta?: { label: string; href: string };
};

export type CalculatorResult = {
  /** Big conclusion at the top of the result screen. */
  headline: string;
  status: ResultStatus;
  statusLabel: string;
  primary: { label: string; value: string; hint?: string };
  secondary?: { label: string; value: string; hint?: string }[];
  metrics: ResultMetric[];
  /** Narrative interpretation — produced by a mocked service, swappable for AI. */
  analysis: string;
  positives: string[];
  attentions: string[];
  opportunities: ResultOpportunity[];
  disclaimer?: string;
};

export type CalculatorSlug =
  | "precificacao"
  | "modelo-lancamento"
  | "pos-graduacao"
  | "conversao"
  | "plataforma";

export type Calculator = {
  slug: CalculatorSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  minutes: number;
  icon: LucideIcon;
  steps: CalculatorStep[];
  compute: (profile: ProducerProfile) => CalculatorResult;
  /** Which tool to suggest next, decided from the profile and the result. */
  crossSell: (profile: ProducerProfile, result: CalculatorResult) => CalculatorSlug[];
};

export type ToolProgress = {
  /** Index of the furthest step reached, per calculator. */
  stepIndex: number;
  completed: boolean;
  /** How many of the calculator's questions have an answer. */
  answered: number;
  total: number;
};
