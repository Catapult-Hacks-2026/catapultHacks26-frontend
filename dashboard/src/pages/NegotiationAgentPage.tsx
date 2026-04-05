import { Link, useParams } from "react-router-dom";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getAgentDisplayStatus,
  getStatusVariant,
} from "@/lib/dashboard-data";
import {
  NegotiationPricePath,
  type PricePoint,
} from "@/components/dashboard/NegotiationPricePath";
import { useEvents } from "@/context/EventsContext";
import {
  useAcceptNegotiation,
  useIntervene,
  useNegotiationDetail,
} from "@/hooks/useNegotiationDetail";

export default function NegotiationAgentPage() {
  const { id } = useParams<{ id: string }>();
  const { getEventForNegotiation, canAcceptAgent } = useEvents();
  const {
    data,
    error,
    isError,
    isLoading,
  } = useNegotiationDetail(id ?? "");
  const acceptNegotiation = useAcceptNegotiation();
  const intervene = useIntervene();
  const event = getEventForNegotiation(id ?? "");
  const agent = event?.agents.find((item) => item.negotiationId === id);
  const canAccept = event && agent ? canAcceptAgent(event, agent) : false;
  const isNegotiating = agent?.status === "Negotiating";
  const displayStatus = agent ? getAgentDisplayStatus(agent) : (data?.status ?? "Negotiating");
  const repLabel = "hotel sales rep";
  const companyLabel = data?.company ?? agent?.company ?? "Negotiation";
  const companyId = id?.split("-")[0] ?? "";
  const negotiatedPrice = data?.negotiatedPrice ?? agent?.negotiatedPrice ?? "—";
  const targetPrice = data?.targetPrice ?? "—";
  const currentPrice = data?.currentPrice ?? "—";
  const locationLabel = data?.location ?? event?.location ?? "Location unavailable";
  const pricePath: PricePoint[] = data?.pricePath ?? [];

  const agentStatus = data?.status ?? displayStatus;

  const agentChipVariant = (!agent || agent.isAccepted ? "success" : getStatusVariant(displayStatus)) as
    | "success"
    | "neutral"
    | "negotiating"
    | "error";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-4 w-40" />
          <section className="grid grid-cols-1 items-end gap-8 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="mt-5 h-14 w-80" />
              <Skeleton className="mt-4 h-5 w-44" />
              <Skeleton className="mt-4 h-16 w-full max-w-3xl" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-4">
              <Skeleton className="h-32 rounded-3xl" />
              <Skeleton className="h-32 rounded-3xl" />
            </div>
          </section>
          <Skeleton className="h-36 rounded-xl" />
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <Skeleton className="h-[420px] rounded-xl xl:col-span-2" />
            <Skeleton className="h-[420px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-sm text-error">
        {(error as Error)?.message ?? "Unable to load negotiation detail."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        {event && (
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            {event.name}
          </Link>
        )}
        <section className="grid grid-cols-1 items-end gap-8 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div className="flex items-center gap-3">
              <Chip variant={agentChipVariant}>{agentStatus}</Chip>
              <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">location_on</span>
                {locationLabel}
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-on-surface sm:text-5xl">
              {companyLabel}
            </h1>
            <Link
              to={`/companies/${companyId}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
            >
              View company profile
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <p className="mt-4 text-sm font-semibold text-on-surface">
              Agent Status: <span className="text-secondary">{agentStatus}</span>
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Autonomous Agent <span className="font-bold text-secondary">Galileo</span> is
              actively negotiating rates, concessions, and commercial terms with the supplier sales team.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-4">
            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                Target Price
              </p>
              <p className="mt-2 text-4xl font-black text-on-surface">{targetPrice}</p>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[11px] uppercase tracking-widest text-secondary">
                Current Price
              </p>
              <p className="mt-2 text-4xl font-black text-secondary">{currentPrice}</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          {canAccept && event && agent ? (
            <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-2xl">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                    Negotiated Price
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-white">{negotiatedPrice}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    The supplier has finalized terms. Accept this offer to lock it into the event and automatically close out competing deals of the same type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => acceptNegotiation.mutate({ eventId: event.id, agentId: agent.negotiationId })}
                  className="relative inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-6 py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100 xl:w-auto xl:min-w-[220px]"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  {acceptNegotiation.isPending ? "Accepting..." : "Accept Offer"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="rounded-xl bg-surface-container-low p-5 sm:p-6 lg:p-8 xl:col-span-2">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">
                    Negotiation Price Path
                  </h2>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Real-time progression from supplier anchor to Galileo target.
                  </p>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p className="font-bold text-on-tertiary-container">
                    Savings to Date: {data.savingsToDate}
                  </p>
                  <p className="font-bold text-error">Distance to Goal: {data.distanceToGoal}</p>
                </div>
              </div>
              <NegotiationPricePath
                points={pricePath}
                marketPrice={data.originalPrice ?? pricePath[0]?.price ?? 0}
                targetPrice={Number.parseFloat(targetPrice.replace(/[^0-9.]/g, "")) || 0}
              />
            </div>

            <div className="space-y-6">
              {isNegotiating ? (
                <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-2xl">
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
                  <h4 className="relative text-2xl font-bold">Intervene Manually</h4>
                  <p className="relative mt-3 text-sm leading-6 text-slate-400">
                    {`Join the live negotiation with the ${repLabel} to handle pricing pushback, concession tradeoffs, or final commercial alignment.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => id && intervene.mutate(id)}
                    disabled={intervene.isPending}
                    className="relative mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    {intervene.isPending ? "Routing..." : "Talk to Hotel Rep"}
                  </button>
                </div>
              ) : null}

              <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Activity Stream
              </p>
              <div className="mt-6 space-y-6">
                {data.activityStream.map((item) => (
                  <div
                    key={`${item.price}-${item.time}`}
                    className="relative pl-6 before:absolute before:bottom-[-24px] before:left-0 before:top-2 before:w-[2px] before:bg-slate-100 last:before:hidden"
                  >
                    <span
                      className={`absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${item.active ? "bg-secondary" : "bg-slate-300"
                        }`}
                    />
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-on-surface">{item.price}</p>
                      {item.badge ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.badgeTone}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                      {item.detailTone ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.detailTone}`}>
                          {item.detail}
                        </span>
                      ) : (
                        <span>{item.detail}</span>
                      )}
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/50 bg-surface-container-highest/30 p-5 backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">
                Negotiation Transcript
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Last two verified messages exchanged through the supplier portal.
              </p>
            </div>
            <button className="rounded-lg border border-slate-200 bg-surface-container-lowest px-6 py-2.5 text-sm font-bold text-on-surface">
              Expand to Full Transcript
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {data.transcript.map((message) => {
              const isAgent = message.sender === "agent";

              return (
                <div
                  key={`${message.label}-${message.timestamp}`}
                  className={`flex items-start gap-4 ${isAgent ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isAgent ? "bg-primary-container text-white" : "bg-secondary text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isAgent ? "smart_toy" : "person"}
                    </span>
                  </div>
                  <div
                    className={`max-w-3xl rounded-2xl border p-4 ${
                      isAgent
                        ? "rounded-tl-none border-slate-100 bg-white shadow-sm"
                        : "rounded-tr-none border-secondary/10 bg-secondary/5 text-right"
                    }`}
                  >
                    <p className="text-sm leading-7 text-on-surface">{message.body}</p>
                    <p className="mt-3 text-[10px] text-slate-400">
                      {message.label} • {message.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
