export type AgentLifecycleStatus =
  | "Queued"
  | "Ringing"
  | "Negotiating"
  | "Finalizing"
  | "Completed"
  | "Failed";

export type NegotiationOutcome =
  | "Deal Closed"
  | "Callback requested"
  | "No Availability"
  | "Moved to higher up"
  | "Failure"
  | "Timed Out";

export type AgentStatus = AgentLifecycleStatus | NegotiationOutcome;

export type CompanyCard = {
  id: string;
  name: string;
  initials: string;
  type: "Hotel";
  totalSavings: string;
  positive: boolean;
  bookings: string;
};

export type SupplierNegotiation = {
  contractId: string;
  region: string;
  icon: string;
  duration: string;
  rate: string;
  savings: string;
  status: "ACTIVE" | "ARCHIVED";
};

export const agentRows: Array<{
  id: string;
  company: string;
  segment: string;
  target: string;
  negotiated: string;
  delta: string;
  deltaTone: string;
  status: AgentStatus;
}> = [
  {
    id: "hilton",
    company: "Hilton Hotels",
    segment: "Hospitality/The Loop",
    target: "$380.00",
    negotiated: "$310.00",
    delta: "(+18.4%)",
    deltaTone: "text-on-tertiary-container",
    status: "Negotiating",
  },
  {
    id: "marriott",
    company: "Marriott Bonvoy",
    segment: "Hospitality/River North",
    target: "$425.00",
    negotiated: "$355.00",
    delta: "(+16.5%)",
    deltaTone: "text-on-tertiary-container",
    status: "Deal Closed",
  },
  {
    id: "hyatt",
    company: "Hyatt Hotels",
    segment: "Hospitality/West Loop",
    target: "$295.00",
    negotiated: "$245.00",
    delta: "(+16.9%)",
    deltaTone: "text-on-tertiary-container",
    status: "Queued",
  },
  {
    id: "ihg",
    company: "IHG Hotels & Resorts",
    segment: "Hospitality/Streeterville",
    target: "$210.00",
    negotiated: "$165.00",
    delta: "(+21.4%)",
    deltaTone: "text-on-tertiary-container",
    status: "Finalizing",
  },
  {
    id: "loews",
    company: "Loews Hotels",
    segment: "Hospitality/Streeterville",
    target: "$490.00",
    negotiated: "$415.00",
    delta: "(+15.3%)",
    deltaTone: "text-on-tertiary-container",
    status: "Ringing",
  },
  {
    id: "sonesta",
    company: "Sonesta Hotels",
    segment: "Hospitality/The Loop",
    target: "$315.00",
    negotiated: "$240.00",
    delta: "(+23.8%)",
    deltaTone: "text-on-tertiary-container",
    status: "Callback requested",
  },
  {
    id: "langham",
    company: "Langham Hotels",
    segment: "Hospitality/River North",
    target: "$480.00",
    negotiated: "$410.00",
    delta: "(+14.6%)",
    deltaTone: "text-on-tertiary-container",
    status: "Negotiating",
  },
];

export const companyCards: CompanyCard[] = [
  {
    id: "hilton",
    name: "Hilton",
    initials: "H",
    type: "Hotel",
    totalSavings: "$329,400",
    positive: true,
    bookings: "4,821",
  },
  {
    id: "marriott",
    name: "Marriott",
    initials: "M",
    type: "Hotel",
    totalSavings: "$170,600",
    positive: true,
    bookings: "3,102",
  },
  {
    id: "hyatt",
    name: "Hyatt",
    initials: "H",
    type: "Hotel",
    totalSavings: "$98,700",
    positive: true,
    bookings: "1,850",
  },
  {
    id: "loews",
    name: "Loews",
    initials: "L",
    type: "Hotel",
    totalSavings: "$87,500",
    positive: true,
    bookings: "1,400",
  },
];

export const supplierNegotiations: SupplierNegotiation[] = [
  {
    contractId: "CHI-2025-1012",
    region: "Hilton / The Loop",
    icon: "apartment",
    duration: "24 Months",
    rate: "$310/avg",
    savings: "+$84,000",
    status: "ACTIVE",
  },
  {
    contractId: "CHI-2025-0615",
    region: "Marriott / River North",
    icon: "public",
    duration: "12 Months",
    rate: "$355/avg",
    savings: "+$56,000",
    status: "ARCHIVED",
  },
];

