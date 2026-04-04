export type AgentStatus = "Negotiating" | "Reviewing" | "Optimized";

export type CompanyCard = {
  id: string;
  name: string;
  initials: string;
  segment: string;
  totalSavings: string;
  yoy: string;
  positive: boolean;
  avgDelta: string;
  bookings: string;
  badge: string;
  badgeClassName: string;
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
    company: "Hilton Worldwide",
    segment: "Hospitality/Corporate",
    target: "$185.00",
    negotiated: "$192.50",
    delta: "(-3.4%)",
    deltaTone: "text-secondary",
    status: "Negotiating",
  },
  {
    id: "delta",
    company: "Delta Air Lines",
    segment: "Aviation/Logistics",
    target: "$450.00",
    negotiated: "$455.00",
    delta: "(-1.1%)",
    deltaTone: "text-on-surface",
    status: "Reviewing",
  },
  {
    id: "marriott",
    company: "Marriott Intl.",
    segment: "Hospitality/Luxury",
    target: "$210.00",
    negotiated: "$208.00",
    delta: "(+0.9%)",
    deltaTone: "text-on-tertiary-container",
    status: "Optimized",
  },
  {
    id: "hyatt",
    company: "Hyatt Hotels",
    segment: "Hospitality/Upscale",
    target: "$195.00",
    negotiated: "$201.00",
    delta: "(-2.9%)",
    deltaTone: "text-secondary",
    status: "Negotiating",
  },
  {
    id: "united",
    company: "United Airlines",
    segment: "Aviation/Global",
    target: "$520.00",
    negotiated: "$510.00",
    delta: "(+2.0%)",
    deltaTone: "text-on-tertiary-container",
    status: "Optimized",
  },
  {
    id: "ihg",
    company: "IHG Hotels & Resorts",
    segment: "Hospitality/Extended Stay",
    target: "$165.00",
    negotiated: "$172.00",
    delta: "(-4.1%)",
    deltaTone: "text-secondary",
    status: "Negotiating",
  },
  {
    id: "american",
    company: "American Airlines",
    segment: "Aviation/Domestic",
    target: "$380.00",
    negotiated: "$382.00",
    delta: "(-0.5%)",
    deltaTone: "text-on-surface",
    status: "Reviewing",
  },
  {
    id: "wyndham",
    company: "Wyndham Hotels",
    segment: "Hospitality/Budget",
    target: "$120.00",
    negotiated: "$118.00",
    delta: "(+1.7%)",
    deltaTone: "text-on-tertiary-container",
    status: "Optimized",
  },
  {
    id: "southwest",
    company: "Southwest Airlines",
    segment: "Aviation/Regional",
    target: "$290.00",
    negotiated: "$295.00",
    delta: "(-1.7%)",
    deltaTone: "text-secondary",
    status: "Negotiating",
  },
  {
    id: "accor",
    company: "Accor Hotels",
    segment: "Hospitality/European",
    target: "$230.00",
    negotiated: "$235.00",
    delta: "(-2.1%)",
    deltaTone: "text-on-surface",
    status: "Reviewing",
  },
  {
    id: "radisson",
    company: "Radisson Group",
    segment: "Hospitality/Midscale",
    target: "$155.00",
    negotiated: "$153.00",
    delta: "(+1.3%)",
    deltaTone: "text-on-tertiary-container",
    status: "Optimized",
  },
  {
    id: "lufthansa",
    company: "Lufthansa Group",
    segment: "Aviation/International",
    target: "$680.00",
    negotiated: "$695.00",
    delta: "(-2.2%)",
    deltaTone: "text-secondary",
    status: "Negotiating",
  },
];

