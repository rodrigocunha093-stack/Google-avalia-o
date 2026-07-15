import { z } from "zod";
import { TARGET_QUERIES, demoStores } from "./demo-data";
import type { PublicStore } from "./types";

const placeSchema = z.object({
  id: z.string(),
  displayName: z.object({ text: z.string() }),
  formattedAddress: z.string().optional(),
  nationalPhoneNumber: z.string().optional(),
  websiteUri: z.string().optional(),
  googleMapsUri: z.string().optional(),
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  businessStatus: z.string().optional(),
  location: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
  regularOpeningHours: z.object({ weekdayDescriptions: z.array(z.string()).optional() }).optional(),
  reviews: z
    .array(
      z.object({
        name: z.string().optional(),
        rating: z.number().optional(),
        relativePublishTimeDescription: z.string().optional(),
        text: z.object({ text: z.string().optional() }).optional(),
        authorAttribution: z.object({ displayName: z.string().optional() }).optional(),
        publishTime: z.string().optional(),
      }),
    )
    .optional(),
});

export async function fetchPublicPlaces(): Promise<PublicStore[]> {
  if (!process.env.GOOGLE_MAPS_API_KEY) return demoStores;
  const results = await Promise.all(TARGET_QUERIES.map((query) => searchAndDetail(query)));
  return results.filter(Boolean) as PublicStore[];
}

async function searchAndDetail(query: string): Promise<PublicStore | null> {
  const search = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({ textQuery: query, languageCode: "pt-BR", regionCode: "BR" }),
  });

  if (!search.ok) throw new Error(`Text Search falhou para ${query}: ${search.status}`);
  const searchBody = (await search.json()) as { places?: { id: string }[] };
  const placeId = searchBody.places?.[0]?.id;
  if (!placeId) return null;

  const detail = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,googleMapsUri,rating,userRatingCount,businessStatus,location,regularOpeningHours,reviews",
    },
  });

  if (!detail.ok) throw new Error(`Place Details falhou para ${query}: ${detail.status}`);
  const place = placeSchema.parse(await detail.json());
  const slug = slugify(query);

  return {
    id: slug,
    slug,
    query,
    internalName: query,
    displayName: place.displayName.text,
    placeId: place.id,
    formattedAddress: place.formattedAddress ?? "",
    nationalPhoneNumber: place.nationalPhoneNumber,
    websiteUri: place.websiteUri,
    googleMapsUri: place.googleMapsUri ?? `https://www.google.com/maps/search/?api=1&query_place_id=${place.id}`,
    rating: place.rating ?? 0,
    userRatingCount: place.userRatingCount ?? 0,
    regularOpeningHours: place.regularOpeningHours?.weekdayDescriptions ?? [],
    businessStatus: place.businessStatus ?? "UNKNOWN",
    neighborhood: inferNeighborhood(query, place.formattedAddress),
    latitude: place.location?.latitude ?? 0,
    longitude: place.location?.longitude ?? 0,
    dataSource: "GOOGLE_PLACES_PUBLIC",
    reviews:
      place.reviews?.slice(0, 5).map((review, index) => ({
        id: `${place.id}-${index}`,
        storeId: slug,
        authorName: review.authorAttribution?.displayName ?? "Avaliador Google",
        rating: review.rating ?? 0,
        relativePublishTimeDescription: review.relativePublishTimeDescription ?? "",
        text: review.text?.text ?? "",
        publishTime: review.publishTime,
        dataSource: "GOOGLE_PLACES_PUBLIC",
      })) ?? [],
  };
}

function inferNeighborhood(query: string, address?: string) {
  const known = ["Bairro dos Estados", "Manaira", "Intermares", "Cristo", "Torre"];
  return known.find((bairro) => normalize(query).includes(normalize(bairro))) ?? address?.split(",")[0] ?? "Joao Pessoa";
}

function slugify(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
