"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/market-insights", label: "Market Insights", icon: "analytics" },
  { href: "/companies", label: "Companies", icon: "business" },
];

const utilityNav = [
  { href: "/settings", label: "Settings", icon: "settings" },
  { href: "/support", label: "Support", icon: "help" },
];

function matches(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-primary-container py-6 shadow-nav">
      <div className="px-6">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-white">
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-white">
              Galileo
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Autonomous Procurement
            </div>
          </div>
        </Link>
      </div>

      <nav className="mt-10 space-y-2 px-2">
        {primaryNav.map((item) => {
          const active = matches(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mx-2 flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "rounded-lg bg-secondary text-white shadow-lg shadow-secondary/20"
                  : "text-slate-400 hover:bg-[#1C263D] hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 px-4">
        {utilityNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-[#1C263D] hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <Link
          href="/negotiations/configure"
          className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-secondary px-4 py-3 font-bold text-white transition-colors hover:bg-secondary-container"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Negotiation
        </Link>
      </div>
    </aside>
  );
}
