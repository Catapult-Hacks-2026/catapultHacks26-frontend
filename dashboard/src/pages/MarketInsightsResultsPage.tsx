import { Link } from "react-router-dom";
import { MarketInsightsResults } from "@/components/dashboard/MarketInsightsResults";

export default function MarketInsightsResultsPage() {
  return (
    <div className="min-h-screen bg-surface px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-2">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-0 sm:p-2 lg:p-8">
        <header>
          <Link
            to="/event-timing"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Query
          </Link>

          <h1 className="mt-4 text-4xl font-black leading-none tracking-tighter text-on-surface sm:text-5xl lg:text-6xl">
            Event Timing
          </h1>
        </header>

        <MarketInsightsResults />
      </div>
    </div>
  );
}
