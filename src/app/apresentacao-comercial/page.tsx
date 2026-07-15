import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, PanelsTopLeft, Route, Store } from "lucide-react";
import { Badge } from "@/components/badge";

const before = ["nota publica", "quantidade publica", "dados cadastrais", "comentarios publicos limitados", "comparacao publica das unidades"];
const after = ["todas as avaliacoes acessiveis", "nota real da semana", "quantidade de avaliacoes por periodo", "comentarios da semana", "avaliacoes nao respondidas", "alertas", "relatorios", "historico", "acompanhamento por gerente"];
const flow = ["Apresentacao da demonstracao", "Aprovacao comercial", "Conexao segura da conta Google", "Vinculacao das lojas", "Importacao dos dados", "Inicio do relatorio semanal"];

export default function CommercialPresentationPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f6] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline" href="/">
          <ArrowLeft size={15} />
          Voltar ao painel
        </Link>
        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel">
            <Badge tone="neutral">Apresentacao Comercial</Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Radar de Avaliacoes para a Rede Menor Preco</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
              Um painel unico para transformar avaliacoes espalhadas em acompanhamento semanal, alertas e acoes por loja.
            </p>
          </div>
          <div className="panel bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-lg">
            <div className="grid size-10 place-items-center rounded-xl bg-white/15">
              <LockKeyhole size={20} />
            </div>
            <p className="mt-5 text-xl font-bold leading-tight sm:text-2xl">
              O cliente nao fornece sua senha. A autorizacao acontece diretamente no ambiente seguro do Google.
            </p>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <StoryBlock
            icon={<Store />}
            title="Situacao atual"
            text="As avaliacoes estao distribuidas entre varios perfis e precisam ser consultadas individualmente."
            items={["visao fragmentada", "comparacao manual", "dificuldade para identificar pendencias", "pouca previsibilidade semanal"]}
          />
          <StoryBlock
            icon={<PanelsTopLeft />}
            title="Solucao proposta"
            text="Um painel unico para acompanhar lojas, notas, novos comentarios, reclamacoes, elogios, avaliacoes criticas, pendencias e desempenho semanal."
            items={["todas as lojas", "notas e novos comentarios", "reclamacoes e elogios", "pendencias e desempenho semanal"]}
          />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <ListPanel title="Antes da autorizacao" badge="Dado publico real" tone="real" items={before} />
          <ListPanel title="Depois da autorizacao" badge="Disponivel apos autorizacao" tone="authorized" items={after} />
        </section>

        <section className="mt-5 panel">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-emerald-100">
              <Route className="text-emerald-700" size={17} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Fluxo de contratacao</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {flow.map((step, index) => (
              <div className="rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-4 hover:border-emerald-200 hover:shadow-sm" key={step}>
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-sm font-bold text-white shadow-sm">{index + 1}</span>
                <p className="mt-3 text-sm font-semibold leading-5">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StoryBlock({ icon, items, text, title }: { icon: React.ReactNode; items: string[]; text: string; title: string }) {
  return (
    <article className="panel">
      <div className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">{icon}</div>
      <h2 className="mt-4 text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50/80 p-3 text-sm" key={item}>
            <CheckCircle2 className="shrink-0 text-emerald-600" size={16} />
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}

function ListPanel({ badge, items, title, tone }: { badge: string; items: string[]; title: string; tone: "real" | "authorized" }) {
  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <Badge tone={tone}>{badge}</Badge>
      </div>
      <ul className="mt-4 grid gap-2.5">
        {items.map((item) => (
          <li className="flex items-center gap-2.5 text-sm" key={item}>
            <CheckCircle2 className="shrink-0 text-emerald-600" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
