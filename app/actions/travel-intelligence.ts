import { unstable_cache, revalidateTag } from "next/cache";

const DUFFEL_BASE = "https://api.duffel.com";
const DUFFEL_VERSION = "v2";
const ARBITER_MULTIPLIER = 1 - 0.184; // −18.4% negotiated edge

const STAYS_FALLBACK: MarketDataPoint[] = [
  { label: "W Chicago - Lakeshore", publicRate: 235, arbiterRate: 191, duffelId: "m1", type: "stays" },
  { label: "The Drake Hotel", publicRate: 198, arbiterRate: 161, duffelId: "m2", type: "stays" },
  { label: "Palmer House Hilton", publicRate: 175, arbiterRate: 142, duffelId: "m3", type: "stays" },
  { label: "LondonHouse Chicago", publicRate: 310, arbiterRate: 252, duffelId: "m4", type: "stays" },
  { label: "The Langham", publicRate: 450, arbiterRate: 367, duffelId: "m5", type: "stays" },
];

const FLIGHTS_FALLBACK: MarketDataPoint[] = [
  { label: "UA2342", publicRate: 280, arbiterRate: 228, duffelId: "f1", type: "flight" },
  { label: "AA451", publicRate: 310, arbiterRate: 252, duffelId: "f2", type: "flight" },
  { label: "DL142", publicRate: 265, arbiterRate: 216, duffelId: "f3", type: "flight" },
];

// ── Auth header helper ───────────────────────────────────────────────────────

function duffelHeaders(): HeadersInit {
  const token = process.env.DUFFEL_ACCESS_TOKEN;
  if (!token) throw new Error("DUFFEL_ACCESS_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Duffel-Version": DUFFEL_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// ── Duffel Stays types ───────────────────────────────────────────────────────

interface DuffelStaysAccommodation {
  id: string;
  name: string;
  cheapest_rate_total_amount: string;
  cheapest_rate_currency: string;
  rating?: { value: number };
  location?: {
    address?: { city_name?: string; country_code?: string };
    geographic_coordinates?: { latitude: number; longitude: number };
  };
}

interface DuffelStaysResult {
  id: string; // result id — used for persistent memory tracking
  accommodation: DuffelStaysAccommodation;
}

interface DuffelStaysResponse {
  data: {
    id: string;
    results: DuffelStaysResult[];
  };
}

// ── Duffel Flights types ─────────────────────────────────────────────────────

interface DuffelSegment {
  operating_carrier: { name: string; iata_code: string };
  marketing_carrier_flight_number: string;
  departing_at: string;
  arriving_at: string;
  origin: { iata_code: string; city_name?: string };
  destination: { iata_code: string; city_name?: string };
}

interface DuffelSlice {
  segments: DuffelSegment[];
  duration: string;
}

interface DuffelOffer {
  id: string; // offer id — used for persistent memory tracking
  total_amount: string;
  total_currency: string;
  base_amount: string;
  tax_amount: string;
  slices: DuffelSlice[];
}

interface DuffelFlightResponse {
  data: {
    id: string; // offer_request id
    offers: DuffelOffer[];
  };
}

// ── Public output types ──────────────────────────────────────────────────────

export interface MarketDataPoint {
  label: string;
  publicRate: number;
  arbiterRate: number;
  duffelId: string; // Duffel's id for persistent memory tracking
  type: "stays" | "flight";
}

export interface MarketIntelligenceResult {
  staysDataPoints: MarketDataPoint[];
  flightDataPoints: MarketDataPoint[];
  currency: string;
  fetchedAt: string;
  totalProperties: number;
  totalFlightOffers: number;
  avgStaysPublicRate: number;
  avgStaysArbiterRate: number;
  avgFlightPublicRate: number;
  avgFlightArbiterRate: number;
  avgSavingsPct: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isoDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function shortenAccommodationName(name: string): string {
  return name
    .replace(/\b(hotel|hotels|chicago|suites|inn|resort|&|the)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 20);
}

function flightLabel(offer: DuffelOffer): string {
  const seg = offer.slices[0]?.segments[0];
  if (!seg) return offer.id.slice(-6);
  return `${seg.operating_carrier.iata_code}${seg.marketing_carrier_flight_number}`;
}

function average(arr: number[]): number {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, n) => s + n, 0) / arr.length);
}

function buildMarketResult(
  staysDataPoints: MarketDataPoint[],
  flightDataPoints: MarketDataPoint[]
): MarketIntelligenceResult {
  const avgStaysPublicRate = average(staysDataPoints.map((d) => d.publicRate));
  const avgFlightPublicRate = average(flightDataPoints.map((d) => d.publicRate));

  return {
    staysDataPoints,
    flightDataPoints,
    currency: "USD",
    fetchedAt: new Date().toISOString(),
    totalProperties: staysDataPoints.length,
    totalFlightOffers: flightDataPoints.length,
    avgStaysPublicRate,
    avgStaysArbiterRate: Math.round(avgStaysPublicRate * ARBITER_MULTIPLIER),
    avgFlightPublicRate,
    avgFlightArbiterRate: Math.round(avgFlightPublicRate * ARBITER_MULTIPLIER),
    avgSavingsPct: 18.4,
  };
}

