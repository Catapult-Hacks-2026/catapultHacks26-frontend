import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  defaultMarketInsightsQuery,
  type MarketInsightsQuery,
} from "@/lib/market-insights-data";

type QueryLocationState = {
  query?: MarketInsightsQuery;
};

export function MarketInsightsChat() {
  const navigate = useNavigate();
  const locationState = useLocation().state as QueryLocationState | null;
  const initialQuery = locationState?.query ?? defaultMarketInsightsQuery;

  const [location, setLocation] = useState(initialQuery.location);
  const [attendees, setAttendees] = useState(initialQuery.attendees);
  const [nights, setNights] = useState(initialQuery.nights);
  const [eventType, setEventType] = useState(initialQuery.eventType);
  const [timing, setTiming] = useState(initialQuery.timing);
  const [eventDetails, setEventDetails] = useState(initialQuery.eventDetails);

  function runTimingAnalysis() {
    navigate("/event-timing/results", {
      state: {
        query: {
          location,
          attendees,
          nights,
          eventType,
          timing,
          eventDetails,
        } satisfies MarketInsightsQuery,
      } satisfies QueryLocationState,
    });
  }

  return (
    <section className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-ambient-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary">
            Event Query
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-on-surface">
            Find the Best Event Window
          </h2>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">
            Enter the destination and event profile. Galileo will estimate the
            strongest date ranges, expected market cost, expected negotiated
            price, and modeled savings.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
            Location
          </span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
            placeholder="City, market, or airport"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
              Event Type
            </span>
            <input
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
              placeholder="Sales kickoff, retreat, summit..."
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
              Preferred Timing
            </span>
            <input
              value={timing}
              onChange={(event) => setTiming(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
              placeholder="Quarter, month, or date range"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
              Attendees
            </span>
            <input
              value={attendees}
              onChange={(event) => setAttendees(event.target.value)}
              type="number"
              className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
              placeholder="100"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
              Nights
            </span>
            <input
              value={nights}
              onChange={(event) => setNights(event.target.value)}
              type="number"
              className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
              placeholder="4"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-widest text-on-primary-container">
            Event Details
          </span>
          <textarea
            rows={4}
            value={eventDetails}
            onChange={(event) => setEventDetails(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-white px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-secondary/40"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button className="rounded-full px-7 py-3 text-sm" onClick={runTimingAnalysis}>
          Run Timing Analysis
        </Button>

      </div>
    </section>
  );
}
