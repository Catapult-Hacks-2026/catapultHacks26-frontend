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
    title: "Multi-threaded Execution",
    body: "Agents autonomously initiate calls, draft emails, and interact directly with hotel and airline booking APIs to close the deal.",
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

      {/* ── Negotiation Dashboard ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.15}
        >
          <div className="relative">
            <div className="panel-shell dashboard-grid relative rounded-[2.5rem] border border-black/7 bg-white/85 p-6 shadow-float backdrop-blur-sm dark:border-white/8 dark:bg-slate-900/80 sm:p-8">
              {/* Dashboard header */}
              <div className="mb-6 flex flex-col gap-4 border-b border-black/6 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/40 dark:text-white/40">
                    Negotiation Dashboard
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink dark:text-white">
                    Chicago Summit + APAC Travel
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
                  <span className="rounded-full bg-[#dce9e1] px-4 py-2 text-sm font-semibold text-[#14694a] dark:bg-emerald/15 dark:text-emerald-400">
                    12 threads live
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: "Rate movement", value: "-18.4%", highlight: true },
                  { label: "Calls closed", value: "41", highlight: false },
                  { label: "Savings captured", value: "$2.8M", highlight: false },
                  { label: "Active vendors", value: "09", highlight: false },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-black/6 bg-canvas p-5 dark:border-white/8 dark:bg-slate-800/50"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/42 dark:text-white/42">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-3 text-4xl font-semibold tracking-[-0.05em] ${
                        stat.highlight ? "text-emerald" : "text-ink dark:text-white"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vendors + Agent feed */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Active vendors */}
                <div className="rounded-[1.8rem] border border-black/6 bg-canvas p-5 dark:border-white/8 dark:bg-slate-800/50">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/42 dark:text-white/42">
                      Active vendors
                    </p>
                    <p className="text-sm font-semibold text-ink dark:text-white">09</p>
                  </div>
                  <div className="space-y-2.5">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.name}
                        className="flex items-start justify-between rounded-2xl bg-[#f6f5f1] px-4 py-3.5 dark:bg-slate-700/40"
                      >
                        <div>
                          <p className="font-semibold text-ink dark:text-white">{vendor.name}</p>
                          <p className="mt-0.5 text-sm leading-6 text-ink/52 dark:text-white/52">
                            {vendor.note}
                          </p>
                        </div>
                        <div
                          className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                            vendor.active ? "bg-emerald" : "bg-amber-400"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent activity feed */}
                <div className="rounded-[1.8rem] border border-black/6 bg-canvas p-5 dark:border-white/8 dark:bg-slate-800/50">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/42 dark:text-white/42">
                      Agent Activity
                    </p>
                    <p className="mt-1.5 text-sm text-ink/48 dark:text-white/48">
                      Live feed — calls, emails, API actions
                    </p>
                  </div>
                  <div>
                    {agentFeed.map((item, index) => (
                      <motion.div
                        key={item.time}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
                        className="flex gap-4 border-b border-black/5 py-4 last:border-none dark:border-white/6"
                      >
                        <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald" />
                        <p className="flex-1 text-sm leading-6 text-ink dark:text-white">
                          {item.action}
                        </p>
                        <p className="flex-shrink-0 text-xs text-ink/38 dark:text-white/38">
                          {item.time}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Metrics strip ── */}
      <div className="border-y border-black/5 bg-white/55 dark:border-white/6 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold tracking-[-0.04em] text-ink dark:text-white">
                  {m.value}
                </span>
                <span className="text-sm text-ink/48 dark:text-white/48">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Capabilities ── */}
      <section
        id="capabilities"
        className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-10 lg:pb-28 lg:pt-28"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-12 max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink/42 dark:text-white/42">
            Negotiation Advantage
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl dark:text-white">
            Agents that learn, execute, and renegotiate without operational drag.
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {valueProps.map((item, index) => (
            <motion.article
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              custom={index * 0.08}
              className="panel-shell group rounded-[1.8rem] border border-black/8 bg-white/90 p-8 shadow-card transition hover:-translate-y-1 hover:shadow-float dark:border-white/8 dark:bg-slate-800/70"
            >
              <div className="mb-10 h-px w-14 bg-ink/15 transition group-hover:bg-emerald dark:bg-white/15 dark:group-hover:bg-emerald" />
              <h3 className="max-w-xs text-2xl font-semibold tracking-[-0.04em] text-ink dark:text-white">
                {item.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-ink/62 dark:text-white/62">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Scale ── */}
      <section id="scale" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink/42 dark:text-white/42">
              Scale
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl lg:text-[3.25rem] dark:text-white">
              Built for the Fortune 500 Travel Matrix.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-ink/60 dark:text-white/60">
            Procurement systems usually fracture at scale. These agents expand across travel categories without losing negotiation context or precision.
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
              className={`panel-shell rounded-[2rem] border border-black/8 bg-[#f7f6f2] p-8 shadow-card transition hover:-translate-y-1 hover:shadow-float dark:border-white/8 dark:bg-slate-800/70 ${card.className}`}
            >
              <div className="flex h-full flex-col justify-between gap-16">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/48 dark:border-white/10 dark:bg-slate-700 dark:text-white/48">
                    Deployment
                  </span>
                  <span className="h-9 w-9 rounded-full border border-black/10 bg-white/90 dark:border-white/10 dark:bg-slate-700/90" />
                </div>
                <div>
                  <h3 className="max-w-sm text-[1.8rem] font-semibold tracking-[-0.04em] text-ink dark:text-white">
                    {card.eyebrow}
                  </h3>
                  <p className="mt-4 max-w-sm text-base leading-7 text-ink/60 dark:text-white/60">
                    {card.body}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        id="footer"
        className="border-t border-black/7 bg-white/55 backdrop-blur-sm dark:border-white/7 dark:bg-slate-900/55"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-ink/50 lg:flex-row lg:items-center lg:justify-between lg:px-10 dark:text-white/50">
          <p className="font-medium">© 2026 Autonomous Procurement Inc.</p>
          <div className="flex items-center gap-6">
            <Link href="#top" className="transition hover:text-ink dark:hover:text-white">
              Privacy
            </Link>
            <Link href="#top" className="transition hover:text-ink dark:hover:text-white">
              Terms
            </Link>
            <Link href="#top" className="transition hover:text-ink dark:hover:text-white">
              API Documentation
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