// ── Stays fetch ───────────────────────────────────────────────────────────────

async function fetchStays(): Promise<MarketDataPoint[]> {
  if (!process.env.DUFFEL_ACCESS_TOKEN) {
    return STAYS_FALLBACK;
  }

  const body = JSON.stringify({
    data: {
      check_in_date: isoDate(14),
      check_out_date: isoDate(15),
      rooms: 1,
      guests: [{ type: "adult" }],
      location: {
        radius: 5,
        geographic_coordinates: {
          // Chicago Loop
          latitude: 41.8781,
          longitude: -87.6298,
        },
      },
    },
  });

  let res: Response;
  try {
    res = await fetch(`${DUFFEL_BASE}/stays/search`, {
      method: "POST",
      headers: duffelHeaders(),
      body,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Duffel Stays search request failed:", error);
    return STAYS_FALLBACK;
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`Duffel Stays search failed ${res.status}: ${text}`);
    return STAYS_FALLBACK;
  }

  const json: DuffelStaysResponse = await res.json();
  const results = json.data.results
    .filter((r) => r.accommodation?.cheapest_rate_total_amount)
    .slice(0, 8)
    .map((r) => {
      const publicRate = parseFloat(r.accommodation.cheapest_rate_total_amount);
      return {
        label: shortenAccommodationName(r.accommodation.name),
        publicRate: Math.round(publicRate),
        arbiterRate: Math.round(publicRate * ARBITER_MULTIPLIER),
        duffelId: r.id, // result id for persistent memory tracking
        type: "stays" as const,
      };
    });

  if (results.length === 0) {
    return STAYS_FALLBACK;
  }
  return results;
}

// ── Flights fetch ─────────────────────────────────────────────────────────────

async function fetchFlights(): Promise<MarketDataPoint[]> {
  if (!process.env.DUFFEL_ACCESS_TOKEN) {
    return FLIGHTS_FALLBACK;
  }

  const body = JSON.stringify({
    data: {
      cabin_class: "economy",
      passengers: [{ type: "adult" }],
      slices: [
        {
          origin: "ORD",
          destination: "JFK",
          departure_date: isoDate(14),
        },
      ],
    },
  });

  let res: Response;
  try {
    res = await fetch(
      `${DUFFEL_BASE}/air/offer_requests?return_offers=true`,
      {
        method: "POST",
        headers: duffelHeaders(),
        body,
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Duffel Flights offer request failed:", error);
    return FLIGHTS_FALLBACK;
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`Duffel Flights offer request failed ${res.status}: ${text}`);
    return FLIGHTS_FALLBACK;
  }

  const json: DuffelFlightResponse = await res.json();
  const offers = json.data.offers
    .filter((o) => o.total_amount)
    .slice(0, 8)
    .map((o) => {
      const publicRate = parseFloat(o.total_amount);
      return {
        label: flightLabel(o),
        publicRate: Math.round(publicRate),
        arbiterRate: Math.round(publicRate * ARBITER_MULTIPLIER),
        duffelId: o.id, // offer id for persistent memory tracking
        type: "flight" as const,
      };
    });

  if (offers.length === 0) {
    return FLIGHTS_FALLBACK;
  }
  return offers;
}

// ── Cached aggregate ──────────────────────────────────────────────────────────

async function fetchMarketIntelligenceFresh(): Promise<MarketIntelligenceResult> {
  const [staysResult, flightsResult] = await Promise.allSettled([
    fetchStays(),
    fetchFlights(),
  ]);

  const staysDataPoints =
    staysResult.status === "fulfilled" ? staysResult.value : (console.error(staysResult.reason), []);
  const flightDataPoints =
    flightsResult.status === "fulfilled" ? flightsResult.value : (console.error(flightsResult.reason), []);

  return buildMarketResult(staysDataPoints, flightDataPoints);
}

const fetchMarketIntelligence = unstable_cache(
  async (): Promise<MarketIntelligenceResult> => fetchMarketIntelligenceFresh(),
  ["duffel-chi-market-intelligence"],
  { revalidate: 300, tags: ["market-inventory"] }
);

export async function getChicagoMarketIntelligence(): Promise<MarketIntelligenceResult> {
  return fetchMarketIntelligence();
}

export async function getChicagoMarketIntelligenceFresh(): Promise<MarketIntelligenceResult> {
  return fetchMarketIntelligenceFresh();
}
