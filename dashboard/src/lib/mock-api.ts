import {
  activityStream,
  agentRows,
  companyCards,
  companyProfiles,
  getFullCompanyProfile,
  initialEvents,
  type AgentStatus,
  type CompanyCard,
  type EventAgent,
  type EventAgentStatus,
  type FullCompanyProfile,
  type GalileoEvent,
} from "@/lib/dashboard-data";
import {
  recommendationWindows,
  type MarketInsightsQuery,
} from "@/lib/market-insights-data";
import { ApiError } from "@/lib/api-error";

type NegotiationRow = {
  id: string;
  company: string;
  segment: string;
  target: string;
  negotiated: string;
  delta: string;
  deltaTone: string;
  status: AgentStatus;
};

type PriceStep = {
  label: string;
  price: number;
  type: "offer" | "negotiated" | "current";
};

type ActivityItem = {
  price: string;
  badge: string | null;
  badgeTone: string;
  detail: string;
  detailTone?: string;
  time: string;
  active: boolean;
};

type TranscriptMessage = {
  sender: "agent" | "supplier";
  body: string;
  timestamp: string;
  label: string;
};

type NegotiationDetail = {
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
  location: string;
};

type DashboardSummary = {
  totalSavedThisYear: string;
  savingsDelta: string;
  hotelsSaved: string;
  contractCount: number;
};

type CompanyProfileResponse = FullCompanyProfile & {
  id: string;
  name: string;
  type: "Hotel";
  totalSavings: string;
  bookings: string;
};

type MarketPreview = {
  market: string;
  predicted: string;
  unit: string;
};

type RecommendationWindow = {
  label: string;
  range: string;
  explanation: string;
  marketCost: string;
  negotiatedPrice: string;
  savings: string;
  probability: string;
};

type LaunchPayload = {
  eventName: string;
  service: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
  requirements: string;
  idealPrice: number;
  ceilingPrice: number;
};

