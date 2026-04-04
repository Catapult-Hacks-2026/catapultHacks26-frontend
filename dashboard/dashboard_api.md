# Galileo Dashboard — API Integration Implementation Plan

All static data currently lives in `src/lib/dashboard-data.ts` and `src/lib/market-insights-data.ts`.
This plan replaces every hardcoded value with live API calls.

---

## 0. Prerequisites — Endpoints to Create

If these endpoints do not already exist in your backend, **create them before starting any phase below**.

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/dashboard/summary` | Total savings, hotel breakdown, active contract count |
| GET | `/api/negotiations` | All agent rows (company, segment, target, negotiated, delta, status) |
| GET | `/api/negotiations/:id` | Single negotiation detail — price path, transcript, activity stream |
| POST | `/api/negotiations/:id/accept` | Accept a closed deal |
| POST | `/api/negotiations` | Launch a new negotiation (from Configure page) |
| GET | `/api/events` | All Galileo events with embedded agents |
| GET | `/api/events/:id` | Single event detail |
| POST | `/api/events/:id/agents/:agentId/accept` | Accept a deal within an event |
| GET | `/api/companies` | Company cards list (name, savings, bookings, type) |
| GET | `/api/companies/:id` | Full company profile — locations, pricing history, booking window scores |
| GET | `/api/companies/:id/negotiations` | Past and active negotiations for a company |
| GET | `/api/market-insights` | Recommendation windows given query params (location, attendees, nights, etc.) |

---

## 1. Shared API Client

**File to create:** `src/lib/api.ts`

Create a thin fetch wrapper used by every hook. It should:
- Prefix all requests with `VITE_API_BASE_URL` (set in `.env`)
- Attach any auth header (Bearer token or API key)
- Throw a typed `ApiError` on non-2xx responses

```ts
// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}
```

Add to `.env`:
```
VITE_API_BASE_URL=https://your-api-host.com
```

---

## 2. React Query Setup

**File to create:** `src/lib/queryClient.ts`

Install React Query if not present:
```bash
npm install @tanstack/react-query
```

```ts
// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
```

Wrap the app in `src/main.tsx`:
```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## 3. Phase 1 — Dashboard Summary (`/`)

**Page:** `src/pages/DashboardPage.tsx`
**Currently hardcoded:** `$686K` total savings, `$686K` hotels stat, `across 7 contracts`, first 3 rows of `agentRows`

### 3a. Create hook `src/hooks/useDashboardSummary.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type DashboardSummary = {
  totalSavedThisYear: string;       // e.g. "$686K"
  savingsDelta: string;             // e.g. "↑ 17.3%"
  hotelsSaved: string;              // e.g. "$686K"
  contractCount: number;            // e.g. 7
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => apiFetch<DashboardSummary>("/api/dashboard/summary"),
  });
}
```

### 3b. Create hook `src/hooks/useNegotiations.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { AgentStatus } from "@/lib/dashboard-data";

export type NegotiationRow = {
  id: string;
  company: string;
  segment: string;
  target: string;
  negotiated: string;
  delta: string;
  deltaTone: string;
  status: AgentStatus;
};

