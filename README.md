# Radar de Avaliacoes - Rede Menor Preco

Aplicacao Next.js para demonstracao comercial de um sistema de gestao de reputacao multi-loja.

O principio atual do produto e:

> Comentarios sao fonte primaria e evidencia. A tela principal mostra decisao, prioridade e acao.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma preparado para PostgreSQL
- Vitest
- Zod
- Google Maps Platform/Places API preparada
- Google Business Profile OAuth preparado

## Interface principal

O painel principal esta organizado por abas:

- **Resumo Executivo**: lojas criticas, temas criticos, risco por loja, prioridade da semana e impacto potencial.
- **O Que Fazer Agora**: acao recomendada, prioridade, loja/tema, responsavel, prazo e evidencia.
- **Por Que Fazer**: comentarios que originaram a acao, tema detectado, frequencia, nota media e recorrencia por loja.
- **Como o Cliente Enxerga**: perfil geral da rede, destaques positivos, destaques negativos e consolidado.
- **Relatorio Detalhado**: comentarios acessados, historico/respostas/evolucao bloqueados ate autorizacao ou importacao oficial.

## Rodar localmente

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run dev
```

Acesse:

```text
http://127.0.0.1:3000
```

## Validacao

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Dados da demonstracao

Os dados usados na demo estao em:

```text
src/lib/demo-data.ts
```

Eles incluem:

- lojas;
- ratings e totais publicos informados;
- comentarios acessados/importados para demonstracao;
- planos de acao locais;
- algumas estruturas simuladas antigas mantidas para compatibilidade.

As regras de decisao, temas, score, filtros e percepcao ficam em:

```text
src/lib/dashboard.ts
```

## Banco de dados

O schema Prisma esta em:

```text
prisma/schema.prisma
```

O banco alvo e PostgreSQL, configurado por:

```env
DATABASE_URL="postgresql://..."
```

No estado atual, a interface ainda le seeds locais de `src/lib/demo-data.ts`. O schema ja esta preparado para persistencia real, mas ainda nao ha migrations neste workspace.

Entidades modeladas:

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

## Fontes e data_source

O sistema separa dados por:

- `GOOGLE_PLACES_PUBLIC`
- `DEMO_SIMULATED`
- `GOOGLE_BUSINESS_PROFILE_AUTHORIZED`

Sem Google Business Profile autorizado ou importacao oficial:

- nao afirmar todos os comentarios;
- nao afirmar comentarios da ultima semana;
- nao afirmar nota semanal real;
- nao afirmar historico completo;
- nao afirmar respostas ou pendencias reais.

## Filtro de periodo

O filtro "Ultima semana" nao recalcula indicadores reais quando os comentarios acessados nao possuem datas oficiais completas.

Quando selecionado sem datas confiaveis, o sistema mostra aviso e nao aplica o periodo aos indicadores.

Periodo real exige:

- OAuth Google Business Profile; ou
- importacao oficial com data, nota, texto, loja e status de resposta.

## Integracao Google

### Places API

Preparada para modo publico:

- Text Search
- Place Details

Variavel:

```env
GOOGLE_MAPS_API_KEY=""
```

### Google Business Profile

Preparado para OAuth 2.0 com escopo:

```text
https://www.googleapis.com/auth/business.manage
```

Fluxo futuro:

1. Cliente clica em conectar.
2. Cliente autoriza no ambiente seguro do Google.
3. Sistema troca `code` por tokens no servidor.
4. Tokens sao criptografados.
5. Sistema lista contas e localizacoes.
6. Usuario vincula localizacoes a lojas internas.
7. Jobs sincronizam reviews paginados.
8. Relatorios semanais reais sao gerados.

## Seguranca

- Nao solicitar senha Google.
- Nao expor tokens no navegador.
- Nao registrar tokens em logs.
- Nao usar scraping, Puppeteer, Selenium, Playwright ou captura de HTML para extrair dados do Google.
- Usar OAuth 2.0 e criptografia de tokens.

## Documentacao para revisao externa

O guia mais direto para Claude Code esta em:

```text
CLAUDE.md
```

O contexto historico mais longo esta em:

```text
CONTEXT.md
```

