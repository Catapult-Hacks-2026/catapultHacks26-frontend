import { apiFetch } from "@/lib/api";
import type {
  RawEnterpriseCompanySummary,
  RawGalileoCompany,
} from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import type { FullCompanyProfile } from "@/lib/dashboard-data";
import { transformCompanyCard, transformCompanyProfile } from "@/lib/transformers";
import { useQuery } from "@/lib/queryClient";

export type CompanyProfileResponse = FullCompanyProfile & {
  id: string;
  name: string;
  type: "Hotel";
  totalSavings: string;
  bookings: string;
};

export function useCompanyCards() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const raw = await apiFetch<RawGalileoCompany[]>("/api/galileo/companies");
      return raw.map(transformCompanyCard);
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
