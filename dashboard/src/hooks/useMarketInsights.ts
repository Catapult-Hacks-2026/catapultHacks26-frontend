import type { MarketInsightsQuery } from "@/lib/market-insights-data";
import { recommendationWindows } from "@/lib/market-insights-data";
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
    mutationFn: async (_query: MarketInsightsQuery) => recommendationWindows,
  });
}
