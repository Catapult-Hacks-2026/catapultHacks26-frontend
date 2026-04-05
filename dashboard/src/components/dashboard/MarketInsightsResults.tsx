import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  defaultMarketInsightsQuery,
  type MarketInsightsQuery,
} from "@/lib/market-insights-data";
import { useMarketInsights, type RecommendationWindow } from "@/hooks/useMarketInsights";

type ResultsLocationState = {
  query?: MarketInsightsQuery;
};

export function MarketInsightsResults() {
  const navigate = useNavigate();
  const locationState = useLocation().state as ResultsLocationState | null;
  const query = locationState?.query ?? defaultMarketInsightsQuery;
  const insights = useMarketInsights();
  const hasFiredRef = useRef(false);
  const [results, setResults] = useState<RecommendationWindow[] | null>(null);

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true;
      void insights.mutateAsync({
        location: query.location,
        eventType: query.eventType,
        preferredTiming: query.timing,
        attendees: Number.parseInt(query.attendees, 10) || 100,
        nights: Number.parseInt(query.nights, 10) || 3,
        eventDetails: query.eventDetails,
      }).then(setResults).catch(() => {});
    }
  }, []);

  function queryAgain() {
    navigate("/event-timing", { state: { query } satisfies ResultsLocationState });
  }

  if (insights.isPending || !results) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-white p-5 shadow-ambient-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-pulse rounded-full bg-secondary" />
            <p className="text-sm font-semibold text-on-surface">
              Running market timing analysis for {query.location}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Comparing hotel demand curves, air pricing pressure, and compression risks against your {query.eventType.toLowerCase()} requirements.
          </p>
          <div className="mt-6 space-y-3">
            <div className="h-24 animate-pulse rounded-2xl bg-surface-container-low" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-28 animate-pulse rounded-2xl bg-surface-container-low" />
              <div className="h-28 animate-pulse rounded-2xl bg-surface-container-low" />
              <div className="h-28 animate-pulse rounded-2xl bg-surface-container-low" />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm sm:p-6"
            >
              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded-full bg-surface-container-high" />
                <div className="h-8 w-56 animate-pulse rounded-xl bg-surface-container-high" />
                <div className="h-14 animate-pulse rounded-2xl bg-surface-container-high" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="h-24 animate-pulse rounded-2xl bg-white" />
                  <div className="h-24 animate-pulse rounded-2xl bg-white" />
                  <div className="h-24 animate-pulse rounded-2xl bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {results.map((window) => (
        <article
          key={window.range}
          className="rounded-[1.75rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary">
                {window.label}
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">
                {window.range}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-on-surface-variant">
                {window.explanation}
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                {window.probability}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Expected Market Cost
              </p>
              <p className="mt-2 text-2xl font-black text-on-surface">{window.marketCost}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Expected Negotiated Price
              </p>
              <p className="mt-2 text-2xl font-black text-secondary">{window.negotiatedPrice}</p>
            </div>
            <div className="rounded-2xl border border-outline-variant/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Expected Savings
              </p>
              <p className="mt-2 text-2xl font-black text-on-tertiary-container">{window.savings}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href="/negotiations/configure"
              className="rounded-full px-7 py-3 text-sm"
            >
              Launch Negotiation
            </Button>
          </div>
        </article>
      ))}

      <div className="flex justify-start pt-2">
        <Button
          variant="ghost"
          className="rounded-full px-7 py-3 text-sm"
          onClick={queryAgain}
        >
          Query Again
        </Button>
      </div>
    </div>
  );
}
