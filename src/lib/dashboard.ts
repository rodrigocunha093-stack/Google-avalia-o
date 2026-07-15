import {
  demoStores,
  simulatedActionPlan,
  simulatedConnectedMetrics,
  simulatedWeeklyFeedbacks,
  getSimulatedRatingTrend,
} from "./demo-data";
import type { ActionPlanItem, PublicReviewSample, PublicStore, RatingTrendPeriod } from "./types";

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

  const actionPlan = simulatedActionPlan.filter((item) => !filters.theme || item.theme === filters.theme);
  const actionCommandCenter = buildActionCommandCenter(actionPlan, reviewSamples);
  const themeDecisionReport = buildThemeDecisionReport(availableReviews);
  const storeDecisionReport = buildStoreDecisionReport(stores);

  return {
    stores,
    reviewSamples,
    selectedTheme: filters.theme,
    themes: identifyThemes(availableReviews.map((review) => review.text)),
    weeklyFeedbacks,
    actionPlan,
    actionCommandCenter,
    themeDecisionReport,
    storeDecisionReport,
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

  return uniqueCanonical(dictionary
    .filter(([needle]) => texts.some((text) => normalize(text).includes(needle)))
    .map(([, label]) => label));
}

function reviewMatchesTheme(text: string, theme: string) {
  return identifyThemes([text]).some((label) => normalize(label) === normalize(theme));
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
    ["sujo", "Limpeza"],
    ["sujeira", "Limpeza"],
    ["calcada", "Area externa"],
    ["mofados", "Validade"],
    ["promocao", "Promocoes"],
    ["apresuntado", "Frios"],
    ["fiambre", "Frios"],
    ["charque", "Carnes"],
  ] as const;
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function unique(values: string[]) {
  return uniqueCanonical(values).sort((a, b) => a.localeCompare(b));
}

function uniqueCanonical(values: string[]) {
  const byKey = new Map<string, string>();
  values.forEach((value) => {
    const key = normalize(value);
    if (!byKey.has(key)) byKey.set(key, value);
  });
  return Array.from(byKey.values());
}

function parseRatingPeriod(value?: string): RatingTrendPeriod {
  if (value === "mensal" || value === "anual") return value;
  return "semanal";
}

