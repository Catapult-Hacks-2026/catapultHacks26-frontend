import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function MarketInsightsChat() {
  const [input, setInput] = useState("");

  return (
    <div className="flex min-h-[750px] flex-col gap-6">
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto pr-4">
        <div className="ml-auto max-w-[80%] rounded-3xl rounded-tr-none bg-surface-container-high p-6 shadow-sm">
          <p className="text-base leading-7 text-on-surface">
            What&apos;s the best time for a 100-person company outing to Las Vegas
            this year?
          </p>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
            10:42 AM • Alex Thompson
          </p>
        </div>

        <div className="flex max-w-[90%] items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-secondary shadow-lg">
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <div className="rounded-3xl rounded-tl-none border border-surface-container bg-surface-container-lowest p-8 shadow-ambient-sm">
            <p className="text-sm leading-7 text-on-surface-variant">
              Based on Vegas compression data, <strong className="text-secondary">October 22-26</strong> is the cleanest booking window for a
              100-person company retreat. The city avoids major convention
              peaks, hotel inventory remains flexible, and airline yield
              management is still favorable for group blocks.
            </p>

            <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-surface-container-low p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-primary-container">
                    Recommended Window
                  </p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-on-surface">
                    Oct 22 - Oct 26
                  </p>
                </div>
                <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-fixed">
                  94% Savings Probability
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                    Average Nightly Rate
                  </p>
                  <p className="mt-2 text-xl font-bold text-on-surface">$184</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-container">
                    ▼ 12% vs Market
                  </p>
                </div>
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                    Flight Availability
                  </p>
                  <p className="mt-2 text-xl font-bold text-on-surface">High</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Optimum Window
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Top Companies Visiting During Window
                </p>
                <div className="mt-3 space-y-3">
                  {[
                    { name: "TechCorp", dot: "bg-secondary", size: "Group Size: 450" },
                    {
                      name: "Innovate Inc",
                      dot: "bg-tertiary-fixed-dim",
                      size: "Group Size: 120",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
                        <span className="text-sm font-medium text-on-surface">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm text-on-surface-variant">
                        {item.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                href="/negotiations/configure"
                className="rounded-full bg-gradient-to-r from-secondary to-secondary-container px-8 py-3 text-sm"
              >
                Start Negotiation
              </Button>
              <Button variant="ghost">Save to Discovery</Button>
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              AI Agent • Verified Market Data
            </p>
          </div>
        </div>
      </div>

      <form
        className="flex items-center rounded-full border border-surface-container bg-surface-container-lowest p-2 pl-6 pr-2 shadow-xl shadow-on-surface/5"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Nexus-Procure about other markets..."
          className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-on-surface text-white transition-opacity hover:opacity-90"
          aria-label="Send message"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
}
