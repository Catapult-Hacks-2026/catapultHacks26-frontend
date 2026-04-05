import { Link, useLocation } from "react-router-dom";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: "grid_view" },
  { href: "/events", label: "Events", icon: "event" },
  { href: "/all-agents", label: "Agents", icon: "smart_toy" },
  { href: "/event-timing", label: "Event Timing", icon: "bar_chart" },
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

type SideNavProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SideNav({ collapsed, onToggle }: SideNavProps) {
  const { pathname } = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-outline-variant/20 bg-white py-5 transition-all duration-200 ${
        collapsed ? "w-20 translate-x-0" : "w-72 translate-x-0 lg:w-60"
      }`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Wordmark */}
      <div className={collapsed ? "flex flex-col items-center gap-2 px-2 pb-4" : "flex items-center justify-between px-5 pb-2"}>
        <Link to="/" className="inline-flex items-center gap-2.5">
          <img src="/Galileo.png" alt="Galileo" className={collapsed ? "h-7 w-7" : "h-8 w-8"} />
          {!collapsed && (
            <span className="text-[32px] font-semibold tracking-tight text-on-surface">
              Galileo
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">
            {collapsed ? "right_panel_open" : "left_panel_close"}
          </span>
        </button>
      </div>

      {/* Primary nav */}
      <nav className={`flex-1 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>

        {primaryNav.map((item) => {
          const active = matches(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex rounded-md py-2 text-[13.5px] transition-colors ${collapsed ? "justify-center px-2" : "items-center gap-2.5 px-2"} ${active
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
              {collapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>

      {/* Utility nav + CTA */}
      <div className={`space-y-0.5 border-t border-outline-variant/20 pt-4 ${collapsed ? "px-2" : "px-3"}`}>
        {utilityNav.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={collapsed ? item.label : undefined}
            className={`flex rounded-md py-2 text-[13.5px] font-normal text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface ${collapsed ? "justify-center px-2" : "items-center gap-2.5 px-2"}`}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              {item.icon}
            </span>
            {collapsed ? null : item.label}
          </Link>
        ))}

        <div className="pt-3">
          <Link
            to="/negotiations/configure"
            title={collapsed ? "Launch Negotiations" : undefined}
            className={`flex w-full items-center justify-center rounded-md bg-secondary py-2 text-[13px] font-medium text-white transition-colors hover:bg-secondary-container ${collapsed ? "px-2" : "gap-2 px-3"}`}
          >
            <span className="material-symbols-outlined text-[16px] leading-none">add</span>
            {collapsed ? null : "Launch Negotiations"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
