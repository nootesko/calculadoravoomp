/**
 * Every string on the landing page, transcribed from the Figma file
 * "Voomp — Website (Copy)" → page `Voomp` → frame `Home Desktop` (1:2755).
 *
 * Keeping the copy in one module makes it easy to hand over to a CMS later and
 * keeps the section components focused on layout.
 */

export type NavLink = { label: string; href: string; hasMenu?: boolean };

export const nav: {
  links: NavLink[];
  login: { label: string; href: string };
  signup: { label: string; href: string };
} = {
  links: [
    { label: "A Voomp", href: "#a-voomp" },
    { label: "Plataforma", href: "#plataforma", hasMenu: true },
    { label: "A Cogna Educação", href: "#grupo-cogna" },
    { label: "Soluções Acadêmicas", href: "#solucoes-academicas" },
    { label: "Cases", href: "#cases" },
    { label: "Voomp Updates", href: "#updates" },
  ],
  login: { label: "Entrar", href: "#entrar" },
  signup: { label: "Criar Conta", href: "#criar-conta" },
};

export const hero = {
  badge: "A plataforma do Grupo Cogna Educação",
  title: ["A plataforma de venda", "e hospedagem de cursos online"],
  cta: { label: "Cadastre-se agora", href: "#criar-conta" },
} as const;

export const cognaIntro = {
  eyebrow: "Uma empresa da Cogna Educação",
  title: ["Da criação de conteúdo", "ao reconhecimento oficial."],
  description:
    "Construa seu negócio educacional na plataforma do maior grupo educacional do país.",
  cta: { label: "Cadastre-se agora", href: "#criar-conta" },
  overlay: {
    badge: ["Validado", "Oficialmente"],
    card: {
      title: ["Seu curso com a visibilidade", "que ele merece"],
      subtitle: "Publique seu curso na Voomp",
      progress: 62,
    },
  },
} as const;

export type Person = {
  name: string;
  image: string;
  handle?: string;
  /** The first card is rendered larger, matching the Figma rail. */
  featured?: boolean;
};

export const entrepreneurs: {
  eyebrow: string;
  title: string;
  people: Person[];
} = {
  eyebrow: "Nossos empresários da educação",
  title: "Conheça quem está no topo",
  people: [
    {
      name: "Juliano Leme",
      handle: "@juliano.leme",
      image: "/images/ent-juliano.png",
      featured: true,
    },
    { name: "Artur Amaral", image: "/images/ent-artur.png" },
    { name: "Junior Ferreira", image: "/images/ent-junior.png" },
    { name: "Professor Eduardo Mira", image: "/images/ent-eduardo.png" },
  ],
};

export const platform = {
  eyebrow: "Plataforma",
  title: [
    "Encontre aqui tudo o que",
    "você precisa para transformar",
    "seu conhecimento em um negócio",
    "educacional de sucesso",
  ],
  cards: [
    {
      title: "Plataforma",
      description:
        "Sistema completo para criar, hospedar, vender e gerenciar seus cursos online",
    },
    {
      title: "Certificação Oficial",
      description:
        "A Voomp é a única plataforma do mercado que oferece extensão universitária e pós-graduação com reconhecimento oficial, em parceria com a faculdade Anhanguera.",
    },
  ],
  cta: { label: "Quero saber mais", href: "#plataforma" },
} as const;

export const featuresIntro = {
  eyebrow: "Principais recursos",
  title: "Tudo o que você precisa para criar, vender e escalar",
  filters: ["Todos", "Checkout", "Voomp Play", "Métricas & Dados", "Integrações"],
} as const;

export type Feature = {
  id: string;
  filter: string;
  eyebrow: string;
  title: string[];
  bullets: string[];
  cta: { label: string; href: string };
  image: string;
  imageAlt: string;
  /** Which side the illustration sits on at desktop widths. */
  imageSide: "left" | "right";
};

