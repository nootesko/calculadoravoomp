import { GraduationCap } from "lucide-react";

import {
  ACADEMIC_CRITERIA,
  ACADEMIC_DISCLAIMER,
  MINIMUM_HOURS,
  POTENTIAL_BANDS,
} from "@/data/benchmarks/academic-rules";
import { STUDENT_BRACKETS, toOptions } from "@/data/ranges";
import {
  AUDIENCES,
  CERTIFICATIONS,
  COURSE_EXISTS,
  EDUCATIONAL_GOALS,
  MATERIALS,
  SEGMENTS,
  TEACHER_EDUCATION,
  YES_NO,
  YES_PARTIAL_NO,
} from "@/lib/tools/options";
import { generateAcademicAssessment } from "@/lib/tools/services/analysis";
import type { Calculator, CalculatorResult, ProducerProfile } from "@/lib/tools/types";

function compute(profile: ProducerProfile): CalculatorResult {
  const evaluated = ACADEMIC_CRITERIA.map((criterion) => {
    const value = criterion.evaluate(profile);
    return { criterion, value, points: value * criterion.weight };
  });

  const totalWeight = ACADEMIC_CRITERIA.reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round(
    (evaluated.reduce((sum, item) => sum + item.points, 0) / totalWeight) * 100
  );

  const level = POTENTIAL_BANDS.find((band) => score >= band.min)!.level;

  const positives = evaluated
    .filter((item) => item.value >= item.criterion.attentionBelow)
    .map((item) => item.criterion.positive);

  const attentions = evaluated
    .filter((item) => item.value < item.criterion.attentionBelow)
    .map((item) => item.criterion.attention);

  const status = level === "ALTO" ? "positive" : level === "MÉDIO" ? "attention" : "negative";

  return {
    headline: `Potencial preliminar: ${level}`,
    status,
    statusLabel: `Índice preliminar ${score}/100`,
    primary: {
      label: "Potencial preliminar",
      value: level,
      hint: "Análise preliminar de estrutura — não é aprovação acadêmica",
    },
    secondary: [{ label: "Índice de aderência", value: `${score}/100` }],
    metrics: [
      {
        label: "Carga horária",
        value: profile.contentHours ? `${profile.contentHours}h` : "—",
        reference: `Referência: a partir de ${MINIMUM_HOURS}h`,
        status: (profile.contentHours ?? 0) >= MINIMUM_HOURS ? "positive" : "attention",
        statusLabel:
          (profile.contentHours ?? 0) >= MINIMUM_HOURS ? "Compatível" : "Precisa complementar",
      },
      {
        label: "Corpo docente",
        value: TEACHER_EDUCATION.find((t) => t.value === profile.teacherEducation)?.label ?? "—",
        status: ["mestrado", "doutorado"].includes(profile.teacherEducation ?? "")
          ? "positive"
          : "attention",
        statusLabel: ["mestrado", "doutorado"].includes(profile.teacherEducation ?? "")
          ? "Titulação adequada"
          : "Precisa ser analisado",
      },
      {
        label: "Avaliação formal",
        value: profile.hasAssessments === "sim" ? "Sim" : profile.hasAssessments === "parcial" ? "Parcial" : "Não",
        status: profile.hasAssessments === "sim" ? "positive" : "attention",
        statusLabel: profile.hasAssessments === "sim" ? "Já existe" : "Precisa estruturar",
      },
      {
        label: "Certificação atual",
        value: CERTIFICATIONS.find((c) => c.value === profile.certification)?.label ?? "—",
        status: "info",
        statusLabel: "Situação hoje",
      },
    ],
    analysis: generateAcademicAssessment({ profile, score, level, gaps: attentions }),
    positives,
    attentions,
    opportunities: [
      {
        title:
          level === "BAIXO"
            ? "Vale entender o caminho antes de investir na estrutura"
            : "Seu curso apresenta características que justificam uma análise acadêmica mais detalhada",
        body:
          "A Voomp é a única plataforma que oferece extensão universitária e pós-graduação com reconhecimento oficial, em parceria com a faculdade Anhanguera. A avaliação acadêmica é feita caso a caso pela instituição.",
        cta: { label: "Solicitar avaliação da Voomp", href: "#criar-conta" },
      },
    ],
    disclaimer: ACADEMIC_DISCLAIMER,
  };
}

