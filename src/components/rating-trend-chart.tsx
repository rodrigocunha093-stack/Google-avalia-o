import { Badge } from "./badge";
import { formatRating } from "@/lib/format";
import type { RatingTrendPeriod, RatingTrendPoint } from "@/lib/types";

export function RatingTrendChart({
  period,
  points,
}: {
  period: RatingTrendPeriod;
  points: RatingTrendPoint[];
}) {
  const width = 720;
  const height = 260;
  const padding = { bottom: 42, left: 44, right: 20, top: 22 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const minRating = 3.5;
  const maxRating = 5;
  const path = points
    .map((point, index) => {
      const x = padding.left + (index / Math.max(points.length - 1, 1)) * chartWidth;
      const y = padding.top + ((maxRating - point.rating) / (maxRating - minRating)) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <section className="panel">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Nota por periodo</h2>
          <p className="mt-1 text-sm text-slate-600">
            Grafico simulado para demonstrar a visualizacao {periodLabel(period)}. Os dados reais por periodo dependem
            da autorizacao do Google Business Profile ou importacao oficial do cliente.
          </p>
        </div>
        <Badge tone="simulated">Demonstracao simulada</Badge>
      </div>

      <div className="overflow-x-auto">
        <svg
          aria-label="Grafico de nota por periodo"
          className="min-w-[640px]"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          {[3.5, 4, 4.5, 5].map((tick) => {
            const y = padding.top + ((maxRating - tick) / (maxRating - minRating)) * chartHeight;
            return (
              <g key={tick}>
                <line stroke="#e2e8f0" x1={padding.left} x2={width - padding.right} y1={y} y2={y} />
                <text fill="#64748b" fontSize="11" x="8" y={y + 4}>{formatRating(tick)}</text>
              </g>
            );
          })}
          <path d={path} fill="none" stroke="#047857" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          {points.map((point, index) => {
            const x = padding.left + (index / Math.max(points.length - 1, 1)) * chartWidth;
            const y = padding.top + ((maxRating - point.rating) / (maxRating - minRating)) * chartHeight;
            return (
              <g key={point.label}>
                <circle cx={x} cy={y} fill="#ffffff" r="6" stroke="#047857" strokeWidth="3" />
                <text fill="#0f172a" fontSize="12" fontWeight="700" textAnchor="middle" x={x} y={y - 12}>
                  {formatRating(point.rating)}
                </text>
                <text fill="#475569" fontSize="11" textAnchor="middle" x={x} y={height - 18}>
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Summary label="Media simulada do periodo" value={formatRating(average(points.map((point) => point.rating)))} />
        <Summary label="Maior nota simulada" value={formatRating(Math.max(...points.map((point) => point.rating)))} />
        <Summary label="Avaliacoes simuladas no periodo" value={points.reduce((sum, point) => sum + point.reviews, 0).toLocaleString("pt-BR")} />
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function periodLabel(period: RatingTrendPeriod) {
  if (period === "mensal") return "mensal";
  if (period === "anual") return "anual";
  return "semanal";
}