export const features: Feature[] = [
  {
    id: "checkout",
    filter: "Checkout",
    eyebrow: "Checkout",
    title: ["Checkout otimizado", "= Conversão máxima"],
    bullets: [
      "Personalizado com sua marca",
      "Vendas recorrentes para cursos por assinatura",
      "Upsell automático para aumentar ticket médio",
      "Múltiplos order bumps: transforme um SIM em múltiplas oportunidades de vendas",
      "Programa de afiliados nativo",
      "Pagamento via PIX, cartão e boleto",
      "Taxa de conversão acima de 90%",
    ],
    cta: { label: "Quero conhecer a Voomp", href: "#criar-conta" },
    image: "/images/feature-checkout.png",
    imageAlt: "Tela de checkout da Voomp com dados pessoais, pagamento e order bump",
    imageSide: "left",
  },
  {
    id: "voomp-play",
    filter: "Voomp Play",
    eyebrow: "Voomp Play",
    title: ["Gestão e entrega", "de conteúdo simplificada"],
    bullets: [
      "Experiência de aprendizagem otimizada pelo app nativo, disponível para Android e IOS",
      "Disponibilidade off-line",
      'Área de membros intuitiva, no estilo "Netflix"',
      "Streaming 100% seguro, protegido contra downloads",
      "White Label totalmente customizável",
      "Gestão completa do conteúdo, com aulas organizadas em módulos e em diferentes formatos (vídeos, arquivos, quizzes e muito mais).",
    ],
    cta: { label: "Quero conhecer a Voomp", href: "#criar-conta" },
    image: "/images/feature-play.png",
    imageAlt: "Área de membros do Voomp Play com catálogo de cursos em vídeo",
    imageSide: "right",
  },
  {
    id: "metricas",
    filter: "Métricas & Dados",
    eyebrow: "Métricas e dados",
    title: ["Dados assertivos e decisivos"],
    bullets: [
      "Visão em tempo real das vendas realizadas",
      "Personalização de dashboards",
      "Dados automatizados",
      "Relatórios analíticos e detalhados a cada venda",
      "Acompanhamento mobile",
      "Visão de funil (checkout, visitas, conversões e acompanhamento de metas)",
    ],
    cta: { label: "Quero conhecer a Voomp", href: "#criar-conta" },
    image: "/images/feature-dados.png",
    imageAlt: "Dashboard de métricas da Voomp com faturamento e saldo disponível",
    imageSide: "left",
  },
  {
    id: "integracoes",
    filter: "Integrações",
    eyebrow: "Integrações",
    title: ["Integre com", "o que você precisa"],
    bullets: [
      "Conecte a Voomp a todo o seu ecossistema de produção digital",
      "Conte com integrações nativas com as principais ferramentas do mercado",
      "Webhook para automações e personalizações",
      "Robustez necessária conforme sua empresa digital cresce",
    ],
    cta: { label: "Quero conhecer a Voomp", href: "#criar-conta" },
    image: "/images/feature-integracoes.png",
    imageAlt: "Catálogo de integrações da Voomp com Zapier, Pluga e Webhook",
    imageSide: "right",
  },
];

export const pricing = {
  eyebrow: "Tudo para você",
  title: ["Voomp é a plataforma", "que estimula o seu crescimento no digital"],
  description:
    "Migre para a Voomp e descubra por que centenas de infoprodutores já fizeram a escolha que transformou de vez seus negócios digitais.",
  tiers: [
    { icon: "award", price: "7,99% + R$ 1", note: "para produtos sem reconhecimento oficial" },
    { icon: "ticket", price: "5,99% + R$ 1", note: "para extensão" },
    { icon: "cap", price: "4,99% + R$ 1", note: "para PÓS/MBA" },
  ],
  cta: {
    title: ["Descubra agora quanto", "você pode ganhar com a Voomp"],
    label: "Calcular agora",
    href: "#calculadora",
  },
} as const;

export const support = {
  eyebrow: "Você no centro",
  title: ["Tenha suporte técnico, comercial e acadêmico", "em cada etapa"],
  description: "Você está se tornando parceiro do maior grupo educacional do país.",
} as const;

export const migration = {
  title: [
    "Quando você migra",
    "para a Voomp, você não está",
    "apenas trocando de plataforma",
  ],
  rows: [
    { label: "Antes", quote: "Mais um infoprodutor vendendo curso online" },
    {
      label: "Depois",
      quote:
        "Educador parceiro do Grupo Cogna com cursos reconhecidos oficialmente",
    },
  ],
} as const;

export const banner = {
  lead: "A pergunta não é",
  strong1: '"POR QUE DEVO MIGRAR?",',
  middle: "é",
  strong2: '"POR QUE AINDA NÃO MIGREI"',
  cta: "Quero migrar para Voomp",
  href: "#criar-conta",
} as const;

export const academic = {
  eyebrow: "Soluções acadêmicas",
  title: ["Anhanguera procura educadores", "e infoprodutores para parceria de conteúdo"],
  description:
    "Seja um parceiro de conteúdo da Anhanguera nos cursos de extensão, pós-graduação e MBA e aproveite o alcance e autoridade de uma marca reconhecida nacionalmente.",
  cta: {
    title: ["Conheça mais sobre a parceria", "de conteúdo com a Anhanguera"],
    label: "Quero saber mais",
    href: "#solucoes-academicas",
  },
} as const;

export const cases = {
  eyebrow: "Cases de sucesso",
  title: "Quem já deu esse passo",
  items: [
    {
      image: "/images/case-fisio.png",
      imageAlt: "Junior Ferreira e Artur Amaral, da Fisio Academy",
      headline:
        "Apostar no modelo de pós-graduações trouxe um retorno financeiro extraordinário para o Junior Ferreira e o Artur Amaral, da Fisio Academy",
      quote:
        "“Havíamos faturado 20 milhões entre 2010 e 2023, antes de colocarmos a pós como CORE da empresa. Desde que iniciamos as pós, no início de 2024 até agora, já faturamos mais de 20 milhões, ou seja, faturamos em 1 ano e meio com as pós, o que levamos 14 anos para faturar. Antes, nosso ticket-médio era de R$ 700, hoje é de R$ 3 mil.”",
      author: ["Junior Ferreira e o Artur Amaral,", "da Fisio Academy"],
    },
  ],
} as const;

