import { apiFetch } from "@/lib/api";
import type { EnterpriseAgent, RawGalileoEvent } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import type { AgentStatus } from "@/lib/dashboard-data";
import {
  formatCurrency,
  mapNegotiationStatus,
} from "@/lib/transformers";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export type NegotiationRow = {
  id: string;
  enterpriseId: string;
  eventId: string;
  companyId: string;
  company: string;
  segment: string;
  target: string;
  negotiated: string;
  idealPrice: number;
  ceilingPrice: number;
  marketPrice: number;
  currentPrice: number;
  isAccepted: boolean;
  outcome: string | null;
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
  budgetPerPerson: number;
  requirements: string;
  guardrails: {
    hotel: {
      idealPrice: number;
      ceilingPrice: number;
    };
    airline: {
      idealPrice: number;
      ceilingPrice: number;
    };
  };
};

export function useNegotiations() {
  return useQuery({
    queryKey: ["negotiations"],
    queryFn: async () => {
      const raw = await apiFetch<EnterpriseAgent[]>(
        `/api/galileo/enterprises/${ENTERPRISE_ID}/agents`,
      );

      return raw.map((agent) => {
        const company = agent.companyName ?? "Supplier";
        const target = agent.idealPrice ?? null;
        const negotiated = agent.currentPrice ?? null;
        const delta =
          typeof target === "number" && typeof negotiated === "number" && target > 0
            ? ((target - negotiated) / target) * 100
            : null;

        return {
          id: agent.id,
          enterpriseId: agent.enterpriseId,
          eventId: agent.eventId,
          companyId: agent.companyId,
          company,
          segment: "Hospitality",
          target: formatCurrency(target, 2),
          negotiated: formatCurrency(negotiated, 2),
          idealPrice: agent.idealPrice,
          ceilingPrice: agent.ceilingPrice,
          marketPrice: agent.marketPrice,
          currentPrice: agent.currentPrice,
          isAccepted: agent.isAccepted,
          outcome: agent.outcome,
          delta: delta === null ? "—" : `(${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%)`,
          deltaTone:
            delta !== null && delta < 0 ? "text-error" : "text-on-tertiary-container",
          status: mapNegotiationStatus(agent.outcome ?? agent.status),
        };
      });
    },
  });
}

export function useLaunchNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LaunchNegotiationPayload) =>
      apiFetch<RawGalileoEvent>(
        "/api/galileo/negotiations/launch",
        {
          body: JSON.stringify({
            enterpriseId: ENTERPRISE_ID,
            ...payload,
          }),
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
