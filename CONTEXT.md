# Contexto detalhado - Radar de Avaliacoes Rede Menor Preco

## Objetivo

Aplicacao web de demonstracao comercial para centralizar acompanhamento de avaliacoes da Rede Menor Preco e preparar uma futura operacao conectada ao Google Business Profile.

O projeto foi criado para demonstrar valor comercial sem depender inicialmente da conta Google do cliente, mas deixando claro que indicadores completos e historicos reais so podem ser obtidos por fonte autorizada ou importacao oficial.

## Estado atual

- Framework: Next.js App Router, React, TypeScript e Tailwind CSS.
- Banco/ORM: Prisma com schema preparado para PostgreSQL.
- Testes: Vitest.
- UI: componentes React locais no estilo shadcn/ui, com badges de origem de dado.
- Rotas principais:
  - `/`: painel geral.
  - `/lojas/[slug]`: pagina individual da loja.
  - `/integracoes`: tela de integracoes e chamada OAuth preparada.
  - `/apresentacao-comercial`: narrativa comercial para demonstracao.
  - `/api/places/public-sync`: endpoint preparado para consulta publica via Places API.
  - `/api/auth/google-business-profile/start`: inicio OAuth.
  - `/api/auth/google-business-profile/callback`: callback OAuth.

## Unidades cadastradas na demo

- Supermercado Menor Preco - Bairro dos Estados
- Supermercado Menor Preco - Manaira
- Supermercado Menor Preco - Intermares
- Supermercado Menor Preco - Cristo
- Supermercado Menor Preco - Torre
- Supermercado Menor Preco - Altiplano
- Mega Atacarejo - Joao Pessoa

## Fontes de dados

O sistema separa rigorosamente os dados por `data_source`:

- `GOOGLE_PLACES_PUBLIC`: dados publicos que podem vir da Google Places API.
- `DEMO_SIMULATED`: dados simulados para demonstracao comercial.
- `GOOGLE_BUSINESS_PROFILE_AUTHORIZED`: dados reais apos autorizacao OAuth do cliente.

Na demo atual, reviews, series historicas, feedbacks semanais e planos de acao sao sementes locais para apresentacao. Eles nao devem ser tratados como historico real completo.

## Limites importantes

Sem Google Business Profile autorizado ou importacao oficial:

- Nao ha garantia de todos os comentarios.
- Nao ha nota semanal real.
- Nao ha quantidade real de avaliacoes por periodo.
- Nao ha verificacao real de respondidas/nao respondidas.
- Nao ha historico integral confiavel.

A aplicacao evita scraping, Playwright, Puppeteer, Selenium ou captura de HTML para contornar limitacoes do Google.

## Funcionalidades implementadas

- Painel com unidades encontradas, media ponderada, total publico e destaques.
- Tabela comparativa das lojas.
- Mapa visual das unidades.
- Filtros por unidade, nota minima, bairro, status, periodo, periodo do grafico e tema.
- Cards de temas clicaveis que filtram comentarios, feedbacks e plano de acao.
- Grafico de nota por periodo:
  - semanal: `6 sem atras` ate `Semana atual`;
  - mensal: `6 meses atras` ate `Mes atual`;
  - anual: 2021 ate 2026.
- Comentarios disponiveis agora por loja e tema.
- Bloco "Todos os comentarios" como recurso disponivel apos autorizacao/importacao oficial.
- Feedbacks da ultima semana simulados.
- Plano de acao por tema, prioridade, responsavel, prazo e evidencia.
- Tela comercial antes/depois da autorizacao.
- Estrutura OAuth Google Business Profile.
- Criptografia AES-256-GCM para tokens.
- Schema Prisma com entidades solicitadas.

## Entidades Prisma

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

## Integracao Google preparada

### Places API

Usada no modo publico para localizar lugares e obter dados publicos quando uma chave `GOOGLE_MAPS_API_KEY` estiver configurada.

APIs previstas:

- Places API Text Search
- Place Details

### Google Business Profile

Preparado para OAuth 2.0 com escopo `https://www.googleapis.com/auth/business.manage`.

Fluxo previsto:

1. Cliente clica em "Conectar Google Business Profile".
2. Cliente autoriza no ambiente seguro do Google.
3. Sistema troca `code` por tokens no servidor.
4. Tokens sao criptografados e persistidos.
5. Sistema lista contas empresariais.
6. Sistema lista localizacoes.
7. Usuario vincula localizacoes a lojas internas.
8. Jobs sincronizam reviews paginados.
9. Relatorios semanais reais passam a ser gerados.

## Alternativas seguras sem chave Places

- Importar CSV/XLSX oficial fornecido pelo cliente.
- Cadastro manual assistido de comentarios para demonstracao.
- Base propria via QR Code/NPS por loja.
- Relatorios oficiais exportados pelo cliente.

Nao usar scraping ou automacao de navegador.

## Como rodar

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

URL local padrao:

```text
http://localhost:3000
```

## Validacao

Comandos usados ao longo do desenvolvimento:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Estado da ultima validacao antes deste contexto:

- lint passando
- typecheck passando
- testes passando
- build passando

## Proximos passos recomendados

1. Implementar autentificacao real de usuarios.
2. Persistir dados no PostgreSQL via Prisma.
3. Criar tela de importacao CSV/XLSX.
4. Persistir conexoes Google criptografadas.
5. Implementar listagem real de contas/localizacoes GBP.
6. Implementar job paginado de reviews autorizadas.
7. Criar relatorio semanal exportavel em PDF.
8. Criar alertas por tema, nota baixa e falta de resposta.
9. Substituir seeds locais por dados reais importados/autorizados.

## Observacao comercial

A demo foi desenhada para mostrar o valor do produto antes da autorizacao do cliente, mas o discurso deve reforcar:

"O cliente nao fornece senha. A autorizacao acontece diretamente no ambiente seguro do Google."
