import { apiFetch } from "@/lib/api";
import type { EnterpriseAgent, RawEnterprise, RawGalileoEvent } from "@/lib/api-types";
import { ENTERPRISE_ID } from "@/lib/config";
import { formatCurrency, transformEnterpriseSummary, transformEvent } from "@/lib/transformers";
import { useQuery } from "@/lib/queryClient";

export type DashboardSummary = {
  totalSavedThisYear: string;
  savingsDelta: string;
  hotelsSaved: string;
  contractCount: number;
};

function parseMoney(str: string): number {
  return Number.parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const [raw, agents, rawEvents] = await Promise.all([
        apiFetch<RawEnterprise>(`/api/galileo/enterprises/${ENTERPRISE_ID}`),
        apiFetch<EnterpriseAgent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/agents`,
        ),
        apiFetch<RawGalileoEvent[]>(
          `/api/galileo/enterprises/${ENTERPRISE_ID}/events`,
        ),
      ]);

      const base = transformEnterpriseSummary(raw);
      const events = rawEvents.map(transformEvent);
      const completedEvents = events.filter((e) => e.status === "Completed");
      const acceptedAgentIds = new Set(
        agents.filter((a) => a.isAccepted).map((a) => a.id),
      );

      let totalSaved = 0;
      let hotelsSaved = 0;
      let hotelContracts = 0;
      for (const event of completedEvents) {
        for (const agent of event.agents) {
          if (acceptedAgentIds.has(agent.negotiationId) || agent.isAccepted) {
            const savings = parseMoney(agent.savings);
            totalSaved += savings;
            if (agent.type === "Hotel") {
              hotelsSaved += savings;
              hotelContracts += 1;
            }
          }
        }
      }

      return {
        ...base,
        totalSavedThisYear: totalSaved > 0 ? formatCurrency(totalSaved, 0) : base.totalSavedThisYear,
        hotelsSaved: hotelsSaved > 0 ? formatCurrency(hotelsSaved, 0) : base.hotelsSaved,
        contractCount: hotelContracts > 0 ? hotelContracts : base.contractCount,
      };
    },
  });
}
