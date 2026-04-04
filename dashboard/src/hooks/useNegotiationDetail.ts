import { apiFetch } from "@/lib/api";
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
    queryFn: () => apiFetch<NegotiationDetail>(`/api/negotiations/${id}`),
  });
}

export function useAcceptNegotiation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean }>(`/api/negotiations/${id}/accept`, {
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