export const activityStream = [
  {
    price: "$310.00",
    badge: "Saved 18.4%",
    badgeTone: "bg-tertiary-fixed text-on-tertiary-container",
    detail: "-$70.00 from market rate",
    time: "2m ago",
    active: true,
  },
  {
    price: "$340.00",
    badge: null,
    badgeTone: "",
    detail: "+$55.00 Counter-offer received",
    detailTone: "bg-error-container text-on-error",
    time: "1h ago",
    active: false,
  },
  {
    price: "$285.00",
    badge: "Saved 6.3%",
    badgeTone: "bg-tertiary-fixed text-on-tertiary-container",
    detail: "-$95.00 Initial agent bid",
    time: "3h ago",
    active: false,
  },
];

export type EventAgentStatus = AgentLifecycleStatus;
export type EventStatus = "Active" | "Completed";

export type EventAgent = {
  negotiationId: string;
  companyId: string;
  company: string;
  type: "Hotel";
  status: EventAgentStatus;
  outcome?: NegotiationOutcome;
  originalPrice: string;
  negotiatedPrice: string;
  savings: string;
  isAccepted?: boolean;
};

export type GalileoEvent = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  attendees: number;
  service: "Hotel";
  status: EventStatus;
  agents: EventAgent[];
};

export const initialEvents: GalileoEvent[] = [
  {
    id: "q3-sales-kickoff",
    name: "Q3 Sales Kickoff",
    location: "Las Vegas, NV",
    startDate: "Oct 22, 2024",
    endDate: "Oct 26, 2024",
    attendees: 120,
    service: "Hotel",
    status: "Active",
    agents: [
      {
        negotiationId: "hilton",
        companyId: "hilton",
        company: "Hilton Hotels",
        type: "Hotel",
        status: "Negotiating",
        originalPrice: "$380/night",
        negotiatedPrice: "$310/night",
        savings: "$33,600",
        isAccepted: false,
      },
      {
        negotiationId: "marriott",
        companyId: "marriott",
        company: "Marriott Bonvoy",
        type: "Hotel",
        status: "Completed",
        outcome: "Deal Closed",
        originalPrice: "$425/night",
        negotiatedPrice: "$355/night",
        savings: "$33,600",
        isAccepted: false,
      },
    ],
  },
  {
    id: "annual-leadership-retreat",
    name: "Annual Leadership Retreat",
    location: "Miami, FL",
    startDate: "Nov 4, 2024",
    endDate: "Nov 7, 2024",
    attendees: 48,
    service: "Hotel",
    status: "Completed",
    agents: [
      {
        negotiationId: "hyatt",
        companyId: "hyatt",
        company: "Hyatt Hotels",
        type: "Hotel",
        status: "Completed",
        outcome: "Deal Closed",
        originalPrice: "$295/night",
        negotiatedPrice: "$245/night",
        savings: "$7,200",
        isAccepted: true,
      },
      {
        negotiationId: "ihg",
        companyId: "ihg",
        company: "IHG Hotels & Resorts",
        type: "Hotel",
        status: "Completed",
        outcome: "Callback requested",
        originalPrice: "$210/night",
        negotiatedPrice: "$165/night",
        savings: "$6,480",
        isAccepted: false,
      },
    ],
  },
  {
    id: "emea-partner-summit",
    name: "EMEA Partner Summit",
    location: "London, UK",
    startDate: "Dec 9, 2024",
    endDate: "Dec 12, 2024",
    attendees: 85,
    service: "Hotel",
    status: "Active",
    agents: [
      {
        negotiationId: "langham",
        companyId: "langham",
        company: "Langham Hotels",
        type: "Hotel",
        status: "Queued",
        originalPrice: "$480/night",
        negotiatedPrice: "$410/night",
        savings: "$17,850",
        isAccepted: false,
      },
      {
        negotiationId: "sonesta",
        companyId: "sonesta",
        company: "Sonesta Hotels",
        type: "Hotel",
        status: "Completed",
        outcome: "Moved to higher up",
        originalPrice: "$315/night",
        negotiatedPrice: "$240/night",
        savings: "$19,125",
        isAccepted: false,
      },
    ],
  },
];

export function getEvent(id: string) {
  return initialEvents.find((e) => e.id === id);
}

export function getEventForNegotiation(negotiationId: string) {
  return initialEvents.find((e) => e.agents.some((a) => a.negotiationId === negotiationId));
}

export function getAgentDisplayStatus(agent: Pick<EventAgent, "status" | "outcome">) {
  return agent.outcome ?? agent.status;
}

export function isClosedDeal(agent: Pick<EventAgent, "status" | "outcome">) {
  return agent.status === "Completed" && agent.outcome === "Deal Closed";
}

