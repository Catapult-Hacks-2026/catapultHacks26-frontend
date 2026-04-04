import { Link, useParams } from "react-router-dom";
import { NegotiationPricePath, type PricePoint } from "@/components/dashboard/NegotiationPricePath";
import { Chip } from "@/components/ui/Chip";
import { useEvents } from "@/context/EventsContext";
import {
  getAgentDisplayStatus,
  getStatusVariant,
  isClosedDeal,
  type AgentStatus,
  type EventAgent,
} from "@/lib/dashboard-data";

const winnerPricePath: PricePoint[] = [
  { label: "Anchor", price: 310, type: "offer" },
  { label: "Round 1", price: 275, type: "negotiated" },
  { label: "Counter", price: 290, type: "offer" },
  { label: "Round 2", price: 258, type: "negotiated" },
  { label: "Counter 2", price: 265, type: "offer" },
  { label: "Final", price: 201, type: "current" },
];

function agentStatusChip(status: AgentStatus) {
  const variant = getStatusVariant(status);
  return <Chip variant={variant}>{status}</Chip>;
}

function agentTypeIcon(type: EventAgent["type"]) {
  return type === "Hotel" ? "hotel" : "flight";
}

function acceptedProgressLabel(service: "Hotel" | "Airline" | "Both", acceptedCount: number) {
  if (service === "Both") {
    return `${acceptedCount}/2 deals accepted`;
  }
  return acceptedCount === 0 ? "No deal accepted yet" : "Deal accepted";
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getEvent, canAcceptAgent, acceptOffer } = useEvents();
  const event = getEvent(id ?? "");

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center text-on-surface-variant">
        Event not found.
      </div>
    );
  }

  const isCompleted = event.status === "Completed";
  const acceptedAgents = event.agents.filter((agent) => agent.isAccepted);
  const winners = acceptedAgents;
  const firstWinner = winners[0];

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="border-b border-outline-variant/20 bg-white px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
        <p className="text-xs text-on-surface-variant">
          <Link to="/events" className="hover:text-on-surface">Events</Link>
          <span className="mx-2 text-outline-variant">›</span>
          {event.name}
        </p>
        <div className="mt-0.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">{event.name}</h1>
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

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:flex-wrap sm:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            {event.startDate} - {event.endDate}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">group</span>
            {event.attendees} attendees
          </span>
        </div>

        {!isCompleted ? (
          <>
            <section className="rounded-xl border border-secondary/20 bg-secondary/5 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Accept closed deals</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {event.service === "Both"
                      ? "Accept one hotel and one airline deal to complete this event. Once a type is accepted, other closed deals of that type are locked."
                      : `Accept one ${event.service.toLowerCase()} deal to complete this event.`}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-on-surface-variant">
                  {acceptedProgressLabel(event.service, acceptedAgents.length)}
                </span>
              </div>

              {acceptedAgents.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {acceptedAgents.map((agent) => (
                    <span
                      key={agent.negotiationId}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-secondary"
                    >
                      <span className="material-symbols-outlined text-[14px]">{agentTypeIcon(agent.type)}</span>
                      {agent.company} accepted
                    </span>
                  ))}
                </div>
              ) : null}
            </section>

            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Agents Working This Event
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {event.agents.map((agent) => {
                  const canAccept = canAcceptAgent(event, agent);
                  const sameTypeAccepted = event.agents.some(
                    (item) => item.type === agent.type && item.isAccepted,
                  );
                  const sameTypeLocked = isClosedDeal(agent) && !agent.isAccepted && !canAccept && sameTypeAccepted;
                  const displayStatus = getAgentDisplayStatus(agent);

                  return (
                    <div
                      key={agent.negotiationId}
                      className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                            <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {agentTypeIcon(agent.type)}
                            </span>
                            {agent.type}
                          </span>
                          <p className="mt-2 font-semibold text-on-surface">{agent.company}</p>
                        </div>
                        {agent.isAccepted ? (
                          <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary">
                            Accepted
                          </span>
                        ) : (
                          agentStatusChip(displayStatus)
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                          to={`/negotiations/${agent.negotiationId}/agent`}
                          className="text-[11px] font-medium text-on-surface-variant hover:text-secondary"
                        >
                          View agent →
                        </Link>

                        {canAccept ? (
                          <button
                            type="button"
                            onClick={() => acceptOffer(event.id, agent.negotiationId)}
                            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-secondary-container"
                          >
                            Accept deal
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </button>
                        ) : sameTypeLocked ? (
                          <span className="text-[11px] font-medium text-on-surface-variant">Competing deal already accepted</span>
                        ) : agent.status !== "Completed" ? (
                          <span className="text-[11px] font-medium text-on-surface-variant">Waiting for call completion</span>
                        ) : agent.isAccepted ? (
                          <span className="text-[11px] font-medium text-secondary">Deal accepted</span>
                        ) : isClosedDeal(agent) ? null : (
                          <span className="text-[11px] font-medium text-on-surface-variant">{displayStatus}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {winners.map((agent) => (
                <div key={agent.negotiationId} className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {agentTypeIcon(agent.type)}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                      Accepted {agent.type} Deal
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-on-surface">{agent.company}</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

            {firstWinner ? (
              <>
                <div className="rounded-xl border border-outline-variant/20 bg-white px-5 py-5 sm:px-6 lg:px-8 lg:py-6">
                  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Negotiation Path</p>
                      <p className="mt-0.5 text-lg font-semibold text-on-surface">{firstWinner.company}</p>
                    </div>
                    <Link
                      to={`/negotiations/${firstWinner.negotiationId}/agent`}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      View full agent →
                    </Link>
                  </div>
                  <NegotiationPricePath points={winnerPricePath} marketPrice={310} targetPrice={200} />
                </div>

                <div className="rounded-xl border border-outline-variant/20 bg-white px-5 py-5 sm:px-6 lg:px-8 lg:py-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Negotiation Transcript</p>
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container">
                        <span className="text-sm font-semibold text-secondary" style={{ fontFamily: "system-ui" }}>G</span>
                      </div>
                      <div className="max-w-2xl rounded-2xl rounded-tl-none bg-surface-container-low px-5 py-3">
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
                      <div className="max-w-2xl rounded-2xl rounded-tr-none border border-outline-variant/20 bg-white px-5 py-3">
                        <p className="text-sm leading-6 text-on-surface">
                          We acknowledge the volume and can review incremental meeting spend if the room-night commitment remains firm through Q4.
                        </p>
                        <p className="mt-2 text-[10px] text-right text-on-surface-variant">{firstWinner.company} · 14:02:45</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container">
                        <span className="text-sm font-semibold text-secondary" style={{ fontFamily: "system-ui" }}>G</span>
                      </div>
                      <div className="max-w-2xl rounded-2xl rounded-tl-none bg-surface-container-low px-5 py-3">
                        <p className="text-sm leading-6 text-on-surface">
                          Confirmed. Galileo proposes locking the rate at <strong className="text-secondary">{firstWinner.negotiatedPrice}</strong> with the agreed concessions and executive arrival support.
                        </p>
                        <p className="mt-2 text-[10px] text-on-surface-variant">Agent Nexus-7 · 14:48:03</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
