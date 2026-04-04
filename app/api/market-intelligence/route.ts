import { NextResponse } from "next/server";
import {
  getChicagoMarketIntelligence,
  getChicagoMarketIntelligenceFresh,
} from "@/app/actions/travel-intelligence";

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceFresh = url.searchParams.get("fresh") === "1";
    const data = forceFresh
      ? await getChicagoMarketIntelligenceFresh()
      : await getChicagoMarketIntelligence();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "x-market-source": forceFresh ? "fresh" : "cache",
        "cache-control": forceFresh ? "no-store" : "public, max-age=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load market data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
