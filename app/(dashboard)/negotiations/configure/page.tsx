import Link from "next/link";
import { AgentPreviewCard } from "@/components/dashboard/AgentPreviewCard";
import { ServiceTypeToggle } from "@/components/dashboard/ServiceTypeToggle";

export default function ConfigureNegotiationPage() {
  return (
    <div className="min-h-screen bg-surface px-10 pb-12 pt-12">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
        Negotiations &gt; <span className="text-secondary">Deploy Agent</span>
      </p>

      <header className="mt-6">
        <h1 className="text-5xl font-black tracking-tighter text-on-surface">
          Configure Negotiation
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Phase 1: Define parameters and intent for the autonomous sourcing
          engine.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-12 gap-8">
        <section className="col-span-7 rounded-xl bg-surface-container-lowest p-8 shadow-ambient-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white">
              01
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Event Parameters</h2>
          </div>

          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Time Range
              </span>
              <div className="relative mt-3">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  calendar_today
                </span>
                <input
                  defaultValue="Oct 12, 2024 - Oct 18, 2024"
                  className="w-full rounded-lg border-none bg-surface-container-low py-4 pl-12 pr-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </label>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Type of Service
              </span>
              <div className="mt-3">
                <ServiceTypeToggle />
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                Specific Requirements
              </span>
              <textarea
                rows={4}
                defaultValue="120 Deluxe Rooms, 5 Suites, Group Baggage Handling"
                placeholder="e.g., '120 Deluxe Rooms, 5 Suites, Group Baggage Handling'"
                className="mt-3 w-full rounded-lg border-none bg-surface-container-low p-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/negotiations/new"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3 font-bold text-white transition-colors hover:bg-secondary-container"
            >
              Next Step
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>

        <div className="col-span-5">
          <AgentPreviewCard />
        </div>
      </div>
    </div>
  );
}
