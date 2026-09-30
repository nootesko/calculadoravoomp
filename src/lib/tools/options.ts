import type { QuestionOption } from "@/lib/tools/types";

/**
 * Shared answer vocabularies. Because every calculator picks its options from
 * here, the same `ProducerProfile` field always holds comparable values — which
 * is what lets a later tool skip a question an earlier tool already answered.
 */

export const PRODUCT_TYPES: QuestionOption[] = [
  { value: "curso-online", label: "Curso online", description: "Conteúdo gravado, acesso individual" },
  { value: "formacao", label: "Formação", description: "Programa longo, várias etapas" },
  { value: "mentoria", label: "Mentoria", description: "Acompanhamento próximo, em grupo ou individual" },
  { value: "comunidade", label: "Comunidade", description: "Acesso contínuo a um grupo" },
  { value: "assinatura", label: "Assinatura", description: "Cobrança recorrente" },
  { value: "consultoria", label: "Consultoria", description: "Serviço aplicado ao negócio do cliente" },
  { value: "outro", label: "Outro" },
];

export const SEGMENTS: QuestionOption[] = [
  { value: "marketing", label: "Marketing e vendas" },
  { value: "saude", label: "Saúde e bem-estar" },
  { value: "financas", label: "Finanças e investimentos" },
  { value: "tecnologia", label: "Tecnologia e dados" },
  { value: "educacao", label: "Educação e carreira" },
  { value: "juridico", label: "Jurídico" },
  { value: "gestao", label: "Gestão e negócios" },
  { value: "estetica", label: "Estética e beleza" },
  { value: "idiomas", label: "Idiomas" },
  { value: "desenvolvimento", label: "Desenvolvimento pessoal" },
  { value: "outro", label: "Outro" },
];

export const AUDIENCES: QuestionOption[] = [
  { value: "consumidor-final", label: "Consumidor final" },
  { value: "profissionais", label: "Profissionais da área" },
  { value: "empresarios", label: "Empresários" },
  { value: "especialistas", label: "Especialistas" },
  { value: "empresas", label: "Empresas (B2B)" },
  { value: "estudantes", label: "Estudantes" },
  { value: "outro", label: "Outro" },
];

export const BUYER_INTENT: QuestionOption[] = [
  {
    value: "direto",
    label: "Sim, diretamente",
    description: "O aluno usa o conteúdo para faturar ou subir de cargo",
  },
  { value: "parcial", label: "Parcialmente", description: "Ajuda, mas não é o objetivo principal" },
  { value: "nao", label: "Não", description: "É interesse pessoal ou qualidade de vida" },
];

export const DELIVERY_FORMATS: QuestionOption[] = [
  { value: "gravado", label: "Gravado" },
  { value: "ao-vivo", label: "Ao vivo" },
  { value: "hibrido", label: "Híbrido" },
];

export const INCLUDES: QuestionOption[] = [
  { value: "comunidade", label: "Comunidade" },
  { value: "suporte", label: "Suporte" },
  { value: "mentoria-grupo", label: "Mentoria em grupo" },
  { value: "mentoria-individual", label: "Mentoria individual" },
  { value: "materiais", label: "Materiais complementares" },
  { value: "certificado", label: "Certificado" },
  { value: "atualizacoes", label: "Atualizações" },
  { value: "eventos", label: "Eventos" },
];

export const CASE_VOLUMES: QuestionOption[] = [
  { value: "nenhum", label: "Nenhum ainda" },
  { value: "poucos", label: "Poucos" },
  { value: "diversos", label: "Diversos" },
  { value: "muitos", label: "Muitos cases documentados" },
];

export const PRICING_BASIS: QuestionOption[] = [
  { value: "benchmark", label: "Benchmark de concorrentes" },
  { value: "testes", label: "Testes de preço" },
  { value: "recomendacao", label: "Recomendação de alguém" },
  { value: "custos", label: "Cálculo de custos" },
  { value: "intuicao", label: "Intuição" },
  { value: "outro", label: "Outro" },
];

export const CERTIFICATIONS: QuestionOption[] = [
  { value: "nenhuma", label: "Nenhuma" },
  { value: "propria", label: "Certificado próprio" },
  { value: "extensao", label: "Extensão universitária" },
  { value: "pos-graduacao", label: "Pós-graduação" },
  { value: "outro", label: "Outro" },
];

export const SALES_MODELS: QuestionOption[] = [
  { value: "perpetuo", label: "Perpétuo" },
  { value: "lancamento", label: "Lançamentos" },
  { value: "webinar", label: "Webinar" },
  { value: "assinatura", label: "Assinatura" },
  { value: "vendas-diretas", label: "Vendas por time comercial" },
  { value: "organico", label: "Só orgânico" },
];

