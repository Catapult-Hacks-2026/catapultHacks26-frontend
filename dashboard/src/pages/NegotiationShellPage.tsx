import { Link } from "react-router-dom";

function MarketCard({ label, market, predicted, unit }: { label: string; market: string; predicted: string; unit: string }) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white px-8 py-6">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Market Analysis</p>
        <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">{label}</span>
      </div>
      <div className="mt-4 grid grid-cols-1 items-end gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <p className="text-xs text-on-surface-variant">Expected Market Price</p>
          <p className="mt-1.5 text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">{market}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{unit}</p>
        </div>
        <div>
          <span className="inline-block rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-fixed">
            Predicted Win
          </span>
          <p className="mt-1.5 text-5xl font-black tracking-tight text-on-surface sm:text-6xl">{predicted}</p>
          <p className="mt-1 text-sm text-on-surface-variant">{unit}</p>
        </div>
      </div>
    </div>
  );
}

export default function NegotiationShellPage() {

  return (
    <div className="-mt-16 min-h-screen bg-surface lg:mt-0" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="sticky top-0 z-30 border-b border-outline-variant/20 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10 lg:py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">
          Set Price Guardrails
        </h1>
      </div>

      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">

        <MarketCard label="Hotel" market="$382" predicted="$318" unit="per night" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Ideal Price</span>
              <p className="mt-0.5 text-xs text-outline">Target anchor for the agent's opening position</p>
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                <input
                  type="number"
                  placeholder="185.00"
                  className="w-full rounded-lg bg-surface-container-low py-3 pl-8 pr-4 text-[15px] text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                />
              </div>
            </label>
          </div>
          <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Ceiling Price</span>
              <p className="mt-0.5 text-xs text-outline">Guardrail to prevent overpayment during escalation</p>
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                <input
                  type="number"
                  placeholder="215.00"
                  className="w-full rounded-lg bg-surface-container-low py-3 pl-8 pr-4 text-[15px] text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/negotiations/configure" className="text-sm text-on-surface-variant hover:text-on-surface">
            ← Back
          </Link>
          <Link
            to="/negotiations/new/agent"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
          >
            Launch Negotiations
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
