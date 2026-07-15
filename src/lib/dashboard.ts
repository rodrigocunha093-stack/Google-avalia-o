import {
  demoStores,
  simulatedActionPlan,
  simulatedConnectedMetrics,
  simulatedWeeklyFeedbacks,
  getSimulatedRatingTrend,
} from "./demo-data";
import type { PublicStore, RatingTrendPeriod } from "./types";

export function getDemoDashboard(filters: {
  bairro?: string;
  rating?: string;
  status?: string;
  store?: string;
  period?: string;
  ratingPeriod?: string;
  theme?: string;
}) {
  const stores = applyFilters(demoStores, filters);
  const ratingPeriod = parseRatingPeriod(filters.ratingPeriod);
  const totalWeightedRating = stores.reduce(
    (sum, store) => sum + store.rating * store.userRatingCount,
    0,
  );
  const totalReviews = stores.reduce((sum, store) => sum + store.userRatingCount, 0);
  const weightedAverageRating = totalReviews ? totalWeightedRating / totalReviews : 0;
  const bestRated = [...stores].sort((a, b) => b.rating - a.rating)[0];
  const mostReviewed = [...stores].sort((a, b) => b.userRatingCount - a.userRatingCount)[0];
  const availableReviews = stores.flatMap((store) => store.reviews);
  const selectedTheme = filters.theme;
  const reviewSamples = selectedTheme
    ? availableReviews.filter((review) => reviewMatchesTheme(review.text, selectedTheme))
    : availableReviews;
  const weeklyFeedbacks = simulatedWeeklyFeedbacks.filter((feedback) => {
    if (filters.store && feedback.storeId !== filters.store) return false;
    if (filters.period && feedback.period !== filters.period) return false;
    if (filters.theme && feedback.theme !== filters.theme) return false;
    return stores.some((store) => store.id === feedback.storeId);
  });

  return {
    stores,
    reviewSamples,
    selectedTheme: filters.theme,
    themes: identifyThemes(availableReviews.map((review) => review.text)),
    weeklyFeedbacks,
    actionPlan: simulatedActionPlan.filter((item) => !filters.theme || item.theme === filters.theme),
    ratingTrend: getSimulatedRatingTrend(ratingPeriod, filters.store),
    ratingPeriod,
    futureWeeklyReport: simulatedConnectedMetrics,
    filters: {
      bairros: unique(demoStores.map((store) => store.neighborhood)),
      statuses: unique(demoStores.map((store) => store.businessStatus)),
      stores: demoStores.map((store) => ({ id: store.id, name: store.displayName })),
      themes: unique([
        ...identifyThemes(demoStores.flatMap((store) => store.reviews.map((review) => review.text))),
        ...simulatedWeeklyFeedbacks.map((feedback) => feedback.theme),
        ...simulatedActionPlan.map((item) => item.theme),
      ]),
    },
    summary: {
      unitsFound: stores.length,
      weightedAverageRating,
      totalReviews,
      bestRated,
      mostReviewed,
    },
  };
}

export function getStoreBySlug(slug: string) {
  return demoStores.find((store) => store.slug === slug);
}

export function calculateWeightedAverage(stores: Pick<PublicStore, "rating" | "userRatingCount">[]) {
  const totalReviews = stores.reduce((sum, store) => sum + store.userRatingCount, 0);
  if (!totalReviews) return 0;
  return stores.reduce((sum, store) => sum + store.rating * store.userRatingCount, 0) / totalReviews;
}

function applyFilters(
  stores: PublicStore[],
  filters: { bairro?: string; rating?: string; status?: string; store?: string },
) {
  return stores.filter((store) => {
    if (filters.store && store.id !== filters.store) return false;
    if (filters.bairro && store.neighborhood !== filters.bairro) return false;
    if (filters.status && store.businessStatus !== filters.status) return false;
    if (filters.rating && store.rating < Number(filters.rating)) return false;
    return true;
  });
}

function identifyThemes(texts: string[]) {
  const dictionary = themeDictionary();

  return dictionary
    .filter(([needle]) => texts.some((text) => normalize(text).includes(needle)))
    .map(([, label]) => label);
}

function reviewMatchesTheme(text: string, theme: string) {
  const dictionary = themeDictionary();
  const normalizedTheme = normalize(theme);
  const themeEntry = dictionary.find(([, label]) => normalize(label) === normalizedTheme);
  const needle = themeEntry?.[0] ?? normalizedTheme;
  return normalize(text).includes(needle);
}

function themeDictionary() {
  return [
    ["preco", "Preco"],
    ["ofertas", "Ofertas"],
    ["fila", "Filas"],
    ["atendimento", "Atendimento"],
    ["estacionamento", "Estacionamento"],
    ["limpeza", "Limpeza"],
    ["variedade", "Variedade"],
    ["padaria", "Padaria"],
    ["autoatendimento", "Autoatendimento"],
    ["carne", "Carnes"],
    ["horario", "Horario"],
    ["gerente", "Atendimento gerencial"],
    ["seguranca", "Seguranca"],
    ["higiene", "Higiene"],
    ["frios", "Frios"],
    ["acougue", "Acougue"],
    ["restaurante", "Restaurante"],
    ["etiqueta", "Divergencia de preco"],
    ["caixa", "Caixas"],
    ["portaria", "Portaria"],
    ["promocoes", "Promocoes"],
    ["baratas", "Controle de pragas"],
    ["pombos", "Controle de pragas"],
    ["validade", "Validade"],
    ["vencido", "Validade"],
    ["mofado", "Validade"],
    ["geladeira", "Refrigeracao"],
    ["rato", "Controle de pragas"],
    ["recepcao", "Recepcao"],
  ] as const;
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function parseRatingPeriod(value?: string): RatingTrendPeriod {
  if (value === "mensal" || value === "anual") return value;
  return "semanal";
}
