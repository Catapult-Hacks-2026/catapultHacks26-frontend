import { useEffect, useMemo, useState } from "react";
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
import { useTranscriptStream } from "@/hooks/useTranscriptStream";
import { LiveTranscript } from "@/components/dashboard/LiveTranscript";
import { useQueryClient } from "@/lib/queryClient";
import type { CallEndedData, PriceChangeEvent, DealFinalizedEvent } from "@/lib/transcript-types";
import type { ActivityItem } from "@/hooks/useNegotiationDetail";

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
  const isNegotiating = agent?.status === "Negotiating" || agent?.status === "Ringing";
  const displayStatus = agent ? getAgentDisplayStatus(agent) : (data?.status ?? "Negotiating");
  const repLabel = "hotel sales rep";
  const companyLabel = data?.company ?? agent?.company ?? "Negotiation";
  const companyId = id?.split("-")[0] ?? "";
  const negotiatedPrice = data?.negotiatedPrice ?? agent?.negotiatedPrice ?? "—";
  const targetPrice = data?.targetPrice ?? "—";
  const currentPrice = data?.currentPrice ?? "—";
  const locationLabel = data?.location ?? event?.location ?? "Location unavailable";
  const pricePath: PricePoint[] = useMemo(() => data?.pricePath ?? [], [data?.pricePath]);

  const agentStatus = data?.status ?? displayStatus;

  const agentChipVariant = (!agent || agent.isAccepted ? "success" : getStatusVariant(displayStatus)) as
    | "success"
    | "neutral"
    | "negotiating"
    | "error";

  const queryClient = useQueryClient();
  const transcriptAgentId = isNegotiating ? (id ?? null) : null;
  const { state: transcriptState } = useTranscriptStream(transcriptAgentId);

  // Snapshot terminal events at the page level so they survive the
  // transcript reducer RESET that fires when isNegotiating flips after
  // queries are invalidated post-call-end.
  const [finalizedSnapshot, setFinalizedSnapshot] = useState<{
    callEnded: CallEndedData | null;
    dealFinalized: DealFinalizedEvent | null;
  }>({ callEnded: null, dealFinalized: null });

  useEffect(() => {
    setFinalizedSnapshot({ callEnded: null, dealFinalized: null });
  }, [id]);

  useEffect(() => {
    if (transcriptState.callEnded || transcriptState.dealFinalized) {
      setFinalizedSnapshot((prev) => ({
        callEnded: transcriptState.callEnded ?? prev.callEnded,
        dealFinalized: transcriptState.dealFinalized ?? prev.dealFinalized,
      }));
    }
  }, [transcriptState.callEnded, transcriptState.dealFinalized]);

  useEffect(() => {
    if ((transcriptState.callEnded || transcriptState.dealFinalized) && id) {
      const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["negotiations", id] });
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["negotiations"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      };
      invalidate();
      // Backend may persist status asynchronously — retry so the UI
      // catches up without requiring a manual refresh.
      const t1 = setTimeout(invalidate, 1500);
      const t2 = setTimeout(invalidate, 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [transcriptState.callEnded, transcriptState.dealFinalized, id, queryClient]);

  const livePricePoints: PricePoint[] = useMemo(
    () =>
      transcriptState.priceChanges.map((pc: PriceChangeEvent) => ({
        label: pc.source === "galileo" ? `Galileo R${pc.round}` : `Hotel R${pc.round}`,
        price: pc.price,
        type: pc.source === "galileo" ? ("negotiated" as const) : ("offer" as const),
      })),
    [transcriptState.priceChanges],
  );

  const dealPoint: PricePoint | null = useMemo(
    () =>
      transcriptState.dealFinalized
        ? { label: "Final Accepted", price: transcriptState.dealFinalized.finalPrice, type: "final" as const }
        : null,
    [transcriptState.dealFinalized],
  );

  const mergedPricePath: PricePoint[] = useMemo(
    () => [...pricePath, ...livePricePoints, ...(dealPoint ? [dealPoint] : [])],
    [pricePath, livePricePoints, dealPoint],
  );

  const liveActivityItems: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];
    for (const pc of transcriptState.priceChanges) {
      items.push({
        price: `$${pc.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        badge: null,
        badgeTone: "",
        detail: pc.source === "galileo" ? "Galileo" : "Hotel Rep",
        time: `Round ${pc.round}`,
        active: false,
      });
    }
    if (transcriptState.dealFinalized) {
      const df: DealFinalizedEvent = transcriptState.dealFinalized;
      items.push({
        price: `$${df.finalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        badge: `Saved $${df.savings.toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
        badgeTone: "bg-tertiary-fixed text-on-tertiary-fixed",
        detail: "Deal Closed",
        time: "Final",
        active: true,
      });
    }
    return items;
  }, [transcriptState.priceChanges, transcriptState.dealFinalized]);

  const mergedActivity = useMemo(
    () => [...(data?.activityStream ?? []), ...liveActivityItems],
    [data?.activityStream, liveActivityItems],
  );

  const callJustEnded = transcriptState.callEnded ?? finalizedSnapshot.callEnded;
  const dealJustFinalized = transcriptState.dealFinalized ?? finalizedSnapshot.dealFinalized;
  const detailDealClosed =
    data?.status === "Deal Closed" || data?.status === "Completed";
  const showOfferSummary = !!(dealJustFinalized || callJustEnded || detailDealClosed);
  const isRateConfirmed = !!(
    dealJustFinalized ||
    callJustEnded?.outcome?.toLowerCase() === "rate_confirmed" ||
    detailDealClosed
  );
  const canAcceptFromDetail = detailDealClosed && !data?.isAccepted;
  const showAcceptWidget =
    isRateConfirmed && !data?.isAccepted && (canAccept || canAcceptFromDetail) && event && agent;

  const parsePriceString = (value: string | undefined | null) => {
    if (!value) return null;
    const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  };
  const detailNegotiatedPrice = parsePriceString(data?.negotiatedPrice);
  const summaryFinalPrice =
    dealJustFinalized?.finalPrice ??
    callJustEnded?.finalPrice ??
    (detailDealClosed ? detailNegotiatedPrice : null);
  const summaryMarketPrice = dealJustFinalized?.marketPrice ?? data?.originalPrice ?? null;
  const summarySavings =
    dealJustFinalized?.savings ??
    (summaryMarketPrice != null && summaryFinalPrice != null ? summaryMarketPrice - summaryFinalPrice : null);
  const summaryOutcome =
    callJustEnded?.outcome ?? (dealJustFinalized || detailDealClosed ? "RATE_CONFIRMED" : null);

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
          {showOfferSummary && (
            <div className={`rounded-xl border p-6 sm:p-8 ${isRateConfirmed ? "border-secondary/20 bg-secondary/5" : "border-slate-200 bg-surface-container-lowest"}`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${isRateConfirmed ? "text-secondary" : "text-on-surface-variant"}`}>
                  {isRateConfirmed ? "check_circle" : "call_end"}
                </span>
                <h3 className="text-lg font-bold text-on-surface">
                  {isRateConfirmed ? "Deal Reached" : "Call Ended"}
                </h3>
                {summaryOutcome && (
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isRateConfirmed
                      ? "bg-secondary/10 text-secondary"
                      : summaryOutcome.toLowerCase() === "callback_requested"
                        ? "bg-amber-100 text-amber-800"
                        : summaryOutcome.toLowerCase() === "failed" || summaryOutcome.toLowerCase() === "timed_out"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                  }`}>
                    {summaryOutcome.replace(/_/g, " ")}
                  </span>
                )}
              </div>
              {summaryFinalPrice != null && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Final Price</p>
                    <p className="mt-1 text-3xl font-black text-on-surface">${summaryFinalPrice}/night</p>
                  </div>
                  {summaryMarketPrice != null && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Market Price</p>
                      <p className="mt-1 text-3xl font-black text-on-surface-variant">${summaryMarketPrice}/night</p>
                    </div>
                  )}
                  {summarySavings != null && summarySavings > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Savings</p>
                      <p className="mt-1 text-3xl font-black text-secondary">${summarySavings}/night</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showAcceptWidget ? (
            <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-2xl">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
              <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                    Negotiated Price
                  </p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-white">
                    {summaryFinalPrice != null ? `$${summaryFinalPrice}/night` : negotiatedPrice}
                  </p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    The supplier has finalized terms. Accept this offer to lock it into the event and automatically close out competing deals of the same type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => acceptNegotiation.mutate({ eventId: event!.id, agentId: agent!.negotiationId })}
                  className="relative inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-6 py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100 xl:w-auto xl:min-w-[220px]"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  {acceptNegotiation.isPending ? "Accepting..." : "Accept Offer"}
                </button>
              </div>
            </div>
          ) : canAccept && event && agent && !showOfferSummary ? (
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
                points={mergedPricePath}
                marketPrice={data.originalPrice ?? mergedPricePath[0]?.price ?? 0}
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
              <div className="mt-6 space-y-4">
                {mergedActivity.map((item) => (
                  <div
                    key={`${item.price}-${item.time}`}
                    className="relative pl-6 before:absolute before:bottom-[-16px] before:left-0 before:top-2 before:w-[2px] before:bg-slate-100 last:before:hidden"
                  >
                    <span
                      className={`absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${item.active ? "bg-secondary" : "bg-slate-300"}`}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-on-surface">{item.price}</p>
                      <span className="text-xs text-on-surface-variant">{item.detail}</span>
                    </div>
                    {item.badge ? (
                      <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${item.badgeTone}`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </section>

        <LiveTranscript state={transcriptState} />
      </div>
    </div>
  );
}
