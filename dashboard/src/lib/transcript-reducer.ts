import type { TranscriptState, TranscriptAction } from "./transcript-types";

export const initialTranscriptState: TranscriptState = {
  entries: [],
  partial: null,
  connectionState: "disconnected",
  lastIndex: -1,
  error: null,
  callEnded: null,
  priceChanges: [],
  dealFinalized: null,
};

export function transcriptReducer(
  state: TranscriptState,
  action: TranscriptAction,
): TranscriptState {
  switch (action.type) {
    case "CONNECTING":
      return { ...state, connectionState: "connecting" };

    case "CONNECTED":
      return { ...state, connectionState: "connected", error: null };

    case "DISCONNECTED":
      return { ...state, connectionState: "disconnected" };

    case "ERROR":
      return { ...state, connectionState: "error", error: action.message };

    case "BACKFILL": {
      const newEntries = action.entries.filter((e) => e.index > state.lastIndex);
      if (newEntries.length === 0) return state;
      const maxIndex = Math.max(...newEntries.map((e) => e.index));
      return {
        ...state,
        entries: [...state.entries, ...newEntries],
        lastIndex: Math.max(state.lastIndex, maxIndex),
      };
    }

    case "PARTIAL":
      return { ...state, partial: action.text };

    case "FINAL": {
      if (action.entry.index <= state.lastIndex) return state;
      return {
        ...state,
        entries: [...state.entries, action.entry],
        partial: null,
        lastIndex: action.entry.index,
      };
    }

    case "CALL_ENDED":
      return { ...state, connectionState: "disconnected", partial: null, callEnded: action.data };

    case "PRICE_CHANGED":
      return { ...state, priceChanges: [...state.priceChanges, action.event] };

    case "DEAL_FINALIZED":
      return { ...state, dealFinalized: action.event };

    case "RESET":
      return initialTranscriptState;

    default:
      return state;
  }
}
