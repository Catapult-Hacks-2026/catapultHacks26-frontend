import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { agentRows } from "@/lib/dashboard-data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface px-10 pb-12 pt-12">
      <AnimateIn>
        <section>
          <div className="rounded-[2rem] bg-surface-container-lowest p-10 shadow-ambient-sm">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                  Total Saved This Year
                </p>
                <div className="mt-4 flex items-baseline gap-3">
                  <h1 className="text-7xl font-bold tracking-tight text-on-surface">
                    $1.2M
                  </h1>
                  <span className="text-sm font-medium text-secondary">↑ 14.2%</span>
                </div>
              </div>
              <Link
                to="/negotiations/configure"
                className="shrink-0 rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
              >
                Start Negotiations
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Hotels
                </p>
                <p className="mt-1.5 text-2xl font-semibold text-on-surface">$740K</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">across 8 contracts</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                  Flights
                </p>
                <p className="mt-1.5 text-2xl font-semibold text-on-surface">$460K</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">across 4 contracts</p>
              </div>
            </div>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0.08}>
        <section className="mt-10 overflow-hidden rounded-3xl bg-surface-container-highest shadow-xl shadow-on-surface/5">
          <div className="grid grid-cols-[1.6fr_0.85fr_1fr_0.9fr] gap-4 px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-on-primary-container">
            <span>Company</span>
            <span>Target Price</span>
            <span>Negotiation Price</span>
            <span>Status</span>
          </div>

          <div>
            {agentRows.slice(0, 3).map((row) => (
              <Link
                key={row.id}
                to={`/negotiations/${row.id}/agent`}
                className="grid grid-cols-[1.6fr_0.85fr_1fr_0.9fr] items-center gap-4 border-t border-outline-variant/5 px-8 py-6 transition-colors hover:bg-surface-container cursor-pointer"
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
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/5 bg-surface-container-low px-8 py-6">
            <p className="text-sm text-on-surface-variant">
              Showing 3 of 12 active Galileo cycles
            </p>
            <Link
              to="/all-agents"
              className="text-sm font-bold text-on-surface transition-colors hover:text-secondary"
            >
              View All Agents →
            </Link>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
