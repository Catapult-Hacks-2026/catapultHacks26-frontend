import {
  fetchNegotiationPricing,
  type NegotiationPricingRequest,
} from "@/lib/negotiation-pricing";
import { useQuery } from "@/lib/queryClient";

export function useNegotiationPricing(payload: NegotiationPricingRequest | null) {
  return useQuery({
    enabled:
      payload !== null &&
      Boolean(payload.startDate) &&
      Boolean(payload.endDate) &&
      Boolean(payload.location) &&
      payload.attendees > 0,
    queryKey: [
      "negotiation-pricing",
      payload?.service ?? "Hotel",
      payload?.startDate ?? "",
      payload?.endDate ?? "",
      payload?.location ?? "",
      payload?.attendees ?? 0,
    ],
    queryFn: () => {
      if (!payload) {
        throw new Error("Negotiation pricing payload is required.");
      }

      return fetchNegotiationPricing(payload);
    },
  });
}
