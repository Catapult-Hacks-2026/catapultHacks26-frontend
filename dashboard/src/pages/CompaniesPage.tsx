import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/dashboard/AnimateIn";
import { AvatarMark } from "@/components/dashboard/AvatarMark";
import { companyCards } from "@/lib/dashboard-data";

const savingsFilters = [
  { label: "Over $1M", checked: false },
  { label: "$500k-$1M", checked: true },
  { label: "Under $500k", checked: false },
];

const industries = ["Hospitality", "Aviation", "Logistics", "SaaS"];

const regionOptions = ["North America", "EMEA", "APAC", "Global"];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen p-8">
      <AnimateIn>
        <div className="flex flex-col gap-8">
          <header className="space-y-3">
            <h1 className="text-[3.5rem] font-black leading-none tracking-tight text-on-surface">
              Companies
            </h1>
            <p className="text-lg text-on-surface-variant">
              Curated directory of autonomous procurement partners and global
              chains.
            </p>
          </header>

          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-3 space-y-6 rounded-xl bg-surface-container-low p-6">
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Total Savings
                </h2>
                <div className="mt-4 space-y-4">
                  {savingsFilters.map((item) => (
                    <label key={item.label} className="flex items-center gap-3 text-sm text-on-surface">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                          item.checked
                            ? "border-secondary bg-secondary text-white"
                            : "border-outline-variant hover:border-secondary"
                        }`}
                      >
                        {item.checked ? (
                          <span className="material-symbols-outlined text-sm">check</span>
                        ) : null}
                      </span>
                      {item.label}
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Industry
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {industries.map((industry, index) => (
                    <span
                      key={industry}
                      className={`rounded-full px-4 py-2 text-sm ${
                        index === 0
                          ? "bg-secondary text-white"
                          : "cursor-pointer bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Region
                </h2>
                <select className="mt-4 w-full rounded-lg border-none bg-surface-container-lowest p-3 text-sm text-on-surface outline-none ring-0 focus:ring-2 focus:ring-secondary/20">
                  {regionOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </section>

              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                  Supplier Rating
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-secondary">
                    {[0, 1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="material-symbols-outlined">star</span>
                  </div>
                  <span className="text-sm text-on-surface-variant">4.0+</span>
                </div>
              </section>
            </aside>

            <section className="col-span-9">
              <div className="grid grid-cols-2 gap-6">
                {companyCards.map((company) => (
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
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${company.badgeClassName}`}
                          >
                            {company.badge}
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
                      <div className="mt-3 flex items-center gap-3">
                        <p className="text-4xl font-black tracking-tight text-on-tertiary-container">
                          {company.totalSavings}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            company.positive
                              ? "bg-tertiary-fixed text-on-tertiary-container"
                              : "bg-error-container text-error"
                          }`}
                        >
                          {company.yoy}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-surface-container pt-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">
                          Avg Delta
                        </p>
                        <p className="mt-2 text-lg font-bold text-on-surface">
                          {company.avgDelta}
                        </p>
                      </div>
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

              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-on-surface-variant">
                  Showing 4 of 128 suppliers
                </p>
                <button className="inline-flex items-center gap-2 rounded-full bg-surface-container-highest px-6 py-3 font-bold text-on-surface transition-colors hover:bg-surface-container">
                  <span className="material-symbols-outlined">expand_more</span>
                  Load More Suppliers
                </button>
              </div>
            </section>
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}