export function useNegotiations() {
  return useQuery({
    queryKey: ["negotiations"],
    queryFn: () => apiFetch<NegotiationRow[]>("/api/negotiations"),
  });
}
```

### 3c. Update `DashboardPage.tsx`

- Replace `import { agentRows }` with `useNegotiations()`
- Replace `import { useDashboardSummary }` for the stats card
- Show a skeleton or spinner while `isLoading`
- Render `data?.slice(0, 3)` for the table preview

---

## 4. Phase 2 — All Agents Page (`/all-agents`)

**Page:** `src/pages/AllAgentsPage.tsx`
**Currently hardcoded:** full `agentRows` array

### Update `AllAgentsPage.tsx`

Reuse `useNegotiations()` from Phase 1. Replace:
```ts
// before
import { agentRows } from "@/lib/dashboard-data";
// after
const { data: agentRows = [], isLoading } = useNegotiations();
```

The counts (`activeCalls`, `queuedOrWrapping`, `closedDeals`) derive from `agentRows` client-side — no change needed there.

---

## 5. Phase 3 — Negotiation Agent Page (`/negotiations/:id/agent`)

**Page:** `src/pages/NegotiationAgentPage.tsx`
**Currently hardcoded:** `pricePath` array, `activityStream`, transcript messages, target/current price stats

### 5a. Create hook `src/hooks/useNegotiationDetail.ts`

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export type PriceStep = {
  label: string;
  price: number;
  type: "offer" | "negotiated" | "current";
};

export type ActivityItem = {
  price: string;
  badge: string | null;
  badgeTone: string;
  detail: string;
  detailTone?: string;
  time: string;
  active: boolean;
};

export type TranscriptMessage = {
  sender: "agent" | "supplier";
  body: string;
  timestamp: string;
  label: string;
};

export type NegotiationDetail = {
  id: string;
  company: string;
  segment: string;
  targetPrice: string;
  currentPrice: string;
  negotiatedPrice: string;
  savingsToDate: string;
  distanceToGoal: string;
  pricePath: PriceStep[];
  activityStream: ActivityItem[];
  transcript: TranscriptMessage[];
  status: string;
  isAccepted: boolean;
};

export function useNegotiationDetail(id: string) {
  return useQuery({
    queryKey: ["negotiations", id],
    queryFn: () => apiFetch<NegotiationDetail>(`/api/negotiations/${id}`),
    enabled: !!id,
  });
}

export function useAcceptNegotiation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/negotiations/${id}/accept`, { method: "POST" }),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["negotiations", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
```

### 5b. Update `NegotiationAgentPage.tsx`

- Remove hardcoded `pricePath` constant
- Remove `activityStream` import from `dashboard-data`
- Call `useNegotiationDetail(id)` and destructure `pricePath`, `activityStream`, `transcript`, `targetPrice`, `currentPrice`
- Wire `useAcceptNegotiation()` to the Accept Offer button
- Show loading skeleton while fetching

---

## 6. Phase 4 — Events Pages (`/events`, `/events/:id`)

**Pages:** `src/pages/EventsPage.tsx`, `src/pages/EventDetailPage.tsx`
**Context:** `src/context/EventsContext.tsx`
**Currently hardcoded:** `initialEvents` array

### 6a. Create hook `src/hooks/useEvents.ts`

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { GalileoEvent } from "@/lib/dashboard-data";

export function useEventsList() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => apiFetch<GalileoEvent[]>("/api/events"),
  });
}

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => apiFetch<GalileoEvent>(`/api/events/${id}`),
    enabled: !!id,
  });
}

export function useAcceptEventOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, agentId }: { eventId: string; agentId: string }) =>
      apiFetch(`/api/events/${eventId}/agents/${agentId}/accept`, { method: "POST" }),
    onSuccess: (_, { eventId }) => {
      qc.invalidateQueries({ queryKey: ["events", eventId] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
```

### 6b. Update `EventsContext.tsx`

Replace the `initialEvents` seed state with the API hooks. The context can continue to wrap the accept logic but delegate to `useAcceptEventOffer`. The `isEventComplete` helper remains client-side.

### 6c. Update `EventsPage.tsx` and `EventDetailPage.tsx`

Replace all reads of `initialEvents` with `useEventsList()` / `useEventDetail(id)`.
Replace `acceptOffer` calls with `useAcceptEventOffer().mutate(...)`.

---

## 7. Phase 5 — Companies Pages (`/companies`, `/companies/:id`)

**Pages:** `src/pages/CompaniesPage.tsx`, `src/pages/CompanyDetailPage.tsx`
**Currently hardcoded:** `companyCards`, `companyProfiles` in `dashboard-data.ts`

### 7a. Create hook `src/hooks/useCompanies.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { CompanyCard, FullCompanyProfile } from "@/lib/dashboard-data";

export function useCompanyCards() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => apiFetch<CompanyCard[]>("/api/companies"),
  });
}

