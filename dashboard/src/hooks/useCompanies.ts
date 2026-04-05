import { apiFetch } from "@/lib/api";
import type {
  EnterpriseAgent,
  HistoricPricingRecord,
  RawEnterpriseCompanySummary,
  RawGalileoCompany,
  RawGalileoEvent,
} from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import type { FullCompanyProfile } from "@/lib/dashboard-data";
import { transformCompanyCard, transformCompanyProfile, transformEvent } from "@/lib/transformers";
import { useQuery } from "@/lib/queryClient";

export type CompanyProfileResponse = FullCompanyProfile & {
  id: string;
  name: string;
  type: "Hotel";
  totalSavings: string;
  bookings: string;
};

function parseMoney(str: string): number {
  return Number.parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
}

function formatSavings(value: number): string {
  if (value <= 0) return "—";
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function useCompanyCards() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const [raw, agents, rawEvents] = await Promise.all([
        apiFetch<RawGalileoCompany[]>("/api/galileo/companies"),
        apiFetch<EnterpriseAgent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/agents`,
        ),
        apiFetch<RawGalileoEvent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/events`,
        ),
      ]);

      const events = rawEvents.map(transformEvent);
      const completedEvents = events.filter((e) => e.status === "Completed");

      return raw.map((company) => {
        const card = transformCompanyCard(company);

        let totalSavings = 0;
        let totalBookings = 0;

        const acceptedAgentEventIds = new Set(
          agents
            .filter((a) => a.companyId === company.id && a.isAccepted)
            .map((a) => a.eventId),
        );

        for (const event of completedEvents) {
          if (!acceptedAgentEventIds.has(event.id)) continue;
          const acceptedAgent = event.agents.find(
            (a) => a.companyId === company.id && a.isAccepted,
          );
          if (acceptedAgent) {
            totalSavings += parseMoney(acceptedAgent.savings);
            totalBookings += 1;
          }
        }

        return {
          ...card,
          totalSavings: totalSavings > 0 ? formatSavings(totalSavings) : card.totalSavings,
          bookings: totalBookings > 0 ? totalBookings.toLocaleString("en-US") : card.bookings,
        };
      });
    },
  });
}

export function useCompanyProfile(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["companies", id],
    queryFn: async () => {
      const [base, enterpriseSummary] = await Promise.all([
        apiFetch<RawGalileoCompany>(`/api/galileo/companies/${id}`),
        apiFetch<RawEnterpriseCompanySummary>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/companies/${id}`,
        ).catch(() => null),
      ]);

      return transformCompanyProfile(base, enterpriseSummary);
    },
  });
}

export function useCompanyNegotiations(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["companies", id, "negotiations"],
    queryFn: async () => {
      const summary = await apiFetch<RawEnterpriseCompanySummary>(
        `/api/galileo/enterprises/${ENTERPRISE_ID}/companies/${id}`,
      );

      const locations =
        Array.isArray(summary.locations)
          ? summary.locations
          : summary.locations
            ? Object.values(summary.locations)
            : [];

      return locations.flatMap((location) =>
        (location.eventIds ?? location.event_ids ?? []).map((eventId) => ({
          company: summary.name ?? "Company",
          delta: "—",
          deltaTone: "text-on-surface-variant",
          id: `${id}-${eventId}`,
          negotiated: "—",
          segment: location.label ?? "Hotel",
          status: "Completed" as const,
          target: "—",
        })),
      );
    },
  });
}

export function useHistoricPricing(hotel: string | undefined) {
  return useQuery({
    enabled: Boolean(hotel),
    queryKey: ["historic-pricing", hotel],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (hotel) params.set("hotel", hotel);
      return apiFetch<HistoricPricingRecord[]>(
        `/api/hotel-data/historic-pricing?${params.toString()}`,
      );
    },
  });
}

export function useCompanyEvents(companyId: string) {
  return useQuery({
    enabled: Boolean(companyId),
    queryKey: ["companies", companyId, "events"],
    queryFn: async () => {
      const [agents, rawEvents] = await Promise.all([
        apiFetch<EnterpriseAgent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/agents`,
        ),
        apiFetch<RawGalileoEvent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/events`,
        ),
      ]);

      const companyAgents = agents.filter((a) => a.companyId === companyId);
      const companyEventIds = new Set(companyAgents.map((a) => a.eventId));
      const acceptedEventIds = new Set(
        companyAgents.filter((a) => a.isAccepted).map((a) => a.eventId),
      );

      const events = rawEvents
        .filter((e) => companyEventIds.has(e.id))
        .map(transformEvent);

      return events.filter((event) => {
        if (event.status === "Active") {
          return event.agents.some((a) => a.companyId === companyId);
        }
        return acceptedEventIds.has(event.id);
      });
    },
  });
}
