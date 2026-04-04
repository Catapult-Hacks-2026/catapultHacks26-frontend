import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { getSupplierProfile, initialEvents } from "@/lib/dashboard-data";

const locationAnalytics = {
  all: {
    label: "All Locations",
    subtitle: "Portfolio-wide view across every negotiated property and market",
    currentLocation: "Global portfolio coverage",
    lifetimeSavings: "$1.2M",
    savingsDelta: "+14%",
    agreements: "Negotiated across 14 master service agreements.",
    pricing: {
      "1Y": [
        { label: "JAN", negotiated: 462, market: 498 },
        { label: "MAR", negotiated: 448, market: 472 },
        { label: "MAY", negotiated: 474, market: 489 },
        { label: "JUL", negotiated: 438, market: 468 },
        { label: "SEP", negotiated: 452, market: 479 },
        { label: "NOV", negotiated: 485, market: 512 },
      ],
      ALL: [
        { label: "JAN", negotiated: 498, market: 536 },
        { label: "MAR", negotiated: 472, market: 511 },
        { label: "MAY", negotiated: 489, market: 528 },
        { label: "JUL", negotiated: 438, market: 468 },
        { label: "SEP", negotiated: 456, market: 491 },
        { label: "NOV", negotiated: 485, market: 522 },
      ],
    },
    eventIds: initialEvents.map((event) => event.id),
  },
  london: {
    label: "London Executive Campus",
    subtitle: "Flagship UK corporate and executive-stay inventory",
    currentLocation: "London, United Kingdom",
    lifetimeSavings: "$428K",
    savingsDelta: "+11%",
    agreements: "Negotiated across 5 London-based commercial agreements.",
    pricing: {
      "1Y": [
        { label: "JAN", negotiated: 438, market: 467 },
        { label: "MAR", negotiated: 421, market: 452 },
        { label: "MAY", negotiated: 446, market: 474 },
        { label: "JUL", negotiated: 417, market: 448 },
        { label: "SEP", negotiated: 433, market: 462 },
        { label: "NOV", negotiated: 451, market: 481 },
      ],
      ALL: [
        { label: "JAN", negotiated: 452, market: 483 },
        { label: "MAR", negotiated: 439, market: 468 },
        { label: "MAY", negotiated: 461, market: 492 },
        { label: "JUL", negotiated: 417, market: 448 },
        { label: "SEP", negotiated: 441, market: 471 },
        { label: "NOV", negotiated: 451, market: 481 },
      ],
    },
    eventIds: ["emea-partner-summit"],
  },
  chicago: {
    label: "Chicago River North",
    subtitle: "Midwest conference and transient corporate inventory",
    currentLocation: "Chicago, IL",
    lifetimeSavings: "$286K",
    savingsDelta: "+9%",
    agreements: "Negotiated across 4 Chicago program agreements.",
    pricing: {
      "1Y": [
        { label: "JAN", negotiated: 312, market: 344 },
        { label: "MAR", negotiated: 298, market: 327 },
        { label: "MAY", negotiated: 325, market: 356 },
        { label: "JUL", negotiated: 302, market: 332 },
        { label: "SEP", negotiated: 316, market: 347 },
        { label: "NOV", negotiated: 329, market: 361 },
      ],
      ALL: [
        { label: "JAN", negotiated: 326, market: 359 },
        { label: "MAR", negotiated: 309, market: 339 },
        { label: "MAY", negotiated: 334, market: 366 },
        { label: "JUL", negotiated: 302, market: 332 },
        { label: "SEP", negotiated: 321, market: 351 },
        { label: "NOV", negotiated: 329, market: 361 },
      ],
    },
    eventIds: ["annual-leadership-retreat"],
  },
  singapore: {
    label: "Singapore Marina District",
    subtitle: "APAC executive travel and logistics lodging footprint",
    currentLocation: "Singapore",
    lifetimeSavings: "$351K",
    savingsDelta: "+18%",
    agreements: "Negotiated across 5 APAC lodging and logistics agreements.",
    pricing: {
      "1Y": [
        { label: "JAN", negotiated: 356, market: 389 },
        { label: "MAR", negotiated: 344, market: 377 },
        { label: "MAY", negotiated: 371, market: 405 },
        { label: "JUL", negotiated: 338, market: 369 },
        { label: "SEP", negotiated: 349, market: 382 },
        { label: "NOV", negotiated: 365, market: 399 },
      ],
      ALL: [
        { label: "JAN", negotiated: 372, market: 405 },
        { label: "MAR", negotiated: 356, market: 389 },
        { label: "MAY", negotiated: 381, market: 417 },
        { label: "JUL", negotiated: 338, market: 369 },
        { label: "SEP", negotiated: 358, market: 392 },
        { label: "NOV", negotiated: 365, market: 399 },
      ],
    },
    eventIds: ["q3-sales-kickoff"],
  },
} as const;

