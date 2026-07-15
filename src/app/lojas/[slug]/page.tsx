import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, LockKeyhole, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/badge";
import { Notice } from "@/components/notice";
import { getStoreBySlug } from "@/lib/dashboard";
import { formatNumber, formatRating } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return ["bairro-dos-estados", "manaira", "intermares", "cristo", "torre", "altiplano", "mega-atacarejo"].map((slug) => ({ slug }));
}

export default async function StorePage({ params }: { params: Params }) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) notFound();

  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-950">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline" href="/">
            <ArrowLeft size={15} />
            Voltar ao painel
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone="real">Dado real acessado</Badge>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{store.displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={15} />
                {store.formattedAddress}
              </p>
            </div>
            <a className="btn-primary" href={store.googleMapsUri} rel="noreferrer" target="_blank">
              Abrir no Google Maps
              <ExternalLink size={15} />
            </a>
          </div>
          <div className="mt-6">
            <Notice />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={<Star size={18} />} label="Nota geral" value={formatRating(store.rating)} accent />
            <InfoCard label="Total de avaliacoes" value={formatNumber(store.userRatingCount)} />
            <InfoCard label="Status" value={store.businessStatus} />
          </div>

          <section className="panel">
            <h2 className="text-lg font-bold tracking-tight">Dados cadastrais</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Place ID</dt>
                <dd className="mt-1 break-all text-slate-700">{store.placeId}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Telefone</dt>
                <dd className="mt-1 flex items-center gap-2 text-slate-700"><Phone size={14} />{store.nationalPhoneNumber ?? "Nao informado"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Site</dt>
                <dd className="mt-1">{store.websiteUri ? <a className="text-emerald-700 hover:underline" href={store.websiteUri}>{store.websiteUri}</a> : <span className="text-slate-400">Nao informado</span>}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coordenadas</dt>
                <dd className="mt-1 text-slate-700">{store.latitude}, {store.longitude}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Comentarios disponiveis agora</h2>
              <Badge tone="real">Dado real acessado</Badge>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              A fonte publica nao entrega todos os comentarios. Para historico completo, comentarios por periodo e respostas, e necessario conectar o Google Business Profile ou importar arquivo oficial do cliente.
            </p>
            <div className="space-y-3">
              {store.reviews.map((review) => (
                <article className="rounded-xl border border-slate-200/80 p-4 hover:border-slate-300" key={review.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-sm">{review.authorName}</strong>
                    <span className={`text-sm font-bold ${review.rating >= 4 ? "text-amber-500" : review.rating >= 3 ? "text-amber-400" : "text-rose-500"}`}>
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{review.text}</p>
                  <p className="mt-2 text-xs text-slate-400">{review.relativePublishTimeDescription}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-lg bg-emerald-100">
                    <LockKeyhole className="text-emerald-700" size={17} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">Todos os comentarios</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Esta lista completa sera preenchida depois da autorizacao segura do Google Business Profile ou de importacao oficial fornecida pelo cliente. A aplicacao nao solicita senha e nao usa scraping.
                </p>
              </div>
              <Badge tone="authorized">Disponivel apos autorizacao</Badge>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="panel bg-gradient-to-b from-white to-slate-50/50">
            <h2 className="text-lg font-bold tracking-tight">Horario</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {store.regularOpeningHours.map((line) => <li className="flex items-center gap-2" key={line}><span className="size-1.5 rounded-full bg-emerald-400" />{line}</li>)}
            </ul>
          </section>

          <section className="panel">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold tracking-tight">Dados que faltam para ficar 100% real</h2>
              <Badge tone="authorized">Apos autorizacao</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Nao exibimos numeros simulados nesta area. Estes indicadores entram apenas quando houver autorizacao do Google Business Profile ou importacao oficial com historico completo.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-slate-700">
              <li className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">Novas avaliacoes por semana com data real</li>
              <li className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">Nota semanal, mensal e anual real</li>
              <li className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">Respostas, pendencias e taxa de resposta</li>
              <li className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">Historico completo acessivel por loja</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value, accent = false }: { icon?: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`panel ${accent ? "border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white" : ""}`}>
      <div className="flex items-center gap-2">
        {icon && <div className={`grid size-8 place-items-center rounded-lg ${accent ? "bg-emerald-100" : "bg-slate-100"}`}><span className={accent ? "text-emerald-700" : "text-slate-500"}>{icon}</span></div>}
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
