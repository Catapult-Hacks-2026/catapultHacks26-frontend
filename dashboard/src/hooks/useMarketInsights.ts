import { apiFetch } from "@/lib/api";
import type { RawEventWindowResult } from "@/lib/api-types";
import { formatCurrency } from "@/lib/transformers";
import { useMutation } from "@/lib/queryClient";

export type EventWindowQuery = {
  location: string;
  eventType: string;
  preferredTiming: string;
  attendees: number;
  nights: number;
  eventDetails: string;
};

export type RecommendationWindow = {
  label: string;
  range: string;
  explanation: string;
  marketCost: string;
  negotiatedPrice: string;
  savings: string;
  probability: string;
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

export function useMarketInsights() {
  return useMutation({
    mutationFn: async (query: EventWindowQuery) => {
      const raw = await apiFetch<RawEventWindowResult[]>(
        "/api/galileo/market/event-window",
        {
          body: JSON.stringify(query),
          method: "POST",
        },
      );

      return raw.map((window) => ({
        label: window.label,
        range: formatDateRange(window.startDate, window.endDate),
        explanation: window.explanation,
        marketCost: `${formatCurrency(window.hotel.marketCost)} / room night`,
        negotiatedPrice: `${formatCurrency(window.hotel.negotiatedPrice)} / room night`,
        savings: `${formatCurrency(window.hotel.savings)} / room night`,
        probability: `${Math.round(window.negotiationConfidence * 100)}% negotiation confidence`,
      }));
    },
  });
}
