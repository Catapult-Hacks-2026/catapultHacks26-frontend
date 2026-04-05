import { apiFetch } from "@/lib/api";
import type { RawMarketPricingResponse } from "@/lib/api-types";

export const GALILEO_MARKET_PRICING_ENDPOINT = "/api/galileo/market/pricing";

export type NegotiationPricingRequest = {
  service: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
};

export type NegotiationPricing = {
  market: string;
  predicted: string;
  unit: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function readNumericValue(...values: Array<number | string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const normalized = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));

      if (Number.isFinite(normalized)) {
        return normalized;
      }
    }
  }

  return null;
}

export async function fetchNegotiationPricing(
  payload: NegotiationPricingRequest,
): Promise<NegotiationPricing> {
  const response = await apiFetch<RawMarketPricingResponse>(
    GALILEO_MARKET_PRICING_ENDPOINT,
    {
      body: JSON.stringify(payload),
      method: "POST",
    },
  );

  const serviceKey = payload.service.toLowerCase() as "hotel" | "airline";
  const serviceData = response[serviceKey];

  const marketValue = readNumericValue(
    serviceData?.marketPrice,
    response.expectedMarketPrice,
    response.expected_market_price,
    response.marketPrice,
    response.market_price,
  );
  const predictedValue = readNumericValue(
    serviceData?.predictedWinPrice,
    response.predictedWin,
    response.predicted_win,
    response.winPrice,
    response.win_price,
  );

  return {
    market: formatCurrency(marketValue ?? 0),
    predicted: formatCurrency(predictedValue ?? 0),
    unit: serviceData?.unit ?? response.unit?.trim() ?? "per night",
  };
}
