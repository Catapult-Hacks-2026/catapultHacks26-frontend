# Dashboard API Implementation Plan

This document maps every mismatch between the current dashboard frontend and the actual backend API (documented in `api_docs.md`), and provides the exact changes needed to connect them.

---

## Summary of Issues

The dashboard was built against assumed endpoint paths and response shapes that don't match the real backend. The main categories of breakage:

1. **Wrong URL paths** — most hooks prefix `/api/` where the backend doesn't, or omit the `/api/galileo/` prefix where the backend requires it.
2. **Missing enterprise ID** — Galileo endpoints require `enterprise_id` in the path; the dashboard doesn't pass one.
3. **Response shape mismatches** — the backend returns raw DB rows; the dashboard expects pre-formatted display strings (e.g. `"$310.00"` instead of `310`).
4. **Non-existent endpoints** — `GET /api/dashboard/summary`, `POST /api/market-insights`, `GET /api/market-insights/preview` don't exist on the backend.
5. **Wrong action verb** — dashboard calls `/accept`, backend uses `/approve` (for negotiations) and a different path structure (for galileo agents).

---

## Endpoint-by-Endpoint Breakdown

### 1. Dashboard Summary — `useDashboardSummary.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `GET /api/dashboard/summary` | **Does not exist** |

**Fix:** This endpoint doesn't exist on the backend. The summary data must be derived client-side from the Galileo enterprise endpoint.

**Implementation:**
- Change `useDashboardSummary` to call `GET /api/galileo/enterprises/{enterprise_id}`
- The enterprise ID should come from an env var `VITE_ENTERPRISE_ID` or be hardcoded to `"ent_demo"` for now
- Map the response:
  ```
  Backend response:
  {
    "totalSavedHotels": 240000,
    "totalSavedAirlines": 180000,
    "totalSaved": 420000,
    "yoyChange": 14.5,
    "hotelContractCount": 8,
    "airlineContractCount": 4
  }

  Dashboard needs:
  {
    totalSavedThisYear: "$420,000"    ← format(totalSaved)
    savingsDelta: "+14.5%"            ← format(yoyChange)
    hotelsSaved: "$240,000"           ← format(totalSavedHotels)
    contractCount: 12                 ← hotelContractCount + airlineContractCount
  }
  ```
- Add a transformer function in the hook that converts raw numbers to formatted display strings

**File changes:** `src/hooks/useDashboardSummary.ts`

---

### 2. Negotiations List — `useNegotiations.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| List endpoint | `GET /api/negotiations` | `GET /negotiations` |

**Fix:** Remove the `/api` prefix.

**Response shape mismatch:**
```
Backend returns:
{
  "id": "9f7c3b5b-...",
  "vendor_name": "Hilton Hotels",
  "product_category": "hotel",
  "status": "pending",
  "strategy": "balanced",
  "round_number": 0,
  "utility_score": null,
  "current_offer": null
}

Dashboard expects (NegotiationRow):
{
  id: string
  company: string        ← vendor_name
  segment: string        ← product_category (needs formatting)
  target: string         ← NOT available directly (need config from detail endpoint)
  negotiated: string     ← current_offer?.unit_price formatted, or "—"
  delta: string          ← computed from target vs negotiated
  deltaTone: string      ← computed
  status: AgentStatus    ← status (needs mapping: "pending" → "Queued", etc.)
}
```

**Implementation:**
- Change path from `"/api/negotiations"` to `"/negotiations"`
- Add a raw response type matching the backend shape
- Add a transformer that maps backend rows → `NegotiationRow[]`
- Status mapping: `pending` → `"Queued"`, `active`/`negotiating` → `"Negotiating"`, `accepted` → `"Deal Closed"`, `escalated` → `"Moved to higher up"`, `completed` → `"Completed"`, `failed` → `"Failed"`
- For `target` and `delta`: either fetch config inline per-negotiation (expensive), or display `"—"` on the list view and only show these on detail

**File changes:** `src/hooks/useNegotiations.ts`

---

### 3. Negotiation Detail — `useNegotiationDetail.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Detail endpoint | `GET /api/negotiations/{id}` | `GET /negotiations/{id}` |
| Messages | embedded in detail response | embedded in detail response (correct) |
| Scoring | not used | `GET /negotiations/{id}/scoring` (available) |

**Fix:** Remove the `/api` prefix.

