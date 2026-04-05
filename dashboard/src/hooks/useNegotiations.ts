import { apiFetch } from "@/lib/api";
import type { RawGalileoAgent, RawNegotiation } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import type { AgentStatus } from "@/lib/dashboard-data";
import { recommendationWindows } from "@/lib/market-insights-data";
import {
  formatCurrency,
  mapNegotiationStatus,
  transformNegotiationRow,
} from "@/lib/transformers";
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
    queryFn: async () => {
      try {
        const raw = await apiFetch<RawNegotiation[]>("/negotiations");
        return raw.map((item) => transformNegotiationRow(item));
      } catch {
        const raw = await apiFetch<RawGalileoAgent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/agents`,
        );

        return raw.map((agent) => {
          const company = agent.vendor_name ?? agent.company ?? agent.company_name ?? agent.name ?? "Supplier";
          const target = agent.original_price ?? agent.market_price ?? null;
          const negotiated =
            agent.negotiated_price ??
            agent.current_price ??
            agent.current_offer?.unit_price ??
            null;
          const delta =
            typeof target === "number" && typeof negotiated === "number" && target > 0
              ? ((target - negotiated) / target) * 100
              : null;

          return {
            company,
            delta: delta === null ? "—" : `(${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%)`,
            deltaTone:
              delta !== null && delta < 0 ? "text-error" : "text-on-tertiary-container",
            id: agent.id,
            negotiated: formatCurrency(negotiated, 2),
            segment: "Hospitality",
            status: mapNegotiationStatus(agent.outcome ?? agent.status),
            target: formatCurrency(target, 2),
          };
        });
      }
    },
  });
}

export function useMarketPreview(location: string, dates: string) {
  return useQuery({
    enabled: Boolean(location),
    queryKey: ["market-preview", location, dates],
    queryFn: async () => {
      const window = recommendationWindows[0];
      return {
        market: window.marketCost,
        predicted: window.negotiatedPrice,
        unit: dates ? `for ${location} during ${dates}` : `for ${location}`,
      };
    },
  });
}

export function useLaunchNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LaunchNegotiationPayload) =>
      apiFetch<{ negotiationId: string } | { eventId: string }>(
        "/api/galileo/negotiations/launch",
        {
        body: JSON.stringify(payload),
        method: "POST",
        },
      ),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
