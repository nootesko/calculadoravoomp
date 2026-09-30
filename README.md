# Voomp — Site

Duas entregas sobre o mesmo design system:

- **`/`** — landing implementada a partir do Figma
  ([arquivo](https://www.figma.com/design/cmXSGMIe4ZQw0i0W7bQ7Xd/Voomp---Website--Copy-)),
  frame `Home Desktop` (`1:2755`).
- **`/ferramentas`** — *Marketing de Funil (Calculadoras VOOMP)*: hub de cinco
  calculadoras/diagnósticos com captura e qualificação de leads. Ver
  [`docs/ferramentas.md`](docs/ferramentas.md).

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** com os tokens do Figma em `src/app/globals.css`
- **shadcn/ui** (Button, Accordion) — o design foi construído sobre os "Pro Blocks" do shadcn
- **Inter** via `next/font` (fonte definida no design system do arquivo)

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Organização

```
src/
  app/
    globals.css          tokens de marca + utilitários (.container-voomp, .eyebrow, bg-navy-radial)
    layout.tsx           fonte Inter, metadata/SEO
    page.tsx             ordem das seções, igual ao frame do Figma
  components/
    site/                uma seção por arquivo
    ui/                  primitivos shadcn
  lib/
    content.ts           TODO o texto da página, transcrito do Figma
public/
  images/                mockups e fotos exportados do Figma em 2x
  icons/  logos/         SVGs exportados do Figma
```

Todo o texto vive em `src/lib/content.ts` — trocar copy ou plugar um CMS não
exige mexer no layout.

## Design system

Camada única de tokens em `src/app/globals.css`. Nenhum valor visual deve ser
escrito solto nos componentes — se faltar um token, o certo é adicioná-lo aqui.

### Tipografia

Escala semântica e fluida, derivada dos estilos de texto do Figma. Um único
utilitário cobre toda a faixa responsiva:

| Classe | Tamanho | Origem no Figma |
| --- | --- | --- |
| `text-display` | 32 → 48px | `text 5x large` 48/48 bold |
| `text-h1` | 26 → 36px | `text 4x large` 36/40 bold |
| `text-h2` | 24 → 32px | `h1` 32 bold |
| `text-h3` | 20px | — |
| `text-h4` | 18px | `h3` 18 bold |
| `text-h5` | 16px | `h4` 16 |
| `text-body-lg` / `text-body` / `text-body-sm` | 18 / 16 / 14px | `text base` 16/24, `text small` 14/20 |
| `text-caption` | 12px | `Subtitle` 12 |
| `text-metric` | 28 → 36px | números grandes das telas de resultado |

> **Atenção ao usar `cn()`**: `tailwind-merge` não conhece esses nomes por
> padrão e classificaria `text-display` e `text-ink` no mesmo grupo, descartando
> o tamanho. Por isso `src/lib/utils.ts` estende o merge com essa lista — ao
> adicionar um tamanho novo, registre-o lá também.

### Movimento

`--ease-out-brand` para entradas e `--ease-spring` para confirmações pequenas.
Utilitários: `animate-step-in` / `animate-step-in-back` (troca de tela com
direção), `animate-rise` (entrada escalonada), `animate-pop` e `animate-check`.
Tudo é anulado sob `prefers-reduced-motion: reduce`.

### Raio, sombra e layout

`rounded-brand-sm|md|lg|xl|2xl|3xl` (4/6/8/12/20/24px, do Figma `border radius`),
`shadow-card` / `shadow-float` (Figma `shadow/sm` e `shadow/lg`) e `shadow-pop`.
`.container-voomp` reproduz o grid de 1440px com gutter de 80px;
`.container-tool` é a coluna de leitura de 860px usada nos diagnósticos.

### Cores de marca

Extraídas das variáveis do Figma (`get_variable_defs`):

| Token | Valor | Origem no Figma |
| --- | --- | --- |
| `--brand-orange` | `#f97316` | `accent-orange` / `Button/Defaut` |
| `--brand-orange-hover` | `#ff822c` | `Button/Hover` |
| `--brand-orange-600` | `#ea580c` | `V-Orange/600` |
| `--brand-navy` | `#02021d` | fundo das seções escuras |
| `--brand-ink` | `#111827` | `text-primary` |
| `--brand-ink-muted` | `#6b7280` | `text-secondary` |
| `--brand-surface-muted` | `#f9fafb` | `Default/gray/50` |

Estados de diagnóstico (`text-positive`, `bg-attention-soft`, …) existem para as
telas de resultado e **nunca** são o único sinal: sempre acompanham ícone e
rótulo em texto.

## Decisões e desvios do Figma

- **Cards de empresários** — nome e @ estão embutidos na arte dos cards no
  Figma (fazem parte do tratamento da foto), então os cards são exportados
  inteiros. O nome é repetido em `alt` e num `<figcaption>` para leitores de
  tela e SEO. O Figma tem 11 pessoas cadastradas, mas só 4 cards estão
  visíveis no arquivo — os outros 7 estão ocultos e não renderizam.
- **Ícones de preço** — o primeiro é o SVG exportado do Figma; os outros dois
  são glifos do Font Awesome no design, substituídos pelos equivalentes do
  Lucide (`Ticket`, `GraduationCap`).
- **Ícones sociais do rodapé** — extraídos do Figma e inlinados em
  `social-icons.tsx`, porque o `lucide-react` v1 não traz mais marcas.
- **Typo no FAQ** — o Figma escreve *"instituição de ensinoeconhecida
  oficialmente"*; aqui está como *"instituição de ensino reconhecida
  oficialmente"*.
- **Fundos exportados** — o Figma embute a cor do canvas em exports de grupos
  de topo. Nos mockups do hero e da plataforma esse fundo foi removido e a
  borda repintada com o navy da seção.
- **Carrosséis** — empresários, gamificação e reels são raias com scroll
  horizontal, para manter tudo acessível em telas menores.

## Fidelidade

Altura renderizada a 1440px: **13.913px** contra **13.949px** do Figma (0,3%).
