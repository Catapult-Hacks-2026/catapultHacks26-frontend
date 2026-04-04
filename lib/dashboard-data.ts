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
