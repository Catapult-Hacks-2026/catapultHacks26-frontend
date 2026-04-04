import { apiFetch } from "@/lib/api";
import type { AgentStatus } from "@/lib/dashboard-data";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export type NegotiationRow = {
  id: string;
  company: string;
  segment: string;
  target: string;
  negotiated: string;
  delta: string;
  deltaTone: string;
  status: AgentStatus;
};

export type MarketPreview = {
  market: string;
  predicted: string;
  unit: string;
};

export type LaunchNegotiationPayload = {
  eventName: string;
  service: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
  requirements: string;
  idealPrice: number;
  ceilingPrice: number;
};

export function useNegotiations() {
  return useQuery({
    queryKey: ["negotiations"],
    queryFn: () => apiFetch<NegotiationRow[]>("/api/negotiations"),
  });
}

export function useMarketPreview(location: string, dates: string) {
  return useQuery({
    enabled: Boolean(location),
    queryKey: ["market-preview", location, dates],
    queryFn: () =>
      apiFetch<MarketPreview>(
        `/api/market-insights/preview?location=${encodeURIComponent(location)}&dates=${encodeURIComponent(dates)}`,
      ),
  });
}

export function useLaunchNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LaunchNegotiationPayload) =>
      apiFetch<{ negotiationId: string }>("/api/negotiations", {
        body: JSON.stringify(payload),
        method: "POST",
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
