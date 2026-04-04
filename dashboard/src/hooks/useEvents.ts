import { apiFetch } from "@/lib/api";
import type { GalileoEvent } from "@/lib/dashboard-data";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export function useEventsList() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => apiFetch<GalileoEvent[]>("/api/events"),
  });
}

export function useEventDetail(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["events", id],
    queryFn: () => apiFetch<GalileoEvent>(`/api/events/${id}`),
  });
}

export function useAcceptEventOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agentId }: { eventId: string; agentId: string }) =>
      apiFetch<{ success: boolean }>(`/api/events/${eventId}/agents/${agentId}/accept`, {
        method: "POST",
      }),
    onSuccess: async (_, { eventId, agentId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      queryClient.invalidateQueries({ queryKey: ["negotiations"] });
      queryClient.invalidateQueries({ queryKey: ["negotiations", agentId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
