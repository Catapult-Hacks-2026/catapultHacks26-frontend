export type HistoricPricingRecord = {
  id: number;
  hotel: string;
  location: string;
  month: number;
  year: number;
  price_per_night: number;
  created_at: string;
};

export type RawOffer = {
  unit_price?: number | null;
  shipping_cost?: number | null;
  payment_terms_days?: number | null;
  delivery_days?: number | null;
  notes?: string | null;
};

export type RawNegotiation = {
  id: string;
  vendor_name: string;
  product_category: string;
  status: string;
  strategy?: string | null;
  round_number?: number | null;
  utility_score?: number | null;
  current_offer?: RawOffer | null;
};

export type RawNegotiationConfig = {
  target_unit_price?: number | null;
  max_unit_price?: number | null;
  target_shipping_cost?: number | null;
  max_shipping_cost?: number | null;
  preferred_payment_terms?: number | null;
  min_payment_terms?: number | null;
  preferred_delivery_days?: number | null;
  max_delivery_days?: number | null;
  quantity?: number | null;
  weight_price?: number | null;
  weight_shipping?: number | null;
  weight_payment_terms?: number | null;
  weight_delivery?: number | null;
  min_acceptable_utility?: number | null;
};

export type RawMessage = {
  id: number | string;
  role: string;
  content: string;
  structured_data?: Record<string, unknown> | null;
  utility_score?: number | null;
  rag_context?: unknown;
  guardrail_log?: unknown;
  created_at?: string | null;
};