function buildActionCommandCenter(actionPlan: ActionPlanItem[], reviewSamples: PublicReviewSample[]) {
  const actionQueue = actionPlan
    .map((item) => ({
      ...item,
      score: actionScore(item),
      slaStatus: item.dueIn.includes("48") ? "Critico" : item.dueIn.includes("7") ? "Esta semana" : "Monitorar",
      stage: item.priority === "Alta" ? "Acionar hoje" : item.priority === "Media" ? "Planejar na semana" : "Acompanhar",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const negativeReviews = reviewSamples.filter((review) => review.rating <= 2);
  const topTheme = mostFrequent([
    ...identifyThemes(negativeReviews.map((review) => review.text)),
    ...actionPlan.filter((item) => item.priority === "Alta").map((item) => item.theme),
  ]);

  return {
    criticalActions: actionPlan.filter((item) => item.priority === "Alta").length,
    dueSoonActions: actionPlan.filter((item) => item.dueIn.includes("48") || item.dueIn.includes("7")).length,
    negativeFeedbacks: negativeReviews.length,
    topRiskTheme: topTheme ?? "Sem tema critico",
    actionQueue,
    weeklyRitual: [
      "Triar reclamacoes criticas por loja e tema",
      "Definir responsavel, prazo e evidencia esperada",
      "Registrar resposta ao cliente e acao executada",
      "Revisar recorrencia na reuniao semanal de gerentes",
    ],
  };
}

function buildThemeDecisionReport(reviews: PublicReviewSample[]) {
  const rows = new Map<string, {
    theme: string;
    mentions: number;
    negativeComments: number;
    stores: Set<string>;
    ratingSum: number;
  }>();

  reviews.forEach((review) => {
    identifyThemes([review.text]).forEach((theme) => {
      const row = rows.get(theme) ?? {
        theme,
        mentions: 0,
        negativeComments: 0,
        stores: new Set<string>(),
        ratingSum: 0,
      };
      row.mentions += 1;
      row.ratingSum += review.rating;
      row.stores.add(review.storeId);
      if (review.rating <= 2) row.negativeComments += 1;
      rows.set(theme, row);
    });
  });

  return Array.from(rows.values())
    .map((row) => {
      const score = row.negativeComments * 35 + row.mentions * 8 + row.stores.size * 5 + themeRiskWeight(row.theme);
      return {
        theme: row.theme,
        mentions: row.mentions,
        negativeComments: row.negativeComments,
        affectedStores: row.stores.size,
        averageRating: row.ratingSum / Math.max(row.mentions, 1),
        score,
        priority: score >= 75 || row.negativeComments >= 2 ? "Alta" : score >= 45 ? "Media" : "Baixa",
        decision: decisionForTheme(row.theme, row.negativeComments),
      };
    })
    .sort((a, b) => b.score - a.score || b.negativeComments - a.negativeComments || a.theme.localeCompare(b.theme))
    .slice(0, 8);
}

function buildStoreDecisionReport(stores: PublicStore[]) {
  return stores
    .map((store) => {
      const negativeReviews = store.reviews.filter((review) => review.rating <= 2);
      const criticalTheme = mostFrequent(identifyThemes(negativeReviews.map((review) => review.text))) ?? "Sem critico";
      const score = negativeReviews.length * 35 + store.userRatingCount / 250 + (store.rating < 4.3 ? 20 : 0) + themeRiskWeight(criticalTheme);
      return {
        id: store.id,
        slug: store.slug,
        name: store.displayName,
        neighborhood: store.neighborhood,
        rating: store.rating,
        reviews: store.userRatingCount,
        negativeComments: negativeReviews.length,
        criticalTheme,
        score: Math.round(score),
        priority: score >= 90 || negativeReviews.length >= 4 ? "Alta" : score >= 55 ? "Media" : "Baixa",
        decision: storeDecision(criticalTheme, negativeReviews.length),
      };
    })
    .sort((a, b) => b.score - a.score || b.negativeComments - a.negativeComments);
}

function storeDecision(theme: string, negativeComments: number) {
  if (!negativeComments) return "Monitorar reputacao e manter rotina atual.";
  const decisions: Record<string, string> = {
    Validade: "Auditoria imediata de pereciveis, validade e retirada de produto improprio.",
    Higiene: "Checklist de limpeza, evidencia fotografica e revisao de rotina por turno.",
    Carnes: "Revisar cadeia fria, lote, armazenamento e devolucao no setor de carnes.",
    Seguranca: "Revisar abordagem, cameras, ronda e protocolo de ocorrencias.",
    Filas: "Rever escala de caixas e tempo maximo de espera por faixa horaria.",
    Preco: "Auditar etiqueta, leitor, oferta e divergencia no caixa.",
    Frios: "Revisar rotulagem, manipulacao e conferencia do balcao de frios.",
  };
  return decisions[theme] ?? "Definir responsavel, prazo e evidencia para o principal ponto critico.";
}

function themeRiskWeight(theme: string) {
  const weights: Record<string, number> = {
    Higiene: 35,
    Validade: 35,
    Carnes: 30,
    Refrigeracao: 30,
    "Controle de pragas": 30,
    Seguranca: 25,
    Frios: 20,
    Acougue: 20,
    "Divergencia de preco": 18,
    Filas: 15,
    Caixas: 15,
    Preco: 12,
  };
  return weights[theme] ?? 8;
}

function decisionForTheme(theme: string, negativeComments: number) {
  const prefix = negativeComments >= 2 ? "Abrir plano prioritario" : "Monitorar e validar evidencias";
  const decisions: Record<string, string> = {
    Higiene: "Auditar higiene, limpeza e controle de pragas com evidencia fotografica.",
    Validade: "Auditar validade, temperatura e retirada de pereciveis improprios.",
    Carnes: "Revisar cadeia fria, embalagem, lote e rotina do setor de carnes.",
    Seguranca: "Revisar abordagem, cameras, ronda e registro de ocorrencias.",
    Filas: "Rever escala, gatilho de abertura de caixas e tempo maximo de espera.",
    Preco: "Auditar etiqueta, oferta, leitor e divergencia no caixa.",
    Frios: "Revisar manipulacao, rotulagem e conferencia de entrega no balcao.",
  };
  return `${prefix}: ${decisions[theme] ?? "Definir responsavel, prazo e evidencia de conclusao."}`;
}

function actionScore(item: ActionPlanItem) {
  const priorityScore = item.priority === "Alta" ? 60 : item.priority === "Media" ? 35 : 15;
  const dueScore = item.dueIn.includes("48") ? 25 : item.dueIn.includes("7") ? 15 : 5;
  const riskThemes = ["Higiene", "Validade", "Carnes", "Seguranca", "Controle de pragas", "Refrigeracao"];
  const riskScore = riskThemes.includes(item.theme) ? 15 : 0;
  return priorityScore + dueScore + riskScore;
}

function mostFrequent(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
}
