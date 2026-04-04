import { Link } from "react-router-dom";

export default function NegotiationShellPage() {
  return (
    <div className="mx-auto max-w-5xl p-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
        Negotiations &gt; Start Negotiation
      </p>

      <header className="mt-6">
        <h1 className="text-[3.5rem] font-bold leading-none tracking-tighter text-on-surface">
          Negotiation Shell
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
          Define the parameters for the vendor negotiation cycle. Analysis
          suggests a 19.2% margin improvement potential.
        </p>
      </header>

      <section className="group relative mt-10 overflow-hidden rounded-xl bg-surface-container-low p-8">
        <span className="material-symbols-outlined absolute right-0 top-0 p-8 text-[120px] text-on-surface opacity-10 transition-opacity group-hover:opacity-20">
          trending_down
        </span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
          Market Analysis Intelligence
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
              Expected Market Price
            </p>
            <p className="mt-3 text-4xl font-bold text-on-surface">$245/night</p>
          </div>
          <div className="hidden h-20 w-px bg-outline-variant/30 md:block" />
          <div className="relative">
            <span className="absolute -top-4 right-0 rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed">
              Predicted Win
            </span>
            <p className="text-[4rem] font-black leading-none tracking-tight text-on-surface">
              $198/night
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-on-surface">Negotiation Delta</span>
            <span className="font-bold text-on-tertiary-container">-$47.00 (19.2%)</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-surface-container-highest">
            <div className="h-3 w-[19.2%] rounded-full bg-gradient-to-r from-secondary to-secondary-container" />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-ambient-sm">
        <h2 className="text-2xl font-bold text-on-surface">Strategic Inputs</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
              Ideal Price
            </span>
            <div className="relative mt-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                $
              </span>
              <input
                type="number"
                placeholder="185.00"
                className="w-full rounded-lg border-none bg-surface-container-low py-4 pl-8 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <p className="mt-2 text-[10px] text-on-surface-variant">
              Target anchor price for the agent&apos;s opening position.
            </p>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
              Highest Price Willing to Pay
            </span>
            <div className="relative mt-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                $
              </span>
              <input
                type="number"
                placeholder="215.00"
                className="w-full rounded-lg border-none bg-surface-container-low py-4 pl-8 pr-4 text-sm outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <p className="mt-2 text-[10px] text-on-surface-variant">
              Guardrail ceiling to prevent overpayment during escalation.
            </p>
          </label>
        </div>

        <Link
          to="/negotiations/new/agent"
          className="mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-secondary px-10 py-5 font-bold text-white shadow-lg transition-all hover:bg-secondary/90 active:scale-[0.98]"
        >
          Start Negotiations
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </section>
    </div>
  );
}
