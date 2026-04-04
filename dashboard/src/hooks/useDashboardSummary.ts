import { apiFetch } from "@/lib/api";
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
    queryFn: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
  });
}
