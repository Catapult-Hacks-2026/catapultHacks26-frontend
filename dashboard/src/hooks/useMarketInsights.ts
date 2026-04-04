import { apiFetch } from "@/lib/api";
import type { MarketInsightsQuery } from "@/lib/market-insights-data";
import { useMutation } from "@/lib/queryClient";

export type RecommendationWindow = {
  label: string;
  range: string;
  explanation: string;
  marketCost: string;
  negotiatedPrice: string;
  savings: string;
  probability: string;
};

export function useMarketInsights() {
  return useMutation({
    mutationFn: (query: MarketInsightsQuery) =>
      apiFetch<RecommendationWindow[]>("/api/market-insights", {
        body: JSON.stringify(query),
        method: "POST",
      }),
  });
}