export const gamification = {
  eyebrow: "Gamificação",
  title: "Sua jornada de sucesso é reconhecida a cada conquista",
  description:
    "O Programa de Gamificação da Voomp valoriza infoprodutores que estão construindo resultados surpreendentes.",
  image: "/images/gamification.png",
  imageAlt:
    "Níveis do programa de gamificação: Ascending to the Peak, Breaking Boundaries, Touching the Stars, Becoming a Legend e Achieving Greatness",
} as const;

export const updates = {
  eyebrow: "Voomp Updates",
  title: ["O que há de novo para", "potencializar seus resultados?"],
  description:
    "Fique por dentro de todas as atualizações, novos recursos e otimizações da Voomp.",
  items: [
    "Novos recursos lançados mensalmente",
    "Melhorias de performance contínuas",
    "Atualizações de segurança constantes",
    "Feedback da comunidade implementado",
  ],
  cta: { label: "Acessar Voomp Updates", href: "#updates" },
} as const;

export const cognaGroup = {
  eyebrow: "Grupo Cogna",
  title: ["Faça parte do maior ecossistema", "de educação do mundo!"],
  stats: [
    {
      value: "+70 marcas",
      description: "Faculdades, escolas, sistemas de ensino, editoras e plataformas de tecnologia",
    },
    { value: "+1.3 milhão", description: "de alunos de graduação e pós-graduação" },
    { value: "+26 mil", description: "Colaboradores" },
    {
      value: "+ R$ 100 milhões",
      description: "Investidos em marketing por ano só na marca Anhanguera",
    },
  ],
  cta: { label: "Conheça mais da Cogna Educação", href: "#grupo-cogna" },
} as const;

export const faq = {
  eyebrow: "FAQ",
  title: ["Dúvidas frequentes", "sobre a Voomp"],
  cta: { label: "Crie sua conta de graça", href: "#criar-conta" },
  items: [
    {
      question: "Qual a diferença entre a Voomp e outras plataformas?",
      // Figma reads "instituição de ensinoeconhecida oficialmente" — typo corrected here.
      answer:
        "Somos a única plataforma que oferece parceria com instituição de ensino reconhecida oficialmente, além da tecnologia robusta e suporte completo do Grupo Cogna.",
    },
    {
      question: "Como funciona a migração para a Voomp?",
      answer:
        "Nossa equipe técnica te ajuda com toda a transferência dos seus conteúdos e configurações, deixando o processo sem burocracias para você.",
    },
    {
      question: "Preciso ter graduação para criar uma extensão ou pós?",
      answer: "Sim, é requisito MEC.",
    },
    {
      question: "Quanto tempo o MEC leva para aprovar meu curso?",
      answer:
        "No caso de cursos de extensão, até 10 dias úteis.\nCom a pós-graduação, de 3 a 5 meses.",
    },
    {
      question: "A Voomp cobra por aluno ativo?",
      answer:
        "Não! Não cobramos por ativação de aluno, por emissão de certificados e nem por banda consumida.",
    },
    {
      question: "Qual tipo de suporte vocês oferecem?",
      answer:
        "Suporte completo: técnico, comercial e acadêmico. No caso da pós-graduação, incluímos o serviço de secretaria especializada.",
    },
    {
      question: "Preciso ter meu curso pronto para poder conseguir meu reconhecimento oficial?",
      answer:
        "Não! Você precisa apenas do seu Projeto Pedagógico de Curso (PPC) preenchido e completo para validação do MEC.",
    },
  ],
} as const;

export const social = {
  title: [
    "Siga nossas redes e receba estratégias diárias",
    "para transformar conhecimento em renda",
  ],
  cta: { label: "Acompanhar no instagram", href: "https://instagram.com" },
  /** Play counts sit under each reel thumbnail in the design. */
  plays: ["2.999", "2.999", "1.821", "1.478", "700"],
} as const;

export const footer = {
  columns: [
    {
      title: "Acesso Rápido",
      links: [
        { label: "Sobre a Voomp", href: "#a-voomp" },
        { label: "Soluções", href: "#plataforma" },
        { label: "Depoimentos", href: "#cases" },
        { label: "Updates", href: "#updates" },
        { label: "Marketplace", href: "#marketplace" },
      ],
    },
    {
      title: "Transparência",
      links: [
        { label: "Fale conosco", href: "#contato" },
        { label: "Central de Ajuda", href: "#ajuda" },
        { label: "Termos e Documentações", href: "#termos" },
      ],
    },
  ],
  login: { label: "Entrar", href: "#entrar" },
  signup: { label: "Cadastre-se Grátis", href: "#criar-conta" },
  tagline: "Voomp transforma infoprodutores em verdadeiros empresários da educação.",
  socials: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    { label: "Spotify", href: "https://spotify.com", icon: "spotify" },
  ],
  copyright: "© Voomp 2025",
  backToTop: "Voltar ao topo",
  madeWith: { before: "Com", after: "para quem ensina e quer empreender na educação." },
} as const;
