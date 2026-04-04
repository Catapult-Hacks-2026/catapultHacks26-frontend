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
    "Need hotel rooms for executives, meeting space, airport transfers, and strong midweek airfare availability.",
};

export const recommendationWindows = [
  {
    label: "Best Overall",
    range: "October 22 - October 26",
    explanation:
      "Convention pressure stays moderate, hotel inventory is still open for groups, and airline pricing has not yet hit late-quarter compression.",
    marketCost: "$245 / room night",
    negotiatedPrice: "$198 / room night",
    savings: "$47 / room night",
    probability: "94% negotiation confidence",
  },
  {
    label: "Backup Window",
    range: "November 5 - November 8",
    explanation:
      "Strong shoulder-season availability with lower airfare volatility, but slightly tighter meeting-space demand from midweek corporate travel.",
    marketCost: "$228 / room night",
    negotiatedPrice: "$191 / room night",
    savings: "$37 / room night",
    probability: "88% negotiation confidence",
  },
  {
    label: "Budget Window",
    range: "December 3 - December 6",
    explanation:
      "Lower transient demand creates room to negotiate harder on rates and concessions, though weather-related airline disruption risk increases.",
    marketCost: "$214 / room night",
    negotiatedPrice: "$179 / room night",
    savings: "$35 / room night",
    probability: "82% negotiation confidence",
  },
];
