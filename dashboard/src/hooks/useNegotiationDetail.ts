import { apiFetch } from "@/lib/api";
import type { RawGalileoAgent, RawGalileoEvent, RawInterveneResponse } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import { transformGalileoAgentDetail } from "@/lib/transformers";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export type PriceStep = {
  label: string;
  price: number;
  type: "offer" | "negotiated" | "current" | "final";
};

export type ActivityItem = {
  price: string;
  badge: string | null;
  badgeTone: string;
  detail: string;
  detailTone?: string;
  time: string;
  active: boolean;
};

export type TranscriptMessage = {
  sender: "agent" | "supplier";
  body: string;
  timestamp: string;
  label: string;
};

export type NegotiationDetail = {
  id: string;
  company: string;
  segment: string;
  targetPrice: string;
  currentPrice: string;
  negotiatedPrice: string;
  originalPrice: number | null;
  savingsToDate: string;
  distanceToGoal: string;
  pricePath: PriceStep[];
  activityStream: ActivityItem[];
  transcript: TranscriptMessage[];
  status: string;
  isAccepted: boolean;
  location: string;
};

export function useNegotiationDetail(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["negotiations", id],
    queryFn: async () => {
      const agent = await apiFetch<RawGalileoAgent>(`/api/galileo/agents/${id}`);
      let fallbackEvent: RawGalileoEvent | null = null;

      if (agent.eventId ?? agent.event_id) {
        try {
          fallbackEvent = await apiFetch<RawGalileoEvent>(
            `/api/galileo/events/${agent.eventId ?? agent.event_id}`,
          );
        } catch {
          fallbackEvent = null;
        }
      }

      return transformGalileoAgentDetail(agent, fallbackEvent);
    },
  });
}

export function useAcceptNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agentId }: { eventId: string; agentId: string }) =>
      apiFetch<RawGalileoEvent>(
        `/api/galileo/events/${eventId}/agents/${agentId}/accept`,
        {
          body: JSON.stringify({ enterpriseId: ENTERPRISE_ID }),
          method: "POST",
        },
      ),
    onSuccess: async (_, { eventId, agentId }) => {
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["negotiations", agentId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useIntervene() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) =>
      apiFetch<RawInterveneResponse>(
        `/api/galileo/agents/${agentId}/intervene`,
        { method: "POST" },
      ),
    onSuccess: async (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["negotiations", agentId] });
    },
  });
}

type PriceChangePayload = {
  agentId: string;
  price: number;
  source: "galileo" | "hotel_rep";
  round?: number;
};

type PriceChangeResult = {
  agentId: string;
  price: number;
  previousPrice: number;
  marketPrice: number;
  source: "galileo" | "hotel_rep";
  round: number;
};

export function usePriceChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, ...body }: PriceChangePayload) =>
      apiFetch<PriceChangeResult>(
        `/api/galileo/agents/${agentId}/price-change`,
        {
          body: JSON.stringify(body),
          method: "POST",
        },
      ),
    onSuccess: async (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: ["negotiations", agentId] });
    },
  });
}

type CloseDealPayload = {
  agentId: string;
  finalPrice: number;
};

type CloseDealResult = {
  agentId: string;
  finalPrice: number;
  marketPrice: number;
  savings: number;
};

export function useCloseDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, finalPrice }: CloseDealPayload) =>
      apiFetch<CloseDealResult>(
        `/api/galileo/agents/${agentId}/close-deal`,
        {
          body: JSON.stringify({ finalPrice, enterpriseId: ENTERPRISE_ID }),
          method: "POST",
        },
      ),
    onSuccess: async (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: ["negotiations", agentId] });
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
