"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Scale", href: "#scale" },
  { label: "Contact", href: "#footer" },
];

const valueProps = [
  {
    title: "Persistent Memory",
    body: "Our agents remember every negotiation, tracking vendor concession patterns, volume thresholds, and historical pricing DNA to leverage in future deals.",
  },
  {
    title: "Omnichannel Execution",
    body: "Autonomously initiates calls, negotiates via calls and emails, and drafts RFPs to suppliers without manual input.",
    glyph: "network" as const,
  },
  {
    title: "Real-time Market Analytics",
    body: "We dynamically renegotiate group bookings and individual bookings in real-time as market conditions change.",
  },
];

const scaleCards = [
  {
    eyebrow: "Global Hotel Blocks",
    body: "Securing inventory without sacrificing margin.",
    className: "lg:col-span-5",
  },
  {
    eyebrow: "Airline Fleet Management",
    body: "Balancing employee status preferences with corporate bottom lines.",
    className: "lg:col-span-3",
  },
  {
    eyebrow: "Massive Event Logistics",
    body: "From venue booking to catering negotiations, handled concurrently.",
    className: "lg:col-span-4",
  },
];

const vendors = [
  { name: "Hilton Americas", note: "Offer improved — 7 additional comp rooms", active: true },
  { name: "United Corporate", note: "Status tier preserved on revised routes", active: true },
  { name: "Sands Expo Center", note: "F&B concession package secured", active: true },
  { name: "Marriott Marquis", note: "Counter-offer under review", active: false },
  { name: "Delta Air Lines", note: "Fare basis DY7→DY5 renegotiation open", active: true },
];

const agentFeed = [
  { time: "2m ago", action: "Called Hilton Americas reservations. Extended checkout concession confirmed." },
  { time: "9m ago", action: "Sent revised group fare matrix to United Corporate account manager." },
  { time: "17m ago", action: "Pinged Sands Expo catering API — upgraded package detected and locked." },
  { time: "24m ago", action: "Renegotiated Delta fare basis DY7 to DY5. $42K delta captured." },
  { time: "31m ago", action: "Initiated RFP to 3 new hotel properties in Chicago Loop." },
];

const metrics = [
  { value: "$847M+", label: "Negotiated annually" },
  { value: "12,400+", label: "Hotel nights secured" },
  { value: "31%", label: "Average savings" },
  { value: "99.7%", label: "Platform uptime" },
];

const easeCurve: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: easeCurve },
  }),
};

export function LandingPage() {
  return (
    <main id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44rem] bg-[radial-gradient(ellipse_at_top,_rgba(14,159,110,0.07),_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(14,159,110,0.06),_transparent_60%)]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(251,251,251,0.88)] backdrop-blur-xl dark:border-white/8 dark:bg-[rgba(12,18,32,0.9)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link
            href="#top"
            className="text-sm font-semibold tracking-[0.18em] text-ink uppercase dark:text-white"
          >
            Autonomous Procurement Inc.
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-ink/58 transition hover:text-ink dark:text-white/58 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#capabilities"
            className="rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-float"
          >
            Start Automating
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        id="hero"
        className="mx-auto max-w-5xl px-6 pb-12 pt-20 text-center lg:px-10 lg:pb-16 lg:pt-28"
      >
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink/52 shadow-card dark:border-white/10 dark:bg-white/5 dark:text-white/52">
            Enterprise Travel Procurement
          </div>
          <h1 className="text-[3.2rem] font-semibold leading-[0.94] tracking-[-0.05em] text-ink sm:text-[4.5rem] lg:text-[6rem] dark:text-white">
            The First Agentic Negotiator for Enterprise Travel.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-ink/62 sm:text-xl dark:text-white/62">
            Stop haggling. Our autonomous agents handle the RFPs, emails, and calls to secure the absolute best rates for your corporate hotels, flights, and events.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#capabilities"
              className="inline-flex items-center justify-center rounded-full bg-emerald px-8 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-1 hover:shadow-float"
            >
              Start Automating
            </Link>
            <Link
              href="#scale"
              className="inline-flex items-center justify-center rounded-full border border-black/12 bg-transparent px-8 py-4 text-base font-semibold text-ink transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70 dark:border-white/12 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/5"
            >
              Read the Whitepaper
            </Link>
          </div>
        </motion.div>
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
