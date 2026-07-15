import { Info } from "lucide-react";

export const DEMO_NOTICE =
  "Esta demonstracao utiliza dados publicos disponibilizados pela Google Places API. A analise completa das avaliacoes, incluindo todos os comentarios e indicadores semanais, dependera da autorizacao da conta Google Business Profile administradora das lojas.";

export function Notice() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-50/50 p-4 text-sm leading-6 text-emerald-900">
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-100">
        <Info size={15} className="text-emerald-700" />
      </div>
      <p>{DEMO_NOTICE}</p>
    </div>
  );
}
