export interface TranscriptEntry {
  role: "hotel" | "agent";
  content: string;
  index: number;
}

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export interface CallEndedData {
  status: string;
  outcome: string;
  finalPrice: number | null;
}

export interface PriceChangeEvent {
  price: number;
  previousPrice: number;
  source: "galileo" | "hotel_rep";
  round: number;
  timestamp: string;
}

export interface DealFinalizedEvent {
  finalPrice: number;
  marketPrice: number;
  savings: number;
  timestamp: string;
}

export interface TranscriptState {
  entries: TranscriptEntry[];
  partial: string | null;
  connectionState: ConnectionState;
  lastIndex: number;
  error: string | null;
  callEnded: CallEndedData | null;
  priceChanges: PriceChangeEvent[];
  dealFinalized: DealFinalizedEvent | null;
}

export type ServerMessage =
  | { type: "backfill"; entries: TranscriptEntry[]; session_id: string }
  | { type: "transcript_partial"; text: string; session_id: string; timestamp: string }
  | { type: "transcript_final"; role: "hotel" | "agent"; content: string; index: number; session_id: string; timestamp: string }
  | { type: "call_ended"; session_id: string; timestamp: string; status?: string; outcome?: string; final_price?: number | null }
  | { type: "price_changed"; galileo_agent_id: string; price: number; previous_price: number; source: "galileo" | "hotel_rep"; round: number; session_id: string; timestamp: string }
  | { type: "deal_finalized"; galileo_agent_id: string; final_price: number; market_price: number; savings: number; session_id: string; timestamp: string }
  | { type: "error"; message: string }
  | { type: "pong" };

export type TranscriptAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED" }
  | { type: "DISCONNECTED" }
  | { type: "ERROR"; message: string }
  | { type: "BACKFILL"; entries: TranscriptEntry[] }
  | { type: "PARTIAL"; text: string }
  | { type: "FINAL"; entry: TranscriptEntry }
  | { type: "CALL_ENDED"; data: CallEndedData | null }
  | { type: "PRICE_CHANGED"; event: PriceChangeEvent }
  | { type: "DEAL_FINALIZED"; event: DealFinalizedEvent }
  | { type: "RESET" };
