import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, LockKeyhole, MapPin, Phone, Star } from "lucide-react";
import { Badge } from "@/components/badge";
import { Notice } from "@/components/notice";
import { getStoreBySlug } from "@/lib/dashboard";
import { simulatedConnectedMetrics } from "@/lib/demo-data";
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
    <main className="min-h-screen bg-[#f8faf9] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline" href="/">
            <ArrowLeft size={16} />
            Voltar ao painel
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone="real">Dado publico real</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{store.displayName}</h1>
              <p className="mt-2 flex items-center gap-2 text-slate-600">
                <MapPin size={17} />
                {store.formattedAddress}
              </p>
            </div>
            <a className="btn-primary" href={store.googleMapsUri} rel="noreferrer" target="_blank">
              Abrir no Google Maps
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="mt-6">
            <Notice />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoCard icon={<Star size={18} />} label="Nota geral" value={formatRating(store.rating)} />
            <InfoCard label="Total de avaliacoes" value={formatNumber(store.userRatingCount)} />
            <InfoCard label="Status" value={store.businessStatus} />
          </div>

          <section className="panel">
            <h2 className="text-xl font-semibold">Dados cadastrais</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-500">Place ID</dt>
                <dd className="mt-1 break-all">{store.placeId}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Telefone</dt>
                <dd className="mt-1 flex items-center gap-2"><Phone size={15} />{store.nationalPhoneNumber ?? "Nao informado"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Site</dt>
                <dd className="mt-1">{store.websiteUri ? <a className="text-emerald-800 hover:underline" href={store.websiteUri}>{store.websiteUri}</a> : "Nao informado"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Coordenadas</dt>
                <dd className="mt-1">{store.latitude}, {store.longitude}</dd>
              </div>
            </dl>
          </section>

          <section className="panel">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Comentarios disponiveis agora</h2>
              <Badge tone="real">Dado publico limitado</Badge>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              A fonte publica nao entrega todos os comentarios. Para historico completo, comentarios por periodo e respostas, e necessario conectar o Google Business Profile ou importar arquivo oficial do cliente.
            </p>
            <div className="space-y-4">
              {store.reviews.map((review) => (
                <article className="rounded-md border border-slate-200 p-4" key={review.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong>{review.authorName}</strong>
                    <span className="font-semibold text-amber-700">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{review.text}</p>
                  <p className="mt-2 text-xs text-slate-500">{review.relativePublishTimeDescription}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <LockKeyhole className="text-emerald-800" size={18} />
                  <h2 className="text-xl font-semibold">Todos os comentarios</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Esta lista completa sera preenchida depois da autorizacao segura do Google Business Profile ou de importacao oficial fornecida pelo cliente. A aplicacao nao solicita senha e nao usa scraping.
                </p>
              </div>
              <Badge tone="authorized">Disponivel apos autorizacao</Badge>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="panel">
            <h2 className="text-xl font-semibold">Horario</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {store.regularOpeningHours.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>

          <section className="panel">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Como ficara apos a conexao</h2>
              <Badge tone="authorized">Disponivel apos autorizacao</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Os numeros abaixo sao demonstrativos e estao separados dos dados reais.
            </p>
            <div className="mt-4 space-y-3">
              {simulatedConnectedMetrics.map((metric) => (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3" key={metric.label}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-amber-950">{metric.label}</span>
                    <Badge tone="simulated">Demonstracao simulada</Badge>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{metric.value}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="panel">
      <div className="flex items-center gap-2 text-emerald-800">{icon}<span className="text-sm font-semibold text-slate-600">{label}</span></div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}