type Database = {
  companyCards: CompanyCard[];
  events: GalileoEvent[];
  negotiations: NegotiationRow[];
  negotiationDetails: Record<string, NegotiationDetail>;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function parseMoney(input: string) {
  return Number.parseFloat(input.replace(/[^0-9.]/g, "")) || 0;
}

function currency(value: number, digits = 0) {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function companyIdFromName(name: string) {
  const direct = companyCards.find(
    (company) => company.name.toLowerCase() === name.toLowerCase(),
  );

  if (direct) {
    return direct.id;
  }

  return name.toLowerCase().split(" ")[0]?.replace(/[^a-z0-9]/g, "") ?? "company";
}

function eventLocationForNegotiation(id: string) {
  const event = initialEvents.find((item) =>
    item.agents.some((agent) => agent.negotiationId === id),
  );

  return event?.location ?? "Chicago, IL";
}

function createPricePath(targetPrice: number, negotiatedPrice: number) {
  const marketRate = Math.max(negotiatedPrice + 70, targetPrice + 95);
  const initialBid = Math.max(targetPrice - 10, negotiatedPrice - 38);
  const counterOne = Math.round((marketRate + negotiatedPrice) / 2);
  const roundTwo = Math.round((counterOne + negotiatedPrice) / 2);
  const counterTwo = Math.round((roundTwo + negotiatedPrice) / 2);

  return [
    { label: "Market Rate", price: marketRate, type: "offer" as const },
    { label: "Initial Bid", price: initialBid, type: "negotiated" as const },
    { label: "Counter", price: counterOne, type: "offer" as const },
    { label: "Round 2", price: roundTwo, type: "negotiated" as const },
    { label: "Counter 2", price: counterTwo, type: "offer" as const },
    { label: "Current", price: negotiatedPrice, type: "current" as const },
  ];
}

function createActivityStream(targetPrice: number, negotiatedPrice: number): ActivityItem[] {
  const marketRate = Math.max(negotiatedPrice + 70, targetPrice + 95);
  const savings = marketRate - negotiatedPrice;

  return [
    {
      price: currency(negotiatedPrice, 2),
      badge: `Saved ${Math.round((savings / marketRate) * 100)}%`,
      badgeTone: "bg-tertiary-fixed text-on-tertiary-fixed",
      detail: `-${currency(savings, 2)} from market rate`,
      time: "2m ago",
      active: true,
    },
    {
      price: currency(negotiatedPrice + 18, 2),
      badge: null,
      badgeTone: "",
      detail: `+${currency(18, 2)} counter-offer received`,
      detailTone: "bg-error-container text-error",
      time: "1h ago",
      active: false,
    },
    {
      price: currency(Math.max(targetPrice - 8, negotiatedPrice - 35), 2),
      badge: "Opening anchor",
      badgeTone: "bg-secondary-fixed text-on-secondary-fixed",
      detail: "Galileo opened below supplier floor",
      time: "3h ago",
      active: false,
    },
  ];
}

function createTranscript(company: string, targetPrice: number, negotiatedPrice: number): TranscriptMessage[] {
  return [
    {
      sender: "agent",
      body: `Galileo is targeting ${currency(targetPrice, 2)} with breakfast and arrival-transfer concessions included.`,
      timestamp: "14:02:11",
      label: "Agent Galileo",
    },
    {
      sender: "supplier",
      body: `${company} can review the volume if room-night commitments remain firm through the requested window.`,
      timestamp: "14:02:45",
      label: `${company} rep`,
    },
    {
      sender: "agent",
      body: `Confirmed. Galileo can lock the package at ${currency(negotiatedPrice, 2)} pending final approval of concessions.`,
      timestamp: "14:48:03",
      label: "Agent Galileo",
    },
  ];
}

function buildNegotiationDetail(row: NegotiationRow): NegotiationDetail {
  const targetPrice = parseMoney(row.target);
  const negotiatedPrice = parseMoney(row.negotiated);
  const currentPrice = negotiatedPrice;
  const marketRate = Math.max(negotiatedPrice + 70, targetPrice + 95);
  const event = initialEvents.find((item) =>
    item.agents.some((agent) => agent.negotiationId === row.id),
  );
  const eventAgent = event?.agents.find((agent) => agent.negotiationId === row.id);

  return {
    id: row.id,
    company: row.company,
    segment: row.segment,
    targetPrice: row.target,
    currentPrice: currency(currentPrice, 0),
    negotiatedPrice: row.negotiated,
    savingsToDate: currency(marketRate - currentPrice, 2),
    distanceToGoal: currency(Math.max(currentPrice - targetPrice, 0), 2),
    pricePath: createPricePath(targetPrice, negotiatedPrice),
    activityStream: row.id === "hilton" ? clone(activityStream) : createActivityStream(targetPrice, negotiatedPrice),
    transcript: createTranscript(row.company, targetPrice, negotiatedPrice),
    status: eventAgent?.outcome ?? eventAgent?.status ?? row.status,
    isAccepted: eventAgent?.isAccepted ?? false,
    location: event?.location ?? eventLocationForNegotiation(row.id),
  };
}

function createDatabase(): Database {
  const negotiations = clone(agentRows);
  const events = clone(initialEvents);
  const negotiationDetails = Object.fromEntries(
    negotiations.map((row) => [row.id, buildNegotiationDetail(row)]),
  );

  return {
    companyCards: clone(companyCards),
    events,
    negotiations,
    negotiationDetails,
  };
}

const db = createDatabase();

function getNegotiationRow(id: string) {
  return db.negotiations.find((row) => row.id === id);
}

function getEventByNegotiationId(id: string) {
  return db.events.find((event) =>
    event.agents.some((agent) => agent.negotiationId === id),
  );
}

function getEvent(eventId: string) {
  return db.events.find((event) => event.id === eventId);
}

function syncNegotiationFromEventAgent(event: GalileoEvent, agent: EventAgent) {
  const row = getNegotiationRow(agent.negotiationId);

  if (row) {
    row.status = agent.outcome ?? agent.status;
    row.negotiated = agent.negotiatedPrice.replace("/night", "");
    row.delta = `(+${Math.max(
      1,
      Math.round(
        ((parseMoney(agent.originalPrice) - parseMoney(agent.negotiatedPrice)) /
          Math.max(parseMoney(agent.originalPrice), 1)) *
          100,
      ),
    )}%)`;
  }

  const detail = db.negotiationDetails[agent.negotiationId];

  if (detail) {
    detail.status = agent.outcome ?? agent.status;
    detail.isAccepted = agent.isAccepted ?? false;
    detail.currentPrice = agent.negotiatedPrice.replace("/night", "");
    detail.negotiatedPrice = agent.negotiatedPrice.replace("/night", "");
    detail.location = event.location;
  }
}

function finalizeEventStatus(event: GalileoEvent) {
  const acceptedTypes = new Set(
    event.agents.filter((agent) => agent.isAccepted).map((agent) => agent.type),
  );

  event.status = acceptedTypes.has("Hotel") ? "Completed" : "Active";
}

function acceptDeal(eventId: string, negotiationId: string) {
  const event = getEvent(eventId);

  if (!event) {
    throw new ApiError(404, `/api/events/${eventId}`, "Event not found");
  }

  const targetAgent = event.agents.find((agent) => agent.negotiationId === negotiationId);

  if (!targetAgent) {
    throw new ApiError(
      404,
      `/api/events/${eventId}/agents/${negotiationId}/accept`,
      "Agent not found",
    );
  }

  const typeAlreadyAccepted = event.agents.some(
    (agent) => agent.type === targetAgent.type && agent.isAccepted,
  );

  if (!targetAgent.isAccepted && !typeAlreadyAccepted) {
    targetAgent.isAccepted = true;
  }

  finalizeEventStatus(event);

  for (const agent of event.agents) {
    syncNegotiationFromEventAgent(event, agent);
  }

  return { success: true };
}

function buildDashboardSummary(): DashboardSummary {
  const totalSavings = db.events
    .flatMap((event) => event.agents)
    .reduce((sum, agent) => sum + parseMoney(agent.savings), 0);
  const hotelSavings = db.events
    .flatMap((event) => event.agents.filter((agent) => agent.type === "Hotel"))
    .reduce((sum, agent) => sum + parseMoney(agent.savings), 0);

  return {
    totalSavedThisYear: currency(Math.round(totalSavings / 1000)) + "K",
    savingsDelta: "↑ 17.3%",
    hotelsSaved: currency(Math.round(hotelSavings / 1000)) + "K",
    contractCount: db.negotiations.length,
  };
}

function companyProfileResponse(id: string): CompanyProfileResponse {
  const card = db.companyCards.find((item) => item.id === id);
  const profile = getFullCompanyProfile(id);

  return {
    ...clone(profile),
    bookings: card?.bookings ?? "0",
    id,
    name: card?.name ?? profile.displayName,
    totalSavings: card?.totalSavings ?? profile.locations.all?.lifetimeSavings ?? "—",
    type: "Hotel",
  };
}

function companyNegotiations(id: string) {
  const profile = companyProfileResponse(id);
  const directCompanyName = companyProfiles[id]?.displayName ?? profile.name;

  return db.negotiations.filter((row) => {
    const normalizedCompany = row.company.toLowerCase();
    return (
      normalizedCompany.includes(id.toLowerCase()) ||
      normalizedCompany.includes(directCompanyName.toLowerCase())
    );
  });
}

function marketPreview(location: string, dates: string): MarketPreview {
  const seed = `${location}-${dates}`.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const market = 280 + (seed % 145);
  const predicted = market - (28 + (seed % 22));

  return {
    market: currency(market, 0),
    predicted: currency(predicted, 0),
    unit: "per night",
  };
}

function buildInsights(query: MarketInsightsQuery): RecommendationWindow[] {
  const attendees = Number.parseInt(query.attendees, 10) || 100;
  const nights = Number.parseInt(query.nights, 10) || 3;
  const base = attendees * nights;

  return recommendationWindows.map((window, index) => {
    const market = 230 + index * 28 + (base % 35);
    const negotiated = market - (32 + index * 7);
    const savings = market - negotiated;

    return {
      ...window,
      explanation: `${window.explanation} Modeled for ${query.location}, ${attendees} attendees, and ${nights} nights of ${query.eventType.toLowerCase()} demand.`,
      marketCost: `${currency(market, 0)} / room night`,
      negotiatedPrice: `${currency(negotiated, 0)} / room night`,
      probability: `${92 - index * 6}% negotiation confidence`,
      range:
        index === 0
          ? query.timing
          : `${query.timing} · Option ${index + 1}`,
      savings: `${currency(savings, 0)} / room night`,
    };
  });
}

function launchNegotiation(payload: LaunchPayload) {
  const negotiationId = `${payload.eventName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const company = "Hilton Hotels";
  const market = marketPreview(payload.location, `${payload.startDate}-${payload.endDate}`);
  const negotiated = currency(Math.max(payload.ceilingPrice - 6, payload.idealPrice + 10), 2);
  const row: NegotiationRow = {
    id: negotiationId,
    company,
    segment: `${payload.service}/${payload.location}`,
    target: currency(payload.idealPrice, 2),
    negotiated,
    delta: `(+${Math.max(
      4,
      Math.round(
        ((parseMoney(market.market) - parseMoney(negotiated)) / Math.max(parseMoney(market.market), 1)) *
          100,
      ),
    )}%)`,
    deltaTone: "text-on-tertiary-container",
    status: "Queued",
  };

  db.negotiations.unshift(row);
  db.negotiationDetails[negotiationId] = {
    ...buildNegotiationDetail(row),
    activityStream: [
      {
        price: currency(payload.ceilingPrice, 2),
        badge: "Queued",
        badgeTone: "bg-secondary-fixed text-on-secondary-fixed",
        detail: "Negotiation packet assembled and ready to dial",
        time: "now",
        active: true,
      },
    ],
    currentPrice: market.market,
    location: payload.location,
    status: "Queued",
  };

  const newEvent: GalileoEvent = {
    id: `${negotiationId}-event`,
    name: payload.eventName,
    location: payload.location,
    startDate: payload.startDate,
    endDate: payload.endDate,
    attendees: payload.attendees,
    service: "Hotel",
    status: "Active",
    agents: [
      {
        company,
        isAccepted: false,
        negotiationId,
        negotiatedPrice: `${negotiated}/night`,
        originalPrice: `${market.market}/night`,
        savings: currency((parseMoney(market.market) - parseMoney(negotiated)) * payload.attendees, 0),
        status: "Queued" as EventAgentStatus,
        type: "Hotel",
      },
    ],
  };

  db.events.unshift(newEvent);

  return { negotiationId };
}

async function parseBody(init?: RequestInit) {
  if (!init?.body) {
    return undefined;
  }

  if (typeof init.body === "string") {
    return JSON.parse(init.body) as unknown;
  }

  return undefined;
}

export async function mockApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const url = new URL(path, "http://localhost");
  const pathname = url.pathname;

  if (method === "GET" && pathname === "/api/dashboard/summary") {
    return clone(buildDashboardSummary()) as T;
  }

  if (method === "GET" && pathname === "/api/negotiations") {
    return clone(db.negotiations) as T;
  }

  if (method === "POST" && pathname === "/api/negotiations") {
    const payload = (await parseBody(init)) as LaunchPayload;
    return launchNegotiation(payload) as T;
  }

  if (method === "GET" && pathname.startsWith("/api/negotiations/")) {
    const id = pathname.split("/")[3];
    const detail = db.negotiationDetails[id];

    if (!detail) {
      throw new ApiError(404, pathname, "Negotiation not found");
    }

    return clone(detail) as T;
  }

  if (method === "POST" && pathname.match(/^\/api\/negotiations\/[^/]+\/accept$/)) {
    const id = pathname.split("/")[3];
    const event = getEventByNegotiationId(id);

    if (!event) {
      const detail = db.negotiationDetails[id];

      if (!detail) {
        throw new ApiError(404, pathname, "Negotiation not found");
      }

      detail.isAccepted = true;
      detail.status = "Accepted";
      return { success: true } as T;
    }

    return acceptDeal(event.id, id) as T;
  }

  if (method === "GET" && pathname === "/api/events") {
    return clone(db.events) as T;
  }

  if (method === "GET" && pathname.startsWith("/api/events/")) {
    const id = pathname.split("/")[3];
    const event = getEvent(id);

    if (!event) {
      throw new ApiError(404, pathname, "Event not found");
    }

    return clone(event) as T;
  }

  if (
    method === "POST" &&
    pathname.match(/^\/api\/events\/[^/]+\/agents\/[^/]+\/accept$/)
  ) {
    const [, , , eventId, , agentId] = pathname.split("/");
    return acceptDeal(eventId, agentId) as T;
  }

  if (method === "GET" && pathname === "/api/companies") {
    return clone(db.companyCards) as T;
  }

  if (method === "GET" && pathname.match(/^\/api\/companies\/[^/]+$/)) {
    const id = pathname.split("/")[3];
    return companyProfileResponse(id) as T;
  }

  if (method === "GET" && pathname.match(/^\/api\/companies\/[^/]+\/negotiations$/)) {
    const id = pathname.split("/")[3];
    return clone(companyNegotiations(id)) as T;
  }

  if (method === "GET" && pathname === "/api/market-insights") {
    const query: MarketInsightsQuery = {
      attendees: url.searchParams.get("attendees") ?? "100",
      eventDetails: url.searchParams.get("eventDetails") ?? "",
      eventType: url.searchParams.get("eventType") ?? "Corporate Event",
      location: url.searchParams.get("location") ?? "Chicago, IL",
      nights: url.searchParams.get("nights") ?? "3",
      timing: url.searchParams.get("timing") ?? "Flexible",
    };

    return buildInsights(query) as T;
  }

  if (method === "POST" && pathname === "/api/market-insights") {
    const body = (await parseBody(init)) as MarketInsightsQuery;
    return buildInsights(body) as T;
  }

  if (method === "GET" && pathname === "/api/market-insights/preview") {
    return marketPreview(
      url.searchParams.get("location") ?? "Chicago, IL",
      url.searchParams.get("dates") ?? "",
    ) as T;
  }

  throw new ApiError(404, pathname, `No mock route matched ${method} ${pathname}`);
}
