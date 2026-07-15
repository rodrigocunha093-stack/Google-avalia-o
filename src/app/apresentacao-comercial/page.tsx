import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole, PanelsTopLeft, Route, Store } from "lucide-react";
import { Badge } from "@/components/badge";

const before = ["nota publica", "quantidade publica", "dados cadastrais", "comentarios publicos limitados", "comparacao publica das unidades"];
const after = ["todas as avaliacoes acessiveis", "nota real da semana", "quantidade de avaliacoes por periodo", "comentarios da semana", "avaliacoes nao respondidas", "alertas", "relatorios", "historico", "acompanhamento por gerente"];
const flow = ["Apresentacao da demonstracao", "Aprovacao comercial", "Conexao segura da conta Google", "Vinculacao das lojas", "Importacao dos dados", "Inicio do relatorio semanal"];

export default function CommercialPresentationPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline" href="/">
          <ArrowLeft size={16} />
          Voltar ao painel
        </Link>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="panel">
            <Badge tone="neutral">Apresentacao Comercial</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Radar de Avaliacoes para a Rede Menor Preco</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Um painel unico para transformar avaliacoes espalhadas em acompanhamento semanal, alertas e acoes por loja.
            </p>
          </div>
          <div className="panel bg-emerald-800 text-white">
            <LockKeyhole />
            <p className="mt-5 text-2xl font-semibold leading-tight">
              O cliente nao fornece sua senha. A autorizacao acontece diretamente no ambiente seguro do Google.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
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

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <ListPanel title="Antes da autorizacao" badge="Dado publico real" tone="real" items={before} />
          <ListPanel title="Depois da autorizacao" badge="Disponivel apos autorizacao" tone="authorized" items={after} />
        </section>

        <section className="mt-6 panel">
          <div className="flex items-center gap-2">
            <Route className="text-emerald-800" />
            <h2 className="text-xl font-semibold">Fluxo de contratacao</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {flow.map((step, index) => (
              <div className="rounded-md border border-slate-200 bg-white p-4" key={step}>
                <span className="grid size-8 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">{index + 1}</span>
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
      <div className="text-emerald-800">{icon}</div>
      <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm" key={item}>
            <CheckCircle2 className="text-emerald-700" size={16} />
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
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge tone={tone}>{badge}</Badge>
      </div>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li className="flex items-center gap-2 text-sm" key={item}>
            <CheckCircle2 className="text-emerald-700" size={16} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
