import { NextResponse } from "next/server";
import { fetchPublicPlaces } from "@/lib/google-places";

export async function GET() {
  const stores = await fetchPublicPlaces();
  return NextResponse.json({
    dataSource: "GOOGLE_PLACES_PUBLIC",
    mode: process.env.GOOGLE_MAPS_API_KEY ? "google_places_api" : "local_demo_seed",
    stores,
    limitation:
      "A Places API retorna uma selecao limitada de avaliacoes definida pelo Google; nao representa o historico completo.",
  });
}