export function useCompanyProfile(id: string) {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: () => apiFetch<FullCompanyProfile>(`/api/companies/${id}`),
    enabled: !!id,
  });
}
```

### 7b. Update `CompaniesPage.tsx`

Replace `import { companyCards }` with `useCompanyCards()`.

### 7c. Update `CompanyDetailPage.tsx`

Replace `getSupplierProfile(id)` and `getFullCompanyProfile(id)` with `useCompanyProfile(id)`.
The pricing chart, booking window, and events table all read from `data` once loaded.

---

## 8. Phase 6 — Configure & Launch Negotiation (`/negotiations/configure`, `/negotiations/setup`)

**Pages:** `src/pages/ConfigureNegotiationPage.tsx`, `src/pages/NegotiationShellPage.tsx`
**Currently hardcoded:** market price `$382`, predicted `$318`

### 8a. Add market preview to negotiation hook

The setup page market card should show live market rates for the selected location/dates. Extend `useNegotiationDetail` or create a lightweight:

```ts
export function useMarketPreview(location: string, dates: string) {
  return useQuery({
    queryKey: ["market-preview", location, dates],
    queryFn: () =>
      apiFetch<{ market: string; predicted: string; unit: string }>(
        `/api/market-insights/preview?location=${encodeURIComponent(location)}&dates=${encodeURIComponent(dates)}`
      ),
    enabled: !!location,
  });
}
```

### 8b. Create mutation `useLaunchNegotiation`

```ts
export function useLaunchNegotiation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      eventName: string;
      service: string;
      startDate: string;
      endDate: string;
      location: string;
      attendees: number;
      requirements: string;
      idealPrice: number;
      ceilingPrice: number;
    }) => apiFetch<{ negotiationId: string }>("/api/negotiations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["negotiations"] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
```

Wire the "Launch Agent" button in `NegotiationShellPage` to `useLaunchNegotiation().mutate(...)`, then navigate to `/negotiations/:returnedId/agent` on success.

---

## 9. Phase 7 — Market Insights / Event Timing (`/event-timing`)

**Component:** `src/components/dashboard/MarketInsightsChat.tsx`
**Currently:** already calls `app/actions/travel-intelligence` on the Next.js landing page side

### 9a. Create hook `src/hooks/useMarketInsights.ts`

```ts
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { MarketInsightsQuery } from "@/lib/market-insights-data";

export type RecommendationWindow = {
  label: string;
  range: string;
  explanation: string;
  marketCost: string;
  negotiatedPrice: string;
  savings: string;
  probability: string;
};

export function useMarketInsights() {
  return useMutation({
    mutationFn: (query: MarketInsightsQuery) =>
      apiFetch<RecommendationWindow[]>("/api/market-insights", {
        method: "POST",
        body: JSON.stringify(query),
      }),
  });
}
```

### 9b. Update `MarketInsightsChat.tsx` and `MarketInsightsResultsPage.tsx`

Replace `recommendationWindows` import with `useMarketInsights().mutate(query)`.
Show loading state while the mutation is pending.
Pass the returned windows array to the results page (via router state or a shared query key).

---

## 10. Error & Loading States

Add a shared `Skeleton` component at `src/components/ui/Skeleton.tsx`:

```tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-container ${className}`} />
  );
}
```

Every page that calls a hook should render skeletons while `isLoading` and an inline error notice when `isError`. Keep it simple — no full-page error boundaries needed for MVP.

---

## 11. Remove Static Data

Once all phases are complete and verified against the live API:

1. Delete the static arrays from `src/lib/dashboard-data.ts`:
   - `agentRows`
   - `companyCards`
   - `companyProfiles`
   - `supplierNegotiations`
   - `activityStream`
   - `initialEvents`

2. Delete `src/lib/market-insights-data.ts` `recommendationWindows` array.

3. Keep all **type exports** in `dashboard-data.ts` — they are still used by hooks and components.

---

## 12. Implementation Order

| Phase | File(s) changed | Depends on |
|-------|----------------|------------|
| 1 — API client + React Query | `src/lib/api.ts`, `src/lib/queryClient.ts`, `src/main.tsx` | Nothing — do this first |
| 2 — Dashboard summary | `src/hooks/useDashboardSummary.ts`, `DashboardPage.tsx` | Phase 1 |
| 3 — Negotiations list | `src/hooks/useNegotiations.ts`, `DashboardPage.tsx`, `AllAgentsPage.tsx` | Phase 1 |
| 4 — Negotiation detail | `src/hooks/useNegotiationDetail.ts`, `NegotiationAgentPage.tsx` | Phase 3 |
| 5 — Events | `src/hooks/useEvents.ts`, `EventsContext.tsx`, `EventsPage.tsx`, `EventDetailPage.tsx` | Phase 1 |
| 6 — Companies | `src/hooks/useCompanies.ts`, `CompaniesPage.tsx`, `CompanyDetailPage.tsx` | Phase 1 |
| 7 — Launch negotiation | `useLaunchNegotiation`, `ConfigureNegotiationPage.tsx`, `NegotiationShellPage.tsx` | Phase 3 |
| 8 — Market insights | `src/hooks/useMarketInsights.ts`, `MarketInsightsChat.tsx` | Phase 1 |
| 9 — Cleanup | Remove static arrays from `dashboard-data.ts` | All phases |