export const academicCalculator: Calculator = {
  slug: "pos-graduacao",
  name: "Seu curso pode se tornar uma pós-graduação?",
  shortName: "Pós-graduação",
  tagline: "Faça uma análise preliminar da estrutura atual do seu curso.",
  description:
    "Faça uma análise preliminar para descobrir se seu curso possui características compatíveis com uma pós-graduação oferecida em parceria com uma instituição reconhecida pelo MEC.",
  minutes: 4,
  icon: GraduationCap,
  steps: [
    {
      id: "curso",
      title: "Sobre o curso",
      questions: [
        { field: "courseExists", kind: "select", label: "O curso já existe?", options: COURSE_EXISTS },
        { field: "segment", kind: "select", label: "Qual a área do curso?", options: SEGMENTS, columns: 3 },
        { field: "productName", kind: "text", label: "Qual o nome do curso?", placeholder: "Ex.: Gestão de Clínicas", optional: true },
      ],
    },
    {
      id: "publico",
      title: "Público e objetivo",
      questions: [
        { field: "audience", kind: "select", label: "Para quem o curso é feito?", options: AUDIENCES, columns: 2 },
        { field: "educationalGoal", kind: "select", label: "Qual o objetivo educacional?", options: EDUCATIONAL_GOALS, columns: 2 },
      ],
    },
    {
      id: "estrutura",
      title: "Estrutura do conteúdo",
      subtitle: "Programas lato sensu costumam exigir carga horária mínima de 360 horas.",
      questions: [
        { field: "contentHours", kind: "number", label: "Carga horária aproximada", unit: "horas", min: 0, placeholder: "360" },
        { field: "moduleCount", kind: "number", label: "Quantos módulos?", min: 0, placeholder: "8" },
        { field: "lessonCount", kind: "number", label: "Quantas aulas, aproximadamente?", min: 0, placeholder: "60" },
      ],
    },
    {
      id: "materiais",
      title: "Materiais didáticos",
      questions: [
        { field: "materials", kind: "multiselect", label: "Quais materiais o curso já tem?", options: MATERIALS, columns: 2 },
      ],
    },
    {
      id: "docentes",
      title: "Corpo docente",
      subtitle: "Esse é um dos critérios que mais pesam numa avaliação acadêmica.",
      questions: [
        { field: "hasGuestTeachers", kind: "select", label: "O curso tem professores ou convidados além de você?", options: YES_NO, columns: 2 },
        { field: "teacherEducation", kind: "select", label: "Qual a maior formação dos responsáveis pelo conteúdo?", options: TEACHER_EDUCATION, columns: 2 },
      ],
    },
    {
      id: "avaliacao",
      title: "Avaliação",
      questions: [
        { field: "hasAssessments", kind: "select", label: "O curso possui avaliações?", options: YES_PARTIAL_NO, columns: 3 },
        { field: "hasFinalProject", kind: "select", label: "Existe trabalho ou projeto final?", options: YES_PARTIAL_NO, columns: 3 },
      ],
    },
    {
      id: "situacao",
      title: "Situação atual",
      questions: [
        { field: "studentCount", kind: "select", label: "Quantos alunos o curso já teve?", options: toOptions(STUDENT_BRACKETS), columns: 2 },
        { field: "certification", kind: "select", label: "Que certificação você oferece hoje?", options: CERTIFICATIONS, columns: 2 },
      ],
    },
  ],
  compute,
  crossSell: () => ["precificacao", "plataforma"],
};