**Response shape mismatch:**
```
Backend returns:
{
  "negotiation": {
    "id": "...",
    "vendor_name": "Hilton Hotels",
    "product_category": "hotel",
    "status": "pending",
    "utility_score": 0.71,
    "current_offer": { "unit_price": 189, ... }
  },
  "config": {
    "target_unit_price": 150,
    "max_unit_price": 200,
    ...
  },
  "messages": [
    { "id": 1, "role": "system", "content": "...", "created_at": "..." }
  ]
}

Dashboard expects (NegotiationDetail):
{
  id, company, segment, targetPrice, currentPrice,
  negotiatedPrice, savingsToDate, distanceToGoal,
  pricePath: PriceStep[],
  activityStream: ActivityItem[],
  transcript: TranscriptMessage[],
  status, isAccepted, location
}
```

**Implementation:**
- Change path from `"/api/negotiations/${id}"` to `"/negotiations/${id}"`
- Add raw response type matching backend
- Build transformer:
  - `company` ← `negotiation.vendor_name`
  - `segment` ← `negotiation.product_category`
  - `targetPrice` ← format `config.target_unit_price`
  - `currentPrice` ← format `config.max_unit_price`
  - `negotiatedPrice` ← format `negotiation.current_offer?.unit_price`
  - `savingsToDate` ← compute `config.max_unit_price - current_offer.unit_price`
  - `distanceToGoal` ← compute `current_offer.unit_price - config.target_unit_price`
  - `pricePath` ← derive from messages that contain `structured_data` with price info
  - `activityStream` ← derive from messages (role=system messages → activity items)
  - `transcript` ← derive from messages (role=agent/vendor messages → transcript)
  - `status` ← map negotiation.status
  - `isAccepted` ← `negotiation.status === "accepted"`
  - `location` ← not available directly; may need to be derived from product_category or a separate lookup
- Optionally also call `GET /negotiations/{id}/scoring` and merge the scoring breakdown into the detail view

**File changes:** `src/hooks/useNegotiationDetail.ts`

---

### 4. Accept Negotiation — `useAcceptNegotiation` in `useNegotiationDetail.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `POST /api/negotiations/{id}/accept` | `POST /negotiations/{id}/approve` |

**Fix:**
- Change path from `"/api/negotiations/${id}/accept"` to `"/negotiations/${id}/approve"`
- The action name on the backend is "approve", not "accept"

**File changes:** `src/hooks/useNegotiationDetail.ts`

---

### 5. Launch Negotiation — `useLaunchNegotiation` in `useNegotiations.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `POST /api/negotiations` | `POST /api/galileo/negotiations/launch` (for galileo flow) OR `POST /negotiations` (for basic negotiation) |

**Decision needed:** The dashboard's `ConfigureNegotiationPage` launches event-based negotiations with fields like `eventName`, `startDate`, `endDate`, `attendees`. This maps to the Galileo flow.

**Fix (Galileo path):**
- Change path to `"/api/galileo/negotiations/launch"`
- The backend inserts into `galileo_events`, `galileo_agents`, etc.
- Payload may need restructuring to match what the backend expects (backend schema not fully documented for this POST body — verify against the actual FastAPI route)

**Fix (basic negotiation path):**
- Change path to `"/negotiations"` (no `/api` prefix)
- Only inserts one row into `negotiations` table

**Recommendation:** Use the Galileo launch endpoint since the dashboard is event-centric.

**File changes:** `src/hooks/useNegotiations.ts`

---

### 6. Events List — `useEvents.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| List endpoint | `GET /api/events` | `GET /api/galileo/enterprises/{enterprise_id}/events` |
| Detail endpoint | `GET /api/events/{id}` | `GET /api/galileo/events/{event_id}` |

**Fix:**
- List: change to `"/api/galileo/enterprises/${ENTERPRISE_ID}/events"`
- Detail: change to `"/api/galileo/events/${id}"`
- Add `?status=` query param support for filtering

**Response shape mismatch for events list:**
The backend returns galileo_events with embedded galileo_agents. The dashboard `GalileoEvent` type expects:
```typescript
{
  id, name, location, startDate, endDate,
  attendees, service: "Hotel",
  status: "Active" | "Completed",
  agents: EventAgent[]
}
```
Verify the backend returns these fields. Agent sub-objects likely need transformation similar to negotiations.

**Response shape mismatch for event detail:**
Backend may include `winnerAgentId`, `winnerTranscript`, `winnerPricePath` for completed events. The dashboard doesn't currently use these — consider adding support.

