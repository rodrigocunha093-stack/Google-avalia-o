# Guia para revisao no Claude Code

Este arquivo e o ponto de partida para revisar o projeto **Radar de Avaliacoes - Rede Menor Preco**.

## Resumo do produto

Aplicacao Next.js/TypeScript para demonstracao comercial de um sistema de gestao de reputacao multi-loja.

O conceito principal atual e:

> Comentarios sao fonte primaria e evidencia. A interface principal deve mostrar decisao, prioridade e acao.

O painel foi reorganizado por abas:

- `Resumo Executivo`: lojas criticas, temas criticos, risco por loja, prioridade e impacto.
- `O Que Fazer Agora`: acoes recomendadas, prioridade, responsavel, prazo e evidencias.
- `Por Que Fazer`: comentarios que originaram a decisao, frequencia, nota media e recorrencia por loja.
- `Como o Cliente Enxerga`: perfil geral, onde a rede acerta, onde erra e consolidado da rede.
- `Relatorio Detalhado`: comentarios acessados e blocos bloqueados para historico/respostas/evolucao apos autorizacao.

## Caminhos principais

- App principal: `src/app/page.tsx`
- Pagina de loja: `src/app/lojas/[slug]/page.tsx`
- Apresentacao comercial: `src/app/apresentacao-comercial/page.tsx`
- Integracoes/OAuth: `src/app/integracoes/page.tsx`
- Rotas OAuth:
  - `src/app/api/auth/google-business-profile/start/route.ts`
  - `src/app/api/auth/google-business-profile/callback/route.ts`
- Sync publico Places preparado: `src/app/api/places/public-sync/route.ts`
- Componentes:
  - `src/components/store-filters.tsx`
  - `src/components/badge.tsx`
  - `src/components/notice.tsx`
- Dados e regras:
  - `src/lib/demo-data.ts`
  - `src/lib/dashboard.ts`
  - `src/lib/types.ts`
  - `src/lib/google-places.ts`
  - `src/lib/google-business-profile.ts`
  - `src/lib/crypto.ts`
- Testes:
  - `src/lib/dashboard.test.ts`
  - `src/lib/crypto.test.ts`
- Banco/ORM:
  - `prisma/schema.prisma`
  - `prisma.config.ts`

## Onde estao as informacoes

### Dados de lojas e comentarios usados na demonstracao

Arquivo: `src/lib/demo-data.ts`

Contem:

- lojas da Rede Menor Preco e Mega Atacarejo;
- ratings e totais publicos informados;
- comentarios acessados/importados para demonstracao;
- planos de acao locais;
- metricas/series simuladas antigas mantidas para compatibilidade de testes/componentes.

Importante: estes dados nao representam historico integral do Google. Sao dados acessados/importados/seeds locais para demonstracao.

### Regras de decisao, temas e score

Arquivo: `src/lib/dashboard.ts`

Responsavel por:

- filtros por loja, bairro, status, nota, tema;
- filtro `reviewTone=negativas`;
- status do filtro de periodo;
- media ponderada;
- temas identificados;
- central de acao gerencial;
- relatorio por tema;
- matriz territorial por loja;
- perfil de percepcao do cliente;
- decisao executiva.

Pontos importantes:

- `period=ultima-semana` **nao recalcula indicadores reais** sem datas oficiais.
- `periodStatus` explica quando o periodo foi selecionado, mas nao aplicado.
- `themeDecisionReport` inclui `evidenceReviews`, usados nas expansoes dos temas.
- `customerPerception` alimenta a aba "Como o Cliente Enxerga".

### Interface principal

Arquivo: `src/app/page.tsx`

Contem:

- barra horizontal de filtros;
- navegacao por abas;
- painel executivo;
- tabelas de temas com expansao;
- evidencias por comentario;
- percepcao positiva/negativa/consolidada;
- relatorio detalhado.

### Banco de dados

Schema: `prisma/schema.prisma`

O banco alvo e PostgreSQL via Prisma. As entidades ja estao modeladas, mas a demo atual ainda usa seeds locais em `src/lib/demo-data.ts` para renderizar a interface.

Entidades principais:

- `stores`
- `public_place_data`
- `public_review_samples`
- `google_connections`
- `google_accounts`
- `google_locations`
- `store_location_links`
- `reviews`
- `synchronization_jobs`
- `weekly_reports`
- `users`
- `roles`
- `audit_logs`

Variavel de banco esperada:

```env
DATABASE_URL="postgresql://..."
```

Arquivo de exemplo: `.env.example`

Nao ha migrations criadas ainda neste workspace. O proximo passo de banco seria criar migrations e trocar a leitura de `demo-data.ts` por queries Prisma.

## Fontes de dados e seguranca

Valores de `data_source`:

- `GOOGLE_PLACES_PUBLIC`
- `DEMO_SIMULATED`
- `GOOGLE_BUSINESS_PROFILE_AUTHORIZED`

Regras:

- Nao usar scraping.
- Nao usar Playwright/Puppeteer/Selenium para extrair dados do Google.
- Nao solicitar senha Google do cliente.
- Integracao completa deve ser por OAuth 2.0 ou importacao oficial.
- Tokens devem ficar criptografados no servidor usando `src/lib/crypto.ts`.

## Filtro de periodo

O filtro "Ultima semana" existe apenas para demonstrar a necessidade de fonte com data real.

Estado atual:

- se `period=ultima-semana` for selecionado;
- e os comentarios acessados nao tiverem `publishTime` completo;
- entao o sistema mostra aviso e **nao aplica** o periodo aos indicadores.

Isso esta coberto por teste em `src/lib/dashboard.test.ts`.

## Comandos de validacao

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Todos passaram na ultima validacao local antes deste guia.

## Como rodar

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run dev
```

URL:

```text
http://127.0.0.1:3000
```

## GitHub

Repositorio remoto:

```text
https://github.com/rodrigocunha093-stack/Google-avalia-o
```

Branch principal:

```text
main
```

## Pontos para revisao do Claude Code

1. Avaliar se `src/app/page.tsx` deve ser quebrado em componentes menores.
2. Revisar a formula de score em `src/lib/dashboard.ts`.
3. Verificar se os nomes dos temas e pesos de risco estao coerentes para varejo alimentar.
4. Planejar persistencia real via Prisma/PostgreSQL.
5. Planejar importacao CSV/XLSX oficial para substituir seeds locais.
6. Revisar OAuth Google Business Profile e armazenamento criptografado.
7. Criar migrations Prisma.
8. Criar testes de interface ou e2e para as abas e expansoes.

