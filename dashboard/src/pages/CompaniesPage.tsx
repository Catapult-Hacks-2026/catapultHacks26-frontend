import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { companyCards } from "@/lib/dashboard-data";

export default function CompaniesPage() {
  const [query, setQuery] = useState("");

  const filtered = companyCards.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <AnimateIn>
        <div className="flex flex-col gap-8">
          <header className="space-y-3">
            <h1 className="text-4xl font-black leading-none tracking-tight text-on-surface sm:text-5xl lg:text-[3.5rem]">
              Companies
            </h1>
            <p className="text-lg text-on-surface-variant">
              Curated directory of autonomous procurement partners and global chains.
            </p>
          </header>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search companies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl bg-surface-container-low py-3 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filtered.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="group rounded-xl border border-transparent bg-surface-container-lowest p-8 transition-all duration-500 hover:border-surface-container-highest hover:shadow-ambient"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <AvatarMark
                      label={company.initials}
                      size="large"
                      className="border border-surface-container bg-slate-50"
                    />
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-on-surface">
                        {company.name}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          hotel
                        </span>
                        {company.type}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">
                    more_vert
                  </span>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Total Savings Realized
                  </p>
                  <div className="mt-3">
                    <p className="text-4xl font-black tracking-tight text-on-tertiary-container">
                      {company.totalSavings}
                    </p>
                  </div>
                </div>

                <div className="border-t border-surface-container pt-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                      Total Bookings
                    </p>
                    <p className="mt-2 text-lg font-bold text-on-surface">
                      {company.bookings}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant">
              No companies match "{query}"
            </p>
          )}
        </div>
      </AnimateIn>
    </div>
  );
}
