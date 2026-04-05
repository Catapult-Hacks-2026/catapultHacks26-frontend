export interface TranscriptEntry {
  role: "hotel" | "agent";
  content: string;
  index: number;
}

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export interface TranscriptState {
  entries: TranscriptEntry[];
  partial: string | null;
  connectionState: ConnectionState;
  lastIndex: number;
  error: string | null;
}

export type ServerMessage =
  | { type: "backfill"; entries: TranscriptEntry[]; session_id: string }
  | { type: "transcript_partial"; text: string; session_id: string; timestamp: string }
  | { type: "transcript_final"; role: "hotel" | "agent"; content: string; index: number; session_id: string; timestamp: string }
  | { type: "call_ended"; session_id: string; timestamp: string }
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
  | { type: "CALL_ENDED" }
  | { type: "RESET" };
