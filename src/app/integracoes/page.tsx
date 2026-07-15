import Link from "next/link";
import { ArrowLeft, KeyRound, LockKeyhole, RefreshCw, ShieldCheck, Unplug } from "lucide-react";
import { Badge } from "@/components/badge";

const steps = [
  "OAuth 2.0 com consentimento no Google",
  "Armazenamento criptografado de access token e refresh token",
  "Renovacao automatica antes da expiracao",
  "Listagem de contas empresariais",
  "Listagem paginada de localizacoes",
  "Vinculo das localizacoes com lojas internas",
  "Sincronizacao paginada de avaliacoes",
  "Falhas isoladas por loja e logs de sincronizacao",
  "Desconexao segura com revogacao e limpeza de tokens",
];

export default function IntegrationsPage() {
  const oauthUrl = "/api/auth/google-business-profile/start";

  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline" href="/">
          <ArrowLeft size={16} />
          Voltar ao painel
        </Link>
        <section className="panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge tone="authorized">Disponivel apos autorizacao</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Integracoes</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Area preparada para conectar a conta Google Business Profile por OAuth 2.0. O cliente nao fornece senha; a autorizacao acontece diretamente no ambiente seguro do Google.
              </p>
            </div>
            <a className="btn-primary" href={oauthUrl}>
              <ShieldCheck size={17} />
              Conectar Google Business Profile
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Feature icon={<KeyRound />} title="OAuth preparado" text="Rotas de inicio e callback validam estado, escopos e troca de codigo por tokens." />
          <Feature icon={<LockKeyhole />} title="Tokens criptografados" text="Tokens ficam no servidor, cifrados com AES-256-GCM, sem exposicao ao navegador ou logs." />
          <Feature icon={<RefreshCw />} title="Renovacao segura" text="Refresh token permite renovar acesso e registrar falhas sem bloquear toda a rede." />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="panel">
            <h2 className="text-xl font-semibold">Fluxo tecnico preparado</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, index) => (
                <li className="flex gap-3 rounded-md border border-slate-200 p-3 text-sm" key={step}>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="panel">
            <h2 className="text-xl font-semibold">Status da demonstracao</h2>
            <div className="mt-4 space-y-3">
              <Status label="Places API publica" value="Pronto para chave" tone="real" />
              <Status label="Business Profile OAuth" value="Arquitetura pronta" tone="authorized" />
              <Status label="Importacao completa" value="Apos credenciais" tone="authorized" />
              <Status label="Desconexao segura" value="Endpoint preparado" tone="authorized" />
            </div>
            <div className="mt-5 rounded-md border border-slate-200 p-4 text-sm leading-6">
              <div className="mb-2 flex items-center gap-2 font-semibold"><Unplug size={16} />Desconexao</div>
              Ao desconectar, os tokens devem ser revogados no Google, removidos do banco e registrados em `audit_logs`.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ icon, text, title }: { icon: React.ReactNode; text: string; title: string }) {
  return (
    <article className="panel">
      <div className="mb-4 text-emerald-800">{icon}</div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}

function Status({ label, tone, value }: { label: string; tone: "real" | "authorized"; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
      <span className="text-sm">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}
