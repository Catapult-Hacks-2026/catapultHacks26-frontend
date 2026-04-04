import { Link, useLocation } from "react-router-dom";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: "grid_view" },
  { href: "/all-agents", label: "Agents", icon: "smart_toy" },
  { href: "/market-insights", label: "Market Insights", icon: "bar_chart" },
  { href: "/companies", label: "Companies", icon: "domain" },
];

const utilityNav = [
  { href: "/settings", label: "Settings", icon: "settings" },
  { href: "/support", label: "Support", icon: "help_outline" },
];

function matches(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SideNav() {
  const { pathname } = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-outline-variant/20 bg-white py-5"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Wordmark */}
      <div className="px-5 pb-2">
        <Link to="/" className="inline-block">
          <span className="text-[32px] font-semibold tracking-tight text-on-surface">
            Galileo
          </span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 px-3">

        {primaryNav.map((item) => {
          const active = matches(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-2.5 rounded-md px-2 py-2 text-[13.5px] transition-colors ${active
                ? "bg-surface-container font-medium text-on-surface"
                : "font-normal text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
            >
              <span
                className="material-symbols-outlined text-[18px] leading-none"
                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Utility nav + CTA */}
      <div className="space-y-0.5 border-t border-outline-variant/20 px-3 pt-4">
        {utilityNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-[13.5px] font-normal text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}

        <div className="pt-3">
          <Link
            to="/negotiations/configure"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-secondary-container"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">add</span>
            Launch Negotiations
          </Link>
        </div>
      </div>
    </aside>
  );
}
