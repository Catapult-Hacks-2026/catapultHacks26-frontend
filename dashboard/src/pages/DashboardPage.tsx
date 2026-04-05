import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEvents } from "@/context/EventsContext";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useNegotiations } from "@/hooks/useNegotiations";
import { getStatusVariant } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const { error: eventsError, getEventForNegotiation } = useEvents();
  const {
    data: summary,
    error: summaryError,
    isLoading: isSummaryLoading,
  } = useDashboardSummary();
  const {
    data: negotiations = [],
    error: negotiationsError,
    isError: isNegotiationsError,
    isLoading: isNegotiationsLoading,
  } = useNegotiations();
  const previewRows = negotiations.slice(0, 3);
  const dashboardError =
    [summaryError, negotiationsError, eventsError].find(Boolean) as Error | undefined;

  return (
    <div className="min-h-screen bg-surface px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-12">
      {dashboardError ? (
        <AnimateIn>
          <section className="mb-6">
            <div className="rounded-2xl border border-error/20 bg-error/10 px-5 py-4 text-sm text-error shadow-ambient-sm">
              {dashboardError.message || "Unable to load dashboard data right now."}
            </div>
          </section>
        </AnimateIn>
      ) : null}

      <AnimateIn>
        <section>
          <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-ambient-sm sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                  Total Saved This Year
                </p>
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  {isSummaryLoading ? (
                    <>
                      <Skeleton className="h-16 w-44 sm:h-20 sm:w-56" />
                      <Skeleton className="h-5 w-20" />
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl font-bold tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
                        {summary?.totalSavedThisYear ?? "—"}
                      </h1>
                      <span className="text-sm font-medium text-secondary">
                        {summary?.savingsDelta ?? "—"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Link
                to="/negotiations/configure"
                className="shrink-0 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
              >
                Start Negotiations
              </Link>
            </div>
            <div className="mt-6 border-t border-outline-variant/20 pt-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Hotels
                </p>
                {isSummaryLoading ? (
                  <>
                    <Skeleton className="mt-2 h-8 w-28" />
                    <Skeleton className="mt-2 h-4 w-32" />
                  </>
                ) : (
                  <>
                    <p className="mt-1.5 text-2xl font-semibold text-on-surface">
                      {summary?.hotelsSaved ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      across {summary?.contractCount ?? 0} contracts
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.08}>
        <section className="mt-10 overflow-hidden rounded-3xl bg-surface-container-highest shadow-xl shadow-on-surface/5">
          <div className="hidden grid-cols-[1.6fr_1.1fr_0.85fr_1fr_0.9fr] gap-4 px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-on-primary-container lg:grid">
            <span>Company</span>
            <span>Event</span>
            <span>Target Price</span>
            <span>Negotiation Price</span>
            <span>Status</span>
          </div>

          <div>
            {isNegotiationsLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-t border-outline-variant/5 px-5 py-5 sm:px-6 lg:grid lg:grid-cols-[1.6fr_1.1fr_0.85fr_1fr_0.9fr] lg:items-center lg:gap-4 lg:px-8 lg:py-6"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-20" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-8 w-28" />
                </div>
              ))
              : previewRows.map((row) => {
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
                        <p className="text-sm text-on-surface-variant">{row.segment}</p>
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
                      <div className="text-lg font-bold text-on-surface">{row.target}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant lg:hidden">Negotiation</div>
                      <div className="text-lg font-bold text-on-surface">
                        {row.negotiated}
                      </div>
                      <div className={`text-sm font-bold ${row.deltaTone}`}>{row.delta}</div>
                    </div>
                    <div>
                      <Chip variant={getStatusVariant(row.status)}>{row.status}</Chip>
                    </div>
                  </Link>
                );
              })}
          </div>

          <div className="flex flex-col gap-3 border-t border-outline-variant/5 bg-surface-container-low px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">
            <p className="text-sm text-on-surface-variant">
              {isNegotiationsError || eventsError
                ? (dashboardError?.message ?? "Unable to load dashboard data.")
                : `Showing ${previewRows.length} of ${negotiations.length} active Galileo cycles`}
            </p>
            <Link
              to="/all-agents"
              className="text-sm font-bold text-on-surface transition-colors hover:text-secondary"
            >
              View All Agents →
            </Link>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
