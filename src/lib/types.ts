export const DATA_SOURCES = [
  "GOOGLE_PLACES_PUBLIC",
  "DEMO_SIMULATED",
  "GOOGLE_BUSINESS_PROFILE_AUTHORIZED",
] as const;

export type DataSource = (typeof DATA_SOURCES)[number];

export type PublicReviewSample = {
  id: string;
  storeId: string;
  authorName: string;
  rating: number;
  relativePublishTimeDescription: string;
  text: string;
  publishTime?: string;
  dataSource: "GOOGLE_PLACES_PUBLIC";
};

export type PublicStore = {
  id: string;
  slug: string;
  query: string;
  internalName: string;
  displayName: string;
  placeId: string;
  formattedAddress: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri: string;
  rating: number;
  userRatingCount: number;
  regularOpeningHours: string[];
  businessStatus: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  reviews: PublicReviewSample[];
  dataSource: "GOOGLE_PLACES_PUBLIC";
};

export type DemoWeeklyMetric = {
  label: string;
  value: string;
  dataSource: "DEMO_SIMULATED" | "GOOGLE_BUSINESS_PROFILE_AUTHORIZED";
};

export type WeeklyFeedback = {
  id: string;
  storeId: string;
  storeName: string;
  theme: string;
  sentiment: "Elogio" | "Reclamacao" | "Neutro";
  rating: number;
  text: string;
  recommendedAction: string;
  period: "ultima-semana";
  dataSource: "DEMO_SIMULATED";
};

export type ActionPlanItem = {
  id: string;
  priority: "Alta" | "Media" | "Baixa";
  theme: string;
  action: string;
  owner: string;
  dueIn: string;
  evidence: string;
  dataSource: "DEMO_SIMULATED";
};

export type RatingTrendPeriod = "semanal" | "mensal" | "anual";

export type RatingTrendPoint = {
  label: string;
  rating: number;
  reviews: number;
  dataSource: "DEMO_SIMULATED";
};
