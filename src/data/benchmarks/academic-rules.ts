/**
 * MOCK — preliminary academic screening criteria.
 *
 * Simulated data for demonstration only.
 *
 * IMPORTANT: this scoring expresses *potential for further analysis*. It never
 * represents approval by MEC or by a partner institution, and the UI must state
 * that on every result.
 */

export type AcademicCriterion = {
  id: string;
  label: string;
  /** Weight in the preliminary score. */
  weight: number;
  /** Evaluated against the profile; returns 0..1. */
  evaluate: (input: AcademicInput) => number;
  /** Shown when the criterion scores below `attentionBelow`. */
  attention: string;
  attentionBelow: number;
  positive: string;
};

export type AcademicInput = {
  courseExists?: string;
  contentHours?: number;
  moduleCount?: number;
  lessonCount?: number;
  materials?: string[];
  hasGuestTeachers?: string;
  teacherEducation?: string;
  hasAssessments?: string;
  hasFinalProject?: string;
  studentCount?: string;
  audience?: string;
  certification?: string;
};

/** Minimum content load usually expected of a lato sensu programme, in hours. */
export const MINIMUM_HOURS = 360;

export const ACADEMIC_CRITERIA: AcademicCriterion[] = [
  {
    id: "existence",
    label: "Curso já estruturado",
    weight: 12,
    evaluate: ({ courseExists }) =>
      courseExists === "sim-vendendo" ? 1 : courseExists === "sim-pronto" ? 0.8 : 0.2,
    attentionBelow: 0.5,
    attention: "O curso ainda está em construção, o que dificulta uma análise acadêmica agora",
    positive: "Curso já estruturado e em operação",
  },
  {
    id: "hours",
    label: "Carga horária compatível",
    weight: 22,
    evaluate: ({ contentHours = 0 }) => {
      if (contentHours >= MINIMUM_HOURS) return 1;
      if (contentHours >= 180) return 0.7;
      if (contentHours >= 60) return 0.45;
      if (contentHours >= 20) return 0.25;
      return 0.1;
    },
    attentionBelow: 0.7,
    attention: `A carga horária atual fica abaixo das ${MINIMUM_HOURS}h normalmente esperadas — seria necessário complementar o conteúdo`,
    positive: "Carga horária relevante para um programa acadêmico",
  },
  {
    id: "structure",
    label: "Organização em módulos e aulas",
    weight: 12,
    evaluate: ({ moduleCount = 0, lessonCount = 0 }) => {
      const score = (moduleCount >= 6 ? 0.5 : moduleCount >= 3 ? 0.3 : 0.1)
        + (lessonCount >= 60 ? 0.5 : lessonCount >= 25 ? 0.3 : 0.1);
      return Math.min(1, score);
    },
    attentionBelow: 0.6,
    attention: "A estrutura em módulos e aulas precisaria ser reorganizada em formato de disciplinas",
    positive: "Conteúdo consolidado e bem dividido",
  },
  {
    id: "faculty",
    label: "Corpo docente",
    weight: 20,
    evaluate: ({ teacherEducation, hasGuestTeachers }) => {
      const byEducation: Record<string, number> = {
        doutorado: 1,
        mestrado: 0.85,
        especializacao: 0.55,
        graduacao: 0.35,
        "nao-informado": 0.15,
      };
      const base = byEducation[teacherEducation ?? "nao-informado"] ?? 0.15;
      return Math.min(1, base + (hasGuestTeachers === "sim" ? 0.15 : 0));
    },
    attentionBelow: 0.8,
    attention:
      "O corpo docente precisa ser analisado — programas lato sensu exigem titulação mínima de especialista, com percentual de mestres e doutores",
    positive: "Corpo docente com titulação compatível",
  },
  {
    id: "assessment",
    label: "Avaliação e trabalho final",
    weight: 16,
    evaluate: ({ hasAssessments, hasFinalProject }) =>
      (hasAssessments === "sim" ? 0.5 : hasAssessments === "parcial" ? 0.25 : 0)
      + (hasFinalProject === "sim" ? 0.5 : hasFinalProject === "parcial" ? 0.25 : 0),
    attentionBelow: 0.7,
    attention:
      "É necessário incluir avaliações formais e trabalho de conclusão para atender à estrutura acadêmica",
    positive: "Já possui avaliações e trabalho de conclusão",
  },
  {
    id: "materials",
    label: "Materiais didáticos",
    weight: 8,
    evaluate: ({ materials = [] }) => Math.min(1, materials.length / 5),
    attentionBelow: 0.6,
    attention: "O acervo de materiais didáticos precisaria ser ampliado",
    positive: "Bom acervo de materiais de apoio",
  },
  {
    id: "audience",
    label: "Público profissional",
    weight: 10,
    evaluate: ({ audience }) =>
      ["profissionais", "especialistas", "empresarios", "empresas"].includes(audience ?? "")
        ? 1
        : audience === "estudantes"
          ? 0.6
          : 0.3,
    attentionBelow: 0.6,
    attention:
      "O público atual é majoritariamente consumidor final, perfil menos aderente à pós-graduação",
    positive: "Público profissional, aderente à pós-graduação",
  },
];

export const POTENTIAL_BANDS = [
  { min: 75, level: "ALTO" as const },
  { min: 50, level: "MÉDIO" as const },
  { min: 0, level: "BAIXO" as const },
];

export const ACADEMIC_DISCLAIMER =
  "Este resultado é apenas uma análise preliminar e não representa aprovação acadêmica ou regulatória. O enquadramento depende de avaliação da instituição parceira e dos requisitos vigentes do MEC.";
