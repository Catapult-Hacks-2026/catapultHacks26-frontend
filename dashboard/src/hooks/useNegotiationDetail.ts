import { apiFetch } from "@/lib/api";
import type { RawGalileoAgent, RawGalileoEvent, RawNegotiationDetail } from "@/lib/api-types";
import { transformGalileoAgentDetail, transformNegotiationDetail } from "@/lib/transformers";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export type PriceStep = {
  label: string;
  price: number;
  type: "offer" | "negotiated" | "current";
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
      try {
        const raw = await apiFetch<RawNegotiationDetail>(`/negotiations/${id}`);
        return transformNegotiationDetail(raw);
      } catch {
        const agent = await apiFetch<RawGalileoAgent>(`/api/galileo/agents/${id}`);
        let fallbackEvent: RawGalileoEvent | null = null;

        if (agent.event_id) {
          try {
            fallbackEvent = await apiFetch<RawGalileoEvent>(`/api/galileo/events/${agent.event_id}`);
          } catch {
            fallbackEvent = null;
          }
        }

        return transformGalileoAgentDetail(agent, fallbackEvent);
      }
    },
  });
}

export function useAcceptNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean }>(`/negotiations/${id}/approve`, {
        method: "POST",
      }),
    onSuccess: async (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["negotiations", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
