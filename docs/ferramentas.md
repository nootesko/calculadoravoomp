# Marketing de Funil (Calculadoras VOOMP)

Hub de ferramentas gratuitas em `/ferramentas`. Protótipo **front-end apenas**:
sem backend, sem autenticação, sem banco. Toda regra de negócio que dependeria de
dados reais está em mocks isolados, prontos para virar chamada de API.

## Rotas

| Rota | Ferramenta |
| --- | --- |
| `/ferramentas` | Home do hub |
| `/ferramentas/precificacao` | Calculadora de precificação de produto |
| `/ferramentas/modelo-lancamento` | Qual o melhor modelo de lançamento |
| `/ferramentas/pos-graduacao` | Seu curso pode se tornar uma pós-graduação? |
| `/ferramentas/conversao` | Sua taxa de conversão está dentro do esperado? |
| `/ferramentas/plataforma` | Você está pagando demais para sua plataforma? |

## Arquitetura

Não são cinco aplicações. É **um motor** que renderiza qualquer calculadora a
partir de uma definição declarativa:

```
src/lib/tools/
  types.ts                 ProducerProfile, Question, Calculator, CalculatorResult
  registry.ts              lista das calculadoras + regras de perfil progressivo
  store.tsx                estado global (useSyncExternalStore + localStorage)
  options.ts               vocabulários de resposta compartilhados
  format.ts                money / percent / ratio em pt-BR
  lead-intelligence.ts     visão comercial derivada (não exibida ao usuário)
  calculators/*.ts         5 definições: steps, perguntas e motor de resultado
  services/analysis.ts     interpretação em texto (mock, trocável por IA)

src/data/
  ranges.ts                faixas de faturamento, TPV, mídia, audiência…
  benchmarks/*.ts          pricingRules, launchRules, academicRules,
                           conversionBenchmarks, platformBenchmarks
```

Adicionar uma sexta calculadora = criar um arquivo em `calculators/` e
registrá-lo em `registry.ts`. A home, o runner, a barra de progresso e o
cross-sell passam a funcionar sem código novo.

### Experiência: tela cheia, uma pergunta por vez

Cada calculadora roda dentro de `ToolShell` — um container `fixed inset-0` que
ocupa a tela inteira. **Não há header, navegação nem rodapé do site**: só
logotipo, a pergunta, `Voltar` e `Prosseguir`. O único caminho de saída é o link
discreto "Sair" no canto superior.

O runner achata os steps numa lista única e mostra **uma pergunta por tela**. O
agrupamento do step vira o eyebrow acima da pergunta ("SEU PRODUTO"), dando
contexto sem poluir.

**Microinterações e animações** (todas anuladas sob `prefers-reduced-motion`):

| Onde | Comportamento |
| --- | --- |
| Troca de pergunta | Slide + fade com direção — entra pela direita ao avançar, pela esquerda ao voltar |
| Opções | Entrada escalonada de 45ms, limitada a 8 itens para listas longas não arrastarem |
| Seleção | Check com escala elástica; card muda borda, fundo e sombra |
| Barra de progresso | Avança já na resposta, antes da tela trocar |
| Botão Prosseguir | `animate-pop` no instante em que fica habilitado |
| Cards | `active:scale-[0.99]` no toque |

**Auto-avanço**: perguntas de escolha única avançam sozinhas 420ms após a
seleção — tempo suficiente para o check registrar visualmente. Múltipla escolha,
texto e números exigem `Prosseguir`. O botão continua sempre disponível.

**Teclado**: `1`–`9` seleciona a opção correspondente (o número aparece no card),
`Enter` avança. Em campos de texto os dígitos são ignorados.

**Semântica**: a pergunta é o `<h1>` da tela, dentro de um `role="group"` com
`aria-labelledby` — assim existe estrutura de heading real e os controles ainda
são anunciados sob o rótulo do grupo. O contador tem `aria-live="polite"`.

**Rolagem**: o conteúdo usa `my-auto` em vez de `items-center`. Centraliza quando
cabe e encosta no topo quando a lista é maior que a viewport — sem isso a
pergunta some acima da área rolável em telas baixas.

### Perfil progressivo

Toda pergunta escreve num campo de `ProducerProfile`. O que já foi respondido em
outro diagnóstico vem preenchido.

**O fluxo contém sempre todas as perguntas da ferramenta.** O perfil progressivo
aparece em *onde a sessão começa*, não em telas que somem: o runner calcula o
`resumeIndex` — a primeira pergunta que ainda precisa de resposta — e entra ali.
Como nada é removido da lista, `Voltar` alcança qualquer pergunta anterior, com
o valor preservado e pronto para ser alterado.