export const SALES_HISTORY: QuestionOption[] = [
  { value: "nenhum", label: "Ainda não vendi", description: "Produto novo ou em construção" },
  { value: "irregular", label: "Vendas irregulares", description: "Acontece, mas sem previsibilidade" },
  { value: "consistente", label: "Vendas consistentes", description: "Todo mês, com previsibilidade" },
];

export const EXPERT_AUTHORITY: QuestionOption[] = [
  { value: "baixa", label: "Baixa", description: "Pouco conhecido fora do círculo próximo" },
  { value: "media", label: "Média", description: "Reconhecido dentro do nicho" },
  { value: "alta", label: "Alta", description: "Referência no mercado, com mídia e palco" },
];

export const TEAM_STRUCTURES: QuestionOption[] = [
  { value: "sozinho", label: "Só eu" },
  { value: "enxuta", label: "Equipe enxuta", description: "1 a 4 pessoas" },
  { value: "estruturada", label: "Equipe estruturada", description: "5 pessoas ou mais" },
];

export const SALES_STRUCTURES: QuestionOption[] = [
  { value: "nenhuma", label: "Não tenho time comercial" },
  { value: "informal", label: "Alguém atende quando aparece" },
  { value: "estruturada", label: "Time comercial estruturado" },
];

export const REVENUE_HORIZONS: QuestionOption[] = [
  { value: "ate-30-dias", label: "Nos próximos 30 dias" },
  { value: "3-6-meses", label: "Em 3 a 6 meses" },
  { value: "6-meses+", label: "Construindo para o longo prazo" },
];

export const YES_PARTIAL_NO: QuestionOption[] = [
  { value: "sim", label: "Sim" },
  { value: "parcial", label: "Parcialmente" },
  { value: "nao", label: "Não" },
];

export const YES_SOMETIMES_NO: QuestionOption[] = [
  { value: "sim", label: "Sim, sempre" },
  { value: "as-vezes", label: "Às vezes" },
  { value: "nao", label: "Não, é autosserviço" },
];

export const RECURRENCE: QuestionOption[] = [
  { value: "sim", label: "Sim, já é recorrente" },
  { value: "pode-ter", label: "Poderia ter" },
  { value: "nao", label: "Não faz sentido" },
];

export const COURSE_EXISTS: QuestionOption[] = [
  { value: "sim-vendendo", label: "Sim, já vendo" },
  { value: "sim-pronto", label: "Sim, está pronto mas ainda não vendi" },
  { value: "em-construcao", label: "Está em construção" },
];

export const EDUCATIONAL_GOALS: QuestionOption[] = [
  { value: "qualificacao", label: "Qualificação profissional" },
  { value: "especializacao", label: "Especialização técnica" },
  { value: "transicao", label: "Transição de carreira" },
  { value: "atualizacao", label: "Atualização" },
  { value: "hobby", label: "Interesse pessoal" },
];

export const MATERIALS: QuestionOption[] = [
  { value: "video", label: "Vídeo" },
  { value: "ebook", label: "E-book / apostila" },
  { value: "podcast", label: "Podcast" },
  { value: "exercicios", label: "Exercícios" },
  { value: "avaliacoes", label: "Avaliações" },
  { value: "projetos", label: "Projetos" },
  { value: "estudos-caso", label: "Estudos de caso" },
  { value: "outros", label: "Outros" },
];

export const TEACHER_EDUCATION: QuestionOption[] = [
  { value: "graduacao", label: "Graduação" },
  { value: "especializacao", label: "Especialização" },
  { value: "mestrado", label: "Mestrado" },
  { value: "doutorado", label: "Doutorado" },
  { value: "nao-informado", label: "Prefiro não informar" },
];

export const PAYMENT_METHODS: QuestionOption[] = [
  { value: "pix", label: "Pix" },
  { value: "cartao-vista", label: "Cartão à vista" },
  { value: "parcelado", label: "Cartão parcelado" },
  { value: "boleto", label: "Boleto" },
  { value: "misto", label: "Misturado" },
];

export const CUSTOM_DEAL: QuestionOption[] = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "nao-sei", label: "Não sei" },
];

export const YES_NO: QuestionOption[] = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
];

export const ROLES: QuestionOption[] = [
  { value: "expert", label: "Expert" },
  { value: "infoprodutor", label: "Infoprodutor" },
  { value: "socio", label: "Sócio" },
  { value: "gestor", label: "Gestor" },
  { value: "agencia", label: "Agência" },
  { value: "colaborador", label: "Colaborador" },
  { value: "outro", label: "Outro" },
];

/** Look a stored value back up to its human label, for summaries. */
export function labelOf(options: QuestionOption[], value?: string) {
  return options.find((option) => option.value === value)?.label ?? value ?? "—";
}