export function getStatusVariant(status: AgentStatus): "success" | "negotiating" | "neutral" | "error" {
  if (status === "Deal Closed" || status === "Completed") {
    return "success";
  }

  if (status === "Ringing" || status === "Negotiating") {
    return "negotiating";
  }

  if (status === "Failed" || status === "Failure" || status === "Timed Out") {
    return "error";
  }

  return "neutral";
}

export type CompanyLocationAnalytics = {
  label: string;
  subtitle: string;
  currentLocation: string;
  lifetimeSavings: string;
  savingsDelta: string;
  agreements: string;
  pricing: {
    "1Y": Array<{ label: string; negotiated: number; market: number }>;
    ALL: Array<{ label: string; negotiated: number; market: number }>;
  };
  eventIds: string[];
};

export type FullCompanyProfile = {
  displayName: string;
  description: string;
  initials: string;
  bookingWindowScores: Array<{ label: string; score: number }>;
  locations: Record<string, CompanyLocationAnalytics>;
};

// Data derived from:
//   src/data/San Francisco Hospitality Market Data - Chicago Historic Pricing.csv
//   src/data/San Francisco Hospitality Market Data - Chicago Past Negotiations.csv
export const companyProfiles: Record<string, FullCompanyProfile> = {
  hilton: {
    displayName: "Hilton Hotels",
    description:
      "Three-property Chicago footprint spanning The Loop, Gold Coast, and Streeterville. Agents have consistently achieved 18–19% reductions off rack, with The Loop delivering the deepest concessions in low-demand winter months.",
    initials: "H",
    bookingWindowScores: [
      { label: "JAN", score: 88 }, { label: "FEB", score: 95 }, { label: "MAR", score: 62 },
      { label: "APR", score: 42 }, { label: "MAY", score: 30 }, { label: "JUN", score: 18 },
      { label: "JUL", score: 22 }, { label: "AUG", score: 28 }, { label: "SEP", score: 55 },
      { label: "OCT", score: 65 }, { label: "NOV", score: 72 }, { label: "DEC", score: 85 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Portfolio-wide view across The Loop, Gold Coast, and Streeterville",
        currentLocation: "Chicago, IL",
        lifetimeSavings: "$329,400",
        savingsDelta: "+18.7%",
        agreements: "3 Chicago-area properties negotiated across 4 active master rate agreements.",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 156, market: 192 },
            { label: "MAR", negotiated: 202, market: 248 },
            { label: "MAY", negotiated: 252, market: 310 },
            { label: "JUN", negotiated: 281, market: 345 },
            { label: "SEP", negotiated: 240, market: 295 },
            { label: "NOV", negotiated: 185, market: 228 },
          ],
          ALL: [
            { label: "JAN", negotiated: 150, market: 185 },
            { label: "MAR", negotiated: 205, market: 252 },
            { label: "MAY", negotiated: 259, market: 318 },
            { label: "JUL", negotiated: 278, market: 342 },
            { label: "SEP", negotiated: 240, market: 295 },
            { label: "NOV", negotiated: 191, market: 235 },
          ],
        },
        eventIds: ["q3-sales-kickoff"],
      },
      theloop: {
        label: "The Loop",
        subtitle: "Downtown core — strongest winter concession window",
        currentLocation: "The Loop, Chicago",
        lifetimeSavings: "$234,500",
        savingsDelta: "+18.4%",
        agreements: "2 active agreements. Starting rate $380 → negotiated $310 (Oct 2025); $395 → $320 (Jun 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 150, market: 185 },
            { label: "MAR", negotiated: 199, market: 245 },
            { label: "MAY", negotiated: 250, market: 308 },
            { label: "JUN", negotiated: 281, market: 345 },
            { label: "SEP", negotiated: 240, market: 295 },
            { label: "NOV", negotiated: 180, market: 222 },
          ],
          ALL: [
            { label: "JAN", negotiated: 145, market: 178 },
            { label: "MAR", negotiated: 195, market: 240 },
            { label: "MAY", negotiated: 248, market: 305 },
            { label: "JUL", negotiated: 275, market: 338 },
            { label: "SEP", negotiated: 240, market: 295 },
            { label: "NOV", negotiated: 178, market: 219 },
          ],
        },
        eventIds: ["q3-sales-kickoff"],
      },
      goldcoast: {
        label: "Gold Coast",
        subtitle: "Premium residential corridor — strong summer compression",
        currentLocation: "Gold Coast, Chicago",
        lifetimeSavings: "$94,900",
        savingsDelta: "+18.8%",
        agreements: "1 active agreement. Starting rate $320 → negotiated $260 (Apr 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 158, market: 195 },
            { label: "MAR", negotiated: 209, market: 258 },
            { label: "MAY", negotiated: 253, market: 312 },
            { label: "JUL", negotiated: 297, market: 365 },
            { label: "SEP", negotiated: 258, market: 318 },
            { label: "NOV", negotiated: 191, market: 235 },
          ],
          ALL: [
            { label: "JAN", negotiated: 155, market: 190 },
            { label: "MAR", negotiated: 205, market: 252 },
            { label: "MAY", negotiated: 250, market: 308 },
            { label: "JUL", negotiated: 297, market: 365 },
            { label: "SEP", negotiated: 260, market: 320 },
            { label: "NOV", negotiated: 188, market: 231 },
          ],
        },
        eventIds: [],
      },
    },
  },

  marriott: {
    displayName: "Marriott Bonvoy",
    description:
      "Multi-property presence across River North, McCormick Place, and The Loop. Agents leverage Marriott's volume sensitivity to secure 16–17% concessions, with McCormick delivering the most favorable low-season rates in January.",
    initials: "M",
    bookingWindowScores: [
      { label: "JAN", score: 85 }, { label: "FEB", score: 88 }, { label: "MAR", score: 55 },
      { label: "APR", score: 40 }, { label: "MAY", score: 35 }, { label: "JUN", score: 22 },
      { label: "JUL", score: 18 }, { label: "AUG", score: 10 }, { label: "SEP", score: 28 },
      { label: "OCT", score: 42 }, { label: "NOV", score: 65 }, { label: "DEC", score: 92 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Portfolio view across River North, McCormick Place, and The Loop",
        currentLocation: "Chicago, IL",
        lifetimeSavings: "$170,600",
        savingsDelta: "+16.8%",
        agreements: "3 Chicago properties across 5 program agreements.",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 154, market: 185 },
            { label: "APR", negotiated: 258, market: 310 },
            { label: "JUN", negotiated: 308, market: 370 },
            { label: "AUG", negotiated: 341, market: 410 },
            { label: "SEP", negotiated: 262, market: 315 },
            { label: "DEC", negotiated: 183, market: 220 },
          ],
          ALL: [
            { label: "JAN", negotiated: 148, market: 178 },
            { label: "APR", negotiated: 255, market: 307 },
            { label: "JUN", negotiated: 305, market: 366 },
            { label: "AUG", negotiated: 341, market: 410 },
            { label: "SEP", negotiated: 262, market: 315 },
            { label: "DEC", negotiated: 183, market: 220 },
          ],
        },
        eventIds: ["q3-sales-kickoff"],
      },
      rivernorth: {
        label: "River North",
        subtitle: "Entertainment district — strong demand Aug–Sep, deep discounts in December",
        currentLocation: "River North, Chicago",
        lifetimeSavings: "$121,800",
        savingsDelta: "+16.5%",
        agreements: "2 active agreements. Starting rate $425 → negotiated $355 (Jun 2025); $225 → $185 (Nov 2024).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 191, market: 230 },
            { label: "APR", negotiated: 258, market: 310 },
            { label: "JUN", negotiated: 316, market: 380 },
            { label: "AUG", negotiated: 341, market: 410 },
            { label: "SEP", negotiated: 306, market: 368 },
            { label: "DEC", negotiated: 183, market: 220 },
          ],
          ALL: [
            { label: "JAN", negotiated: 186, market: 224 },
            { label: "APR", negotiated: 258, market: 310 },
            { label: "JUN", negotiated: 313, market: 376 },
            { label: "AUG", negotiated: 341, market: 410 },
            { label: "SEP", negotiated: 307, market: 369 },
            { label: "DEC", negotiated: 183, market: 220 },
          ],
        },
        eventIds: ["q3-sales-kickoff"],
      },
      mccormick: {
        label: "McCormick Place",
        subtitle: "Convention campus — lowest rates in January, peaks in September",
        currentLocation: "McCormick Place, Chicago",
        lifetimeSavings: "$48,800",
        savingsDelta: "+16.2%",
        agreements: "1 active agreement. Starting rate $340 → negotiated $285 (Sep 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 116, market: 140 },
            { label: "MAR", negotiated: 157, market: 188 },
            { label: "MAY", negotiated: 202, market: 242 },
            { label: "JUL", negotiated: 248, market: 298 },
            { label: "SEP", negotiated: 285, market: 315 },
            { label: "NOV", negotiated: 226, market: 272 },
          ],
          ALL: [
            { label: "JAN", negotiated: 116, market: 140 },
            { label: "MAR", negotiated: 160, market: 192 },
            { label: "MAY", negotiated: 207, market: 248 },
            { label: "JUL", negotiated: 252, market: 302 },
            { label: "SEP", negotiated: 285, market: 315 },
            { label: "NOV", negotiated: 230, market: 275 },
          ],
        },
        eventIds: [],
      },
    },
  },

  hyatt: {
    displayName: "Hyatt Hotels",
    description:
      "Strong presence in Chicago's West Loop and Magnificent Mile. Hyatt's volume-based rate structure enables agents to achieve 17–18% savings, with the sharpest concessions available in February before convention season accelerates rates into Q3.",
    initials: "H",
    bookingWindowScores: [
      { label: "JAN", score: 85 }, { label: "FEB", score: 92 }, { label: "MAR", score: 62 },
      { label: "APR", score: 40 }, { label: "MAY", score: 28 }, { label: "JUN", score: 20 },
      { label: "JUL", score: 12 }, { label: "AUG", score: 15 }, { label: "SEP", score: 22 },
      { label: "OCT", score: 10 }, { label: "NOV", score: 45 }, { label: "DEC", score: 72 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Portfolio view across West Loop and Magnificent Mile",
        currentLocation: "Chicago, IL",
        lifetimeSavings: "$98,700",
        savingsDelta: "+17.6%",
        agreements: "2 properties across 3 program agreements.",
        pricing: {
          "1Y": [
            { label: "FEB", negotiated: 181, market: 220 },
            { label: "MAR", negotiated: 267, market: 325 },
            { label: "MAY", negotiated: 326, market: 396 },
            { label: "JUL", negotiated: 363, market: 440 },
            { label: "SEP", negotiated: 363, market: 440 },
            { label: "OCT", negotiated: 374, market: 450 },
          ],
          ALL: [
            { label: "FEB", negotiated: 178, market: 216 },
            { label: "MAR", negotiated: 262, market: 318 },
            { label: "MAY", negotiated: 330, market: 401 },
            { label: "JUL", negotiated: 363, market: 440 },
            { label: "SEP", negotiated: 366, market: 444 },
            { label: "OCT", negotiated: 374, market: 454 },
          ],
        },
        eventIds: ["annual-leadership-retreat"],
      },
      westloop: {
        label: "West Loop",
        subtitle: "Tech and finance district — extreme October peaks, strong winter savings",
        currentLocation: "West Loop, Chicago",
        lifetimeSavings: "$71,200",
        savingsDelta: "+17.3%",
        agreements: "2 active agreements. Starting rate $295 → negotiated $245 (Mar 2025); $215 → $175 (Feb 2025).",
        pricing: {
          "1Y": [
            { label: "FEB", negotiated: 179, market: 218 },
            { label: "MAR", negotiated: 227, market: 275 },
            { label: "MAY", negotiated: 287, market: 348 },
            { label: "JUL", negotiated: 363, market: 440 },
            { label: "SEP", negotiated: 342, market: 415 },
            { label: "OCT", negotiated: 408, market: 495 },
          ],
          ALL: [
            { label: "FEB", negotiated: 175, market: 212 },
            { label: "MAR", negotiated: 227, market: 275 },
            { label: "MAY", negotiated: 293, market: 355 },
            { label: "JUL", negotiated: 363, market: 440 },
            { label: "SEP", negotiated: 345, market: 418 },
            { label: "OCT", negotiated: 408, market: 495 },
          ],
        },
        eventIds: ["annual-leadership-retreat"],
      },
      magmile: {
        label: "Magnificent Mile",
        subtitle: "Retail and leisure corridor — highest rack rates, strong negotiation upside",
        currentLocation: "Magnificent Mile, Chicago",
        lifetimeSavings: "$27,500",
        savingsDelta: "+17.3%",
        agreements: "1 active agreement. Starting rate $405 → negotiated $335 (Oct 2024).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 260, market: 315 },
            { label: "MAR", negotiated: 311, market: 378 },
            { label: "MAY", negotiated: 362, market: 440 },
            { label: "JUL", negotiated: 430, market: 522 },
            { label: "SEP", negotiated: 386, market: 468 },
            { label: "OCT", negotiated: 335, market: 405 },
          ],
          ALL: [
            { label: "JAN", negotiated: 256, market: 310 },
            { label: "MAR", negotiated: 308, market: 373 },
            { label: "MAY", negotiated: 365, market: 443 },
            { label: "JUL", negotiated: 433, market: 525 },
            { label: "SEP", negotiated: 389, market: 472 },
            { label: "OCT", negotiated: 335, market: 405 },
          ],
        },
        eventIds: [],
      },
    },
  },

  ihg: {
    displayName: "IHG Hotels & Resorts",
    description:
      "Three Chicago locations including InterContinental Streeterville, The Loop, and Kimpton River North. IHG delivers the deepest discount rates in the portfolio — agents average 20–21% reductions — with January offering sub-$165 negotiated rates at Streeterville.",
    initials: "I",
    bookingWindowScores: [
      { label: "JAN", score: 95 }, { label: "FEB", score: 90 }, { label: "MAR", score: 62 },
      { label: "APR", score: 40 }, { label: "MAY", score: 28 }, { label: "JUN", score: 10 },
      { label: "JUL", score: 12 }, { label: "AUG", score: 18 }, { label: "SEP", score: 30 },
      { label: "OCT", score: 48 }, { label: "NOV", score: 82 }, { label: "DEC", score: 88 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Portfolio view across Streeterville, The Loop, and River North",
        currentLocation: "Chicago, IL",
        lifetimeSavings: "$121,000",
        savingsDelta: "+20.5%",
        agreements: "3 properties across 3 program agreements.",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 135, market: 170 },
            { label: "MAR", negotiated: 178, market: 224 },
            { label: "MAY", negotiated: 230, market: 289 },
            { label: "JUN", negotiated: 270, market: 340 },
            { label: "SEP", negotiated: 234, market: 295 },
            { label: "NOV", negotiated: 152, market: 192 },
          ],
          ALL: [
            { label: "JAN", negotiated: 131, market: 165 },
            { label: "MAR", negotiated: 175, market: 220 },
            { label: "MAY", negotiated: 230, market: 290 },
            { label: "JUN", negotiated: 268, market: 337 },
            { label: "SEP", negotiated: 234, market: 295 },
            { label: "NOV", negotiated: 151, market: 190 },
          ],
        },
        eventIds: ["annual-leadership-retreat"],
      },
      streeterville: {
        label: "Streeterville",
        subtitle: "InterContinental — June peaks at $385, January floor at $165",
        currentLocation: "Streeterville, Chicago",
        lifetimeSavings: "$79,200",
        savingsDelta: "+21.4%",
        agreements: "1 active agreement. Starting rate $210 → negotiated $165 (Nov 2024).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 131, market: 165 },
            { label: "MAR", negotiated: 175, market: 220 },
            { label: "MAY", negotiated: 230, market: 290 },
            { label: "JUN", negotiated: 306, market: 385 },
            { label: "SEP", negotiated: 234, market: 295 },
            { label: "NOV", negotiated: 151, market: 190 },
          ],
          ALL: [
            { label: "JAN", negotiated: 131, market: 165 },
            { label: "MAR", negotiated: 178, market: 224 },
            { label: "MAY", negotiated: 234, market: 295 },
            { label: "JUN", negotiated: 306, market: 385 },
            { label: "SEP", negotiated: 237, market: 298 },
            { label: "NOV", negotiated: 151, market: 190 },
          ],
        },
        eventIds: ["annual-leadership-retreat"],
      },
      theloop: {
        label: "The Loop",
        subtitle: "Central business district — strong mid-year availability",
        currentLocation: "The Loop, Chicago",
        lifetimeSavings: "$41,800",
        savingsDelta: "+20.7%",
        agreements: "1 active agreement. Starting rate $290 → negotiated $230 (May 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 139, market: 175 },
            { label: "MAR", negotiated: 181, market: 228 },
            { label: "MAY", negotiated: 230, market: 290 },
            { label: "JUL", negotiated: 256, market: 322 },
            { label: "SEP", negotiated: 234, market: 295 },
            { label: "NOV", negotiated: 155, market: 195 },
          ],
          ALL: [
            { label: "JAN", negotiated: 136, market: 171 },
            { label: "MAR", negotiated: 178, market: 224 },
            { label: "MAY", negotiated: 230, market: 290 },
            { label: "JUL", negotiated: 254, market: 320 },
            { label: "SEP", negotiated: 234, market: 295 },
            { label: "NOV", negotiated: 153, market: 192 },
          ],
        },
        eventIds: [],
      },
    },
  },

  loews: {
    displayName: "Loews Hotels",
    description:
      "Streeterville flagship with strong summer compression and reliable year-round availability. Agents have achieved 15–20% reductions across two separate negotiations, with February offering the deepest concessions at sub-$220 negotiated rates.",
    initials: "L",
    bookingWindowScores: [
      { label: "JAN", score: 90 }, { label: "FEB", score: 92 }, { label: "MAR", score: 55 },
      { label: "APR", score: 38 }, { label: "MAY", score: 30 }, { label: "JUN", score: 20 },
      { label: "JUL", score: 12 }, { label: "AUG", score: 15 }, { label: "SEP", score: 25 },
      { label: "OCT", score: 48 }, { label: "NOV", score: 70 }, { label: "DEC", score: 85 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Streeterville portfolio — summer peaks, strong winter value",
        currentLocation: "Streeterville, Chicago",
        lifetimeSavings: "$87,500",
        savingsDelta: "+17.9%",
        agreements: "2 program agreements. Starting rates $490 → $415 (Jul 2025); $245 → $195 (Mar 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 172, market: 210 },
            { label: "MAR", negotiated: 238, market: 290 },
            { label: "MAY", negotiated: 263, market: 320 },
            { label: "JUL", negotiated: 370, market: 450 },
            { label: "SEP", negotiated: 324, market: 395 },
            { label: "NOV", negotiated: 218, market: 265 },
          ],
          ALL: [
            { label: "JAN", negotiated: 168, market: 205 },
            { label: "MAR", negotiated: 235, market: 286 },
            { label: "MAY", negotiated: 263, market: 320 },
            { label: "JUL", negotiated: 370, market: 450 },
            { label: "SEP", negotiated: 327, market: 398 },
            { label: "NOV", negotiated: 220, market: 268 },
          ],
        },
        eventIds: [],
      },
    },
  },

  sonesta: {
    displayName: "Sonesta Hotels",
    description:
      "Value-tier presence in The Loop and River North with the highest average discount rate in the portfolio at 21–24%. February marks the deepest floor at $145 market rate in The Loop, while July brings River North into its seasonal peak at $360.",
    initials: "S",
    bookingWindowScores: [
      { label: "JAN", score: 92 }, { label: "FEB", score: 95 }, { label: "MAR", score: 62 },
      { label: "APR", score: 40 }, { label: "MAY", score: 30 }, { label: "JUN", score: 18 },
      { label: "JUL", score: 15 }, { label: "AUG", score: 12 }, { label: "SEP", score: 28 },
      { label: "OCT", score: 45 }, { label: "NOV", score: 70 }, { label: "DEC", score: 85 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "Portfolio view across The Loop and River North",
        currentLocation: "Chicago, IL",
        lifetimeSavings: "$71,100",
        savingsDelta: "+21.6%",
        agreements: "2 properties across 2 program agreements.",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 135, market: 173 },
            { label: "MAR", negotiated: 174, market: 222 },
            { label: "MAY", negotiated: 221, market: 282 },
            { label: "JUL", negotiated: 257, market: 328 },
            { label: "SEP", negotiated: 252, market: 322 },
            { label: "NOV", negotiated: 187, market: 238 },
          ],
          ALL: [
            { label: "JAN", negotiated: 131, market: 168 },
            { label: "MAR", negotiated: 171, market: 218 },
            { label: "MAY", negotiated: 218, market: 278 },
            { label: "JUL", negotiated: 257, market: 328 },
            { label: "SEP", negotiated: 252, market: 322 },
            { label: "NOV", negotiated: 184, market: 234 },
          ],
        },
        eventIds: ["emea-partner-summit"],
      },
      theloop: {
        label: "The Loop",
        subtitle: "Budget-friendly Loop option — Feb floor $145, August peaks $315",
        currentLocation: "The Loop, Chicago",
        lifetimeSavings: "$47,800",
        savingsDelta: "+23.8%",
        agreements: "1 active agreement. Starting rate $315 → negotiated $240 (Aug 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 116, market: 148 },
            { label: "MAR", negotiated: 145, market: 185 },
            { label: "MAY", negotiated: 190, market: 242 },
            { label: "JUN", negotiated: 231, market: 295 },
            { label: "AUG", negotiated: 240, market: 315 },
            { label: "NOV", negotiated: 168, market: 215 },
          ],
          ALL: [
            { label: "JAN", negotiated: 113, market: 145 },
            { label: "MAR", negotiated: 147, market: 188 },
            { label: "MAY", negotiated: 192, market: 245 },
            { label: "JUN", negotiated: 231, market: 295 },
            { label: "AUG", negotiated: 247, market: 318 },
            { label: "NOV", negotiated: 171, market: 218 },
          ],
        },
        eventIds: ["emea-partner-summit"],
      },
      rivernorth: {
        label: "River North",
        subtitle: "Entertainment district — July peak $360, strong winter availability",
        currentLocation: "River North, Chicago",
        lifetimeSavings: "$23,300",
        savingsDelta: "+19.4%",
        agreements: "1 active agreement. Starting rate $360 → negotiated $290 (Jul 2025).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 155, market: 198 },
            { label: "MAR", negotiated: 202, market: 258 },
            { label: "MAY", negotiated: 252, market: 322 },
            { label: "JUL", negotiated: 290, market: 360 },
            { label: "SEP", negotiated: 255, market: 325 },
            { label: "NOV", negotiated: 204, market: 260 },
          ],
          ALL: [
            { label: "JAN", negotiated: 151, market: 193 },
            { label: "MAR", negotiated: 198, market: 253 },
            { label: "MAY", negotiated: 248, market: 317 },
            { label: "JUL", negotiated: 290, market: 360 },
            { label: "SEP", negotiated: 257, market: 328 },
            { label: "NOV", negotiated: 202, market: 257 },
          ],
        },
        eventIds: [],
      },
    },
  },

  langham: {
    displayName: "Langham Hotels",
    description:
      "Ultra-luxury River North property with the highest rack rates in the Chicago portfolio. Market rates range from $380 in December to $695 in August. Agents have achieved 14–15% reductions against an elevated ask, delivering $410 negotiated rates on $480 starting bids.",
    initials: "L",
    bookingWindowScores: [
      { label: "JAN", score: 72 }, { label: "FEB", score: 75 }, { label: "MAR", score: 60 },
      { label: "APR", score: 40 }, { label: "MAY", score: 25 }, { label: "JUN", score: 18 },
      { label: "JUL", score: 15 }, { label: "AUG", score: 10 }, { label: "SEP", score: 22 },
      { label: "OCT", score: 38 }, { label: "NOV", score: 55 }, { label: "DEC", score: 68 },
    ],
    locations: {
      all: {
        label: "All Locations",
        subtitle: "River North luxury flagship — highest rates, consistent negotiation savings",
        currentLocation: "River North, Chicago",
        lifetimeSavings: "$45,500",
        savingsDelta: "+14.6%",
        agreements: "1 active agreement. Starting rate $480 → negotiated $410 (Dec 2024).",
        pricing: {
          "1Y": [
            { label: "JAN", negotiated: 337, market: 395 },
            { label: "MAR", negotiated: 359, market: 420 },
            { label: "MAY", negotiated: 451, market: 528 },
            { label: "AUG", negotiated: 594, market: 695 },
            { label: "SEP", negotiated: 534, market: 625 },
            { label: "DEC", negotiated: 325, market: 380 },
          ],
          ALL: [
            { label: "JAN", negotiated: 332, market: 388 },
            { label: "MAR", negotiated: 359, market: 420 },
            { label: "MAY", negotiated: 455, market: 533 },
            { label: "AUG", negotiated: 594, market: 695 },
            { label: "SEP", negotiated: 537, market: 628 },
            { label: "DEC", negotiated: 325, market: 380 },
          ],
        },
        eventIds: ["emea-partner-summit"],
      },
    },
  },
};

