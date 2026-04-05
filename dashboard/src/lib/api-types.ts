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
};

export type RawGalileoActivityItem = {
  id?: string | number;
  price?: string | number | null;
  badge?: string | null;
  badgeTone?: string | null;
  detail?: string | null;
  detailTone?: string | null;
  time?: string | null;
  created_at?: string | null;
  active?: boolean | null;
};

export type RawGalileoTranscriptMessage = {
  id?: string | number;
  role?: string | null;
  sender?: string | null;
  body?: string | null;
  content?: string | null;
  timestamp?: string | null;
  created_at?: string | null;
  label?: string | null;
};

export type RawGalileoPreviousNegotiation = {
  id?: string | number;
  location?: string | null;
  month?: string | null;
  market_price?: number | null;
  negotiated_price?: number | null;
};

export type RawGalileoAgent = {
  id: string;
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

export type RawGalileoCompany = {
  id: string;
  name?: string | null;
  description?: string | null;
  type?: string | null;
  totalSavings?: number | string | null;
  total_savings?: number | string | null;
  bookings?: number | string | null;
  initials?: string | null;
  locations?: RawGalileoLocation[] | Record<string, RawGalileoLocation> | null;
};

export type RawEnterpriseCompanySummary = {
  id?: string;
  companyId?: string;
  company_id?: string;
  name?: string;
  description?: string;
  totalSavings?: number | string | null;
  total_savings?: number | string | null;
  bookings?: number | string | null;
  acceptedAgreements?: number | null;
  accepted_agreements?: number | null;
  bookingWindowScores?:
    | Array<{ label: string; score: number }>
    | null;
  booking_window_scores?:
    | Array<{ label: string; score: number }>
    | null;
  locations?: RawGalileoLocation[] | Record<string, RawGalileoLocation> | null;
};
