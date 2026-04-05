import { useEffect, useReducer, useRef, useCallback } from "react";
import { transcriptReducer, initialTranscriptState } from "@/lib/transcript-reducer";
import type { ServerMessage } from "@/lib/transcript-types";
import { buildRealtimeWebSocketUrl } from "@/lib/realtime";

const PING_INTERVAL_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const MAX_RETRIES = 10;

export function useTranscriptStream(agentId: string | null) {
  const [state, dispatch] = useReducer(transcriptReducer, initialTranscriptState);
  const lastIndexRef = useRef(state.lastIndex);
  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retriesRef = useRef(0);

  lastIndexRef.current = state.lastIndex;

  const cleanup = useCallback(() => {
    if (pingRef.current) {
      clearInterval(pingRef.current);
      pingRef.current = null;
    }
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
    dispatch({ type: "DISCONNECTED" });
  }, [cleanup]);

  useEffect(() => {
    if (!agentId) {
      cleanup();
      dispatch({ type: "RESET" });
      return;
    }

    dispatch({ type: "RESET" });
    retriesRef.current = 0;

    function connect() {
      cleanup();

      const url = buildRealtimeWebSocketUrl(
        `/api/galileo/agents/${agentId}/transcript/ws`,
        new URLSearchParams({ last_index: String(lastIndexRef.current) }),
      );
      if (!url) {
        dispatch({ type: "ERROR", message: "Real-time backend is not configured" });
        return;
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;

      dispatch({ type: "CONNECTING" });

      ws.onopen = () => {
        dispatch({ type: "CONNECTED" });
        retriesRef.current = 0;

        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, PING_INTERVAL_MS);
      };

      ws.onmessage = (event) => {
        let msg: ServerMessage;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (msg.type) {
          case "backfill":
            dispatch({ type: "BACKFILL", entries: msg.entries });
            break;
          case "transcript_partial":
            dispatch({ type: "PARTIAL", text: msg.text });
            break;
          case "transcript_final":
            dispatch({
              type: "FINAL",
              entry: { role: msg.role, content: msg.content, index: msg.index },
            });
            break;
          case "price_changed":
            dispatch({
              type: "PRICE_CHANGED",
              event: {
                price: msg.price,
                previousPrice: msg.previous_price,
                source: msg.source,
                round: msg.round,
                timestamp: msg.timestamp,
              },
            });
            break;
          case "deal_finalized":
            dispatch({
              type: "DEAL_FINALIZED",
              event: {
                finalPrice: msg.final_price,
                marketPrice: msg.market_price,
                savings: msg.savings,
                timestamp: msg.timestamp,
              },
            });
            break;
          case "call_ended":
            dispatch({
              type: "CALL_ENDED",
              data: msg.status
                ? { status: msg.status, outcome: msg.outcome ?? "", finalPrice: msg.final_price ?? null }
                : null,
            });
            ws.close();
            break;
          case "error":
            dispatch({ type: "ERROR", message: msg.message });
            break;
          case "pong":
            break;
        }
      };

      ws.onclose = (event) => {
        if (pingRef.current) {
          clearInterval(pingRef.current);
          pingRef.current = null;
        }

        if (event.code === 4004) {
          dispatch({ type: "ERROR", message: "No active call" });
          return;
        }

        dispatch({ type: "DISCONNECTED" });

        if (retriesRef.current < MAX_RETRIES) {
          const delay = Math.min(
            BASE_BACKOFF_MS * Math.pow(2, retriesRef.current),
            MAX_BACKOFF_MS,
          );
          retriesRef.current += 1;
          reconnectRef.current = setTimeout(connect, delay);
        } else {
          dispatch({ type: "ERROR", message: "Connection lost after maximum retries" });
        }
      };

      ws.onerror = () => {
        dispatch({ type: "ERROR", message: "WebSocket error" });
      };
    }

    connect();

    return cleanup;
  }, [agentId, cleanup]);

  return { state, disconnect };
}