export function getFullCompanyProfile(id: string): FullCompanyProfile {
  const fallbackName = id.charAt(0).toUpperCase() + id.slice(1);
  return (
    companyProfiles[id] ?? {
      displayName: fallbackName,
      description: "Corporate hospitality procurement partner.",
      initials: fallbackName[0],
      bookingWindowScores: [
        { label: "JAN", score: 70 }, { label: "FEB", score: 80 }, { label: "MAR", score: 55 },
        { label: "APR", score: 40 }, { label: "MAY", score: 30 }, { label: "JUN", score: 20 },
        { label: "JUL", score: 15 }, { label: "AUG", score: 18 }, { label: "SEP", score: 30 },
        { label: "OCT", score: 45 }, { label: "NOV", score: 60 }, { label: "DEC", score: 75 },
      ],
      locations: {
        all: {
          label: "All Locations",
          subtitle: "",
          currentLocation: "Chicago, IL",
          lifetimeSavings: "—",
          savingsDelta: "—",
          agreements: "—",
          pricing: { "1Y": [], ALL: [] },
          eventIds: [],
        },
      },
    }
  );
}

export function getSupplierProfile(id: string) {
  const fallbackName = id.charAt(0).toUpperCase() + id.slice(1);
  const company = companyCards.find((item) => item.id === id);
  const fullProfile = companyProfiles[id];

  return {
    id,
    name: company?.name ?? fallbackName,
    displayName: fullProfile?.displayName ?? fallbackName,
    initials: fullProfile?.initials ?? company?.initials ?? fallbackName.slice(0, 1).toUpperCase(),
    type: "Hotel" as const,
    description:
      fullProfile?.description ??
      "A long-term hospitality procurement partner with dense urban inventory, resilient corporate rate structures, and consistent service-level compliance across managed travel programs.",
  };
}
