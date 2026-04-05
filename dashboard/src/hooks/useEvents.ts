import { apiFetch } from "@/lib/api";
import type { RawGalileoEvent } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import { transformEvent } from "@/lib/transformers";
import { useMutation, useQuery, useQueryClient } from "@/lib/queryClient";

export function useEventsList() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const raw = await apiFetch<RawGalileoEvent[]>(
        `/api/galileo/enterprises/${ENTERPRISE_ID}/events`,
      );
      return raw.map(transformEvent);
    },
  });
}

export function useEventDetail(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["events", id],
    queryFn: async () => {
      const raw = await apiFetch<RawGalileoEvent>(`/api/galileo/events/${id}`);
      return transformEvent(raw);
    },
  });
}

export function useAcceptEventOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, agentId }: { eventId: string; agentId: string }) =>
      apiFetch<{ success: boolean }>(`/api/galileo/events/${eventId}/agents/${agentId}/accept`, {
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
