import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useNegotiationPricing } from "@/hooks/useNegotiationPricing";
import { useLaunchNegotiation } from "@/hooks/useNegotiations";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function MarketCard({
  isLoading,
  label,
  market,
  predicted,
  unit,
}: {
  isLoading: boolean;
  label: string;
  market?: string;
  predicted?: string;
  unit: string;
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-white px-8 py-6">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Market Analysis</p>
          <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">{label}</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-44 sm:h-20 sm:w-56" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-16 w-40 sm:h-20 sm:w-52" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white px-8 py-6">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Market Analysis</p>
        <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">{label}</span>
      </div>
      <div className="mt-4 grid grid-cols-1 items-end gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <p className="text-xs text-on-surface-variant">Expected Market Price</p>
          <p className="mt-1.5 text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
            {market ?? "$0"}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">{unit}</p>
        </div>
        <div>
          <span className="inline-block rounded-full bg-tertiary-fixed px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-tertiary-fixed">
            Predicted Win
          </span>
          <p className="mt-1.5 text-5xl font-black tracking-tight text-on-surface sm:text-6xl">
            {predicted ?? "$0"}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">{unit}</p>
        </div>
      </div>
    </div>
  );
}

export default function NegotiationShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventName = searchParams.get("eventName") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const location = searchParams.get("location") ?? "";
  const attendees = Number.parseInt(searchParams.get("attendees") ?? "", 10);
  const requirements = searchParams.get("requirements") ?? "";
  const service = searchParams.get("service") ?? "Hotel";

  const [idealPrice, setIdealPrice] = useState("");
  const [ceilingPrice, setCeilingPrice] = useState("");

  const pricingPayload =
    startDate && endDate && location && Number.isFinite(attendees) && attendees > 0
      ? {
          service,
          attendees,
          endDate,
          location,
          startDate,
        }
      : null;

  const { data, isLoading } = useNegotiationPricing(pricingPayload);
  const launch = useLaunchNegotiation();

  const parsedIdeal = Number.parseFloat(idealPrice);
  const parsedCeiling = Number.parseFloat(ceilingPrice);
  const canLaunch = Number.isFinite(parsedIdeal) && parsedIdeal > 0
    && Number.isFinite(parsedCeiling) && parsedCeiling > 0;

  const handleLaunch = () => {
    if (!canLaunch) return;
    void launch.mutateAsync({
      eventName,
      service,
      startDate,
      endDate,
      location,
      attendees,
      idealPrice: parsedIdeal,
      ceilingPrice: parsedCeiling,
      requirements,
      guardrails: {
        hotel: { idealPrice: parsedIdeal, ceilingPrice: parsedCeiling },
      },
    }).then((event) => {
      const firstAgent = event.agents?.find(
        (a) => a.status === "Negotiating",
      );
      if (firstAgent) {
        navigate(`/negotiations/${firstAgent.id}/agent`);
      } else {
        navigate(`/events/${event.id}`);
      }
    }).catch(() => {});
  };

  return (
    <div className="-mt-16 min-h-screen bg-surface lg:mt-0" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="sticky top-0 z-30 border-b border-outline-variant/20 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10 lg:py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">
          Set Price Guardrails
        </h1>
      </div>

      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">

        <MarketCard
          isLoading={isLoading}
          label={service}
          market={data?.market}
          predicted={data?.predicted}
          unit={data?.unit ?? "per night"}
        />

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
                  value={idealPrice}
                  onChange={(e) => setIdealPrice(e.target.value)}
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
                  value={ceilingPrice}
                  onChange={(e) => setCeilingPrice(e.target.value)}
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
          <button
            type="button"
            onClick={handleLaunch}
            disabled={launch.isPending || !canLaunch}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-container disabled:opacity-50"
          >
            {launch.isPending ? "Launching..." : "Launch Negotiations"}
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