export type RawNegotiationDetail = {
  negotiation: RawNegotiation;
  research_brief?: Record<string, unknown>;
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

export type RawGalileoPricePoint = {
  id?: string | number;
  label?: string | null;
  price?: number | null;
  unit_price?: number | null;
  value?: number | null;
  type?: string | null;
  round?: number | null;
};

export type RawGalileoActivityItem = {
  id?: string | number;
  price?: string | number | null;
  badge?: string | null;
  badgeType?: string | null;
  badgeTone?: string | null;
  detail?: string | null;
  detailType?: string | null;
  detailTone?: string | null;
  time?: string | null;
  timestamp?: string | null;
  agentId?: string | null;
  created_at?: string | null;
  active?: boolean | null;
};

export type RawGalileoTranscriptMessage = {
  id?: string | number;
  agentId?: string | null;
  role?: string | null;
  sender?: string | null;
  body?: string | null;
  message?: string | null;
  content?: string | null;
  timestamp?: string | null;
  created_at?: string | null;
  label?: string | null;
};

export type RawGalileoPreviousNegotiation = {
  id?: string | number;
  contractId?: string | null;
  location?: string | null;
  region?: string | null;
  month?: string | null;
  duration?: string | null;
  finalRate?: number | null;
  totalSavings?: number | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  market_price?: number | null;
  negotiated_price?: number | null;
};

export type EnterpriseAgent = {
  id: string;
  enterpriseId: string;
  eventId: string;
  companyId: string;
  companyName: string;
  status: string;
  outcome: string | null;
  idealPrice: number;
  ceilingPrice: number;
  marketPrice: number;
  currentPrice: number;
  isAccepted: boolean;
};

export type RawGalileoAgent = {
  id: string;
  enterpriseId?: string | null;
  eventId?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  segment?: string | null;
  lifecycleStatus?: string | null;
  idealPrice?: number | null;
  ceilingPrice?: number | null;
  marketPrice?: number | null;
  originalPrice?: number | null;
  currentPrice?: number | null;
  delta?: number | null;
  potentialSavings?: number | null;
  savingsToDate?: number | null;
  distanceToGoal?: number | null;
  company_id?: string | null;
  event_id?: string | null;
  vendor_name?: string | null;
  company?: string | null;
  company_name?: string | null;
  name?: string | null;
  product_category?: string | null;
  service?: string | null;
  type?: string | null;
  status?: string | null;
  outcome?: string | null;
  current_offer?: RawOffer | null;
  original_price?: number | null;
  market_price?: number | null;
  negotiated_price?: number | null;
  current_price?: number | null;
  savings?: number | null;
  isAccepted?: boolean | null;
  is_accepted?: boolean | null;
  location?: string | null;
  pricePath?: RawGalileoPricePoint[] | null;
  activityStream?: RawGalileoActivityItem[] | null;
  transcript?: RawGalileoTranscriptMessage[] | null;
  previousNegotiations?: RawGalileoPreviousNegotiation[] | null;
};

export type RawGalileoEvent = {
  id: string;
  enterpriseId?: string | null;
  name?: string | null;
  event_name?: string | null;
  location?: string | null;
  startDate?: string | null;
  start_date?: string | null;
  endDate?: string | null;
  end_date?: string | null;
  attendees?: number | null;
  attendee_count?: number | null;
  service?: string | null;
  status?: string | null;
  agents?: RawGalileoAgent[] | null;
  requirements?: string | null;
  budgetPerPerson?: number | null;
  winnerAgentId?: string | null;
  winnerTranscript?: RawGalileoTranscriptMessage[] | null;
  winnerPricePath?: RawGalileoPricePoint[] | null;
};

export type RawGalileoLocation = {
  id?: string;
  label?: string | null;
  name?: string | null;
  subtitle?: string | null;
  location?: string | null;
  currentLocation?: string | null;
  current_location?: string | null;
  lifetimeSavings?: number | string | null;
  lifetime_savings?: number | string | null;
  savingsDelta?: number | string | null;
  savings_delta?: number | string | null;
  agreements?: string | null;
  pricing?: {
    "1Y"?: Array<{ label: string; negotiated: number; market: number }>;
    ALL?: Array<{ label: string; negotiated: number; market: number }>;
  } | null;
  eventIds?: string[] | null;
  event_ids?: string[] | null;
};

export type RawCompanyLocation = {
  id: string;
  companyId: string;
  name: string;
  address: string;
  phone: string;
};

export type RawGalileoCompany = {
  id: string;
  name?: string | null;
  initials?: string | null;
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  badge?: string | null;
  type?: string | null;
  totalSavings?: number | string | null;
  total_savings?: number | string | null;
  bookings?: number | string | null;
  locations?: RawGalileoLocation[] | RawCompanyLocation[] | Record<string, RawGalileoLocation> | null;
};

export type RawEnterpriseCompanySummary = {
  id?: string;
  companyId?: string;
  company_id?: string;
  enterpriseId?: string;
  locationId?: string;
  name?: string;
  description?: string;
  totalSavings?: number | string | null;
  total_savings?: number | string | null;
  bookings?: number | string | null;
  totalBookings?: number | null;
  acceptedAgreements?: number | null;
  accepted_agreements?: number | null;
  agreementsCount?: number | null;
  agreementsSummary?: string | null;
  lifetimeSavings?: number | null;
  savingsDelta?: number | null;
  avgDelta?: number | null;
  yoyChange?: number | null;
  bookingWindowScores?:
    | Array<{ label: string; score: number }>
    | null;
  booking_window_scores?:
    | Array<{ label: string; score: number }>
    | null;
  bookingWindow?:
    | Array<{ month: string; score: number; status: string }>
    | null;
  pricingTrends?:
    | Array<{ month: string; year: number; range: string; negotiatedPrice: number; marketPrice: number }>
    | null;
  linkedEvents?: RawGalileoEvent[] | null;
  locations?: RawGalileoLocation[] | Record<string, RawGalileoLocation> | null;
};

export type RawMarketPricingResponse = {
  service?: string;
  hotel?: {
    marketPrice: number;
    predictedWinPrice: number;
    unit: string;
  };
  airline?: {
    marketPrice: number;
    predictedWinPrice: number;
    unit: string;
  };
  expectedMarketPrice?: number | string | null;
  expected_market_price?: number | string | null;
  marketPrice?: number | string | null;
  market_price?: number | string | null;
  predictedWin?: number | string | null;
  predicted_win?: number | string | null;
  winPrice?: number | string | null;
  win_price?: number | string | null;
  unit?: string | null;
};

export type RawEventWindowResult = {
  label: string;
  startDate: string;
  endDate: string;
  explanation: string;
  hotel: {
    marketCost: number;
    negotiatedPrice: number;
    savings: number;
  };
  airline: {
    marketCost: number;
    negotiatedPrice: number;
    savings: number;
  };
  negotiationConfidence: number;
};

export type RawInterveneResponse = {
  agentId: string;
  status: string;
  callRoutingInfo: string;
  transferredAt: string;
};