**File changes:** `src/hooks/useEvents.ts`, `src/context/EventsContext.tsx`

---

### 7. Accept Event Offer — `useAcceptEventOffer` in `useEvents.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `POST /api/events/{eventId}/agents/{agentId}/accept` | `POST /api/galileo/events/{eventId}/agents/{agentId}/accept` |

**Fix:** Add the `/api/galileo` prefix.

**File changes:** `src/hooks/useEvents.ts`

---

### 8. Companies — `useCompanies.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| List endpoint | `GET /api/companies` | `GET /api/galileo/companies` |
| Detail endpoint | `GET /api/companies/{id}` | `GET /api/galileo/companies/{id}` |
| Negotiations for company | `GET /api/companies/{id}/negotiations` | `GET /api/galileo/enterprises/{enterprise_id}/companies/{company_id}` |

**Fix:**
- `useCompanyCards`: change to `"/api/galileo/companies"` with optional `?q=` for search
- `useCompanyProfile`: change to `"/api/galileo/companies/${id}"` — backend embeds `locations` from `galileo_locations`
- `useCompanyNegotiations`: change to `"/api/galileo/enterprises/${ENTERPRISE_ID}/companies/${id}"` — this returns linked event history, savings totals, accepted agreements, booking-window data, pricing trends

**Response shape mismatch:**
```
Backend company list:
  galileo_companies rows (id, name, etc.)

Dashboard expects (CompanyCard):
  { id, name, initials, type: "Hotel", totalSavings: "$329,400", positive: true, bookings: "4,821" }
```
Transformer needed: derive `initials` from name, format savings as currency string, etc. Some fields like `totalSavings` and `bookings` may only be available from the enterprise-specific company endpoint, not the base company list.

**File changes:** `src/hooks/useCompanies.ts`

---

### 9. Market Insights — `useMarketInsights.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `POST /api/market-insights` | **Does not exist (out of scope)** |
| Preview | `GET /api/market-insights/preview` | **Does not exist (out of scope)** |

**Fix options:**

**Option A — Keep mock/static data:** Market insights uses AI/LLM-derived recommendations that are computed in-process memory, not SQL. Since these endpoints are out of scope for the SQL-backed API, keep using the static `recommendationWindows` data from `market-insights-data.ts` and the mock API fallback.

**Option B — Use hotel-data endpoints as a proxy:** For the market preview feature, use:
- `GET /api/hotel-data/historic-pricing?hotel={hotel}&location={location}` for market rate data
- `GET /api/hotel-data/past-negotiations?hotel={hotel}&location={location}` for negotiation history

These provide real pricing data that could power a simpler market insights view without the LLM recommendation layer.

**Recommendation:** Option A for now. Mark these as requiring a future backend endpoint.

**File changes:** `src/hooks/useMarketInsights.ts` (minimal — add comment), `src/hooks/useNegotiations.ts` (remove `useMarketPreview` or point to hotel-data)

---

### 10. Market Preview — `useMarketPreview` in `useNegotiations.ts`

| | Current (broken) | Backend (actual) |
|---|---|---|
| Endpoint | `GET /api/market-insights/preview` | **Does not exist** |

**Fix:** Either remove this hook or replace with calls to the hotel-data endpoints:
- `GET /api/hotel-data/historic-pricing?location=${location}`
- `GET /api/hotel-data/past-negotiations?location=${location}`

**File changes:** `src/hooks/useNegotiations.ts`

---

## New Infrastructure Needed

### A. Enterprise ID Configuration

Many Galileo endpoints require `enterprise_id`. Add:

```typescript
// src/lib/config.ts
export const ENTERPRISE_ID = import.meta.env.VITE_ENTERPRISE_ID ?? "ent_demo";
```

Update `.env`:
```
VITE_ENTERPRISE_ID=ent_demo
```

### B. Response Transformer Layer

Add a `src/lib/transformers.ts` file with functions to convert raw backend responses to the display types the UI expects:

```typescript
export function formatCurrency(cents: number): string
export function mapNegotiationStatus(backendStatus: string): AgentStatus
export function transformNegotiationRow(raw: RawNegotiation): NegotiationRow
export function transformNegotiationDetail(raw: RawNegotiationDetail): NegotiationDetail
export function transformEnterpriseSummary(raw: RawEnterprise): DashboardSummary
export function transformCompanyCard(raw: RawCompany): CompanyCard
export function transformEvent(raw: RawGalileoEvent): GalileoEvent
```

