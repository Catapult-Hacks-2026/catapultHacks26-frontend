import { Link } from "react-router-dom";
import { events, type GalileoEvent } from "@/lib/dashboard-data";

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

const active = events.filter((e) => e.status === "Active");
const past = events.filter((e) => e.status === "Completed");

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="border-b border-outline-variant/20 bg-white px-10 py-5 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">Events</h1>
        <Link
          to="/negotiations/configure"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Event
        </Link>
      </div>

      <div className="px-10 py-8 space-y-8">

        {/* Active */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active — {active.length}</p>
          <div className="space-y-2">
            {active.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Past */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Past — {past.length}</p>
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
  const completedAgents = event.agents.filter((a) => a.status === "Completed").length;
  const allDone = completedAgents === event.agents.length;

  return (
    <Link
      to={`/events/${event.id}`}
      className="flex items-center gap-6 rounded-xl border border-outline-variant/20 bg-white px-6 py-4 transition-colors hover:bg-surface-container-low"
    >
      <div className="flex items-center gap-2.5 w-48 shrink-0">
        {statusDot(event.status)}
        <span className="text-sm font-medium text-on-surface">{event.name}</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-on-surface-variant w-40 shrink-0">
        <span className="material-symbols-outlined text-[15px]">location_on</span>
        {event.location}
      </div>

      <div className="text-sm text-on-surface-variant w-44 shrink-0">
        {event.startDate} – {event.endDate}
      </div>

      <div className="text-sm text-on-surface-variant w-24 shrink-0">
        {event.attendees} people
      </div>

      <div className="flex items-center gap-2 flex-1">
        {event.agents.map((agent) => (
          <span
            key={agent.negotiationId}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              agent.status === "Completed"
                ? "bg-tertiary-fixed text-on-tertiary-fixed"
                : agent.status === "Reviewing"
                  ? "bg-surface-container-highest text-on-surface-variant"
                  : "bg-secondary-fixed text-on-secondary-fixed"
            }`}
          >
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {agent.type === "Hotel" ? "hotel" : "flight"}
            </span>
            {agent.company.split(" ")[0]}
          </span>
        ))}
      </div>

      <div className="shrink-0 text-right">
        {event.status === "Active" && allDone ? (
          <span className="text-xs font-semibold text-secondary">Select winner →</span>
        ) : event.status === "Completed" ? (
          <span className="text-xs text-on-surface-variant">Completed</span>
        ) : (
          <span className="text-xs text-on-surface-variant">{completedAgents}/{event.agents.length} done</span>
        )}
      </div>
    </Link>
  );
}
