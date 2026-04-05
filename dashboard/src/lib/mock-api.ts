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
} from "@/lib/market-insights-data";
import { GALILEO_MARKET_PRICING_ENDPOINT } from "@/lib/negotiation-pricing";
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

type NegotiationPricingPayload = {
  service?: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
};

type EventWindowPayload = {
  location: string;
  eventType: string;
  preferredTiming: string;
  attendees: number;
  nights: number;
  eventDetails: string;
};

type LaunchPayload = {
  enterpriseId?: string;
  eventName: string;
  service: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
  budgetPerPerson?: number;
  requirements: string;
  guardrails?: {
    hotel: { idealPrice: number; ceilingPrice: number };
    airline: { idealPrice: number; ceilingPrice: number };
  };
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

function differenceInNights(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const raw = Math.round((end.getTime() - start.getTime()) / millisecondsPerDay);

  return Math.max(1, Number.isFinite(raw) ? raw : 1);
}

function marketPricing(payload: NegotiationPricingPayload) {
  const nights = differenceInNights(payload.startDate, payload.endDate);
  const seed = `${payload.location}-${payload.startDate}-${payload.endDate}-${payload.attendees}`
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const hotelMarket = 210 + nights * 18 + (payload.attendees % 35) + (seed % 45);
  const hotelPredicted = hotelMarket - (20 + (payload.attendees % 12) + (seed % 10));
  const airlineMarket = 320 + (payload.attendees % 50) + (seed % 30);
  const airlinePredicted = airlineMarket - (15 + (seed % 18));

  return {
    service: payload.service ?? "Hotel",
    hotel: {
      marketPrice: hotelMarket,
      predictedWinPrice: hotelPredicted,
      unit: "per night",
    },
    airline: {
      marketPrice: airlineMarket,
      predictedWinPrice: airlinePredicted,
      unit: "per seat",
    },
  };
}

function eventWindow(payload: EventWindowPayload) {
  const seed = `${payload.location}-${payload.eventType}-${payload.attendees}`
    .split("")
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return recommendationWindows.map((window, index) => {
    const hotelMarket = 230 + index * 28 + (payload.attendees % 35);
    const hotelNegotiated = hotelMarket - (32 + index * 7);
    const airlineMarket = 310 + index * 15 + (seed % 25);
    const airlineNegotiated = airlineMarket - (20 + index * 5);
    const baseMonth = 4 + index;
    const startDay = 1 + index * 7;
    const endDay = startDay + payload.nights;

    return {
      label: window.label,
      startDate: `2026-${String(baseMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`,
      endDate: `2026-${String(baseMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`,
      explanation: window.explanation,
      hotel: {
        marketCost: hotelMarket,
        negotiatedPrice: hotelNegotiated,
        savings: hotelMarket - hotelNegotiated,
      },
      airline: {
        marketCost: airlineMarket,
        negotiatedPrice: airlineNegotiated,
        savings: airlineMarket - airlineNegotiated,
      },
      negotiationConfidence: (92 - index * 6) / 100,
    };
  });
}

function launchNegotiation(payload: LaunchPayload) {
  const negotiationId = `${payload.eventName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;
  const company = "Hilton Hotels";
  const idealPrice = payload.guardrails?.hotel.idealPrice ?? 0;
  const ceilingPrice = payload.guardrails?.hotel.ceilingPrice ?? 0;
  const market = marketPreview(payload.location, `${payload.startDate}-${payload.endDate}`);
  const negotiated = currency(Math.max(ceilingPrice - 6, idealPrice + 10), 2);
  const row: NegotiationRow = {
    id: negotiationId,
    company,
    segment: `${payload.service}/${payload.location}`,
    target: currency(idealPrice, 2),
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
        price: currency(ceilingPrice, 2),
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

  return clone(newEvent);
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

function buildMockAgentResponse(detail: NegotiationDetail, row: NegotiationRow, eventForAgent?: GalileoEvent) {
  return {
    id: row.id,
    enterpriseId: "ent_demo",
    eventId: eventForAgent?.id ?? null,
    companyId: row.id.split("-")[0] ?? row.id,
    companyName: row.company,
    status: detail.status,
    outcome: detail.status,
    idealPrice: parseMoney(detail.targetPrice),
    ceilingPrice: parseMoney(detail.targetPrice) + 30,
    marketPrice: detail.pricePath[0]?.price ?? parseMoney(row.target),
    currentPrice: parseMoney(detail.currentPrice),
    isAccepted: detail.isAccepted,
    pricePath: detail.pricePath,
    activityStream: detail.activityStream.map((item) => ({
      id: `${item.time}-${item.price}`,
      agentId: row.id,
      price: parseMoney(item.price),
      badge: item.badge,
      badgeType: item.badgeTone.includes("tertiary") ? "savings" : "neutral",
      detail: item.detail,
      detailType: item.detailTone?.includes("error") ? "negative" : "neutral",
      timestamp: item.time,
      active: item.active,
    })),
    transcript: detail.transcript.map((msg, idx) => ({
      id: `${row.id}-msg-${idx}`,
      agentId: row.id,
      message: msg.body,
      sender: msg.sender === "agent" ? "Galileo" : row.company,
      timestamp: msg.timestamp,
    })),
    location: detail.location,
    segment: detail.segment,
  };
}

function buildMockEventResponse(event: GalileoEvent) {
  return {
    id: event.id,
    enterpriseId: "ent_demo",
    name: event.name,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    attendees: event.attendees,
    service: event.service,
    status: event.status,
    agents: event.agents.map((agent) => ({
      id: agent.negotiationId,
      enterpriseId: "ent_demo",
      eventId: event.id,
      companyId: agent.negotiationId.split("-")[0] ?? agent.negotiationId,
      companyName: agent.company,
      status: agent.status,
      outcome: agent.outcome ?? agent.status,
      idealPrice: parseMoney(agent.originalPrice) - 30,
      ceilingPrice: parseMoney(agent.originalPrice),
      marketPrice: parseMoney(agent.originalPrice),
      currentPrice: parseMoney(agent.negotiatedPrice),
      isAccepted: agent.isAccepted,
    })),
    requirements: "",
    budgetPerPerson: 0,
    winnerAgentId: event.agents.find((a) => a.isAccepted)?.negotiationId ?? null,
    winnerTranscript: [],
    winnerPricePath: [],
  };
}

export async function mockApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const url = new URL(path, "http://localhost");
  const pathname = url.pathname;

  // GET /api/galileo/enterprises/{enterprise_id}
  if (method === "GET" && pathname.match(/^\/api\/galileo\/enterprises\/[^/]+$/)) {
    const summary = buildDashboardSummary();
    return clone({
      id: pathname.split("/")[4],
      name: "Demo Enterprise",
      description: "Enterprise travel procurement",
      totalSavedHotels: parseMoney(summary.hotelsSaved) * 1000,
      totalSavedAirlines: 0,
      totalSaved: parseMoney(summary.totalSavedThisYear) * 1000,
      yoyChange: 17.3,
      hotelContractCount: summary.contractCount,
      airlineContractCount: 0,
    }) as T;
  }

  // GET /api/galileo/enterprises/{enterprise_id}/agents
  if (method === "GET" && pathname.match(/^\/api\/galileo\/enterprises\/[^/]+\/agents$/)) {
    return clone(
      db.negotiations.map((row) => {
        const detail = db.negotiationDetails[row.id];
        const event = getEventByNegotiationId(row.id);
        if (detail) {
          return buildMockAgentResponse(detail, row, event);
        }
        return {
          id: row.id,
          enterpriseId: "ent_demo",
          eventId: event?.id ?? null,
          companyId: row.id,
          companyName: row.company,
          status: row.status,
          outcome: row.status,
          idealPrice: parseMoney(row.target),
          ceilingPrice: parseMoney(row.target) + 30,
          marketPrice: parseMoney(row.target) + 60,
          currentPrice: parseMoney(row.negotiated),
          isAccepted: false,
        };
      }),
    ) as T;
  }

  // GET /api/galileo/agents/{agent_id}
  if (method === "GET" && pathname.match(/^\/api\/galileo\/agents\/[^/]+$/) && !pathname.includes("/activity-stream") && !pathname.includes("/transcript") && !pathname.includes("/intervene")) {
    const id = pathname.split("/")[4];
    const detail = db.negotiationDetails[id];
    const row = getNegotiationRow(id);

    if (!detail || !row) {
      throw new ApiError(404, pathname, "Agent not found");
    }

    const event = getEventByNegotiationId(id);
    return clone(buildMockAgentResponse(detail, row, event)) as T;
  }

  // POST /api/galileo/agents/{agent_id}/intervene
  if (method === "POST" && pathname.match(/^\/api\/galileo\/agents\/[^/]+\/intervene$/)) {
    const agentId = pathname.split("/")[4];
    const detail = db.negotiationDetails[agentId];

    if (!detail) {
      throw new ApiError(404, pathname, "Agent not found");
    }

    if (detail.status !== "Negotiating") {
      throw new ApiError(409, pathname, "Agent is not in Negotiating status");
    }

    return clone({
      agentId,
      status: "Routed",
      callRoutingInfo: "+1-555-0123",
      transferredAt: new Date().toISOString(),
    }) as T;
  }

  // GET /api/galileo/agents/{agent_id}/activity-stream (mock as regular JSON for now)
  if (method === "GET" && pathname.match(/^\/api\/galileo\/agents\/[^/]+\/activity-stream$/)) {
    const agentId = pathname.split("/")[4];
    const detail = db.negotiationDetails[agentId];

    if (!detail) {
      throw new ApiError(404, pathname, "Agent not found");
    }

    return clone(detail.activityStream.map((item, idx) => ({
      id: `${agentId}-activity-${idx}`,
      agentId,
      price: parseMoney(item.price),
      badge: item.badge,
      badgeType: "neutral",
      detail: item.detail,
      detailType: "neutral",
      timestamp: item.time,
      active: item.active,
    }))) as T;
  }

  // GET /api/galileo/agents/{agent_id}/transcript (mock as regular JSON for now)
  if (method === "GET" && pathname.match(/^\/api\/galileo\/agents\/[^/]+\/transcript$/)) {
    const agentId = pathname.split("/")[4];
    const detail = db.negotiationDetails[agentId];

    if (!detail) {
      throw new ApiError(404, pathname, "Agent not found");
    }

    return clone(detail.transcript.map((msg, idx) => ({
      id: `${agentId}-msg-${idx}`,
      agentId,
      message: msg.body,
      sender: msg.sender === "agent" ? "Galileo" : detail.company,
      timestamp: msg.timestamp,
    }))) as T;
  }

  // GET /api/galileo/enterprises/{enterprise_id}/events
  if (method === "GET" && pathname.match(/^\/api\/galileo\/enterprises\/[^/]+\/events$/)) {
    return clone(db.events.map(buildMockEventResponse)) as T;
  }

  // GET /api/galileo/events/{event_id}
  if (method === "GET" && pathname.match(/^\/api\/galileo\/events\/[^/]+$/)) {
    const id = pathname.split("/")[4];
    const event = getEvent(id);

    if (!event) {
      throw new ApiError(404, pathname, "Event not found");
    }

    return clone(buildMockEventResponse(event)) as T;
  }

  // POST /api/galileo/events/{event_id}/agents/{agent_id}/accept
  if (
    method === "POST" &&
    pathname.match(/^\/api\/galileo\/events\/[^/]+\/agents\/[^/]+\/accept$/)
  ) {
    const parts = pathname.split("/");
    const eventId = parts[4];
    const agentId = parts[6];
    acceptDeal(eventId, agentId);
    const event = getEvent(eventId)!;
    return clone(buildMockEventResponse(event)) as T;
  }

  // GET /api/galileo/companies
  if (method === "GET" && pathname === "/api/galileo/companies") {
    return clone(db.companyCards.map((card) => ({
      id: card.id,
      name: card.name,
      initials: card.initials,
      description: "",
      phone: "",
      website: "",
      industry: "Hospitality",
      badge: "",
      locations: [],
    }))) as T;
  }

  // GET /api/galileo/companies/{company_id}
  if (method === "GET" && pathname.match(/^\/api\/galileo\/companies\/[^/]+$/)) {
    const id = pathname.split("/")[4];
    const card = db.companyCards.find((c) => c.id === id);
    return clone({
      id,
      name: card?.name ?? "Company",
      initials: card?.initials ?? "C",
      description: "",
      phone: "",
      website: "",
      industry: "Hospitality",
      badge: "",
      locations: [],
    }) as T;
  }

  // GET /api/galileo/enterprises/{enterprise_id}/companies/{company_id}
  if (method === "GET" && pathname.match(/^\/api\/galileo\/enterprises\/[^/]+\/companies\/[^/]+$/)) {
    const parts = pathname.split("/");
    const companyId = parts[6];
    const profile = companyProfileResponse(companyId);
    const card = db.companyCards.find((c) => c.id === companyId);

    return clone({
      companyId,
      enterpriseId: parts[4],
      locationId: url.searchParams.get("locationId") ?? null,
      lifetimeSavings: parseMoney(card?.totalSavings ?? "0"),
      savingsDelta: 0,
      agreementsCount: 0,
      agreementsSummary: "",
      avgDelta: 0,
      totalBookings: parseMoney(card?.bookings ?? "0"),
      totalSavings: parseMoney(card?.totalSavings ?? "0"),
      yoyChange: 0,
      pricingTrends: [],
      bookingWindow: [],
      linkedEvents: [],
      locations: profile.locations,
      name: card?.name,
      description: profile.description,
      bookingWindowScores: profile.bookingWindowScores,
    }) as T;
  }

  // POST /api/galileo/market/pricing
  if (method === "POST" && pathname === GALILEO_MARKET_PRICING_ENDPOINT) {
    const body = (await parseBody(init)) as NegotiationPricingPayload;
    return marketPricing(body) as T;
  }

  // POST /api/galileo/market/event-window
  if (method === "POST" && pathname === "/api/galileo/market/event-window") {
    const body = (await parseBody(init)) as EventWindowPayload;
    return eventWindow(body) as T;
  }

  // POST /api/galileo/negotiations/launch
  if (method === "POST" && pathname === "/api/galileo/negotiations/launch") {
    const payload = (await parseBody(init)) as LaunchPayload;
    return launchNegotiation(payload) as T;
  }

  // Legacy fallback routes for backwards compatibility

  if (method === "GET" && pathname === "/api/dashboard/summary") {
    return clone(buildDashboardSummary()) as T;
  }

  if (method === "GET" && pathname === "/api/negotiations") {
    return clone(db.negotiations) as T;
  }

  if (method === "GET" && pathname.startsWith("/api/negotiations/")) {
    const id = pathname.split("/")[3];
    const detail = db.negotiationDetails[id];

    if (!detail) {
      throw new ApiError(404, pathname, "Negotiation not found");
    }

    return clone(detail) as T;
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

  throw new ApiError(404, pathname, `No mock route matched ${method} ${pathname}`);
}
