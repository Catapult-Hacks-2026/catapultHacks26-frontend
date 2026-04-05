import type {
  RawEnterprise,
  RawEnterpriseCompanySummary,
  RawGalileoActivityItem,
  RawGalileoAgent,
  RawGalileoCompany,
  RawGalileoEvent,
  RawGalileoLocation,
  RawGalileoPricePoint,
  RawGalileoTranscriptMessage,
  RawMessage,
  RawNegotiation,
  RawNegotiationConfig,
  RawNegotiationDetail,
  RawOffer,
} from "@/lib/api-types";
import type {
  AgentStatus,
  CompanyCard,
  EventAgent,
  FullCompanyProfile,
  GalileoEvent,
} from "@/lib/dashboard-data";
import { getFullCompanyProfile } from "@/lib/dashboard-data";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function asNumber(value: unknown): number | null {
  if (isFiniteNumber(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.-]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeLabel(value?: string | null) {
  if (!value) {
    return "Just now";
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const parts = value.split(" ");
  return parts[1] ?? value;
}

function toInitials(name: string) {
  const pieces = name.split(/\s+/).filter(Boolean);
  return pieces.slice(0, 2).map((piece) => piece[0]?.toUpperCase() ?? "").join("") || "C";
}

function coerceType(_value?: string | null): "Hotel" {
  return "Hotel";
}

function coerceSegment(category?: string | null, location?: string | null) {
  const categoryLabel = category?.toLowerCase() === "hotel" ? "Hospitality" : titleCase(category ?? "Hotel");
  return location ? `${categoryLabel}/${location}` : categoryLabel;
}

function firstDefinedString(...values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0);
}

export function formatCurrency(value: number | null | undefined, digits = 0) {
  if (!isFiniteNumber(value ?? null)) {
    return "—";
  }

  return `$${(value ?? 0).toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}`;
}

function formatSignedPercent(value: number | null | undefined) {
  if (!isFiniteNumber(value ?? null)) {
    return "—";
  }

  return `${value! >= 0 ? "+" : ""}${value!.toFixed(1)}%`;
}

function formatSavingsPercent(base: number | null, negotiated: number | null) {
  if (!isFiniteNumber(base) || !isFiniteNumber(negotiated) || base <= 0) {
    return "—";
  }

  const pct = ((base - negotiated) / base) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `(${sign}${pct.toFixed(1)}%)`;
}

function eventStatus(status?: string | null): GalileoEvent["status"] {
  const normalized = status?.toLowerCase() ?? "";
  return normalized === "completed" || normalized === "accepted" ? "Completed" : "Active";
}

export function mapNegotiationStatus(status?: string | null): AgentStatus {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized === "pending" || normalized === "queued") return "Queued";
  if (normalized === "reviewing") return "Finalizing";
  if (normalized === "optimized") return "Finalizing";
  if (normalized === "ringing") return "Ringing";
  if (normalized === "active" || normalized === "negotiating" || normalized === "in_progress") return "Negotiating";
  if (normalized === "finalizing") return "Finalizing";
  if (normalized === "accepted" || normalized === "approved" || normalized === "deal_closed") return "Deal Closed";
  if (normalized === "completed") return "Completed";
  if (normalized === "cancelled") return "Failed";
  if (normalized === "escalated" || normalized === "escalated_to_human") return "Moved to higher up";
  if (normalized === "awaiting_callback" || normalized === "awaiting callback") return "Callback requested";
  if (normalized === "callback_requested" || normalized === "callback requested") return "Callback requested";
  if (normalized === "no_availability" || normalized === "no availability") return "No Availability";
  if (normalized === "timeout" || normalized === "timed_out") return "Timed Out";
  if (normalized === "failed" || normalized === "failure") return "Failed";

  return "Queued";
}

function eventAgentStatus(status?: string | null): EventAgent["status"] {
  const mapped = mapNegotiationStatus(status);
  if (mapped === "Ringing" || mapped === "Negotiating" || mapped === "Queued" || mapped === "Finalizing" || mapped === "Completed" || mapped === "Failed") {
    return mapped;
  }
  return mapped === "Deal Closed" ? "Completed" : "Queued";
}

function eventAgentOutcome(agent: RawGalileoAgent) {
  if (agent.isAccepted || agent.is_accepted) {
    return "Deal Closed" as const;
  }

  const normalized = agent.outcome?.toLowerCase() ?? agent.status?.toLowerCase() ?? "";
  if (normalized === "rate_confirmed") return "Deal Closed" as const;
  if (normalized === "callback_requested") return "Callback requested" as const;
  if (normalized === "escalated_to_human") return "Moved to higher up" as const;
  if (normalized === "no_availability") return "No Availability" as const;
  if (normalized === "failed") return "Failure" as const;
  if (normalized === "timed_out") return "Timed Out" as const;
  if (normalized === "accepted" || normalized === "approved" || normalized === "deal closed") return "Deal Closed" as const;
  if (normalized === "escalated") return "Moved to higher up" as const;
  if (normalized === "callback requested" || normalized === "callback_requested") return "Callback requested" as const;
  if (normalized === "failed" || normalized === "failure") return "Failure" as const;
  if (normalized === "timed_out" || normalized === "timeout") return "Timed Out" as const;
  if (normalized === "no_availability" || normalized === "no availability") return "No Availability" as const;

  return undefined;
}

function getCurrentOfferUnitPrice(offer?: RawOffer | null) {
  return asNumber(offer?.unit_price);
}

function normalizePricePath(raw: RawGalileoPricePoint[] | null | undefined, targetPrice?: number | null, currentPrice?: number | null) {
  const mapped =
    raw
      ?.map((point, index) => {
        const price = asNumber(point.price) ?? asNumber(point.unit_price) ?? asNumber(point.value);
        if (!isFiniteNumber(price)) {
          return null;
        }

        const type = point.type === "negotiated" || point.type === "current" || point.type === "final"
          ? point.type
          : "offer";
        return { label: point.label ?? `Step ${index + 1}`, price, type };
      })
      .filter((point): point is { label: string; price: number; type: "offer" | "negotiated" | "current" | "final" } => point !== null) ?? [];

  if (mapped.length > 0) {
    return mapped;
  }

  const fallback: Array<{ label: string; price: number; type: "offer" | "negotiated" | "current" }> = [];
  if (isFiniteNumber(targetPrice ?? null)) {
    fallback.push({ label: "Target", price: targetPrice!, type: "negotiated" });
  }
  if (isFiniteNumber(currentPrice ?? null)) {
    fallback.push({ label: "Current", price: currentPrice!, type: "current" });
  }
  return fallback;
}

function normalizeActivityStream(raw: RawGalileoActivityItem[] | null | undefined) {
  return (
    raw?.map((item, index, items) => ({
      active: item.active ?? index === items.length - 1,
      badge: item.badge ?? null,
      badgeTone:
        item.badgeTone ??
        (item.badgeType === "savings"
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-secondary-fixed text-on-secondary-fixed"),
      detail: item.detail ?? "Status updated",
      detailTone:
        item.detailTone ??
        (item.detailType === "positive"
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : item.detailType === "negative"
            ? "bg-error-container text-error"
            : undefined),
      price: typeof item.price === "number" ? formatCurrency(item.price, 2) : item.price ?? "—",
      time: item.time ?? formatTimeLabel(item.timestamp ?? item.created_at),
    })) ?? []
  );
}

function transcriptSender(role?: string | null, sender?: string | null): "agent" | "supplier" {
  const normalized = (role ?? sender ?? "").toLowerCase();
  if (normalized === "agent" || normalized === "assistant" || normalized === "galileo") {
    return "agent";
  }
  return "supplier";
}

function normalizeTranscript(raw: RawGalileoTranscriptMessage[] | null | undefined, companyName: string) {
  return (
    raw?.map((message) => ({
      body: message.message ?? message.body ?? message.content ?? "",
      label:
        message.label ??
        (transcriptSender(message.role, message.sender) === "agent" ? "Agent Galileo" : `${companyName} rep`),
      sender: transcriptSender(message.role, message.sender),
      timestamp: formatTimeLabel(message.timestamp ?? message.created_at),
    })) ?? []
  );
}

function extractMessagePrice(message: RawMessage) {
  const structured = message.structured_data ?? {};
  return (
    asNumber(structured.unit_price) ??
    asNumber((structured.current_offer as Record<string, unknown> | undefined)?.unit_price) ??
    asNumber((structured.offer as Record<string, unknown> | undefined)?.unit_price) ??
    null
  );
}

function buildDetailPricePath(messages: RawMessage[], config: RawNegotiationConfig, offerPrice: number | null) {
  const points = messages
    .map((message, index) => {
      const price = extractMessagePrice(message);
      if (!isFiniteNumber(price)) {
        return null;
      }

      const role = message.role.toLowerCase();
      return {
        label: role === "system" ? `Update ${index + 1}` : titleCase(role),
        price,
        type: role === "system" ? "current" : role === "agent" || role === "assistant" ? "negotiated" : "offer",
      } as const;
    })
    .filter((point): point is { label: string; price: number; type: "offer" | "negotiated" | "current" } => point !== null);

  if (points.length > 0) {
    return points;
  }

  return normalizePricePath(
    [],
    asNumber(config.target_unit_price),
    offerPrice ?? asNumber(config.max_unit_price),
  );
}

function buildActivityStream(messages: RawMessage[], targetPrice: number | null, currentPrice: number | null) {
  const systemMessages = messages.filter((message) => message.role.toLowerCase() === "system");

  if (systemMessages.length > 0) {
    return systemMessages.map((message, index) => ({
      active: index === systemMessages.length - 1,
      badge:
        isFiniteNumber(targetPrice) && isFiniteNumber(currentPrice)
          ? `Saved ${Math.max(((targetPrice! - currentPrice!) / Math.max(targetPrice!, 1)) * 100, 0).toFixed(1)}%`
          : null,
      badgeTone: "bg-tertiary-fixed text-on-tertiary-fixed",
      detail: message.content,
      detailTone: undefined,
      price: isFiniteNumber(currentPrice) ? formatCurrency(currentPrice!, 2) : "—",
      time: formatTimeLabel(message.created_at),
    }));
  }

  if (!isFiniteNumber(currentPrice)) {
    return [];
  }

  return [
    {
      active: true,
      badge: null,
      badgeTone: "bg-tertiary-fixed text-on-tertiary-fixed",
      detail: "Current offer on file",
      detailTone: undefined,
      price: formatCurrency(currentPrice!, 2),
      time: "Just now",
    },
  ];
}

function buildTranscript(messages: RawMessage[], companyName: string) {
  return messages
    .filter((message) => message.role.toLowerCase() !== "system")
    .map((message) => {
      const sender = transcriptSender(message.role, message.role);
      return {
        body: message.content,
        label: sender === "agent" ? "Agent Galileo" : `${companyName} rep`,
        sender,
        timestamp: formatTimeLabel(message.created_at),
      };
    });
}

export function transformEnterpriseSummary(raw: RawEnterprise) {
  return {
    contractCount: (raw.hotelContractCount ?? 0) + (raw.airlineContractCount ?? 0),
    hotelsSaved: formatCurrency(raw.totalSavedHotels),
    savingsDelta: formatSignedPercent(raw.yoyChange),
    totalSavedThisYear: formatCurrency(raw.totalSaved),
  };
}

export function transformNegotiationRow(raw: RawNegotiation, location?: string | null) {
  const target = null;
  const negotiated = getCurrentOfferUnitPrice(raw.current_offer);
  const deltaTone =
    isFiniteNumber(target) && isFiniteNumber(negotiated) && negotiated! > target!
      ? "text-error"
      : "text-on-tertiary-container";

  return {
    company: raw.vendor_name,
    delta: formatSavingsPercent(target, negotiated),
    deltaTone,
    id: raw.id,
    negotiated: formatCurrency(negotiated, 2),
    segment: coerceSegment(raw.product_category, location),
    status: mapNegotiationStatus(raw.status),
    target: "—",
  };
}

export function transformNegotiationDetail(raw: RawNegotiationDetail, fallbackLocation?: string | null) {
  const currentOffer = getCurrentOfferUnitPrice(raw.negotiation.current_offer);
  const targetPrice = asNumber(raw.config.target_unit_price);
  const maxPrice = asNumber(raw.config.max_unit_price);
  const company = raw.negotiation.vendor_name;

  return {
    activityStream: buildActivityStream(raw.messages, maxPrice, currentOffer),
    company,
    currentPrice: formatCurrency(currentOffer, 0),
    distanceToGoal:
      isFiniteNumber(currentOffer) && isFiniteNumber(targetPrice)
        ? formatCurrency(Math.max(currentOffer! - targetPrice!, 0), 2)
        : "—",
    id: raw.negotiation.id,
    isAccepted: raw.negotiation.status === "accepted",
    location: fallbackLocation ?? titleCase(raw.negotiation.product_category),
    negotiatedPrice: formatCurrency(currentOffer, 2),
    pricePath: buildDetailPricePath(raw.messages, raw.config, currentOffer),
    savingsToDate:
      isFiniteNumber(maxPrice) && isFiniteNumber(currentOffer)
        ? formatCurrency(Math.max(maxPrice! - currentOffer!, 0), 2)
        : "—",
    segment: titleCase(raw.negotiation.product_category),
    status: mapNegotiationStatus(raw.negotiation.status),
    targetPrice: formatCurrency(targetPrice, 0),
    transcript: buildTranscript(raw.messages, company),
  };
}

function priceFromAgent(agent: RawGalileoAgent, key: "original" | "negotiated") {
  if (key === "original") {
    return (
      asNumber(agent.marketPrice) ??
      asNumber(agent.originalPrice) ??
      asNumber(agent.original_price) ??
      asNumber(agent.market_price) ??
      asNumber(agent.pricePath?.[0]?.price) ??
      asNumber(agent.pricePath?.[0]?.unit_price)
    );
  }

  return (
    asNumber(agent.currentPrice) ??
    asNumber(agent.current_price) ??
    asNumber(agent.negotiated_price) ??
    getCurrentOfferUnitPrice(agent.current_offer) ??
    asNumber(agent.pricePath?.[agent.pricePath.length - 1]?.price) ??
    asNumber(agent.pricePath?.[agent.pricePath.length - 1]?.unit_price)
  );
}

export function transformEventAgent(agent: RawGalileoAgent): EventAgent {
  const company =
    firstDefinedString(
      agent.companyName,
      agent.vendor_name,
      agent.company,
      agent.company_name,
      agent.name,
    ) ?? "Supplier";
  const originalPrice = priceFromAgent(agent, "original");
  const negotiatedPrice = priceFromAgent(agent, "negotiated");
  const savings =
    asNumber(agent.savingsToDate) ??
    asNumber(agent.savings) ??
    (isFiniteNumber(originalPrice) && isFiniteNumber(negotiatedPrice) ? originalPrice! - negotiatedPrice! : null);

  return {
    company,
    companyId: agent.companyId ?? agent.company_id ?? "",
    isAccepted: Boolean(agent.isAccepted ?? agent.is_accepted),
    negotiationId: agent.id,
    negotiatedPrice: isFiniteNumber(negotiatedPrice) ? `${formatCurrency(negotiatedPrice, 0)}/night` : "—",
    originalPrice: isFiniteNumber(originalPrice) ? `${formatCurrency(originalPrice, 0)}/night` : "—",
    outcome: eventAgentOutcome(agent),
    savings: formatCurrency(savings),
    status: eventAgentStatus(agent.status),
    type: coerceType(agent.type ?? agent.service ?? agent.product_category),
  };
}

export function transformEvent(raw: RawGalileoEvent): GalileoEvent {
  return {
    agents: (raw.agents ?? []).map(transformEventAgent),
    attendees: raw.attendees ?? raw.attendee_count ?? 0,
    endDate: formatDateLabel(raw.endDate ?? raw.end_date),
    id: raw.id,
    location: raw.location ?? "Location unavailable",
    name: raw.name ?? raw.event_name ?? "Unnamed event",
    service: coerceType(raw.service),
    startDate: formatDateLabel(raw.startDate ?? raw.start_date),
    status: eventStatus(raw.status),
  };
}

export function transformGalileoAgentDetail(raw: RawGalileoAgent, fallbackEvent?: RawGalileoEvent | null) {
  const company =
    firstDefinedString(
      raw.companyName,
      raw.vendor_name,
      raw.company,
      raw.company_name,
      raw.name,
    ) ?? "Supplier";
  const target = asNumber(raw.idealPrice);
  const original = priceFromAgent(raw, "original");
  const negotiated = priceFromAgent(raw, "negotiated");
  const status = eventAgentOutcome(raw) ?? mapNegotiationStatus(raw.status);

  return {
    activityStream: normalizeActivityStream(raw.activityStream),
    company,
    currentPrice: formatCurrency(negotiated, 0),
    distanceToGoal:
      asNumber(raw.distanceToGoal) !== null
        ? formatCurrency(asNumber(raw.distanceToGoal), 2)
        : isFiniteNumber(negotiated) && isFiniteNumber(target)
          ? formatCurrency(Math.max(negotiated! - target!, 0), 2)
          : "—",
    id: raw.id,
    isAccepted: Boolean(raw.isAccepted ?? raw.is_accepted),
    location: raw.location ?? fallbackEvent?.location ?? "Location unavailable",
    negotiatedPrice: formatCurrency(negotiated, 2),
    originalPrice: original ?? null,
    pricePath: [
      ...(isFiniteNumber(original) ? [{ label: "Market", price: original!, type: "offer" as const }] : []),
      ...normalizePricePath(raw.pricePath, target, negotiated),
    ],
    savingsToDate:
      asNumber(raw.savingsToDate) !== null
        ? formatCurrency(asNumber(raw.savingsToDate), 2)
        : isFiniteNumber(original) && isFiniteNumber(negotiated)
          ? formatCurrency(Math.max(original! - negotiated!, 0), 2)
          : "—",
    segment: raw.segment ?? titleCase(raw.product_category ?? raw.service ?? raw.type ?? "Hotel"),
    status,
    targetPrice: formatCurrency(target, 0),
    transcript: normalizeTranscript(raw.transcript, company),
  };
}

export function transformCompanyCard(raw: RawGalileoCompany): CompanyCard {
  const name = raw.name ?? "Company";
  const totalSavings = asNumber(raw.totalSavings) ?? asNumber(raw.total_savings);
  const bookings = asNumber(raw.bookings);

  return {
    bookings: bookings?.toLocaleString("en-US") ?? "—",
    id: raw.id,
    initials: raw.initials ?? toInitials(name),
    name,
    positive: true,
    totalSavings: formatCurrency(totalSavings),
    type: "Hotel",
  };
}

function normalizeLocations(
  locations: RawGalileoLocation[] | Record<string, RawGalileoLocation> | null | undefined,
  fallback: FullCompanyProfile["locations"],
) {
  if (!locations) {
    return fallback;
  }

  const entries = Array.isArray(locations)
    ? locations.map((location, index) => [location.id ?? location.label ?? location.name ?? `loc-${index}`, location] as const)
    : Object.entries(locations);

  const mapped = Object.fromEntries(
    entries.map(([key, location]) => {
      const fallbackLocation = fallback[key] ?? fallback.all;
      return [
        key,
        {
          agreements: location.agreements ?? fallbackLocation?.agreements ?? "—",
          currentLocation:
            location.currentLocation ??
            location.current_location ??
            location.location ??
            fallbackLocation?.currentLocation ??
            "Location unavailable",
          eventIds: location.eventIds ?? location.event_ids ?? fallbackLocation?.eventIds ?? [],
          label: location.label ?? location.name ?? fallbackLocation?.label ?? titleCase(key),
          lifetimeSavings:
            typeof location.lifetimeSavings === "string"
              ? location.lifetimeSavings
              : typeof location.lifetime_savings === "string"
                ? location.lifetime_savings
                : formatCurrency(asNumber(location.lifetimeSavings) ?? asNumber(location.lifetime_savings)),
          pricing: location.pricing ?? fallbackLocation?.pricing ?? { "1Y": [], ALL: [] },
          savingsDelta:
            typeof location.savingsDelta === "string"
              ? location.savingsDelta
              : typeof location.savings_delta === "string"
                ? location.savings_delta
                : formatSignedPercent(asNumber(location.savingsDelta) ?? asNumber(location.savings_delta)),
          subtitle: location.subtitle ?? fallbackLocation?.subtitle ?? "",
        },
      ];
    }),
  );

  return Object.keys(mapped).length > 0 ? mapped : fallback;
}

export function transformCompanyProfile(
  base: RawGalileoCompany,
  enterpriseSummary: RawEnterpriseCompanySummary | null,
) {
  const fallback = getFullCompanyProfile(base.id);
  const name = base.name ?? enterpriseSummary?.name ?? fallback.displayName;
  const totalSavings = asNumber(enterpriseSummary?.totalSavings) ?? asNumber(enterpriseSummary?.total_savings) ?? asNumber(base.totalSavings) ?? asNumber(base.total_savings);
  const bookings = asNumber(enterpriseSummary?.bookings) ?? asNumber(base.bookings);
  const locations = normalizeLocations(
    enterpriseSummary?.locations ?? base.locations,
    fallback.locations,
  );

  return {
    bookingWindowScores:
      enterpriseSummary?.bookingWindowScores ??
      enterpriseSummary?.booking_window_scores ??
      enterpriseSummary?.bookingWindow?.map((bw) => ({ label: bw.month, score: bw.score })) ??
      fallback.bookingWindowScores,
    bookings: bookings?.toLocaleString("en-US") ?? "—",
    description: base.description ?? enterpriseSummary?.description ?? fallback.description,
    displayName: name,
    id: base.id,
    initials: base.initials ?? fallback.initials ?? toInitials(name),
    locations,
    name,
    totalSavings: formatCurrency(totalSavings),
    type: "Hotel" as const,
  };
}
