import { MarketInsightsChat } from "@/components/dashboard/MarketInsightsChat";

export default function MarketInsightsPage() {
  return (
    <div className="min-h-screen bg-surface px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-2">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-0 sm:p-2 lg:p-8">
        <header>

          <h1 className="mt-4 text-4xl font-black leading-none tracking-tighter text-on-surface sm:text-5xl lg:text-6xl">
            Event Timing
          </h1>
        </header>

        <MarketInsightsChat />
      </div>
    </div>
  );
}
