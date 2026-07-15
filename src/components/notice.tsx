import { Info } from "lucide-react";

export const DEMO_NOTICE =
  "Esta demonstracao utiliza dados publicos disponibilizados pela Google Places API. A analise completa das avaliacoes, incluindo todos os comentarios e indicadores semanais, dependera da autorizacao da conta Google Business Profile administradora das lojas.";

export function Notice() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
      <Info className="mt-0.5 shrink-0" size={18} />
      <p>{DEMO_NOTICE}</p>
    </div>
  );
}
