import Link from "next/link";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { agentRows } from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface px-10 pb-12 pt-12">
      <AnimateIn>
        <section className="grid gap-8 xl:grid-cols-[1.2fr_340px]">
          <div className="rounded-[2rem] bg-surface-container-lowest p-10 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
              Fiscal Performance YTD
            </p>
            <div className="mt-5 flex items-end gap-4">
              <h1 className="text-6xl font-black tracking-tight text-on-surface">
                $1.2M
              </h1>
              <Chip variant="success" className="mb-2">
                14.2% Optimization
              </Chip>
            </div>
            <p className="mt-4 max-w-xl text-sm text-on-surface-variant">
              Total money saved via Galileo Intelligence across negotiated hotel,
              flight, and corporate event contracts this fiscal year.
            </p>
          </div>

          <div className="rounded-[2rem] bg-primary-container p-8 text-white shadow-nav">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Deploy
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Launch the next sourcing cycle
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Brief the agent, set your guardrails, and start a new negotiation
              run against live suppliers.
            </p>
            <Button
              href="/negotiations/configure"
              icon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              }
              className="mt-8 w-full justify-center"
            >
              New Negotiation
            </Button>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.08}>
        <section className="mt-10 overflow-hidden rounded-3xl bg-surface-container-highest shadow-xl shadow-on-surface/5">
          <div className="grid grid-cols-[1.6fr_0.85fr_1fr_0.9fr_0.7fr] gap-4 px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-on-primary-container">
            <span>Company</span>
            <span>Target Price</span>
            <span>Negotiation Price</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          <div>
            {agentRows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1.6fr_0.85fr_1fr_0.9fr_0.7fr] items-center gap-4 border-t border-outline-variant/5 px-8 py-6 transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-4">
                  <AvatarMark label={row.company[0]} />
                  <div>
                    <p className="font-bold text-on-surface">{row.company}</p>
                    <p className="text-sm text-on-surface-variant">{row.segment}</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-on-surface">{row.target}</div>
                <div>
                  <div className="text-lg font-bold text-on-surface">
                    {row.negotiated}
                  </div>
                  <div className={`text-sm font-bold ${row.deltaTone}`}>{row.delta}</div>
                </div>
                <div>
                  <Chip
                    variant={
                      row.status === "Negotiating"
                        ? "negotiating"
                        : row.status === "Optimized"
                          ? "success"
                          : "neutral"
                    }
                  >
                    {row.status}
                  </Chip>
                </div>
                <div>
                  <Link
                    href="/negotiations/hilton/agent"
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/5 bg-surface-container-low px-8 py-6">
            <p className="text-sm text-on-surface-variant">
              Showing 3 of 12 active Galileo cycles
            </p>
            <Link
              href="/market-insights"
              className="text-sm font-bold text-on-surface transition-colors hover:text-secondary"
            >
              View All Agents
            </Link>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
