import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { agentRows, getStatusVariant } from "@/lib/dashboard-data";
import { useEvents } from "@/context/EventsContext";

export default function AllAgentsPage() {
  const { getEventForNegotiation } = useEvents();
  const activeCalls = agentRows.filter((r) => r.status === "Ringing" || r.status === "Negotiating").length;
  const queuedOrWrapping = agentRows.filter((r) => r.status === "Queued" || r.status === "Finalizing").length;
  const closedDeals = agentRows.filter((r) => r.status === "Deal Closed").length;

  return (
    <div className="min-h-screen bg-surface px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-12">
      <AnimateIn>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
              Active Galileo Cycles
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
              All Agents
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant">
              {agentRows.length} active sourcing cycles across hotels, aviation,
              and corporate events.
            </p>
          </div>

        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Live Calls
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {activeCalls}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Ringing or negotiating
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Queued / Finalizing
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {queuedOrWrapping}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Before or just after the call
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-tertiary-container">
              Closed Deals
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {closedDeals}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Negotiations won
            </p>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.08}>
        <section className="mt-8 overflow-hidden rounded-3xl bg-surface-container-highest shadow-xl shadow-on-surface/5">
          <div className="hidden grid-cols-[1.6fr_1.1fr_0.85fr_1fr_0.9fr] gap-4 px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-on-primary-container lg:grid">
            <span>Company</span>
            <span>Event</span>
            <span>Target Price</span>
            <span>Negotiation Price</span>
            <span>Status</span>
          </div>

          <div>
            {agentRows.map((row) => {
              const event = getEventForNegotiation(row.id);
              return (
                <Link
                  key={row.id}
                  to={`/negotiations/${row.id}/agent`}
                  className="flex flex-col gap-4 border-t border-outline-variant/5 px-5 py-5 transition-colors hover:bg-surface-container sm:px-6 lg:grid lg:grid-cols-[1.6fr_1.1fr_0.85fr_1fr_0.9fr] lg:items-center lg:gap-4 lg:px-8 lg:py-6"
                >
                  <div className="flex items-center gap-4">
                    <AvatarMark label={row.company[0]} />
                    <div>
                      <p className="font-bold text-on-surface">{row.company}</p>
                      <p className="text-sm text-on-surface-variant">
                        {row.segment}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm lg:text-base">
                    {event ? (
                      <Link
                        to={`/events/${event.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="group/event inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[13px] text-on-surface-variant group-hover/event:text-secondary">
                          event
                        </span>
                        <span className="text-sm font-semibold text-on-surface group-hover/event:text-secondary leading-tight">
                          {event.name}
                        </span>
                      </Link>
                    ) : (
                      <span className="text-sm text-on-surface-variant">—</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 lg:block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant lg:hidden">Target</span>
                    <div className="text-lg font-bold text-on-surface">
                      {row.target}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant lg:hidden">Negotiation</div>
                    <div className="text-lg font-bold text-on-surface">
                      {row.negotiated}
                    </div>
                    <div className={`text-sm font-bold ${row.deltaTone}`}>
                      {row.delta}
                    </div>
                  </div>
                  <div>
                    <Chip variant={getStatusVariant(row.status)}>{row.status}</Chip>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-outline-variant/5 bg-surface-container-low px-5 py-5 sm:px-6 lg:px-8">
            <p className="text-sm text-on-surface-variant">
              Showing all {agentRows.length} active Galileo cycles
            </p>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
