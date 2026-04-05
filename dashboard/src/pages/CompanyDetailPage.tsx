import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCompanyEvents, useCompanyNegotiations, useCompanyProfile, useHistoricPricing } from "@/hooks/useCompanies";

type PricingRange = "1Y" | "ALL";

function formatCurrency(value: number) {
  return `$${value} / night avg`;
}

function parseMoney(str: string): number {
  const cleaned = str.replace(/[^0-9.]/g, "");
  return Number.parseFloat(cleaned) || 0;
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
  const {
    data: profile,
    error,
    isError,
    isLoading,
  } = useCompanyProfile(id);
  const {
    data: negotiations = [],
    isLoading: isNegotiationsLoading,
  } = useCompanyNegotiations(id);
  const { data: companyEvents = [] } = useCompanyEvents(id);
  const { data: historicPricing = [] } = useHistoricPricing(profile?.displayName);
  const [locationScope, setLocationScope] = useState<string>("all");
  const [pricingRange, setPricingRange] = useState<PricingRange>("ALL");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-5 w-28" />
        <section className="grid grid-cols-1 items-end gap-8 xl:grid-cols-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 xl:col-span-8">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <Skeleton className="h-40 rounded-3xl xl:col-span-4" />
        </section>
        <Skeleton className="h-10 w-80 rounded-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-[380px] rounded-3xl xl:col-span-2" />
          <Skeleton className="h-[380px] rounded-3xl xl:col-span-1" />
          <Skeleton className="h-[300px] rounded-3xl xl:col-span-3" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl p-4 text-sm text-error sm:p-6 lg:p-8">
        {(error as Error)?.message ?? "Unable to load company profile."}
      </div>
    );
  }

  const locationKeys = Object.keys(profile.locations);
  const resolvedLocationScope = profile.locations[locationScope] ? locationScope : (locationKeys[0] ?? "all");
  const activeLocation = profile.locations[resolvedLocationScope] ?? profile.locations[locationKeys[0]] ?? {
    agreements: "—",
    currentLocation: "Location unavailable",
    eventIds: [],
    label: "All Locations",
    lifetimeSavings: "—",
    pricing: { "1Y": [], ALL: [] },
    savingsDelta: "—",
    subtitle: "",
  };
  const pastEvents = companyEvents.filter((e) => e.status === "Completed");
  const lifetimeSavings = pastEvents.reduce((sum, event) => {
    const companyAgent = event.agents.find((a) => a.companyId === id && a.isAccepted);
    return sum + (companyAgent ? parseMoney(companyAgent.savings) : 0);
  }, 0);
  const formattedLifetimeSavings = lifetimeSavings > 0
    ? `$${lifetimeSavings.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : activeLocation.lifetimeSavings;

  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const historicSeries = historicPricing
    .slice()
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((r) => ({
      label: `${MONTH_LABELS[r.month - 1]} ${r.year}`,
      negotiated: r.price_per_night,
      market: r.price_per_night,
    }));

  const fallbackSeries = activeLocation.pricing[pricingRange] ?? [];
  const activeSeries = historicSeries.length > 0 ? historicSeries : fallbackSeries;
  const safeActiveIndex =
    activePointIndex === null ? null : Math.min(activePointIndex, activeSeries.length - 1);
  const activePoint = safeActiveIndex === null ? null : activeSeries[safeActiveIndex];
  const allValues = activeSeries.flatMap((point) => [point.negotiated, point.market]);
  const minChartValue = allValues.length > 0 ? Math.min(...allValues) - 14 : 0;
  const maxChartValue = allValues.length > 0 ? Math.max(...allValues) + 14 : 100;
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
  const visibleEvents = companyEvents;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Companies
      </Link>

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
                hotel
              </span>
              {profile.type}
            </span>
            <p className="text-sm leading-7 text-on-surface-variant">
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-3 text-sm sm:gap-6">
              <span className="text-on-surface-variant">{activeLocation.currentLocation}</span>
              {!isNegotiationsLoading ? (
                <span className="text-on-surface-variant">
                  {negotiations.length} negotiations on file
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container-low p-6 sm:p-8 xl:col-span-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Total Lifetime Savings
          </p>
          <div className="mt-4 text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface">
            {formattedLifetimeSavings}
          </div>
          <p className="mt-2 text-sm font-semibold text-secondary">{activeLocation.savingsDelta} avg savings rate</p>
        </div>
      </section>

      {locationKeys.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {locationKeys.map((key) => {
            const item = profile.locations[key];
            const selected = locationScope === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setLocationScope(key);
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
      )}

      <p className="text-xs text-on-surface-variant">{activeLocation.agreements}</p>

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
              {(["1Y", "ALL"] as PricingRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setPricingRange(range);
                    setActivePointIndex(null);
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${pricingRange === range
                    ? "bg-secondary font-bold text-white"
                    : "bg-surface-container text-on-surface-variant"
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative mt-8"
            onMouseLeave={() => setActivePointIndex(null)}
          >
            {activeSeries.length > 0 ? (
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
                    key={`${pricingRange}-${resolvedLocationScope}-${point.label}-grid`}
                    x1={point.x}
                    y1={24}
                    x2={point.x}
                    y2={168}
                    stroke="rgba(15, 159, 110, 0.08)"
                    strokeDasharray="4 8"
                  />
                ))}
                <path d={negotiatedAreaPath} fill="url(#pricing-fill)" />
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
                    <g key={`${pricingRange}-${resolvedLocationScope}-${point.label}-market`}>
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
                    <g key={`${pricingRange}-${resolvedLocationScope}-${point.label}`}>
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
            ) : (
              <div className="flex h-[220px] items-center justify-center text-sm text-on-surface-variant">
                No pricing data available for this view.
              </div>
            )}
            {activePoint && activeNegotiatedPoint ? (
              <div
                className="glass-panel absolute top-4 w-[90%] max-w-xs -translate-x-1/2 rounded-xl border border-white p-3 shadow-xl transition-all duration-200"
                style={{ left: `${activeNegotiatedPoint.x / 8}%` }}
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
                  key={`${pricingRange}-${resolvedLocationScope}-${point.label}-label`}
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
            {profile.bookingWindowScores.map(({ label, score }) => (
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

          {visibleEvents.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No events linked to this location scope.</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
