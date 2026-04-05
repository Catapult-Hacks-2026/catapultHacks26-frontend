"use client";

import { useEffect, useRef } from "react";
import type { TranscriptState } from "@/lib/transcript-types";
import type { ConnectionState } from "@/lib/transcript-types";

function ConnectionDot({ state }: { state: ConnectionState }) {
  const color = {
    connected: "bg-emerald-500",
    connecting: "bg-amber-400 animate-pulse",
    disconnected: "bg-slate-300",
    error: "bg-red-500",
  }[state];

  const label = {
    connected: "Live",
    connecting: "Connecting",
    disconnected: "Disconnected",
    error: "Error",
  }[state];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export function LiveTranscript({ state }: { state: TranscriptState }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.entries.length, state.partial]);

  const hasContent = state.entries.length > 0 || state.partial;

  return (
    <section className="rounded-2xl border border-slate-200/50 bg-surface-container-highest/30 p-5 backdrop-blur-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Negotiation Transcript
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Live call transcript between Galileo and the supplier.
          </p>
        </div>
        <ConnectionDot state={state.connectionState} />
      </div>

      <div className="mt-8 max-h-[480px] space-y-6 overflow-y-auto pr-2">
        {!hasContent && state.connectionState === "connected" && (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            Waiting for conversation to begin&hellip;
          </p>
        )}

        {!hasContent && state.connectionState === "connecting" && (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            Connecting to live call&hellip;
          </p>
        )}

        {!hasContent && state.connectionState === "error" && (
          <p className="py-8 text-center text-sm text-red-500">
            {state.error ?? "Unable to connect to live call"}
          </p>
        )}

        {!hasContent && state.connectionState === "disconnected" && (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No active call
          </p>
        )}

        {state.entries.map((entry) =>
          entry.role === "agent" ? (
            <div key={entry.index} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-white">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="max-w-3xl rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-sm leading-7 text-on-surface">{entry.content}</p>
              </div>
            </div>
          ) : (
            <div key={entry.index} className="flex flex-row-reverse items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
              <div className="max-w-3xl rounded-2xl rounded-tr-none border border-secondary/10 bg-secondary/5 p-4 text-right">
                <p className="text-sm leading-7 text-on-surface">{entry.content}</p>
              </div>
            </div>
          ),
        )}

        {state.partial && (
          <div className="flex flex-row-reverse items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-white">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
            <div className="max-w-3xl rounded-2xl rounded-tr-none border border-secondary/10 bg-secondary/5 p-4 text-right">
              <p className="text-sm italic leading-7 text-on-surface/60">
                {state.partial}
                <span className="ml-1 inline-flex gap-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary/40 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary/40 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary/40 [animation-delay:300ms]" />
                </span>
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
