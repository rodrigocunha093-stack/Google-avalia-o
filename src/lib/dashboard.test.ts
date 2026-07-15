import { describe, expect, it } from "vitest";
import { calculateWeightedAverage, getDemoDashboard } from "./dashboard";

describe("dashboard", () => {
  it("calcula media ponderada por quantidade de avaliacoes", () => {
    const value = calculateWeightedAverage([
      { rating: 5, userRatingCount: 10 },
      { rating: 3, userRatingCount: 30 },
    ]);

    expect(value).toBe(3.5);
  });

  it("mantem dados simulados separados dos dados publicos", () => {
    const dashboard = getDemoDashboard({});

    expect(dashboard.summary.unitsFound).toBe(7);
    expect(dashboard.stores.every((store) => store.dataSource === "GOOGLE_PLACES_PUBLIC")).toBe(true);
    expect(dashboard.futureWeeklyReport.every((metric) => metric.dataSource === "DEMO_SIMULATED")).toBe(true);
  });

  it("usa os dados publicos informados manualmente para lojas revisadas", () => {
    const dashboard = getDemoDashboard({});
    const byId = new Map(dashboard.stores.map((store) => [store.id, store]));

    expect(byId.get("bairro-dos-estados")?.rating).toBe(4.3);
    expect(byId.get("bairro-dos-estados")?.userRatingCount).toBe(5112);
    expect(byId.get("manaira")?.rating).toBe(4.5);
    expect(byId.get("manaira")?.userRatingCount).toBe(2888);
    expect(byId.get("mega-atacarejo")?.rating).toBe(4.3);
    expect(byId.get("mega-atacarejo")?.userRatingCount).toBe(909);
    expect(byId.get("altiplano")?.rating).toBe(4.4);
    expect(byId.get("altiplano")?.userRatingCount).toBe(92);
    expect(byId.get("torre")?.rating).toBe(4.4);
    expect(byId.get("torre")?.userRatingCount).toBe(1379);
    expect(byId.get("cristo")?.rating).toBe(4.2);
    expect(byId.get("cristo")?.userRatingCount).toBe(2188);
  });

  it("filtra feedbacks simulados por ultima semana e tema", () => {
    const dashboard = getDemoDashboard({ period: "ultima-semana", theme: "Filas" });

    expect(dashboard.weeklyFeedbacks).toHaveLength(2);
    expect(dashboard.weeklyFeedbacks.every((feedback) => feedback.theme === "Filas")).toBe(true);
    expect(dashboard.weeklyFeedbacks.every((feedback) => feedback.dataSource === "DEMO_SIMULATED")).toBe(true);
  });

  it("monta uma central de acao com fila priorizada", () => {
    const dashboard = getDemoDashboard({});

    expect(dashboard.actionCommandCenter.criticalActions).toBeGreaterThan(0);
    expect(dashboard.actionCommandCenter.dueSoonActions).toBeGreaterThan(0);
    expect(dashboard.actionCommandCenter.actionQueue[0]?.score).toBeGreaterThanOrEqual(
      dashboard.actionCommandCenter.actionQueue.at(-1)?.score ?? 0,
    );
    expect(dashboard.actionCommandCenter.weeklyRitual).toContain("Definir responsavel, prazo e evidencia esperada");
  });

  it("filtra comentarios disponiveis por tema", () => {
    const dashboard = getDemoDashboard({ theme: "Filas" });

    expect(dashboard.reviewSamples.length).toBeGreaterThan(0);
    expect(dashboard.reviewSamples.every((review) => review.text.toLowerCase().includes("fila"))).toBe(true);
  });

  it("mantem temas identificados sem duplicidade para chaves estaveis na interface", () => {
    const dashboard = getDemoDashboard({});

    expect(new Set(dashboard.themes).size).toBe(dashboard.themes.length);
    expect(dashboard.themes.filter((theme) => theme === "Validade")).toHaveLength(1);
    expect(dashboard.themes.filter((theme) => theme === "Controle de pragas")).toHaveLength(1);
  });

  it("prioriza temas por comentarios negativos, volume e risco operacional", () => {
    const dashboard = getDemoDashboard({});
    const highPriorityThemes = dashboard.themeDecisionReport
      .filter((item) => item.priority === "Alta")
      .map((item) => item.theme);

    expect(highPriorityThemes).toContain("Validade");
    expect(dashboard.themeDecisionReport[0]?.score).toBeGreaterThanOrEqual(
      dashboard.themeDecisionReport.at(-1)?.score ?? 0,
    );
    expect(dashboard.themeDecisionReport.every((item) => item.negativeComments >= 0)).toBe(true);
  });

  it("gera matriz territorial de decisao por loja", () => {
    const dashboard = getDemoDashboard({});

    expect(dashboard.storeDecisionReport).toHaveLength(dashboard.stores.length);
    expect(dashboard.storeDecisionReport[0]?.score).toBeGreaterThanOrEqual(
      dashboard.storeDecisionReport.at(-1)?.score ?? 0,
    );
    expect(dashboard.storeDecisionReport.some((store) => store.priority === "Alta")).toBe(true);
  });

  it("inclui avaliacoes de menor classificacao para Altiplano", () => {
    const dashboard = getDemoDashboard({ store: "altiplano" });

    expect(dashboard.reviewSamples.some((review) => review.rating <= 2)).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("autoatendimento"))).toBe(true);
  });

  it("inclui avaliacoes de baixa classificacao para Bairro dos Estados", () => {
    const dashboard = getDemoDashboard({ store: "bairro-dos-estados" });

    expect(dashboard.reviewSamples.some((review) => review.rating <= 2)).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("seguranca"))).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("etiqueta"))).toBe(true);
  });

  it("inclui avaliacoes de baixa classificacao para Manaira", () => {
    const dashboard = getDemoDashboard({ store: "manaira" });

    expect(dashboard.reviewSamples.some((review) => review.rating <= 2)).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("seguranca"))).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("carne"))).toBe(true);
  });

  it("inclui avaliacoes de baixa classificacao para Cristo", () => {
    const dashboard = getDemoDashboard({ store: "cristo" });

    expect(dashboard.reviewSamples.some((review) => review.rating <= 2)).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("acougue"))).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("vencido"))).toBe(true);
  });

  it("inclui avaliacoes de baixa classificacao para Torre", () => {
    const dashboard = getDemoDashboard({ store: "torre" });

    expect(dashboard.reviewSamples.some((review) => review.rating <= 2)).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("fila"))).toBe(true);
    expect(dashboard.reviewSamples.some((review) => review.text.toLowerCase().includes("mofados"))).toBe(true);
  });

  it("altera serie do grafico por periodo", () => {
    const dashboard = getDemoDashboard({ ratingPeriod: "mensal" });

    expect(dashboard.ratingPeriod).toBe("mensal");
    expect(dashboard.ratingTrend[0].label).toBe("6 meses atras");
    expect(dashboard.ratingTrend.at(-1)?.label).toBe("Mes atual");
    expect(dashboard.ratingTrend.every((point) => point.dataSource === "DEMO_SIMULATED")).toBe(true);
  });

  it("deixa claro qual semana e a mais recente", () => {
    const dashboard = getDemoDashboard({ ratingPeriod: "semanal" });

    expect(dashboard.ratingTrend[0].label).toBe("6 sem atras");
    expect(dashboard.ratingTrend.at(-1)?.label).toBe("Semana atual");
  });
});
