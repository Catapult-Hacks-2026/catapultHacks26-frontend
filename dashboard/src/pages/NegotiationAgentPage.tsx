import { Link, useParams } from "react-router-dom";
import { Chip } from "@/components/ui/Chip";
import { activityStream } from "@/lib/dashboard-data";
import {
  NegotiationPricePath,
  type PricePoint,
} from "@/components/dashboard/NegotiationPricePath";
import { useEvents } from "@/context/EventsContext";

const pricePath: PricePoint[] = [
  { label: "Anchor", price: 300, type: "offer" },
  { label: "Round 1", price: 272, type: "negotiated" },
  { label: "Counter", price: 281, type: "offer" },
  { label: "Round 2", price: 260, type: "negotiated" },
  { label: "Counter 2", price: 268, type: "offer" },
  { label: "Round 3", price: 252, type: "negotiated" },
  { label: "Current", price: 245, type: "current" },
];

export default function NegotiationAgentPage() {
  const { id } = useParams<{ id: string }>();
  const { getEventForNegotiation, canAcceptAgent, acceptOffer } = useEvents();
  const event = getEventForNegotiation(id ?? "");
  const agent = event?.agents.find((item) => item.negotiationId === id);
  const canAccept = event && agent ? canAcceptAgent(event, agent) : false;
  const isNegotiating = agent?.status === "Negotiating";
  const repLabel = agent?.type === "Airline" ? "airline sales rep" : "hotel sales rep";

  const agentStatus = (() => {
    if (!agent) return "Live Negotiation";
    if (agent.isAccepted) return "Accepted";
    if (agent.status === "Cancelled") return "Cancelled";
    return agent.status;
  })();

  const agentChipVariant = (() => {
    if (!agent) return "success";
    if (agent.isAccepted) return "success";
    if (agent.status === "Cancelled") return "error";
    if (agent.status === "Reviewing") return "neutral";
    if (agent.status === "Negotiating") return "negotiating";
    return "success";
  })() as "success" | "neutral" | "negotiating" | "error";

  const actionLabel = (() => {
    if (!agent) return null;
    if (agent.isAccepted) return "Offer accepted";
    if (agent.status === "Cancelled") return "Offer cancelled";
    if (agent.status !== "Completed") return "Waiting for completion";
    return "Type already accepted";
  })();

  return (
    <div className="h-screen overflow-y-auto bg-surface">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        {event && (
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            {event.name}
          </Link>
        )}
        <section className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-8">
            <div className="flex items-center gap-3">
              <Chip variant={agentChipVariant}>{agentStatus}</Chip>
              <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-base">location_on</span>
                London, UK
              </span>
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-on-surface">
              Hilton London
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Autonomous Agent <span className="font-bold text-secondary">Galileo</span> is
              actively negotiating rates, concessions, and commercial terms with the supplier sales team.
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
            <div className="mb-6 flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">
                  Negotiation Price Path
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Real-time progression from supplier anchor to Galileo target.
                </p>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-on-tertiary-container">
                  Savings to Date: $55.00
                </p>
                <p className="font-bold text-error">Distance to Goal: $25.00</p>
              </div>
            </div>
            <NegotiationPricePath
              points={pricePath}
              marketPrice={300}
              targetPrice={220}
            />
          </div>

          <div className="space-y-6">
            <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-2xl">
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
              <h4 className="relative text-2xl font-bold">{isNegotiating ? "Intervene Manually" : "Accept Offer"}</h4>
              <p className="relative mt-3 text-sm leading-6 text-slate-400">
                {isNegotiating
                  ? `Join the live negotiation with the ${repLabel} to handle pricing pushback, concession tradeoffs, or final commercial alignment.`
                  : canAccept
                  ? "The supplier has finalized terms. Accept this offer to lock it into the event and automatically close out competing offers of the same type."
                  : actionLabel ?? "This negotiation is not ready to be accepted yet."}
              </p>
              {isNegotiating ? (
                <button
                  type="button"
                  className="relative mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  Talk to {agent?.type === "Airline" ? "Airline" : "Hotel"} Rep
                </button>
              ) : canAccept && event && agent ? (
                <button
                  type="button"
                  onClick={() => acceptOffer(event.id, agent.negotiationId)}
                  className="relative mt-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white py-4 text-sm font-black text-primary-container transition-colors hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-lg">check</span>
                  Accept Offer
                </button>
              ) : (
                <div className="relative mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 py-4 text-sm font-black text-slate-200">
                  <span className="material-symbols-outlined text-lg">
                    {agent?.isAccepted ? "check_circle" : agent?.status === "Cancelled" ? "cancel" : "schedule"}
                  </span>
                  {actionLabel ?? "Unavailable"}
                </div>
              )}
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
                      className={`absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${item.active ? "bg-secondary" : "bg-slate-300"
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
                  Agent Galileo • 14:02:11
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
