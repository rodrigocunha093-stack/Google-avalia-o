export function formatRating(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 1,
  });
}

export function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}