type LocationScope = keyof typeof locationAnalytics;
type PricingRange = keyof (typeof locationAnalytics)["all"]["pricing"];

function formatCurrency(value: number) {
  return `$${value} / night avg`;
}

function buildChartPoints(
  series: ReadonlyArray<{ label: string; value: number }>,
  minValue: number,
  maxValue: number,
) {
  const width = 800;
  const height = 200;
  const leftPadding = 24;
  const rightPadding = 24;
  const topPadding = 28;
  const bottomPadding = 34;
  const usableWidth = width - leftPadding - rightPadding;
  const usableHeight = height - topPadding - bottomPadding;

  return series.map((point, index) => {
    const x =
      leftPadding +
      (usableWidth * index) / Math.max(series.length - 1, 1);
    const y =
      topPadding +
      ((maxValue - point.value) / Math.max(maxValue - minValue, 1)) * usableHeight;

    return { ...point, x, y };
  });
}

function buildLinePath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");
}

function buildAreaPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";

  const linePath = buildLinePath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L${lastPoint.x.toFixed(2)} 200 L${firstPoint.x.toFixed(2)} 200 Z`;
}

export default function CompanyDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const profile = getSupplierProfile(id);
  const [locationScope, setLocationScope] = useState<LocationScope>("all");
  const [pricingRange, setPricingRange] = useState<PricingRange>("ALL");
  const activeLocation = locationAnalytics[locationScope];
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const activeSeries = activeLocation.pricing[pricingRange];
  const safeActiveIndex =
    activePointIndex === null ? null : Math.min(activePointIndex, activeSeries.length - 1);
  const activePoint = safeActiveIndex === null ? null : activeSeries[safeActiveIndex];
  const allValues = activeSeries.flatMap((point) => [point.negotiated, point.market]);
  const minChartValue = Math.min(...allValues) - 14;
  const maxChartValue = Math.max(...allValues) + 14;
  const negotiatedPoints = buildChartPoints(
    activeSeries.map((point) => ({ label: point.label, value: point.negotiated })),
    minChartValue,
    maxChartValue,
  );
  const marketPoints = buildChartPoints(
    activeSeries.map((point) => ({ label: point.label, value: point.market })),
    minChartValue,
    maxChartValue,
  );
  const activeNegotiatedPoint =
    safeActiveIndex === null ? null : negotiatedPoints[safeActiveIndex];
  const negotiatedLinePath = buildLinePath(negotiatedPoints);
  const negotiatedAreaPath = buildAreaPath(negotiatedPoints);
  const marketLinePath = buildLinePath(marketPoints);
  const visibleEventIds = activeLocation.eventIds as readonly string[];
  const visibleEvents = initialEvents.filter((event) =>
    visibleEventIds.includes(event.id),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="grid grid-cols-1 items-end gap-8 xl:grid-cols-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 xl:col-span-8">
          <div className="relative">
            <AvatarMark
              label={profile.initials}
              size="xl"
              className="bg-primary-container text-4xl text-secondary"
            />

          </div>

          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
              {profile.displayName}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {profile.type === "Hotel" ? "hotel" : "flight"}
              </span>
              {profile.type}
            </span>
            <p className="text-sm leading-7 text-on-surface-variant">
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm sm:gap-6">
              <span className="text-on-surface-variant">{activeLocation.currentLocation}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container-low p-6 sm:p-8 xl:col-span-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Total Lifetime Savings
          </p>
          <div className="mt-4 text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface">
            {activeLocation.lifetimeSavings}
          </div>

        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {Object.entries(locationAnalytics).map(([key, item]) => {
          const selected = locationScope === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setLocationScope(key as LocationScope);
                setPricingRange("ALL");
                setActivePointIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${selected
                ? "bg-secondary font-bold text-white"
                : "bg-surface-container text-on-surface-variant"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl bg-surface-container-lowest p-5 sm:p-6 lg:p-8 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Pricing Trends</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Historical booking movement across negotiated room blocks for {activeLocation.label.toLowerCase()}.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                  Negotiated
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-on-surface/60" />
                  Market
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPricingRange("1Y");
                  setActivePointIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${pricingRange === "1Y"
                  ? "bg-secondary font-bold text-white"
                  : "bg-surface-container text-on-surface-variant"
                  }`}
              >
                1Y
              </button>
              <button
                type="button"
                onClick={() => {
                  setPricingRange("ALL");
                  setActivePointIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${pricingRange === "ALL"
                  ? "bg-secondary font-bold text-white"
                  : "bg-surface-container text-on-surface-variant"
                  }`}
              >
                ALL
              </button>
            </div>
          </div>

          <div
            className="relative mt-8"
            onMouseLeave={() => setActivePointIndex(null)}
          >
            <svg viewBox="0 0 800 200" className="h-[220px] w-full">
              <defs>
                <linearGradient id="pricing-fill" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f9f6e" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0f9f6e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradient-line" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0f9f6e" />
                  <stop offset="100%" stopColor="#0b7a58" />
                </linearGradient>
              </defs>
              {negotiatedPoints.map((point) => (
                <line
                  key={`${pricingRange}-${point.label}-grid`}
                  x1={point.x}
                  y1={24}
                  x2={point.x}
                  y2={168}
                  stroke="rgba(15, 159, 110, 0.08)"
                  strokeDasharray="4 8"
                />
              ))}
              <path
                d={negotiatedAreaPath}
                fill="url(#pricing-fill)"
              />
              <path
                d={marketLinePath}
                fill="none"
                stroke="rgba(17, 24, 39, 0.55)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 8"
              />
              <path
                d={negotiatedLinePath}
                fill="none"
                stroke="url(#gradient-line)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {marketPoints.map((point, index) => {
                const isActive = safeActiveIndex !== null && index === safeActiveIndex;

                return (
                  <g key={`${pricingRange}-${point.label}-market`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 6 : 4}
                      fill="rgba(17, 24, 39, 0.7)"
                      stroke="white"
                      strokeWidth={isActive ? 3 : 2}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="18"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setActivePointIndex(index)}
                    />
                  </g>
                );
              })}
              {negotiatedPoints.map((point, index) => {
                const isActive = safeActiveIndex !== null && index === safeActiveIndex;

                return (
                  <g key={`${pricingRange}-${point.label}`}>
                    {isActive ? (
                      <circle cx={point.x} cy={point.y} r="18" fill="#0f9f6e" opacity="0.18" />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 7 : 5}
                      fill="#0f9f6e"
                      stroke="white"
                      strokeWidth={isActive ? 3 : 2}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="18"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setActivePointIndex(index)}
                    />
                  </g>
                );
              })}
            </svg>
            {activePoint && activeNegotiatedPoint ? (
              <div
                className="glass-panel absolute top-4 w-[90%] max-w-xs -translate-x-1/2 rounded-xl border border-white p-3 shadow-xl transition-all duration-200"
                style={{
                  left: `${activeNegotiatedPoint.x / 8}%`,
                }}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-on-primary-container">
                  {activePoint.label} Pricing
                </p>
                <p className="mt-1 text-sm font-bold text-on-surface">
                  Negotiated: {formatCurrency(activePoint.negotiated)}
                </p>
                <p className="mt-1 text-sm font-bold text-on-surface-variant">
                  Market: {formatCurrency(activePoint.market)}
                </p>
              </div>
            ) : null}
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-widest text-on-primary-container sm:grid-cols-6">
              {activeSeries.map((point, index) => (
                <button
                  key={`${pricingRange}-${point.label}-label`}
                  type="button"
                  onMouseEnter={() => setActivePointIndex(index)}
                  onFocus={() => setActivePointIndex(index)}
                  onClick={() => setActivePointIndex(index)}
                  className={`rounded-full px-2 py-1 text-left transition-colors ${safeActiveIndex !== null && index === safeActiveIndex
                    ? "bg-secondary/10 text-secondary"
                    : "text-on-primary-container"
                    }`}
                >
                  {point.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:p-6 lg:p-8 xl:col-span-1">
          <h2 className="text-2xl font-bold text-on-surface">Booking Window</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Optimal months to negotiate based on historical rate compression.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { label: "JAN", score: 15 },
              { label: "FEB", score: 95 },
              { label: "MAR", score: 55 },
              { label: "APR", score: 20 },
              { label: "MAY", score: 25 },
              { label: "JUN", score: 62 },
              { label: "JUL", score: 90 },
              { label: "AUG", score: 18 },
              { label: "SEP", score: 50 },
              { label: "OCT", score: 28 },
              { label: "NOV", score: 32 },
              { label: "DEC", score: 85 },
            ].map(({ label, score }) => (
              <div key={label} className="flex flex-col gap-2 rounded-2xl bg-surface-container p-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  {label}
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-secondary"
                    style={{ width: `${score}%`, opacity: 0.25 + (score / 100) * 0.75 }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: `rgba(15, 159, 110, ${0.35 + (score / 100) * 0.65})` }}
                >
                  {score >= 75 ? "Best" : score >= 45 ? "Good" : "Worst Deal"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-5 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-secondary opacity-90" />
              Best deal
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-secondary opacity-50" />
              Good
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-secondary opacity-25" />
              Worst Deal price
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-5 sm:p-6 md:col-span-2 lg:p-8 xl:col-span-3">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Current And Past Events</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Event activity for {activeLocation.label.toLowerCase()}, including live sourcing cycles and completed programs.
              </p>
            </div>
          </div>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {visibleEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-surface-container-low p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/events/${event.id}`}
                    className="font-bold text-on-surface transition-colors hover:text-secondary"
                  >
                    {event.name}
                  </Link>
                  <Chip variant={event.status === "Active" ? "success" : "neutral"}>
                    {event.status === "Active" ? "Current" : "Past"}
                  </Chip>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <p className="font-bold uppercase tracking-wider text-on-primary-container">Location</p>
                    <p className="mt-0.5 text-on-surface-variant">{event.location}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-on-primary-container">Service</p>
                    <p className="mt-0.5 text-on-surface">{event.service}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-on-primary-container">Dates</p>
                    <p className="mt-0.5 text-on-surface-variant">{event.startDate} – {event.endDate}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-on-primary-container">Attendees</p>
                    <p className="mt-0.5 text-on-surface">{event.attendees}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* sm+: table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
                  <th className="pb-1 pl-4">Event</th>
                  <th className="pb-1 pl-4">Location</th>
                  <th className="pb-1 pl-4">Dates</th>
                  <th className="pb-1 pl-4">Service</th>
                  <th className="pb-1 pl-4">Attendees</th>
                  <th className="pb-1 pl-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="rounded-l-2xl bg-surface-container-low px-4 py-3 font-bold text-on-surface">
                      <Link
                        to={`/events/${event.id}`}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-secondary"
                      >
                        {event.name}
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </Link>
                    </td>
                    <td className="bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
                      {event.location}
                    </td>
                    <td className="bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
                      {event.startDate} – {event.endDate}
                    </td>
                    <td className="bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface">
                      {event.service}
                    </td>
                    <td className="bg-surface-container-low px-4 py-3 text-sm font-medium text-on-surface">
                      {event.attendees}
                    </td>
                    <td className="rounded-r-2xl bg-surface-container-low px-4 py-3">
                      <Chip variant={event.status === "Active" ? "success" : "neutral"}>
                        {event.status === "Active" ? "Current" : "Past"}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
