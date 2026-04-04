import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEvent, type EventAgent } from "@/lib/dashboard-data";
import { NegotiationPricePath, type PricePoint } from "@/components/dashboard/NegotiationPricePath";
import { Chip } from "@/components/ui/Chip";

const winnerPricePath: PricePoint[] = [
  { label: "Anchor", price: 310, type: "offer" },
  { label: "Round 1", price: 275, type: "negotiated" },
  { label: "Counter", price: 290, type: "offer" },
  { label: "Round 2", price: 258, type: "negotiated" },
  { label: "Counter 2", price: 265, type: "offer" },
  { label: "Final", price: 201, type: "current" },
];

function agentStatusChip(status: EventAgent["status"]) {
  if (status === "Negotiating") return <Chip variant="negotiating">Negotiating</Chip>;
  if (status === "Reviewing") return <Chip variant="neutral">Reviewing</Chip>;
  return <Chip variant="success">Completed</Chip>;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = getEvent(id ?? "");
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [markedDone, setMarkedDone] = useState(false);

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center text-on-surface-variant">
        Event not found.
      </div>
    );
  }

  const allAgentsDone = event.agents.every((a) => a.status === "Completed");
  const isCompleted = event.status === "Completed" || markedDone;
  const winners = event.agents.filter((a) => a.isWinner);

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="border-b border-outline-variant/20 bg-white px-10 py-5">
        <p className="text-xs text-on-surface-variant">
          <Link to="/events" className="hover:text-on-surface">Events</Link>
          <span className="mx-2 text-outline-variant">›</span>
          {event.name}
        </p>
        <div className="mt-0.5 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-on-surface">{event.name}</h1>
          {isCompleted ? (
            <span className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-semibold text-on-surface-variant">
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold text-on-secondary-fixed">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
              </span>
              Active
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-8 space-y-6">

        {/* Event meta */}
        <div className="flex gap-6 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            {event.startDate} – {event.endDate}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">group</span>
            {event.attendees} attendees
          </span>
        </div>

        {/* Active: agent cards */}
        {!isCompleted && (
          <>
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Agents Working This Event
              </p>
              <div className="grid grid-cols-3 gap-4">
                {event.agents.map((agent) => (
                  <Link
                    key={agent.negotiationId}
                    to={`/negotiations/${agent.negotiationId}/agent`}
                    className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5 transition-colors hover:bg-surface-container-low"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {agent.type === "Hotel" ? "hotel" : "flight"}
                          </span>
                          {agent.type}
                        </span>
                        <p className="mt-2 font-semibold text-on-surface">{agent.company}</p>
                      </div>
                      {agentStatusChip(agent.status)}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Original</p>
                        <p className="mt-0.5 text-base font-semibold text-on-surface">{agent.originalPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Current</p>
                        <p className="mt-0.5 text-base font-semibold text-secondary">{agent.negotiatedPrice}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] text-on-surface-variant">
                      Potential savings: <span className="font-semibold text-on-tertiary-container">{agent.savings}</span>
                    </p>
                    <p className="mt-3 text-[11px] font-medium text-on-surface-variant">View agent →</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Select winner if all done */}
            {allAgentsDone && !markedDone && (
              <section className="rounded-xl border border-secondary/20 bg-secondary/5 px-6 py-5">
                <p className="text-sm font-semibold text-on-surface">All agents have finished — select the winning suppliers</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">Choose one hotel and one airline (if applicable) to finalise the event.</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {event.agents.map((agent) => (
                    <button
                      key={agent.negotiationId}
                      type="button"
                      onClick={() => setSelectedWinner(agent.negotiationId)}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        selectedWinner === agent.negotiationId
                          ? "border-secondary bg-white shadow-sm"
                          : "border-outline-variant/20 bg-white hover:border-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-on-surface">{agent.company}</span>
                        {selectedWinner === agent.negotiationId && (
                          <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-on-surface-variant">{agent.negotiatedPrice} · saved {agent.savings}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!selectedWinner}
                    onClick={() => setMarkedDone(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mark Event as Done
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* Completed: contract summary */}
        {isCompleted && (
          <>
            {/* Winners row */}
            <div className="grid grid-cols-2 gap-4">
              {winners.map((agent) => (
                <div key={agent.negotiationId} className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {agent.type === "Hotel" ? "hotel" : "flight"}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Winning {agent.type}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-on-surface">{agent.company}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Original</p>
                      <p className="mt-1 text-xl font-bold text-on-surface">{agent.originalPrice}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Negotiated</p>
                      <p className="mt-1 text-xl font-bold text-secondary">{agent.negotiatedPrice}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Saved</p>
                      <p className="mt-1 text-xl font-bold text-on-tertiary-container">{agent.savings}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price path of first winner */}
            <div className="rounded-xl border border-outline-variant/20 bg-white px-8 py-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Negotiation Path</p>
                  <p className="mt-0.5 text-lg font-semibold text-on-surface">{winners[0]?.company}</p>
                </div>
                <Link
                  to={`/negotiations/${winners[0]?.negotiationId}/agent`}
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  View full agent →
                </Link>
              </div>
              <NegotiationPricePath points={winnerPricePath} marketPrice={310} targetPrice={200} />
            </div>

            {/* Transcript */}
            <div className="rounded-xl border border-outline-variant/20 bg-white px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">Negotiation Transcript</p>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container">
                    <span className="text-sm font-semibold text-secondary" style={{ fontFamily: "system-ui" }}>G</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-surface-container-low px-5 py-3 max-w-2xl">
                    <p className="text-sm leading-6 text-on-surface">
                      Based on 450 projected room nights and current weekday compression, Galileo is targeting a structured rate below the published corporate floor with breakfast and transfer concessions.
                    </p>
                    <p className="mt-2 text-[10px] text-on-surface-variant">Agent Nexus-7 · 14:02:11</p>
                  </div>
                </div>
                <div className="flex flex-row-reverse items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-highest">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                  </div>
                  <div className="rounded-2xl rounded-tr-none bg-white border border-outline-variant/20 px-5 py-3 max-w-2xl">
                    <p className="text-sm leading-6 text-on-surface">
                      We acknowledge the volume and can review incremental meeting spend if the room-night commitment remains firm through Q4.
                    </p>
                    <p className="mt-2 text-[10px] text-on-surface-variant text-right">{winners[0]?.company} · 14:02:45</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container">
                    <span className="text-sm font-semibold text-secondary" style={{ fontFamily: "system-ui" }}>G</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-surface-container-low px-5 py-3 max-w-2xl">
                    <p className="text-sm leading-6 text-on-surface">
                      Confirmed. Galileo proposes locking the Q4 block at <strong className="text-secondary">{winners[0]?.negotiatedPrice}</strong> with a 10% attrition allowance and complimentary airport transfers for executive arrivals.
                    </p>
                    <p className="mt-2 text-[10px] text-on-surface-variant">Agent Nexus-7 · 14:48:03</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