Por isso existe um único botão na tela inicial: **Continuar** (ou **Começar**,
quando não sabemos nada ainda). Não há "Editar respostas" — editar é voltar.

Campos marcados com `alwaysAsk` (preço atual, taxa da plataforma, vendas do mês)
contam como "precisa de resposta" mesmo já tendo valor, porque mudam com
frequência — é por isso que a retomada pode cair numa pergunta anterior à última
respondida.

Quando *nenhuma* pergunta precisa de resposta, a tela inicial oferece **Ver
diagnóstico** e **Revisar respostas** (que entra na pergunta 1).

### Captura de contato

Nome, e-mail e WhatsApp são pedidos **uma única vez**, imediatamente antes do
primeiro resultado — nunca na entrada da ferramenta. O botão fica desabilitado
até os três campos estarem válidos.

### `LeadIntelligence`

`buildLeadIntelligence(profile)` deriva a visão comercial — `estimated_tpv`,
`migration_potential`, `academic_product_potential`, `commercial_maturity`,
`media_maturity`, `lead_score`, `calculators_completed`. Não aparece na
interface; é o formato que um CRM receberia.

## Mocks e honestidade dos dados

Os benchmarks são **simulados para demonstração** e assim são apresentados na
interface. Em especial:

- As faixas de taxa em `platform-benchmarks.ts` são intervalos ilustrativos de
  negociação por porte de operação — **não** são tabelas publicadas de nenhuma
  plataforma nomeada, e a interface não afirma que sejam.
- A triagem acadêmica nunca diz que um curso "foi aprovado". Ela devolve
  potencial **ALTO / MÉDIO / BAIXO** e sempre exibe o disclaimer de que é
  análise preliminar, sujeita à avaliação da instituição parceira e ao MEC.
- A precificação usa "faixa estimada" e "referência", nunca um valor definitivo.

## Decisões de lógica que valem registro

- **Plataforma**: a taxa efetiva é comparada direto contra a faixa do TPV. O mix
  de pagamento e a ausência de negociação personalizada entram como *sinais no
  texto*, nunca alargando o teto da faixa — caso contrário uma negociação ruim
  se justificaria sozinha.
- **Conversão**: CPL acima da referência **não** basta para chamar a captação de
  gargalo. Se CAC e ROAS estão saudáveis, o tráfego se paga, e o resultado usa um
  estado próprio ("o funil se sustenta, mas o lead está caro").
- **Modelo de lançamento**: a compatibilidade é limitada a 95%. São regras
  mockadas e direcionais; 100% afirmaria mais do que o motor consegue sustentar.

## Aviso de uso comercial

A frase *"Essas informações podem ser usadas para prospecção comercial."* com o
link de Política de Privacidade aparece nos **pontos de entrada**, não em todas
as telas:

- na home do hub (`CalculatorFooter`);
- na tela inicial de cada calculadora — antes de qualquer resposta ser dada
  (`<ToolShell disclosure>`).

Cada calculadora tem URL própria e pode ser acessada direto, sem passar pelo
hub; por isso o aviso existe nos dois lugares. Repetido em cada pergunta virava
ruído, e a seção 14 do blueprint foi ajustada nesse ponto a pedido do cliente.

> Vale reavaliar antes de ir a produção: a tela de captura de contato é onde o
> dado pessoal é de fato enviado, e hoje ela não exibe o aviso.

## Demonstração

Não há atalho de preenchimento na interface — a apresentação é feita respondendo
as perguntas normalmente.

Para testes automatizados, o cenário é injetado direto no `localStorage`
(`voomp.producerProfile`): um produtor de R$ 100 mil/mês, plataforma concorrente
a 6,5%, curso de 40h com certificado próprio. Esse perfil exercita as cinco
ferramentas e representa o ICP forte descrito no blueprint.

```js
localStorage.setItem("voomp.producerProfile", JSON.stringify({
  segment: "marketing", productType: "curso-online", price: 997,
  monthlyRevenue: "100-300k", platform: "hotmart", platformRate: 6.5,
  /* … */
}));
```

## O que falta para virar produto

- Persistir o perfil num backend em vez de `localStorage`.
- Substituir `src/data/benchmarks/*` por API com dados reais da Voomp.
- Ligar `services/analysis.ts` a um modelo para gerar a interpretação.
- Enviar `LeadIntelligence` ao CRM.
- Consentimento explícito (LGPD) antes de gravar os dados de contato, e avaliar
  repetir o aviso de uso comercial na tela de captura.
- Uma forma de o produtor limpar as próprias respostas — o botão "Limpar minhas
  respostas" foi removido a pedido, então hoje só dá para zerar apagando o
  `localStorage` do navegador.
- Link de entrada para `/ferramentas` na navegação principal — hoje a landing
  segue fiel ao Figma, que não prevê esse item de menu.
