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
    title: "Real-time Market Price Updates and Analytics",
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
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_right,_rgba(17,24,39,0.08),_transparent_32rem)]" />

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[rgba(251,251,251,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="#top" className="text-sm font-semibold tracking-[0.18em] text-ink uppercase">
            Autonomous Procurement Inc.
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-ink/70 transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#hero"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card transition hover:-translate-y-0.5 hover:shadow-float"
          >
            Start Automating
          </Link>
        </div>
      </header>

      <section id="hero" className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="max-w-2xl"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink/65 shadow-card">
              Enterprise Travel Procurement
            </div>
            <h1 className="max-w-4xl text-[3.2rem] font-semibold leading-[0.96] tracking-[-0.05em] text-ink sm:text-[4.5rem] lg:text-[5.4rem]">
              The First Agentic Negotiator for Enterprise Travel.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/72 sm:text-xl">
              Stop haggling. Our autonomous agents handle the RFPs, emails, and calls to secure the absolute best rates for your corporate hotels, flights, and events.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#capabilities"
                className="inline-flex items-center justify-center rounded-full bg-emerald px-7 py-4 text-base font-semibold text-white shadow-card transition hover:-translate-y-1 hover:shadow-float"
              >
                Start Automating
              </Link>
              <Link
                href="#scale"
                className="inline-flex items-center justify-center rounded-full border border-black/12 bg-transparent px-7 py-4 text-base font-semibold text-ink transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/75"
              >
                Read the Whitepaper
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.1}
            className="relative"
          >
            <div className="absolute -left-6 top-16 h-24 w-24 rounded-full bg-[#dce9e1] blur-3xl" />
            <div className="absolute -right-8 bottom-12 h-28 w-28 rounded-full bg-[#ece7db] blur-3xl" />

            <div className="panel-shell dashboard-grid relative rounded-[2rem] border border-black/8 bg-white/85 p-5 shadow-float backdrop-blur-sm sm:p-6">
              <div className="rounded-[1.6rem] border border-black/7 bg-canvas p-4 shadow-card sm:p-5">
                <div className="flex items-center justify-between border-b border-black/6 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
                      Negotiation Dashboard
                    </p>
                    <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-ink">
                      Chicago Summit + APAC Travel
                    </p>
                  </div>
                  <div className="rounded-full bg-[#dce9e1] px-3 py-2 text-xs font-semibold text-[#14694a]">
                    12 threads live
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                  <div className="space-y-4 rounded-[1.5rem] border border-black/6 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                          Rate movement
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-ink">
                          -18.4%
                        </p>
                      </div>
                      <div className="rounded-full border border-[#bfe0d1] bg-[#edf8f2] px-3 py-2 text-xs font-semibold text-[#14694a] whitespace-nowrap">
                        renegotiating
                      </div>
                    </div>
                    <div className="flex h-36 items-end gap-3 rounded-[1.2rem] bg-[#f4f3ef] px-4 pb-4 pt-6">
                      {[44, 58, 40, 70, 63, 88, 74].map((height, index) => (
                        <motion.div
                          key={height}
                          initial={{ scaleY: 0.45, opacity: 0.4 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{ duration: 0.7, delay: 0.14 + index * 0.05 }}
                          className="w-full origin-bottom rounded-full bg-ink"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-black/6 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                          Active vendors
                        </p>
                        <p className="text-sm font-semibold text-ink">09</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          ["Hilton Americas", "Offer improved by 7 rooms"],
                          ["United Corporate", "Status tier preserved"],
                          ["Sands Expo", "Catering concession added"],
                        ].map(([vendor, note]) => (
                          <div
                            key={vendor}
                            className="flex items-start justify-between rounded-2xl bg-[#f6f5f1] px-4 py-3"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-semibold text-ink truncate">{vendor}</p>
                              <p className="mt-1 text-sm leading-6 text-ink/58 truncate">{note}</p>
                            </div>
                            <div className="flex-shrink-0 mt-1 h-2.5 w-2.5 rounded-full bg-emerald" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-[1.5rem] border border-black/6 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                          Calls closed
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-ink">
                          41
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-black/6 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/45">
                          Savings captured
                        </p>
                        <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-ink">
                          $2.8M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="capabilities"
        className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 max-w-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink/45">
            Negotiation Advantage
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl">
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
              className="panel-shell rounded-[1.8rem] border border-black/8 bg-white/90 p-7 shadow-card"
            >
              <div className="mb-10 h-px w-14 bg-ink/20" />
              <h3 className="max-w-xs text-2xl font-semibold tracking-[-0.04em] text-ink">
                {item.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-ink/68">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="scale" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-ink/45">
              Scale
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-ink sm:text-4xl lg:text-[3.25rem]">
              Built for the Fortune 500 Travel Matrix.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-ink/64">
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
              className={`panel-shell rounded-[2rem] border border-black/8 bg-[#f7f6f2] p-8 shadow-card ${card.className}`}
            >
              <div className="flex h-full flex-col justify-between gap-16">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                    Deployment
                  </span>
                  <span className="h-10 w-10 rounded-full border border-black/10 bg-white/90" />
                </div>
                <div>
                  <h3 className="max-w-sm text-[1.8rem] font-semibold tracking-[-0.04em] text-ink">
                    {card.eyebrow}
                  </h3>
                  <p className="mt-4 max-w-sm text-base leading-7 text-ink/66">{card.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <footer
        id="footer"
        className="border-t border-black/8 bg-white/70 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 text-sm text-ink/62 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© 2026 Autonomous Procurement Inc.</p>
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
    </main>
  );
}
