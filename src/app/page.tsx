import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Clock3,
  Filter,
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
import { RatingTrendChart } from "@/components/rating-trend-chart";
import { StoreFilters } from "@/components/store-filters";
import { getDemoDashboard } from "@/lib/dashboard";
import { formatNumber, formatRating } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const dashboard = getDemoDashboard({
    store: asString(params.store),
    bairro: asString(params.bairro),
    status: asString(params.status),
    rating: asString(params.rating),
    period: asString(params.period),
    ratingPeriod: asString(params.ratingPeriod),
    theme: asString(params.theme),
  });
  const selectedTheme = asString(params.theme);

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
        <MetricCard
          icon={<Building2 size={20} />}
          label="Unidades encontradas"
          value={dashboard.summary.unitsFound.toString()}
          badge="Dado publico real"
        />
        <MetricCard
          icon={<Star size={20} />}
          label="Nota media ponderada"
          value={formatRating(dashboard.summary.weightedAverageRating)}
          badge="Dado publico real"
        />
        <MetricCard
          icon={<MessageSquareText size={20} />}
          label="Total publico de avaliacoes"
          value={formatNumber(dashboard.summary.totalReviews)}
          badge="Dado publico real"
        />
        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Melhor nota"
          value={dashboard.summary.bestRated?.displayName ?? "-"}
          badge={formatRating(dashboard.summary.bestRated?.rating)}
        />
        <MetricCard
          icon={<MapPinned size={20} />}
          label="Maior volume"
          value={dashboard.summary.mostReviewed?.displayName ?? "-"}
          badge={`${formatNumber(dashboard.summary.mostReviewed?.userRatingCount ?? 0)} avaliacoes`}
        />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="panel h-fit">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={18} />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          <StoreFilters
            bairros={dashboard.filters.bairros}
            ratingPeriod={dashboard.ratingPeriod}
            statuses={dashboard.filters.statuses}
            stores={dashboard.filters.stores}
            themes={dashboard.filters.themes}
          />
        </aside>

        <div className="space-y-6">
          <section className="panel">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Comparativo das lojas</h2>
                <p className="text-sm text-slate-600">
                  Dados publicos retornados pela Places API ou seed local da demonstracao.
                </p>
              </div>
              <Badge tone="real">Dado publico real</Badge>
            </div>
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
                  {dashboard.stores.map((store) => (
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
                      <td>
                        <a className="text-emerald-800 hover:underline" href={store.googleMapsUri} rel="noreferrer" target="_blank">
                          Abrir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <RatingTrendChart period={dashboard.ratingPeriod} points={dashboard.ratingTrend} />

          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="panel">
              <div className="mb-4 flex items-center gap-2">
                <MapPinned size={19} />
                <h2 className="text-xl font-semibold">Mapa das unidades</h2>
              </div>
              <div className="relative min-h-[420px] overflow-hidden rounded-md border border-slate-200 bg-[#dde9df]">
                <div className="absolute inset-0 map-grid" />
                {dashboard.stores.map((store, index) => (
                  <Link
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold shadow-sm ring-1 ring-slate-200 hover:ring-emerald-400"
                    href={`/lojas/${store.slug}`}
                    key={store.id}
                    style={{
                      left: `${20 + ((index * 17) % 60)}%`,
                      top: `${24 + ((index * 23) % 54)}%`,
                    }}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-700 text-white">
                      {index + 1}
                    </span>
                    {store.neighborhood}
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Comentarios disponiveis agora</h2>
                <Badge tone="real">Dado publico limitado</Badge>
              </div>
              <p className="mb-4 text-sm leading-6 text-slate-600">
                Sem autorizacao do Google Business Profile, a fonte publica nao entrega todos os comentarios. Esta area mostra apenas os comentarios que a fonte atual permite exibir.
              </p>
              {selectedTheme && (
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-950">
                  <span>Filtrando comentarios por tema:</span>
                  <Badge tone="real">{selectedTheme}</Badge>
                  <Link className="font-semibold text-emerald-800 hover:underline" href={hrefWithoutParam(params, "theme")}>
                    Limpar tema
                  </Link>
                </div>
              )}
              <div className="space-y-4">
                {dashboard.reviewSamples.map((review) => (
                  <article className="border-b border-slate-200 pb-4 last:border-0" key={review.id}>
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm">{review.authorName}</strong>
                      <span className="text-sm font-semibold text-amber-700">{review.rating}/5</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{review.text}</p>
                  </article>
                ))}
                {dashboard.reviewSamples.length === 0 && (
                  <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                    Nenhum comentario disponivel agora para este tema nos filtros atuais.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="panel">
              <h2 className="text-xl font-semibold">Temas identificados nos comentarios</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.themes.map((theme) => (
                  <Link
                    className={theme === selectedTheme ? "theme-chip-active" : "theme-chip"}
                    href={hrefWithParam(params, "theme", theme)}
                    key={theme}
                  >
                    {theme}
                  </Link>
                ))}
                {selectedTheme && (
                  <Link className="theme-chip-clear" href={hrefWithoutParam(params, "theme")}>
                    Todos
                  </Link>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Clique em um tema para filtrar os comentarios disponiveis agora, os feedbacks da semana e o plano de acao. A classificacao completa de todos os comentarios depende da autorizacao do Google Business Profile ou importacao oficial do cliente.
              </p>
            </div>
            <div className="panel">
              <div className="mb-4 flex items-center gap-2">
                <Clock3 size={19} />
                <h2 className="text-xl font-semibold">Futuro relatorio semanal</h2>
              </div>
              <div className="space-y-3">
                {dashboard.futureWeeklyReport.map((item) => (
                  <div className="flex items-center justify-between rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2" key={item.label}>
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <Badge tone="simulated">{item.value}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                <AlertTriangle className="mt-0.5 shrink-0" size={16} />
                <p>Bloco ilustrativo com dados simulados. Nao representa indicadores reais das lojas.</p>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-2">
                  <LockKeyhole className="text-emerald-800" size={19} />
                  <h2 className="text-xl font-semibold">Todos os comentarios</h2>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Para exibir todos os comentarios reais, o sistema precisa receber os dados por uma fonte autorizada: conexao OAuth com Google Business Profile ou importacao oficial fornecida pelo cliente. Assim conseguimos listar historico completo acessivel, periodo, respostas, pendencias, temas e plano de acao sem usar scraping.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="authorized">Disponivel apos autorizacao</Badge>
                <Badge tone="neutral">Importacao oficial aceita</Badge>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="panel">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText size={19} />
                  <h2 className="text-xl font-semibold">Feedbacks da ultima semana</h2>
                </div>
                <Badge tone="simulated">Demonstracao simulada</Badge>
              </div>
              <p className="mb-4 text-sm leading-6 text-slate-600">
                Sem Places API ou autorizacao Google Business Profile, feedbacks por periodo nao podem ser extraidos do Google com seguranca. Este bloco mostra como a analise semanal ficara apos autorizacao ou importacao confiavel.
              </p>
              <div className="space-y-3">
                {dashboard.weeklyFeedbacks.map((feedback) => (
                  <article className="rounded-md border border-slate-200 p-4" key={feedback.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-sm">{feedback.storeName}</strong>
                        <p className="mt-1 text-xs text-slate-500">{feedback.theme} · {feedback.sentiment}</p>
                      </div>
                      <Badge tone={feedback.sentiment === "Reclamacao" ? "simulated" : "neutral"}>{feedback.rating}/5</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{feedback.text}</p>
                    <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-800">
                      Acao sugerida: {feedback.recommendedAction}
                    </p>
                  </article>
                ))}
                {dashboard.weeklyFeedbacks.length === 0 && (
                  <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                    Nenhum feedback simulado encontrado para os filtros atuais.
                  </p>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks size={19} />
                <h2 className="text-xl font-semibold">Plano de acao</h2>
              </div>
              <div className="space-y-3">
                {dashboard.actionPlan.map((item) => (
                  <article className="rounded-md border border-slate-200 p-4" key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge tone={item.priority === "Alta" ? "simulated" : "neutral"}>{item.priority}</Badge>
                        <h3 className="mt-3 font-semibold">{item.theme}</h3>
                      </div>
                      <Badge tone="simulated">Simulado</Badge>
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
            </div>
          </section>
        </div>
      </section>
    </main>
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
        <Badge tone={badge === "Dado publico real" ? "real" : "neutral"}>{badge}</Badge>
      </div>
      <p className="mt-5 text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold leading-tight text-slate-950">{value}</p>
    </div>
  );
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hrefWithParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
  value: string,
) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([entryKey, entryValue]) => {
    const normalized = asString(entryValue);
    if (normalized && entryKey !== key) next.set(entryKey, normalized);
  });
  next.set(key, value);
  return `/?${next.toString()}`;
}

function hrefWithoutParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([entryKey, entryValue]) => {
    const normalized = asString(entryValue);
    if (normalized && entryKey !== key) next.set(entryKey, normalized);
  });
  const query = next.toString();
  return query ? `/?${query}` : "/";
}
