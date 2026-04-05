export type MarketInsightsQuery = {
  location: string;
  attendees: string;
  nights: string;
  eventType: string;
  timing: string;
  eventDetails: string;
};

export const defaultMarketInsightsQuery: MarketInsightsQuery = {
  location: "Las Vegas, NV",
  attendees: "100",
  nights: "4",
  eventType: "Company Retreat",
  timing: "Q4 2026",
  eventDetails:
    "Need hotel rooms for executives, meeting space, and airport transfers.",
};

export const recommendationWindows = [
  {
    label: "Best Overall",
    range: "October 22 - October 26",
    explanation:
      "Convention pressure stays moderate and Hilton/Marriott inventory is still open for groups. Historic data shows agents have achieved 16–18% off rack in this window.",
    marketCost: "$380 / room night",
    negotiatedPrice: "$310 / room night",
    savings: "$70 / room night",
    probability: "94% negotiation confidence",
  },
  {
    label: "Backup Window",
    range: "November 5 - November 8",
    explanation:
      "Strong shoulder-season availability across Hyatt West Loop and IHG Streeterville. Agents have consistently brought rates below $250 for 48-person groups.",
    marketCost: "$295 / room night",
    negotiatedPrice: "$245 / room night",
    savings: "$50 / room night",
    probability: "88% negotiation confidence",
  },
  {
    label: "Budget Window",
    range: "December 3 - December 6",
    explanation:
      "Lower transient demand enables the deepest concessions. IHG Streeterville data shows negotiated rates as low as $165 against a $210 ask in this period.",
    marketCost: "$210 / room night",
    negotiatedPrice: "$165 / room night",
    savings: "$45 / room night",
    probability: "82% negotiation confidence",
  },
];
