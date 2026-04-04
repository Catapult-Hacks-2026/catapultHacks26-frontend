"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MarketIntelligenceResult } from "@/app/actions/travel-intelligence";

const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Scale", href: "#scale" },
  { label: "Contact", href: "#footer" },
];

const metricCards = [
  {
    title: "Persistent Vendor Memory",
    body: "Galileo remembers every negotiation, tracking vendor concession patterns and historical pricing DNA.",
    glyph: "memory" as const,
  },
  {
    title: "Omnichannel Execution",
    body: "Autonomously initiates calls, drafts emails, and interacts directly with booking APIs.",
    glyph: "network" as const,
  },
  {
    title: "Continuous Sourcing",
    body: "Dynamically renegotiates group blocks and individual bookings in real-time.",
    glyph: "refresh" as const,
  },
];

const scaleCards = [
  {
    eyebrow: "Global Hotel Blocks",
    body: "Negotiation memory and live rate checks across high-volume urban inventory.",
    className: "lg:col-span-5",
  },
  {
    eyebrow: "Airline Fleet Management",
    body: "Carrier pricing monitored continuously for route, timing, and contract leverage.",
    className: "lg:col-span-3",
  },
  {
    eyebrow: "Massive Event Logistics",
    body: "Hotels, air, and event travel coordinated as one procurement system instead of siloed workstreams.",
    className: "lg:col-span-4",
  },
];

const DATA_REVALIDATE_SECONDS = 300;
const HERO_IMAGE = "/hero-clouds.jpeg";
const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: easeCurve },
  }),
};

type ChartPoint = {
  label: string;
  shortLabel: string;
  publicRate: number;
  arbiterRate: number;
  savings: number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload?: ChartPoint;
  }>;
};

function truncateLabel(label: string) {
  return label.length > 12 ? `${label.slice(0, 12)}...` : label;
}

function formatTimestamp(value?: string) {
  if (!value) return "Awaiting sync";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length || !payload[0]?.payload) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-[#f8f4ec]/92 px-4 py-3 text-left shadow-card backdrop-blur-[2px]">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-ink/45">{point.label}</p>
      <div className="mt-2 space-y-1.5 text-sm text-ink/72">
        <div className="flex items-center justify-between gap-8">
          <span>Market</span>
          <span className="font-bold text-ink">${point.publicRate}</span>
        </div>
        <div className="flex items-center justify-between gap-8">
          <span>Galileo</span>
          <span className="font-bold text-ink">${point.arbiterRate}</span>
        </div>
        <div className="flex items-center justify-between gap-8 border-t border-ink/8 pt-2">
          <span>Savings</span>
          <span className="font-bold text-ink">${point.savings}</span>
        </div>
      </div>
    </div>
  );
}

function FeatureGlyph({ glyph }: { glyph: (typeof metricCards)[number]["glyph"] }) {
  if (glyph === "memory") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      </svg>
    );
  }

  if (glyph === "network") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
        <path d="M12 7v10M7 12h10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3" />
      <path d="M5 5v4h4M15 15h4v4" />
    </svg>
  );
}

