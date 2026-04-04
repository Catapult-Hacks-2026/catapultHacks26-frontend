import { apiFetch } from "@/lib/api";
import type { CompanyCard, FullCompanyProfile } from "@/lib/dashboard-data";
import { useQuery } from "@/lib/queryClient";
import type { NegotiationRow } from "@/hooks/useNegotiations";

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
    queryFn: () => apiFetch<CompanyCard[]>("/api/companies"),
  });
}

export function useCompanyProfile(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["companies", id],
    queryFn: () => apiFetch<CompanyProfileResponse>(`/api/companies/${id}`),
  });
}

export function useCompanyNegotiations(id: string) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["companies", id, "negotiations"],
    queryFn: () => apiFetch<NegotiationRow[]>(`/api/companies/${id}/negotiations`),
  });
}
