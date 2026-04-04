import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEvents } from "@/context/EventsContext";
import {
  getAgentDisplayStatus,
  getStatusVariant,
  isClosedDeal,
  type EventAgent,
  type GalileoEvent,
} from "@/lib/dashboard-data";

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

function agentTypeIcon(_type: EventAgent["type"]) {
  return "hotel";
}

function agentBadgeClass(agent: EventAgent) {
  if (agent.isAccepted) {
    return "bg-secondary/10 text-secondary";
  }

  const variant = getStatusVariant(getAgentDisplayStatus(agent));
  if (variant === "success") return "bg-tertiary-fixed text-on-tertiary-fixed";
  if (variant === "error") return "bg-error-container text-error";
  if (variant === "negotiating") return "bg-secondary-fixed text-on-secondary-fixed";
  return "bg-surface-container-highest text-on-surface-variant";
}

export default function EventsPage() {
  const { error, events, isLoading } = useEvents();
  const active = events.filter((event) => event.status === "Active");
  const past = events.filter((event) => event.status === "Completed");

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="flex flex-col gap-3 border-b border-outline-variant/20 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 lg:py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">Events</h1>
        <Link
          to="/negotiations/configure"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Event
        </Link>
      </div>

      <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active - {active.length}</p>
          <div className="space-y-2">
            {isLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-xl border border-outline-variant/20 bg-white px-5 py-6 sm:px-6">
                    <Skeleton className="h-6 w-48" />
                    <div className="mt-4 grid gap-3 lg:grid-cols-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))
              : active.map((event) => (
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
        {error ? (
          <p className="text-sm text-error">
            {(error as Error)?.message ?? "Unable to load events."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: GalileoEvent }) {
  const { canAcceptAgent, acceptOffer } = useEvents();
  const completedAgents = event.agents.filter((agent) => agent.status === "Completed").length;
  const closedDeals = event.agents.filter((agent) => isClosedDeal(agent)).length;
  const acceptedAgents = event.agents.filter((agent) => agent.isAccepted);
  const eligibleAgents = event.agents.filter((agent) => canAcceptAgent(event, agent));

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white transition-colors hover:bg-surface-container-low">
      <div className="flex flex-col gap-4 px-5 py-4 sm:px-6">
        <Link to={`/events/${event.id}`} className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex items-center gap-2.5 lg:w-48 lg:shrink-0">
            {statusDot(event.status)}
            <span className="text-sm font-medium text-on-surface">{event.name}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant lg:w-40 lg:shrink-0">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {event.location}
          </div>

          <div className="text-sm text-on-surface-variant lg:w-44 lg:shrink-0">
            {event.startDate} - {event.endDate}
          </div>

          <div className="text-sm text-on-surface-variant lg:w-24 lg:shrink-0">
            {event.attendees} people
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2">
            {event.agents.map((agent) => (
              <span
                key={agent.negotiationId}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${agentBadgeClass(agent)}`}
              >
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {agentTypeIcon(agent.type)}
                </span>
                {agent.company.split(" ")[0]}
                {agent.isAccepted ? " accepted" : ""}
              </span>
            ))}
          </div>
        </Link>

        <div className="shrink-0 text-left lg:text-right">
          {event.status === "Completed" ? (
            <span className="text-xs text-on-surface-variant">Completed</span>
          ) : acceptedAgents.length > 0 ? (
            <span className="text-xs text-on-surface-variant">{acceptedAgents.length} accepted</span>
          ) : closedDeals > 0 ? (
            <span className="text-xs text-on-surface-variant">{closedDeals} deal{closedDeals === 1 ? "" : "s"} ready</span>
          ) : (
            <span className="text-xs text-on-surface-variant">{completedAgents}/{event.agents.length} done</span>
          )}
        </div>
      </div>

      {event.status === "Active" && eligibleAgents.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-outline-variant/10 px-6 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Accept Deal</span>
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
