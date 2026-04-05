import { apiFetch } from "@/lib/api";
import type { RawEnterprise } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import { transformEnterpriseSummary } from "@/lib/transformers";
import { useQuery } from "@/lib/queryClient";

export type DashboardSummary = {
  totalSavedThisYear: string;
  savingsDelta: string;
  hotelsSaved: string;
  contractCount: number;
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const raw = await apiFetch<RawEnterprise>(`/api/galileo/enterprises/${ENTERPRISE_ID}`);
      return transformEnterpriseSummary(raw);
    },
  });
}
