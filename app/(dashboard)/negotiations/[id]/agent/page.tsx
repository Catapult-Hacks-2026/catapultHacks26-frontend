import { Chip } from "@/components/ui/Chip";
import { activityStream } from "@/lib/dashboard-data";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div className="h-screen overflow-y-auto bg-surface">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <section className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-8">
            <div className="flex items-center gap-3">
              <Chip variant="success">Live Negotiation</Chip>
              <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">location_on</span>
                London, UK
              </span>
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-on-surface">
              Hilton London
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Autonomous Agent <span className="font-bold text-secondary">Nexus-7</span> is
              currently processing volume discounts for Q4 corporate travel.
            </p>
          </div>
          <div className="col-span-4 grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                Target Price
              </p>
              <p className="mt-2 text-4xl font-black text-on-surface">$220</p>
            </div>
            <div className="rounded-3xl bg-surface-container-low p-6">
              <p className="text-[11px] uppercase tracking-widest text-secondary">
                Current Price
              </p>
              <p className="mt-2 text-4xl font-black text-secondary">$245</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-8">
          <div className="col-span-2 rounded-xl bg-surface-container-low p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">
                  Negotiation Price Path
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Real-time progression from supplier anchor to Galileo target.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-on-tertiary-container">
                  Savings to Date: $55.00
                </p>
                <p className="font-bold text-error">Distance to Goal: $25.00</p>
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                    Current
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-tertiary-container" />
                    Target
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    Supplier
                  </span>
                </div>
              </div>
            </div>

            <div className="relative mt-8 h-64">
              <div className="absolute inset-0">
                <div className="absolute left-0 right-0 top-0 border-t-2 border-slate-300">
                  <span className="inline-block -translate-y-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    $300 Market Price
                  </span>
                </div>
                <div className="absolute left-0 right-0 top-[45%] border-t-2 border-dashed border-on-tertiary-container/30">
                  <span className="inline-block -translate-y-1/2 rounded-full bg-tertiary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-container">
                    $220 Target
                  </span>
                </div>
                <div className="absolute left-0 right-0 top-[68%] border-t border-slate-100 opacity-50">
                  <span className="inline-block -translate-y-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    $200
                  </span>
                </div>
              </div>

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(159,232,202,0.3)" />
                    <stop offset="100%" stopColor="rgba(159,232,202,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 0 L 100 0 L 100 55 L 75 45 L 50 35 Q 25 20, 0 0 Z"
                  fill="url(#grad1)"
                />
                <path
                  d="M 0 0 Q 25 20, 50 35 L 75 45 L 100 55"
                  fill="none"
                  stroke="#0f9f6e"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle cx="100" cy="55" r="8" fill="#0f9f6e" opacity="0.2" />
                <circle cx="100" cy="55" r="4" fill="#0f9f6e" />
                <circle cx="75" cy="45" r="3" fill="#0b6b4d" />
                <circle cx="25" cy="20" r="3" fill="#f59e0b" />
              </svg>
            </div>
          </div>

          <div className="space-y-6">
            <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-2xl">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
              <h4 className="relative text-2xl font-bold">Intervene Manually</h4>
              <p className="relative mt-3 text-sm leading-6 text-slate-400">
                Join the supplier interaction if legal review, relationship
                repair, or exception handling is required.
              </p>
              <button className="relative mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100">
                <span className="material-symbols-outlined text-lg">call</span>
                Jump into Call
              </button>
            </div>

            <div className="rounded-xl border border-slate-100 bg-surface-container-lowest p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Activity Stream
              </p>
              <div className="mt-6 space-y-6">
                {activityStream.map((item) => (
                  <div
                    key={`${item.price}-${item.time}`}
                    className="relative pl-6 before:absolute before:bottom-[-24px] before:left-0 before:top-2 before:w-[2px] before:bg-slate-100 last:before:hidden"
                  >
                    <span
                      className={`absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
                        item.active ? "bg-secondary" : "bg-slate-300"
                      }`}
                    />
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-on-surface">{item.price}</p>
                      {item.badge ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.badgeTone}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                      {item.detailTone ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.detailTone}`}>
                          {item.detail}
                        </span>
                      ) : (
                        <span>{item.detail}</span>
                      )}
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/50 bg-surface-container-highest/30 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">
                Negotiation Transcript
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Last two verified messages exchanged through the supplier portal.
              </p>
            </div>
            <button className="rounded-lg border border-slate-200 bg-surface-container-lowest px-6 py-2.5 text-sm font-bold text-on-surface">
              Expand to Full Transcript
            </button>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-white">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="max-w-3xl rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-sm leading-7 text-on-surface">
                  Based on our projected volume of 450 room nights and the
                  current weekday compression profile, Galileo is targeting a
                  structured rate below your published corporate floor with
                  breakfast and transfer concessions included.
                </p>
                <p className="mt-3 text-[10px] text-slate-400">
                  Agent Nexus-7 • 14:02:11
                </p>
              </div>
            </div>

            <div className="flex flex-row-reverse items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-white">
                <span className="material-symbols-outlined text-sm">person</span>
              </div>
              <div className="max-w-3xl rounded-2xl rounded-tr-none border border-secondary/10 bg-secondary/5 p-4 text-right">
                <p className="text-sm leading-7 text-on-surface">
                  We acknowledge the volume and can review incremental meeting
                  spend if the room-night commitment remains firm through the Q4
                  period.
                </p>
                <p className="mt-3 text-[10px] text-slate-400">
                  Hilton Portal Rep • 14:02:45
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
