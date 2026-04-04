import Link from "next/link";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { agentRows } from "@/lib/dashboard-data";

export default function AllAgentsPage() {
  const negotiating = agentRows.filter((r) => r.status === "Negotiating").length;
  const optimized = agentRows.filter((r) => r.status === "Optimized").length;
  const reviewing = agentRows.filter((r) => r.status === "Reviewing").length;

  return (
    <div className="min-h-screen bg-surface px-10 pb-12 pt-12">
      <AnimateIn>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
              Active Galileo Cycles
            </p>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-on-surface">
              All Agents
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant">
              {agentRows.length} active sourcing cycles across hotels, aviation,
              and corporate events.
            </p>
          </div>
          <Link
            href="/"
            className="mb-1 text-sm font-bold text-on-surface-variant transition-colors hover:text-secondary"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-5">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
              Negotiating
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {negotiating}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Active live sessions
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Reviewing
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {reviewing}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Pending approval
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-tertiary-container">
              Optimized
            </p>
            <p className="mt-2 text-4xl font-black text-on-surface">
              {optimized}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Contracts locked
            </p>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.08}>
        <section className="mt-8 overflow-hidden rounded-3xl bg-surface-container-highest shadow-xl shadow-on-surface/5">
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
                    <p className="text-sm text-on-surface-variant">
                      {row.segment}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-on-surface">
                  {row.target}
                </div>
                <div>
                  <div className="text-lg font-bold text-on-surface">
                    {row.negotiated}
                  </div>
                  <div className={`text-sm font-bold ${row.deltaTone}`}>
                    {row.delta}
                  </div>
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
                    href={`/negotiations/${row.id}/agent`}
                    className="text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/5 bg-surface-container-low px-8 py-5">
            <p className="text-sm text-on-surface-variant">
              Showing all {agentRows.length} active Galileo cycles
            </p>
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
