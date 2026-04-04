import { Link } from "react-router-dom";
import { useEvents } from "@/context/EventsContext";
import type { EventAgent, GalileoEvent } from "@/lib/dashboard-data";

function statusDot(status: GalileoEvent["status"]) {
  if (status === "Active") {
    return (
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
      </span>
    );
  }
  return <span className="h-2 w-2 rounded-full bg-outline-variant" />;
}

function agentTypeIcon(type: EventAgent["type"]) {
  return type === "Hotel" ? "hotel" : "flight";
}

function agentBadgeClass(agent: EventAgent) {
  if (agent.isAccepted) {
    return "bg-secondary/10 text-secondary";
  }

  if (agent.status === "Cancelled") {
    return "bg-error-container text-error";
  }

  if (agent.status === "Completed") {
    return "bg-tertiary-fixed text-on-tertiary-fixed";
  }

  if (agent.status === "Reviewing") {
    return "bg-surface-container-highest text-on-surface-variant";
  }

  return "bg-secondary-fixed text-on-secondary-fixed";
}

export default function EventsPage() {
  const { events } = useEvents();
  const active = events.filter((event) => event.status === "Active");
  const past = events.filter((event) => event.status === "Completed");

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="flex items-center justify-between border-b border-outline-variant/20 bg-white px-10 py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">Events</h1>
        <Link
          to="/negotiations/configure"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Event
        </Link>
      </div>

      <div className="space-y-8 px-10 py-8">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active - {active.length}</p>
          <div className="space-y-2">
            {active.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Past - {past.length}</p>
          <div className="space-y-2">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: GalileoEvent }) {
  const { canAcceptAgent, acceptOffer } = useEvents();
  const completedAgents = event.agents.filter((agent) => agent.status === "Completed").length;
  const acceptedAgents = event.agents.filter((agent) => agent.isAccepted);
  const eligibleAgents = event.agents.filter((agent) => canAcceptAgent(event, agent));

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white transition-colors hover:bg-surface-container-low">
      <div className="flex items-center gap-6 px-6 py-4">
        <Link to={`/events/${event.id}`} className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex w-48 shrink-0 items-center gap-2.5">
            {statusDot(event.status)}
            <span className="text-sm font-medium text-on-surface">{event.name}</span>
          </div>

          <div className="flex w-40 shrink-0 items-center gap-1.5 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {event.location}
          </div>

          <div className="w-44 shrink-0 text-sm text-on-surface-variant">
            {event.startDate} - {event.endDate}
          </div>

          <div className="w-24 shrink-0 text-sm text-on-surface-variant">
            {event.attendees} people
          </div>

          <div className="flex flex-1 items-center gap-2">
            {event.agents.map((agent) => (
              <span
                key={agent.negotiationId}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${agentBadgeClass(agent)}`}
              >
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {agentTypeIcon(agent.type)}
                </span>
                {agent.company.split(" ")[0]}
                {agent.isAccepted ? " accepted" : agent.status === "Cancelled" ? " cancelled" : ""}
              </span>
            ))}
          </div>
        </Link>

        <div className="shrink-0 text-right">
          {event.status === "Completed" ? (
            <span className="text-xs text-on-surface-variant">Completed</span>
          ) : acceptedAgents.length > 0 ? (
            <span className="text-xs text-on-surface-variant">{acceptedAgents.length} accepted</span>
          ) : (
            <span className="text-xs text-on-surface-variant">{completedAgents}/{event.agents.length} done</span>
          )}
        </div>
      </div>

      {event.status === "Active" && eligibleAgents.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant/10 px-6 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Accept Offer</span>
          {eligibleAgents.map((agent) => (
            <button
              key={agent.negotiationId}
              type="button"
              onClick={() => acceptOffer(event.id, agent.negotiationId)}
              className="inline-flex items-center gap-2 rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/10"
            >
              <span className="material-symbols-outlined text-[14px]">{agentTypeIcon(agent.type)}</span>
              {agent.company}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