function PerformanceBars() {
  return (
    <div className="flex items-end gap-3">
      {[0.28, 0.62, 0.42, 0.86].map((height, index) => (
        <div key={height} className="relative h-44 w-4 overflow-hidden rounded-full bg-[#3f3f3f]">
          <div
            className="absolute bottom-0 w-full rounded-full bg-[#f8f4ec]"
            style={{ height: `${height * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function LandingPage() {
  const [market, setMarket] = useState<MarketIntelligenceResult | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [marketSource, setMarketSource] = useState<"cache" | "fresh" | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const loadMarket = useCallback(async (forceFresh = false) => {
    try {
      if (forceFresh) setIsRefreshing(true);
      const res = await fetch(`/api/market-intelligence${forceFresh ? "?fresh=1" : ""}`, {
        cache: forceFresh ? "no-store" : "default",
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error || "Failed to load market data.");
      }

      const data = (await res.json()) as MarketIntelligenceResult;
      setMarket(data);
      setMarketError(null);
      setMarketSource(res.headers.get("x-market-source") === "fresh" ? "fresh" : "cache");
    } catch (err) {
      setMarketError(err instanceof Error ? err.message : "Failed to load market data.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMarket();
    const intervalId = window.setInterval(() => {
      loadMarket(true);
    }, DATA_REVALIDATE_SECONDS * 1000);

    return () => window.clearInterval(intervalId);
  }, [loadMarket]);

  const primaryStays = market?.staysDataPoints ?? [];
  const topVendors = primaryStays.slice(0, 4);
  const avgPublic = market?.avgStaysPublicRate ?? 0;
  const avgArbiter = market?.avgStaysArbiterRate ?? 0;
  const avgSavings = avgPublic && avgArbiter ? Math.max(avgPublic - avgArbiter, 0) : 0;

  const chartData = useMemo<ChartPoint[]>(() => {
    const points = market?.staysDataPoints?.length ? market.staysDataPoints : market?.flightDataPoints ?? [];
    return points.map((point) => ({
      label: point.label,
      shortLabel: truncateLabel(point.label),
      publicRate: point.publicRate,
      arbiterRate: point.arbiterRate,
      savings: Math.max(point.publicRate - point.arbiterRate, 0),
    }));
  }, [market]);

  const rateMovement = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0]?.publicRate ?? 0;
    const last = chartData[chartData.length - 1]?.publicRate ?? 0;
    if (!first || !last) return null;
    return ((last - first) / first) * 100;
  }, [chartData]);

  const signals = useMemo(() => {
    if (!primaryStays.length) return [];
    const sorted = [...primaryStays].sort((a, b) => a.publicRate - b.publicRate);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    return [
      `Lowest live ADR: ${lowest.label} · $${lowest.publicRate}`,
      `Highest live ADR: ${highest.label} · $${highest.publicRate}`,
      `Avg savings captured: $${avgSavings}`,
      marketSource === "fresh" ? "Source: live market fetch" : "Source: cached market fetch",
    ];
  }, [primaryStays, avgSavings, marketSource]);

  return (
    <main id="top" className="relative overflow-hidden bg-canvas text-ink min-h-screen">
      {/* Persist the background gradient unconditionally */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[75vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundPosition: "center 34%",
            transform: "scale(1.01)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,244,236,0.0)_0%,rgba(248,244,236,0.15)_30%,rgba(248,244,236,0.50)_65%,rgba(248,244,236,0.85)_85%,#f8f4ec_100%)]" />
      </div>

      <header className="relative z-40 bg-transparent pt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="#top" className="text-sm uppercase tracking-[0.22em] text-ink font-semibold">
            Galileo Enterprise
          </Link>
          <nav className="ml-auto flex items-center gap-7 text-sm font-medium text-ink/70">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section id="hero" className="relative z-20 isolate overflow-hidden pt-28 lg:pt-40">
        <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start min-h-[60vh]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="max-w-3xl flex flex-col justify-between h-full"
            >
              <div>
                <h1 className="hero-shadow mt-2 text-[2.8rem] leading-[0.98] tracking-[-0.04em] text-ink sm:text-[3.9rem] lg:text-[4.7rem]">
                  Galileo: live enterprise travel sourcing without the manual chase.
                </h1>
                <p className="hero-shadow mt-6 max-w-2xl text-base leading-8 text-ink/66 sm:text-lg font-medium">
                  Corporate hotels, flights, and event blocks sourced continuously from one agentic workflow, with live market pricing wired directly into the decision layer.
                </p>
              </div>

              {/* The Action Button */}
              <div className="mt-16 sm:mt-32 mb-20 lg:mb-24">
                <motion.a
                  href="#live-updates-section"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRevealed(true);
                    setTimeout(() => {
                      document.getElementById("live-updates-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(47,47,47,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`group inline-flex items-center gap-5 rounded-full border-2 border-ink/20 bg-[#f8f4ec]/80 px-8 py-5 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-ink shadow-lg backdrop-blur-md transition-all duration-500`}
                >
                  <span>Show Me How It Works</span>
                  <span className="relative flex h-6 w-6 items-center justify-center overflow-visible">
                    <svg
                      viewBox="0 0 24 24"
                      className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right side graph shown on load */}
            <div className="relative lg:pl-8 lg:pt-3">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.1}
              >
                <p className="text-xl font-bold leading-tight text-ink">
                  Increase in hotel bookings when using automated follow-up methods.
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-ink/66 font-medium">
                  A company leveraging HubSpot's speed-to-lead automation saw a 25% boost in qualified leads through immediate follow-up emails.
                </p>

                <div className="mt-5 rounded-[1.75rem] border-2 border-ink/20 bg-[#f8f4ec]/62 p-5 backdrop-blur-[1px]">
                  <div className="relative h-[17.5rem] overflow-hidden">
                    <div className="absolute bottom-10 left-14 top-4 w-px bg-ink" />
                    <div className="absolute bottom-10 left-14 right-5 h-px bg-ink" />
                    <div className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink">
                      Booking rate
                    </div>
                    <div className="absolute bottom-1 left-[6.4rem] text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink">
                      Q4 2024
                    </div>
                    <div className="absolute bottom-1 right-7 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink">
                      Q1 2025
                    </div>
                    <div className="absolute left-[4.35rem] top-[0.9rem] text-[0.74rem] font-bold text-ink">25%</div>
                    <div className="absolute left-[4.35rem] top-[6.2rem] text-[0.68rem] font-bold text-ink/78">12%</div>
                    <div className="absolute left-[4.75rem] bottom-[3.2rem] text-[0.68rem] font-bold text-ink/78">0%</div>

                    <svg viewBox="0 0 420 260" className="absolute inset-0 h-full w-full overflow-visible">
                      <motion.path
                        d="M94 194 C150 186, 204 166, 258 134 S 338 88, 382 62"
                        fill="none"
                        stroke="#111111"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.4 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.circle
                        cx="94"
                        cy="194"
                        r="6"
                        fill="#111111"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.35 }}
                      />
                      <motion.circle
                        cx="382"
                        cy="62"
                        r="8"
                        fill="#111111"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.05, duration: 0.35 }}
                      />
                    </svg>
                  </div>

                  <p className="mt-2 text-right text-[0.72rem] italic text-ink">
                    *Company data from HubSpot.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {isRevealed && (
        <motion.div
          initial={{ y: "40vh", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative z-10 bg-transparent"
        >

          <section id="live-updates-section" className="scroll-mt-20 mx-auto max-w-7xl px-6 pb-20 pt-16 mt-8 lg:px-10 lg:pb-24 lg:pt-24 lg:mt-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.15}
              id="live-updates"
            className="mt-2 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"
          >
            <div>
              <div className="flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em] text-ink/58">
                <span className="h-2 w-2 rounded-full bg-ink/55" />
                <span>Live supplier updates</span>
              </div>
              <div className="mt-5 space-y-5">
                {topVendors.length ? (
                  topVendors.map((vendor) => (
                    <div key={vendor.label} className="border-l border-ink/18 pl-4">
                      <p className="text-lg leading-7 text-ink">{vendor.label}</p>
                      <p className="mt-1 text-sm leading-6 text-ink/58">
                        Market ${vendor.publicRate} · Galileo ${vendor.arbiterRate}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink/52">
                    {marketError ? "Live data unavailable." : "Loading live hotel quotes."}
                  </p>
                )}
              </div>
              <p className="mt-7 text-xs uppercase tracking-[0.16em] text-ink/46">
                {market?.fetchedAt ? `Updated ${formatTimestamp(market.fetchedAt)}` : "Syncing live market data"}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-ink/58">Live Market Graph</p>
                  <p className="mt-2 text-xl text-ink">Chicago travel pricing</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadMarket(true)}
                  disabled={isRefreshing}
                  className="translate-y-1 rounded-full border-2 border-[#f8f4ec] bg-[#f8f4ec]/52 px-5 py-2.5 text-[0.76rem] font-bold uppercase tracking-[0.18em] text-ink shadow-[0_10px_30px_-20px_rgba(47,47,47,0.65)] transition hover:bg-[#f8f4ec]/70 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh live data"}
                </button>
              </div>

              <div className="mt-6 h-64 lg:h-72">
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 14, right: 10, left: 10, bottom: 24 }}>
                      <defs>
                        <linearGradient id="publicRateFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(17,17,17,0.12)" />
                          <stop offset="100%" stopColor="rgba(17,17,17,0)" />
                        </linearGradient>
                        <linearGradient id="galileoRateFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(17,17,17,0.2)" />
                          <stop offset="100%" stopColor="rgba(17,17,17,0.03)" />
                        </linearGradient>
                      </defs>
                      <YAxis
                        tick={{ fill: "rgba(17,17,17,0.88)", fontSize: 11, fontWeight: 700 }}
                        tickLine={false}
                        axisLine={false}
                        width={52}
                        tickMargin={8}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <XAxis
                        dataKey="shortLabel"
                        tick={{ fill: "rgba(17,17,17,0.88)", fontSize: 10, fontWeight: 700 }}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={16}
                        interval="preserveStartEnd"
                      />
                      <Tooltip cursor={false} content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="publicRate"
                        stroke="#111111"
                        strokeWidth={2}
                        strokeDasharray="5 6"
                        fill="url(#publicRateFill)"
                        fillOpacity={1}
                        dot={{ r: 2.5, fill: "#111111", strokeWidth: 0 }}
                        activeDot={{ r: 4, fill: "#111111", strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="arbiterRate"
                        stroke="#111111"
                        strokeWidth={3}
                        fill="url(#galileoRateFill)"
                        fillOpacity={1}
                        dot={{ r: 3, fill: "#111111", strokeWidth: 0 }}
                        activeDot={{ r: 4.5, fill: "#111111", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center text-sm text-ink/48">
                    {marketError ? "Market graph unavailable." : "Loading market graph..."}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-2 text-xs text-ink/56">
                {signals.length ? (
                  signals.map((signal) => (
                    <div key={signal} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink/42" />
                      <span>{signal}</span>
                    </div>
                  ))
                ) : (
                  <div>{marketError ? "Live sync failed. Check the API token." : "Awaiting market snapshot."}</div>
                )}
              </div>
            </div>
          </motion.div>
        </section>

      <section id="capabilities" className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10 lg:pt-16">
        <div className="flex flex-col gap-6">
          <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="w-full rounded-[2rem] bg-[#f8f4ec] px-8 py-10 text-ink shadow-float lg:px-10 lg:py-12"
          >
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-ink/62">Performance Metrics</p>
              <h2 className="max-w-4xl text-[2.9rem] leading-[1.05] tracking-[-0.04em] text-ink sm:text-[4.1rem]">
                Save $120,000 and 10 weeks of time
              </h2>
              <p className="max-w-3xl text-base leading-8 text-ink/62">
                According to engine.com, the leading travel management website.
              </p>
            </div>
          </motion.article>

          <div className="grid gap-6 lg:grid-cols-3">
            {metricCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                custom={index * 0.08}
                className="rounded-[1.8rem] bg-[#f8f4ec] px-7 py-7 text-ink shadow-card"
              >
                <div className="text-ink">
                  <FeatureGlyph glyph={card.glyph} />
                </div>
                <h3 className="mt-5 text-[1.9rem] leading-tight tracking-[-0.03em] text-ink">{card.title}</h3>
                <p className="mt-4 text-base leading-8 text-ink/62">{card.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="scale" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.26em] text-ink/42">Scale</p>
            <h2 className="mt-4 text-[2.4rem] leading-[1.03] tracking-[-0.04em] text-ink sm:text-[3.6rem]">
              Built for enterprise travel programs that cannot afford manual lag.
            </h2>
          </div>
          <p className="max-w-md pt-2 text-base leading-8 text-ink/52">
            Hotels, flights, and event travel stay inside one negotiation memory so the system scales without losing context.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-8">
          {scaleCards.map((card, index) => (
            <motion.article
              key={card.eyebrow}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              custom={index * 0.08}
              className={`panel-shell rounded-[2rem] border border-ink/8 bg-[#f8f4ec] p-8 shadow-card transition hover:-translate-y-1 hover:shadow-float ${card.className}`}
            >
              <div className="flex h-full flex-col justify-between gap-16">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-ink/10 bg-[#f8f4ec] px-3 py-2 text-xs uppercase tracking-[0.18em] text-ink/48">
                    Deployment
                  </span>
                  <span className="h-9 w-9 rounded-full border border-ink/10 bg-[#f8f4ec]" />
                </div>
                <div>
                  <h3 className="max-w-sm text-[2rem] leading-tight tracking-[-0.03em] text-ink">{card.eyebrow}</h3>
                  <p className="mt-5 max-w-sm text-base leading-8 text-ink/56">{card.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pb-32 pt-10 text-center lg:px-10">
        <h2 className="mb-10 text-[3rem] leading-tight tracking-[-0.04em] text-ink sm:text-[4rem]">
          Ready to automate your travel procurement?
        </h2>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-4 rounded-full bg-ink px-10 py-5 text-[0.8rem] font-bold uppercase tracking-[0.2em] text-[#f8f4ec] transition-all hover:scale-105 hover:bg-ink/90 hover:shadow-xl"
        >
          <span>Launch dashboard</span>
          <span className="relative flex h-5 w-5 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </a>
      </section>

      <footer id="footer" className="border-t border-ink/8 bg-[#f8f4ec]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-ink/50 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© 2026 Galileo Enterprise</p>
          <div className="flex items-center gap-6">
            <Link href="#top" className="transition hover:text-ink">
              Privacy
            </Link>
            <Link href="#top" className="transition hover:text-ink">
              Terms
            </Link>
            <Link href="#top" className="transition hover:text-ink">
              API Documentation
            </Link>
          </div>
        </div>
      </footer>
      </motion.div>
      )}
    </main>
  );
}