export const companyCards: CompanyCard[] = [
  {
    id: "hilton",
    name: "Hilton",
    initials: "H",
    segment: "Global hospitality portfolio",
    totalSavings: "$1,240,500",
    yoy: "+12% YoY",
    positive: true,
    avgDelta: "18.4%",
    bookings: "4,821",
    badge: "Strategic Partner",
    badgeClassName: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
  {
    id: "marriott",
    name: "Marriott",
    initials: "M",
    segment: "Luxury and extended stay",
    totalSavings: "$842,200",
    yoy: "+8% YoY",
    positive: true,
    avgDelta: "15.2%",
    bookings: "3,102",
    badge: "Preferred Supplier",
    badgeClassName: "bg-surface-container-highest text-on-secondary-fixed-variant",
  },
  {
    id: "delta",
    name: "Delta",
    initials: "D",
    segment: "Corporate aviation and logistics",
    totalSavings: "$2,105,800",
    yoy: "+21% YoY",
    positive: true,
    avgDelta: "24.1%",
    bookings: "12,544",
    badge: "Strategic Partner",
    badgeClassName: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  },
  {
    id: "hyatt",
    name: "Hyatt",
    initials: "H",
    segment: "Upper-upscale hospitality",
    totalSavings: "$412,000",
    yoy: "-2% YoY",
    positive: false,
    avgDelta: "9.2%",
    bookings: "1,850",
    badge: "Preferred Supplier",
    badgeClassName: "bg-surface-container-highest text-on-secondary-fixed-variant",
  },
];

export const supplierNegotiations: SupplierNegotiation[] = [
  {
    contractId: "LH-2023-0492",
    region: "EMEA Corporate",
    icon: "public",
    duration: "24 Months",
    rate: "$242/avg",
    savings: "+$420,000",
    status: "ACTIVE",
  },
  {
    contractId: "LH-2022-0115",
    region: "North America",
    icon: "apartment",
    duration: "12 Months",
    rate: "$310/avg",
    savings: "+$285,000",
    status: "ARCHIVED",
  },
  {
    contractId: "LH-2021-0882",
    region: "APAC Logistics",
    icon: "flight_takeoff",
    duration: "36 Months",
    rate: "$185/avg",
    savings: "+$512,000",
    status: "ARCHIVED",
  },
];

export const activityStream = [
  {
    price: "$245.00",
    badge: "Saved 5.2%",
    badgeTone: "bg-tertiary-fixed text-on-tertiary-container",
    detail: "-$15.00 from previous bid",
    time: "2m ago",
    active: true,
  },
  {
    price: "$260.00",
    badge: null,
    badgeTone: "",
    detail: "+$10.00 Counter-offer received",
    detailTone: "bg-error-container text-on-error",
    time: "1h ago",
    active: false,
  },
  {
    price: "$250.00",
    badge: "Saved 2.1%",
    badgeTone: "bg-tertiary-fixed text-on-tertiary-container",
    detail: "-$8.00 Initial agent push",
    time: "3h ago",
    active: false,
  },
];

export type EventAgentStatus = "Negotiating" | "Reviewing" | "Completed";
export type EventStatus = "Active" | "Completed";

export type EventAgent = {
  negotiationId: string;
  company: string;
  type: "Hotel" | "Airline";
  status: EventAgentStatus;
  originalPrice: string;
  negotiatedPrice: string;
  savings: string;
  isWinner?: boolean;
};

export type GalileoEvent = {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  attendees: number;
  service: "Hotel" | "Airline" | "Both";
  status: EventStatus;
  agents: EventAgent[];
};

export const events: GalileoEvent[] = [
  {
    id: "q3-sales-kickoff",
    name: "Q3 Sales Kickoff",
    location: "Las Vegas, NV",
    startDate: "Oct 22, 2024",
    endDate: "Oct 26, 2024",
    attendees: 120,
    service: "Both",
    status: "Active",
    agents: [
      {
        negotiationId: "hilton",
        company: "Hilton Worldwide",
        type: "Hotel",
        status: "Negotiating",
        originalPrice: "$245/night",
        negotiatedPrice: "$192/night",
        savings: "$6,360",
        isWinner: false,
      },
      {
        negotiationId: "marriott",
        company: "Marriott Intl.",
        type: "Hotel",
        status: "Completed",
        originalPrice: "$260/night",
        negotiatedPrice: "$208/night",
        savings: "$8,320",
        isWinner: false,
      },
      {
        negotiationId: "delta",
        company: "Delta Air Lines",
        type: "Airline",
        status: "Reviewing",
        originalPrice: "$520/seat",
        negotiatedPrice: "$455/seat",
        savings: "$7,800",
        isWinner: false,
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
    service: "Both",
    status: "Completed",
    agents: [
      {
        negotiationId: "hyatt",
        company: "Hyatt Hotels",
        type: "Hotel",
        status: "Completed",
        originalPrice: "$310/night",
        negotiatedPrice: "$201/night",
        savings: "$13,104",
        isWinner: true,
      },
      {
        negotiationId: "ihg",
        company: "IHG Hotels & Resorts",
        type: "Hotel",
        status: "Completed",
        originalPrice: "$295/night",
        negotiatedPrice: "$220/night",
        savings: "$10,800",
        isWinner: false,
      },
      {
        negotiationId: "american",
        company: "American Airlines",
        type: "Airline",
        status: "Completed",
        originalPrice: "$480/seat",
        negotiatedPrice: "$382/seat",
        savings: "$4,704",
        isWinner: true,
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
        negotiationId: "lufthansa",
        company: "Lufthansa Group",
        type: "Hotel",
        status: "Negotiating",
        originalPrice: "$380/night",
        negotiatedPrice: "$310/night",
        savings: "$17,850",
        isWinner: false,
      },
      {
        negotiationId: "accor",
        company: "Accor Hotels",
        type: "Hotel",
        status: "Negotiating",
        originalPrice: "$350/night",
        negotiatedPrice: "$290/night",
        savings: "$15,300",
        isWinner: false,
      },
    ],
  },
];

export function getEvent(id: string) {
  return events.find((e) => e.id === id);
}

export function getEventForNegotiation(negotiationId: string) {
  return events.find((e) => e.agents.some((a) => a.negotiationId === negotiationId));
}

export function getSupplierProfile(id: string) {
  const fallbackName = id.charAt(0).toUpperCase() + id.slice(1);
  const company = companyCards.find((item) => item.id === id);

  return {
    id,
    name: company?.name ?? fallbackName,
    displayName: "Lumina Hospitality Group",
    initials: company?.initials ?? fallbackName.slice(0, 1).toUpperCase(),
    description:
      "A long-term hospitality procurement partner with dense urban inventory, resilient corporate rate structures, and consistent service-level compliance across managed travel programs.",
    phone: "+1 (415) 555-0198",
    website: "luminahospitality.com",
    location: "London, United Kingdom",
  };
}
