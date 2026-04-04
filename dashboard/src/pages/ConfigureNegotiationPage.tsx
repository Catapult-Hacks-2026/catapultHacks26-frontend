import { useState } from "react";
import { Link } from "react-router-dom";

const serviceTypes = [
  { id: "Hotel", icon: "hotel" },
];

export default function ConfigureNegotiationPage() {
  const [service, setService] = useState("Hotel");

  return (
    <div className="-mt-16 min-h-screen bg-surface lg:mt-0" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-outline-variant/20 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-10 lg:py-5">
        <h1 className="text-3xl font-semibold tracking-tight text-on-surface">
          New Negotiation
        </h1>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="space-y-4">

          {/* Row 1: Event Name + Service Type */}
          <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto]">
            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Event Name</span>
                <input
                  type="text"
                  placeholder="e.g. Q3 Sales Kickoff, Annual Leadership Retreat"
                  className="mt-2 w-full rounded-lg bg-surface-container-low px-3 py-3 text-[15px] text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                />
              </label>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Service</p>
              <div className="mt-2 flex gap-2">
                {serviceTypes.map(({ id, icon }) => {
                  const selected = service === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setService(id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        selected
                          ? "border-secondary bg-secondary/5 text-secondary"
                          : "border-outline-variant/30 bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}>
                        {icon}
                      </span>
                      {id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2: Dates + Location */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Start Date</span>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline">calendar_today</span>
                  <input
                    type="date"
                    className="w-full rounded-lg bg-surface-container-low py-3 pl-9 pr-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">End Date</span>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline">calendar_today</span>
                  <input
                    type="date"
                    className="w-full rounded-lg bg-surface-container-low py-3 pl-9 pr-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Location</span>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline">location_on</span>
                  <input
                    type="text"
                    placeholder="City or airport code"
                    className="w-full rounded-lg bg-surface-container-low py-3 pl-9 pr-3 text-sm text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Row 3: Attendees + Requirements */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr]">
            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Attendees</span>
                <input
                  type="number"
                  placeholder="120"
                  className="mt-2 w-full rounded-lg bg-surface-container-low px-3 py-3 text-[15px] text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                />
              </label>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-white px-6 py-5">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Specific Requirements</span>
                <input
                  type="text"
                  placeholder="Room types, meal plans, AV, baggage handling..."
                  className="mt-2 w-full rounded-lg bg-surface-container-low px-3 py-3 text-[15px] text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/30"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="text-sm text-on-surface-variant hover:text-on-surface">
              Cancel
            </Link>
            <Link
              to={`/negotiations/setup?service=${service}`}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-container"
            >
              Review & Launch
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