### C. Raw Backend Types

Add a `src/lib/api-types.ts` file with TypeScript types matching the exact backend response shapes documented in `api_docs.md`:

```typescript
export type RawNegotiation = {
  id: string;
  vendor_name: string;
  product_category: string;
  status: string;
  strategy: string;
  round_number: number;
  utility_score: number | null;
  current_offer: RawOffer | null;
};

export type RawNegotiationDetail = {
  negotiation: RawNegotiation;
  research_brief: Record<string, unknown>;
  config: RawNegotiationConfig;
  messages: RawMessage[];
};

export type RawEnterprise = {
  id: string;
  name: string;
  description: string;
  totalSavedHotels: number;
  totalSavedAirlines: number;
  totalSaved: number;
  yoyChange: number;
  hotelContractCount: number;
  airlineContractCount: number;
};

// ... etc for all backend shapes
```

### D. SSE Support for Live Streams

The backend provides two SSE endpoints that the dashboard doesn't currently consume:
- `GET /api/galileo/agents/{agent_id}/activity-stream`
- `GET /api/galileo/agents/{agent_id}/transcript`

**Future enhancement:** Add an `useSSE` hook or use `EventSource` to stream live activity and transcript updates into the agent detail view, instead of polling.

---

## Implementation Order

| Priority | Task | Files | Complexity |
|---|---|---|---|
| 1 | Add `config.ts` with ENTERPRISE_ID | `src/lib/config.ts`, `.env` | Low |
| 2 | Add `api-types.ts` with raw backend types | `src/lib/api-types.ts` | Low |
| 3 | Add `transformers.ts` with mappers | `src/lib/transformers.ts` | Medium |
| 4 | Fix `useNegotiations` — path + transformer | `src/hooks/useNegotiations.ts` | Medium |
| 5 | Fix `useNegotiationDetail` — path + transformer + approve | `src/hooks/useNegotiationDetail.ts` | High |
| 6 | Fix `useEvents` — galileo paths + enterprise ID | `src/hooks/useEvents.ts` | Medium |
| 7 | Fix `useAcceptEventOffer` — galileo path | `src/hooks/useEvents.ts` | Low |
| 8 | Fix `useDashboardSummary` — enterprise endpoint + transformer | `src/hooks/useDashboardSummary.ts` | Medium |
| 9 | Fix `useCompanies` — galileo paths + transformer | `src/hooks/useCompanies.ts` | Medium |
| 10 | Fix `useLaunchNegotiation` — galileo launch path | `src/hooks/useNegotiations.ts` | Medium |
| 11 | Handle market insights gracefully (keep mock or use hotel-data) | `src/hooks/useMarketInsights.ts` | Low |
| 12 | Add SSE support for live agent streams | New hook | High (optional) |

---

## Quick Reference: Path Corrections

| Hook | Current Path | Correct Path |
|---|---|---|
| `useDashboardSummary` | `GET /api/dashboard/summary` | `GET /api/galileo/enterprises/{eid}` |
| `useNegotiations` | `GET /api/negotiations` | `GET /negotiations` |
| `useNegotiationDetail` | `GET /api/negotiations/{id}` | `GET /negotiations/{id}` |
| `useAcceptNegotiation` | `POST /api/negotiations/{id}/accept` | `POST /negotiations/{id}/approve` |
| `useLaunchNegotiation` | `POST /api/negotiations` | `POST /api/galileo/negotiations/launch` |
| `useMarketPreview` | `GET /api/market-insights/preview` | **Does not exist** |
| `useEventsList` | `GET /api/events` | `GET /api/galileo/enterprises/{eid}/events` |
| `useEventDetail` | `GET /api/events/{id}` | `GET /api/galileo/events/{id}` |
| `useAcceptEventOffer` | `POST /api/events/{eid}/agents/{aid}/accept` | `POST /api/galileo/events/{eid}/agents/{aid}/accept` |
| `useCompanyCards` | `GET /api/companies` | `GET /api/galileo/companies` |
| `useCompanyProfile` | `GET /api/companies/{id}` | `GET /api/galileo/companies/{id}` |
| `useCompanyNegotiations` | `GET /api/companies/{id}/negotiations` | `GET /api/galileo/enterprises/{eid}/companies/{id}` |
| `useMarketInsights` | `POST /api/market-insights` | **Does not exist** |
