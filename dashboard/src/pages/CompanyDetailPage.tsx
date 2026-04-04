import { useParams } from "react-router-dom";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { Chip } from "@/components/ui/Chip";
import { getSupplierProfile, supplierNegotiations } from "@/lib/dashboard-data";

export default function CompanyDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const profile = getSupplierProfile(id);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <section className="grid grid-cols-12 items-end gap-8">
        <div className="col-span-8 flex gap-8">
          <div className="relative">
            <AvatarMark
              label={profile.initials}
              size="xl"
              className="bg-primary-container text-4xl text-secondary"
            />
            <div className="absolute -bottom-2 -right-2 rounded-lg bg-tertiary-fixed-dim p-1.5 text-on-tertiary-fixed">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>

          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
              {profile.displayName}
            </h1>
            <span className="inline-flex rounded-full bg-surface-container-highest px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary">
              Preferred Tier I
            </span>
            <p className="text-sm leading-7 text-on-surface-variant">
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="font-medium text-secondary">{profile.phone}</span>
              <span className="text-on-surface-variant">{profile.website}</span>
              <span className="text-on-surface-variant">{profile.location}</span>
            </div>
          </div>
        </div>

        <div className="col-span-4 rounded-3xl bg-surface-container-low p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
            Total Lifetime Savings
          </p>
          <div className="mt-4 text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface">
            $1.2M
          </div>
          <div className="mt-4 flex items-center gap-2 text-on-tertiary-container">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              trending_up
            </span>
            <span className="font-bold">+14%</span>
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">
            Negotiated across 14 master service agreements.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-[400px] rounded-3xl bg-surface-container-lowest p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Pricing Trends</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Historical booking movement across negotiated room blocks.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-surface-container px-4 py-2 text-sm text-on-surface-variant">
                1Y
              </button>
              <button className="rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white">
                ALL
              </button>
            </div>
          </div>

          <div className="relative mt-8">
            <svg viewBox="0 0 800 200" className="h-[220px] w-full">
              <defs>
                <linearGradient id="pricing-fill" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f9f6e" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0f9f6e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradient-line" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0f9f6e" />
                  <stop offset="100%" stopColor="#0b7a58" />
                </linearGradient>
              </defs>
              <path
                d="M0 150 Q 100 130 200 160 T 400 80 T 600 110 T 800 40 L800 200 L0 200 Z"
                fill="url(#pricing-fill)"
              />
              <path
                d="M0 150 Q 100 130 200 160 T 400 80 T 600 110 T 800 40"
                fill="none"
                stroke="url(#gradient-line)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="400" cy="80" r="18" fill="#0f9f6e" opacity="0.2" />
              <circle cx="400" cy="80" r="7" fill="#0f9f6e" />
            </svg>
            <div className="glass-panel absolute left-1/2 top-16 -translate-x-1/2 rounded-xl border border-white p-3 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-on-primary-container">
                Current Avg
              </p>
              <p className="mt-1 text-sm font-bold text-on-surface">$485 / night avg</p>
            </div>
            <div className="mt-4 grid grid-cols-6 text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
              {["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container-high p-8">
          <h2 className="text-2xl font-bold text-on-surface">Booking Window Heatmap</h2>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
              "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
            ].map((month) => {
              const best = ["FEB", "JUL", "DEC"].includes(month);
              const mid = ["MAR", "JUN", "SEP"].includes(month);

              return (
                <div
                  key={month}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-bold ${
                    best
                      ? "bg-tertiary-fixed-dim text-on-tertiary-fixed"
                      : mid
                        ? "bg-secondary-fixed text-on-secondary-fixed opacity-70"
                        : "bg-surface-container-lowest text-on-surface-variant opacity-40"
                  }`}
                >
                  {best ? (
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ) : null}
                  {month}
                </div>
              );
            })}
          </div>
          <div className="mt-6 space-y-3 text-sm text-on-surface-variant">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-tertiary-fixed-dim" />
              Best Deal
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-surface-container-lowest" />
              Peak Price
            </div>
          </div>
        </div>

        <div className="col-span-3 rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-8">
          <div className="overflow-hidden">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
                  <th>Contract ID</th>
                  <th>Focus Region</th>
                  <th>Duration</th>
                  <th>Negotiated Rate</th>
                  <th>Net Savings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {supplierNegotiations.map((row) => (
                  <tr key={row.contractId} className="hover:bg-surface-container-low">
                    <td className="rounded-l-2xl bg-surface-container-low px-4 py-4 font-bold text-on-surface">
                      {row.contractId}
                    </td>
                    <td className="bg-surface-container-low px-4 py-4">
                      <div className="flex items-center gap-3 text-on-surface">
                        <span className="material-symbols-outlined text-base text-on-surface-variant">
                          {row.icon}
                        </span>
                        {row.region}
                      </div>
                    </td>
                    <td className="bg-surface-container-low px-4 py-4 text-on-surface-variant">
                      {row.duration}
                    </td>
                    <td className="bg-surface-container-low px-4 py-4 font-medium text-on-surface">
                      {row.rate}
                    </td>
                    <td className="bg-surface-container-low px-4 py-4 font-bold text-on-tertiary-container">
                      {row.savings}
                    </td>
                    <td className="rounded-r-2xl bg-surface-container-low px-4 py-4">
                      <Chip variant={row.status === "ACTIVE" ? "success" : "neutral"}>
                        {row.status}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
