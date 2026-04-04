import { MarketInsightsChat } from "@/components/dashboard/MarketInsightsChat";

export default function MarketInsightsPage() {
  return (
    <div className="min-h-screen bg-surface px-10 pb-12 pt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-8">
        <header>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">
            Autonomous Landscape
          </p>
          <h1 className="mt-4 text-6xl font-black leading-none tracking-tighter text-on-surface">
            Market Insights
          </h1>
        </header>

        <MarketInsightsChat />
      </div>
    </div>
  );
}
