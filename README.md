# Radar de Avaliacoes — Rede Menor Preco

Aplicacao Next.js para demonstracao comercial de monitoramento de avaliacoes de lojas da Rede Menor Preco, com dois modos:

- Modo demonstracao publica: usa dados publicos obtidos via Google Maps Platform Places API, Text Search e Place Details. Sem scraping, automacao de navegador ou captura de HTML.
- Modo cliente conectado: arquitetura preparada para Google Business Profile API via OAuth 2.0, importacao completa das avaliacoes autorizadas e relatorios semanais reais.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Acesse `http://localhost:3000`.

Sem `GOOGLE_MAPS_API_KEY`, a aplicacao usa seed local para permitir a demonstracao visual sem chamar APIs pagas. Indicadores de periodo, grafico semanal/mensal/anual, feedbacks da ultima semana, temas semanais e plano de acao ficam marcados como `DEMO_SIMULATED`.

## APIs utilizadas

- Google Maps Platform Places API: Place Details.
- Google Maps Platform Places API: Text Search.
- Google Maps Platform: links oficiais para Google Maps.
- Futuro: Google Business Profile API, Account Management API, Business Information API e OAuth 2.0.

## Obter chave da Places API

1. Criar ou selecionar um projeto no Google Cloud Console.
2. Ativar billing no projeto.
3. Ativar Places API no Google Maps Platform.
4. Criar uma API key em APIs & Services > Credentials.
5. Restringir a chave por API e por origem/servidor conforme o ambiente.
6. Preencher `GOOGLE_MAPS_API_KEY` no `.env`.

## Alternativas seguras sem chave Places

Sem chave Places e sem autorizacao do cliente, a aplicacao nao deve tentar extrair avaliacoes do Google por scraping, automacao de navegador, captura de HTML ou contornos. As formas seguras e confiaveis sao:

- Conectar a conta Google Business Profile por OAuth 2.0. E o caminho mais completo para todos os comentarios acessiveis, avaliacoes por periodo, respostas, pendencias e historico.
- Importacao manual assistida por arquivo CSV/XLSX fornecido pelo cliente. O arquivo pode ser carregado no banco como `GOOGLE_BUSINESS_PROFILE_AUTHORIZED` ou como fonte interna validada, mantendo trilha em `audit_logs`.
- Cadastro manual de feedbacks coletados pela equipe comercial ou operacional, sempre marcado como `DEMO_SIMULATED` quando for demonstracao ou como fonte interna separada quando houver evidencia do cliente.
- Uso de exports oficiais ou relatorios enviados pelo proprio cliente, sem solicitar senha e sem acessar interfaces privadas.

Filtros como "ultima semana", grafico por periodo, temas, feedbacks recentes e plano de acao so devem ser reais quando a fonte tiver data confiavel: Google Business Profile autorizado ou arquivo/export oficial do cliente.

## Custos potenciais

As chamadas de Text Search, Place Details e carregamento de mapas podem gerar custos conforme SKUs da Google Maps Platform. Em producao, use cache em banco, sincronizacao controlada e quotas para evitar chamadas repetidas.

## Limitacoes dos dados publicos

A Places API pode retornar somente uma selecao limitada de avaliacoes definida pelo Google. O modo demonstracao nao afirma possuir todos os comentarios, comentarios da semana, nota semanal real, evolucao semanal precisa, respostas ou historico integral.

Sem Places API, nem mesmo essa selecao publica deve ser buscada automaticamente no Google. A demonstracao passa a operar com dados simulados e/ou importacoes fornecidas pelo cliente.

## Conexao futura do cliente

O cliente devera autorizar a aplicacao no ambiente seguro do Google. Ele nao fornece senha. Depois da autorizacao, o sistema devera persistir tokens criptografados, listar contas, listar localizacoes, vincular lojas internas e sincronizar avaliacoes paginadas com logs por loja.

## Entidades de dados

O schema Prisma inclui `stores`, `public_place_data`, `public_review_samples`, `google_connections`, `google_accounts`, `google_locations`, `store_location_links`, `reviews`, `synchronization_jobs`, `weekly_reports`, `users`, `roles` e `audit_logs`.

Todos os dados possuem separacao por `data_source`:

- `GOOGLE_PLACES_PUBLIC`
- `DEMO_SIMULATED`
- `GOOGLE_BUSINESS_PROFILE_AUTHORIZED`

## Roteiro de demonstracao comercial

1. Abrir a visao geral e mostrar unidades encontradas, media ponderada, total publico e comparativo.
2. Aplicar filtros por unidade, bairro, nota e status.
3. Aplicar filtro de periodo "Ultima semana" e tema para mostrar feedbacks simulados.
4. Alterar o grafico de nota por periodo entre semanal, mensal e anual.
5. Apresentar o plano de acao gerado a partir dos temas da semana.
6. Abrir uma loja e mostrar comentarios disponiveis agora, alem do bloco "Todos os comentarios" como recurso apos autorizacao/importacao oficial.
7. Mostrar a secao "Como ficara apos a conexao" com badges de simulacao.
8. Abrir "Apresentacao Comercial" para explicar antes/depois da autorizacao.
9. Abrir "Integracoes" e reforcar o fluxo OAuth sem senha do cliente.

## Validacao

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
