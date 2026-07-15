import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  Filter,
  Flame,
  ListChecks,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/badge";
import { Notice } from "@/components/notice";
import { StoreFilters } from "@/components/store-filters";
import { getDemoDashboard } from "@/lib/dashboard";
import { formatNumber, formatRating } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type TabKey = "resumo" | "fazer" | "porque" | "percepcao" | "detalhado";

const tabs: { key: TabKey; label: string; description: string }[] = [
  { key: "resumo", label: "Resumo Executivo", description: "lojas criticas, temas criticos, risco e impacto" },
  { key: "fazer", label: "O Que Fazer Agora", description: "acao, prioridade, responsavel, prazo e evidencia" },
  { key: "porque", label: "Por Que Fazer", description: "comentarios de origem, frequencia e recorrencia" },
  { key: "percepcao", label: "Como o Cliente Enxerga", description: "percepcao por tema, pontos fortes e criticos" },
  { key: "detalhado", label: "Relatorio Detalhado", description: "comentarios, historico, respostas e evolucao" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeTab = parseTab(asString(params.tab));
  const dashboard = getDemoDashboard({
    store: asString(params.store),
    bairro: asString(params.bairro),
    status: asString(params.status),
    rating: asString(params.rating),
    period: asString(params.period),
    ratingPeriod: asString(params.ratingPeriod),
    reviewTone: asString(params.reviewTone),
    theme: asString(params.theme),
  });
  const selectedTheme = asString(params.theme);
  const reviewTone = asString(params.reviewTone);

  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Radar de Avaliacoes
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Rede Menor Preco
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-secondary" href="/apresentacao-comercial">
                Apresentacao Comercial
                <ArrowUpRight size={16} />
              </Link>
              <Link className="btn-primary" href="/integracoes">
                <ShieldCheck size={16} />
                Integracoes
              </Link>
            </div>
          </nav>
          <Notice />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:px-8">
        <MetricCard icon={<Building2 size={20} />} label="Unidades encontradas" value={dashboard.summary.unitsFound.toString()} badge="Dado real acessado" />
        <MetricCard icon={<Star size={20} />} label="Nota media ponderada" value={formatRating(dashboard.summary.weightedAverageRating)} badge="Dado real acessado" />
        <MetricCard icon={<MessageSquareText size={20} />} label="Total publico de avaliacoes" value={formatNumber(dashboard.summary.totalReviews)} badge="Dado real acessado" />
        <MetricCard icon={<TrendingUp size={20} />} label="Melhor nota" value={dashboard.summary.bestRated?.displayName ?? "-"} badge={formatRating(dashboard.summary.bestRated?.rating)} />
        <MetricCard icon={<MapPinned size={20} />} label="Maior volume" value={dashboard.summary.mostReviewed?.displayName ?? "-"} badge={`${formatNumber(dashboard.summary.mostReviewed?.userRatingCount ?? 0)} avaliacoes`} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="panel">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} />
                <h2 className="text-lg font-semibold">Filtros</h2>
              </div>
              <Badge tone="neutral">Aplicado em todas as abas</Badge>
            </div>
            <StoreFilters
              bairros={dashboard.filters.bairros}
              ratingPeriod={dashboard.ratingPeriod}
              statuses={dashboard.filters.statuses}
              stores={dashboard.filters.stores}
              themes={dashboard.filters.themes}
            />
          </section>

          <TabNavigation activeTab={activeTab} params={params} />

          {activeTab === "resumo" && (
            <div className="space-y-6">
              <ExecutiveDecisionPanel dashboard={dashboard} params={params} />

              <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="panel">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">Lojas criticas e risco por loja</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Ranking territorial por risco calculado com nota, volume publico, comentarios negativos acessados e tema critico.
                      </p>
                    </div>
                    <Badge tone="real">Dados acessados</Badge>
                  </div>
                  <StoreDecisionList stores={dashboard.storeDecisionReport.slice(0, 5)} />
                </div>

                <div className="panel">
                  <h2 className="text-xl font-semibold">Prioridade da semana</h2>
                  <div className="mt-4 space-y-3">
                    <DecisionMiniCard label="Tema critico" value={dashboard.executiveDecision.primaryTheme} />
                    <DecisionMiniCard label="Loja em foco" value={dashboard.executiveDecision.primaryStore} />
                    <DecisionMiniCard label="Impacto potencial" value={dashboard.executiveDecision.whyItMatters} />
                  </div>
                </div>
              </section>

              <ThemeDecisionTable items={dashboard.themeDecisionReport.slice(0, 5)} title="Temas criticos" />
            </div>
          )}

          {activeTab === "fazer" && (
            <div className="space-y-6">
              <section className="panel border-emerald-100 bg-white">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Flame className="text-emerald-800" size={20} />
                      <h2 className="text-xl font-semibold">O Que Fazer Agora</h2>
                    </div>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                      Acoes agrupadas por tema, sem duplicidade visual, com prioridade, responsavel, prazo e evidencia de origem.
                    </p>
                  </div>
                  <Badge tone="real">Analise dos dados acessados</Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <ActionMetric label="Acoes criticas" value={dashboard.actionCommandCenter.criticalActions.toString()} />
                  <ActionMetric label="Prazos da semana" value={dashboard.actionCommandCenter.dueSoonActions.toString()} />
                  <ActionMetric label="Reclamacoes triadas" value={dashboard.actionCommandCenter.negativeFeedbacks.toString()} />
                  <ActionMetric label="Tema de maior risco" value={dashboard.actionCommandCenter.topRiskTheme} />
                </div>

                <ActionQueue items={dashboard.actionCommandCenter.actionQueue} params={params} />
              </section>

              <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <ActionPlanList items={dashboard.actionPlan} />
                <WeeklyRitual steps={dashboard.actionCommandCenter.weeklyRitual} />
              </section>
            </div>
          )}

          {activeTab === "porque" && (
            <div className="space-y-6">
              <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <ReviewEvidencePanel
                  params={params}
                  reviewSamples={dashboard.reviewSamples}
                  reviewTone={reviewTone}
                  selectedTheme={selectedTheme}
                />
                <section className="panel">
                  <h2 className="text-xl font-semibold">Por Que Fazer</h2>
                  <div className="mt-4 space-y-3">
                    <DecisionMiniCard label="Tema detectado" value={dashboard.executiveDecision.primaryTheme} />
                    <DecisionMiniCard label="Frequencia" value={dashboard.executiveDecision.whyItMatters} />
                    <DecisionMiniCard label="Recorrencia por loja" value={`${dashboard.themeDecisionReport[0]?.affectedStores ?? 0} loja(s) afetada(s)`} />
                  </div>
                </section>
              </section>

              <ThemeDecisionTable items={dashboard.themeDecisionReport} title="Frequencia, nota e recorrencia por tema" showAverage />
            </div>
          )}

          {activeTab === "percepcao" && (
            <div className="space-y-6">
              <section className="panel border-emerald-100 bg-white">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Perfil percebido pelo cliente</h2>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                      Esta aba traduz os comentarios acessados em leitura de percepcao: onde a rede e vista positivamente, onde esta frustrando o cliente e qual o consolidado geral.
                    </p>
                  </div>
                  <Badge tone="real">Fundamentado por comentarios</Badge>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <PerceptionCard
                    tone="neutral"
                    title="Perfil geral da rede"
                    text={dashboard.customerPerception.networkProfile}
                  />
                  <PerceptionCard
                    tone="positive"
                    title="Onde estamos acertando"
                    text={dashboard.customerPerception.positiveHighlight}
                  />
                  <PerceptionCard
                    tone="negative"
                    title="Onde estamos errando"
                    text={dashboard.customerPerception.negativeHighlight}
                  />
                </div>

                <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Consolidado para a rede</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{dashboard.customerPerception.networkConsolidated}</p>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <section className="panel">
                  <h2 className="text-xl font-semibold">Comentarios positivos que sustentam o destaque</h2>
                  <ReviewQuoteList reviews={dashboard.customerPerception.positiveReviews} />
                </section>

                <section className="panel">
                  <h2 className="text-xl font-semibold">Comentarios negativos que sustentam o alerta</h2>
                  <ReviewQuoteList reviews={dashboard.customerPerception.negativeReviews} />
                </section>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <section className="panel">
                  <h2 className="text-xl font-semibold">Comparacao entre lojas</h2>
                  <StoreComparisonTable stores={dashboard.stores} />
                </section>
                <section className="panel">
                  <h2 className="text-xl font-semibold">Temas de percepcao</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {dashboard.themes.map((theme) => (
                      <Link className={theme === selectedTheme ? "theme-chip-active" : "theme-chip"} href={hrefWithParam(params, "theme", theme)} key={theme}>
                        {theme}
                      </Link>
                    ))}
                    {selectedTheme && <Link className="theme-chip-clear" href={hrefWithoutParams(params, ["theme", "reviewTone"])}>Todos</Link>}
                  </div>
                  <StoreDecisionList stores={dashboard.storeDecisionReport.slice(0, 4)} />
                </section>
              </section>
            </div>
          )}

          {activeTab === "detalhado" && (
            <div className="space-y-6">
              <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <ReviewEvidencePanel
                  params={params}
                  reviewSamples={dashboard.reviewSamples}
                  reviewTone={reviewTone}
                  selectedTheme={selectedTheme}
                />
                <section className="space-y-6">
                  <section className="panel">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold">Historico e respostas</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Historico completo, respostas ao cliente e status de pendencia dependem de autorizacao Google Business Profile ou importacao oficial.
                        </p>
                      </div>
                      <Badge tone="authorized">Apos autorizacao</Badge>
                    </div>
                  </section>

                  <section className="panel">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold">Evolucao por periodo</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Sem datas completas nao exibimos grafico semanal, mensal ou anual real.
                        </p>
                      </div>
                      <Badge tone="authorized">Apos autorizacao</Badge>
                    </div>
                  </section>
                </section>
              </section>

              <section className="panel">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex items-center gap-2">
                      <LockKeyhole className="text-emerald-800" size={19} />
                      <h2 className="text-xl font-semibold">Comentarios completos e acompanhamento de execucao</h2>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Para exibir todos os comentarios reais, respostas, pendencias e acompanhamento de execucao, o sistema precisa receber dados por OAuth do Google Business Profile ou importacao oficial.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="authorized">Disponivel apos autorizacao</Badge>
                    <Badge tone="neutral">Importacao oficial aceita</Badge>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function TabNavigation({
  activeTab,
  params,
}: {
  activeTab: TabKey;
  params: Record<string, string | string[] | undefined>;
}) {
  return (
    <section className="panel">
      <div className="grid gap-2 md:grid-cols-5">
        {tabs.map((tab) => (
          <Link className={tab.key === activeTab ? "tab-active" : "tab-link"} href={hrefWithParam(params, "tab", tab.key)} key={tab.key}>
            <span>{tab.label}</span>
            <small>{tab.description}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ExecutiveDecisionPanel({
  dashboard,
  params,
}: {
  dashboard: ReturnType<typeof getDemoDashboard>;
  params: Record<string, string | string[] | undefined>;
}) {
  return (
    <section className="panel border-emerald-200 bg-emerald-50/30">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-4xl">
          <Badge tone="real">Painel de decisao</Badge>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            O que a rede deve resolver primeiro
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {dashboard.executiveDecision.mission} Os comentarios ficam como fonte primaria e evidencia; a tela principal mostra a decisao.
          </p>
        </div>
        <Link className="btn-primary" href={hrefWithParams(params, { reviewTone: "negativas", tab: "porque", theme: dashboard.executiveDecision.primaryTheme })}>
          Ver evidencias
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-md border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-emerald-800">Acao recomendada agora</p>
          <h3 className="mt-2 text-lg font-semibold leading-7 text-slate-950">
            {dashboard.executiveDecision.primaryAction}
          </h3>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <DecisionMiniCard label="Tema critico" value={dashboard.executiveDecision.primaryTheme} />
            <DecisionMiniCard label="Loja em foco" value={dashboard.executiveDecision.primaryStore} />
            <DecisionMiniCard label="Evidencias negativas" value={dashboard.executiveDecision.evidenceCount.toString()} />
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Como o cliente enxerga</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{dashboard.executiveDecision.customerView}</p>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            Base da prioridade: {dashboard.executiveDecision.whyItMatters}
          </p>
        </div>
      </div>
    </section>
  );
}

function ActionQueue({
  items,
  params,
}: {
  items: ReturnType<typeof getDemoDashboard>["actionCommandCenter"]["actionQueue"];
  params: Record<string, string | string[] | undefined>;
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-md border border-slate-200">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[72px_1fr_120px_120px_130px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
          <span>Score</span>
          <span>Tema e origem</span>
          <span>SLA</span>
          <span>Status</span>
          <span>Reclamacoes</span>
        </div>
        {items.map((item) => (
          <div className="grid grid-cols-[72px_1fr_120px_120px_130px] gap-3 border-t border-slate-200 px-4 py-3 text-sm" key={item.id}>
            <strong className="text-emerald-800">{item.score}</strong>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-950">{item.theme}</span>
                <Badge tone={item.priority === "Alta" ? "real" : "neutral"}>{item.priority}</Badge>
              </div>
              <p className="mt-1 leading-6 text-slate-700">{item.action}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.storesAffected} loja(s) afetada(s) · {item.negativeComments} reclamacao(oes) de origem
              </p>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-600">
                {item.evidence.map((evidence) => <li key={evidence}>Evidencia: {evidence}</li>)}
              </ul>
              <p className="mt-2 text-xs text-slate-500">Dono: {item.owner}</p>
            </div>
            <span className="text-slate-700">{item.dueIn}</span>
            <span className="font-medium text-slate-800">{item.stage}</span>
            <Link className="font-semibold text-emerald-800 hover:underline" href={hrefWithParams(params, { reviewTone: "negativas", tab: "porque", theme: item.theme })}>
              Ver origem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyRitual({ steps }: { steps: string[] }) {
  return (
    <section className="panel">
      <div className="mb-3 flex items-center gap-2">
        <ClipboardCheck size={18} />
        <h3 className="font-semibold">Ritual semanal recomendado</h3>
      </div>
      <ol className="space-y-2 text-sm leading-6 text-slate-700">
        {steps.map((step, index) => (
          <li className="flex gap-2" key={step}>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ActionPlanList({ items }: { items: ReturnType<typeof getDemoDashboard>["actionPlan"] }) {
  return (
    <section className="panel">
      <div className="mb-4 flex items-center gap-2">
        <ListChecks size={19} />
        <h2 className="text-xl font-semibold">Plano de acao</h2>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <article className="rounded-md border border-slate-200 p-4" key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone={item.priority === "Alta" ? "real" : "neutral"}>{item.priority}</Badge>
                <h3 className="mt-3 font-semibold">{item.theme}</h3>
              </div>
              <Badge tone="real">Dados acessados</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{item.action}</p>
            <dl className="mt-3 grid gap-2 text-xs text-slate-600">
              <div><dt className="font-semibold">Responsavel</dt><dd>{item.owner}</dd></div>
              <div><dt className="font-semibold">Prazo</dt><dd>{item.dueIn}</dd></div>
              <div><dt className="font-semibold">Evidencia</dt><dd>{item.evidence}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewEvidencePanel({
  params,
  reviewSamples,
  reviewTone,
  selectedTheme,
}: {
  params: Record<string, string | string[] | undefined>;
  reviewSamples: ReturnType<typeof getDemoDashboard>["reviewSamples"];
  reviewTone?: string;
  selectedTheme?: string;
}) {
  return (
    <section className="panel">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Comentarios que originaram a decisao</h2>
        <Badge tone="real">Fonte primaria</Badge>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">
        Comentarios sao exibidos aqui como evidencia da decisao, nao como o centro da interface.
      </p>
      {selectedTheme && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-950">
          <span>Filtrando comentarios por tema:</span>
          <Badge tone="real">{selectedTheme}</Badge>
          {reviewTone === "negativas" && <Badge tone="real">Somente reclamacoes</Badge>}
          <Link className="font-semibold text-emerald-800 hover:underline" href={hrefWithoutParams(params, ["theme", "reviewTone"])}>
            Limpar filtro
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {reviewSamples.map((review) => (
          <article className="border-b border-slate-200 pb-4 last:border-0" key={review.id}>
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm">{review.authorName}</strong>
              <span className="text-sm font-semibold text-amber-700">{review.rating}/5</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{review.text}</p>
          </article>
        ))}
        {reviewSamples.length === 0 && (
          <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Nenhum comentario disponivel agora para este tema nos filtros atuais.
          </p>
        )}
      </div>
    </section>
  );
}

function ThemeDecisionTable({
  items,
  showAverage = false,
  title,
}: {
  items: ReturnType<typeof getDemoDashboard>["themeDecisionReport"];
  showAverage?: boolean;
  title: string;
}) {
  return (
    <section className="panel">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Prioridade calculada pelos dados acessados: comentarios negativos, quantidade de mencoes, lojas afetadas e risco operacional do tema.
          </p>
        </div>
        <Badge tone="real">Dados acessados</Badge>
      </div>
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tema</th>
              <th>Prioridade</th>
              <th>Score</th>
              <th>Negativos</th>
              <th>Mencoes</th>
              {showAverage && <th>Nota media</th>}
              <th>Lojas</th>
              <th>Decisao recomendada</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.theme}>
                <td className="font-semibold text-slate-950">{item.theme}</td>
                <td><Badge tone={item.priority === "Alta" ? "real" : "neutral"}>{item.priority}</Badge></td>
                <td>{item.score}</td>
                <td>{item.negativeComments}</td>
                <td>{item.mentions}</td>
                {showAverage && <td>{formatRating(item.averageRating)}</td>}
                <td>{item.affectedStores}</td>
                <td className="min-w-[280px] text-sm leading-6 text-slate-700">{item.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StoreDecisionList({ stores }: { stores: ReturnType<typeof getDemoDashboard>["storeDecisionReport"] }) {
  return (
    <div className="space-y-3">
      {stores.map((store, index) => (
        <Link className="block rounded-md border border-slate-200 p-3 hover:border-emerald-300 hover:bg-emerald-50/40" href={`/lojas/${store.slug}`} key={store.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-emerald-700 text-xs font-semibold text-white">{index + 1}</span>
                <strong className="text-sm text-slate-950">{store.neighborhood}</strong>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{store.name}</p>
            </div>
            <Badge tone={store.priority === "Alta" ? "real" : "neutral"}>{store.priority}</Badge>
          </div>
          <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-4">
            <span>Score: <strong className="text-slate-950">{store.score}</strong></span>
            <span>Nota: <strong className="text-slate-950">{formatRating(store.rating)}</strong></span>
            <span>Negativos: <strong className="text-slate-950">{store.negativeComments}</strong></span>
            <span>Tema: <strong className="text-slate-950">{store.criticalTheme}</strong></span>
          </div>
          <p className="mt-3 rounded-md bg-slate-50 p-2 text-xs leading-5 text-slate-700">{store.decision}</p>
        </Link>
      ))}
    </div>
  );
}

function StoreComparisonTable({ stores }: { stores: ReturnType<typeof getDemoDashboard>["stores"] }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Unidade</th>
            <th>Bairro</th>
            <th>Nota</th>
            <th>Avaliacoes</th>
            <th>Status</th>
            <th>Maps</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>
                <Link className="font-semibold text-emerald-800 hover:underline" href={`/lojas/${store.slug}`}>
                  {store.displayName}
                </Link>
                <div className="text-xs text-slate-500">{store.placeId}</div>
              </td>
              <td>{store.neighborhood}</td>
              <td>{formatRating(store.rating)}</td>
              <td>{formatNumber(store.userRatingCount)}</td>
              <td>{store.businessStatus}</td>
              <td><a className="text-emerald-800 hover:underline" href={store.googleMapsUri} rel="noreferrer" target="_blank">Abrir</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerceptionCard({
  text,
  title,
  tone,
}: {
  text: string;
  title: string;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneClass = {
    negative: "border-rose-200 bg-rose-50 text-rose-950",
    neutral: "border-slate-200 bg-slate-50 text-slate-950",
    positive: "border-emerald-200 bg-emerald-50 text-emerald-950",
  }[tone];

  return (
    <article className={`rounded-md border p-4 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase opacity-75">{title}</p>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </article>
  );
}

function ReviewQuoteList({ reviews }: { reviews: ReturnType<typeof getDemoDashboard>["reviewSamples"] }) {
  if (!reviews.length) {
    return <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-600">Sem comentarios suficientes nos dados acessados.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {reviews.map((review) => (
        <article className="rounded-md border border-slate-200 p-3" key={review.id}>
          <div className="flex items-center justify-between gap-3">
            <strong className="text-sm">{review.authorName}</strong>
            <span className="text-sm font-semibold text-amber-700">{review.rating}/5</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{review.text}</p>
        </article>
      ))}
    </div>
  );
}

function MetricCard({
  badge,
  icon,
  label,
  value,
}: {
  badge: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="panel min-h-36">
      <div className="flex items-center justify-between gap-3 text-emerald-800">
        {icon}
        <Badge tone="neutral">{badge}</Badge>
      </div>
      <p className="mt-5 text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold leading-tight text-slate-950">{value}</p>
    </div>
  );
}

function ActionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function DecisionMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseTab(value?: string): TabKey {
  return tabs.some((tab) => tab.key === value) ? (value as TabKey) : "resumo";
}

function hrefWithParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
  value: string,
) {
  return hrefWithParams(params, { [key]: value });
}

function hrefWithParams(
  params: Record<string, string | string[] | undefined>,
  values: Record<string, string>,
) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([entryKey, entryValue]) => {
    const normalized = asString(entryValue);
    if (normalized && !(entryKey in values)) next.set(entryKey, normalized);
  });
  Object.entries(values).forEach(([key, value]) => next.set(key, value));
  return `/?${next.toString()}`;
}

function hrefWithoutParams(
  params: Record<string, string | string[] | undefined>,
  keys: string[],
) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([entryKey, entryValue]) => {
    const normalized = asString(entryValue);
    if (normalized && !keys.includes(entryKey)) next.set(entryKey, normalized);
  });
  const query = next.toString();
  return query ? `/?${query}` : "/";
}
