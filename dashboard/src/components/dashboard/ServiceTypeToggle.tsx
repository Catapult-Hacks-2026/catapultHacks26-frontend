import { useState } from "react";

const options = [
  { id: "hotel", label: "Hotel", icon: "hotel" },
  { id: "airline", label: "Airline", icon: "flight" },
] as const;

export function ServiceTypeToggle() {
  const [active, setActive] = useState<(typeof options)[number]["id"]>("hotel");

  return (
    <div className="rounded-xl bg-surface-container-low p-1">
      <div className="flex gap-2">
        {options.map((option) => {
          const selected = option.id === active;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActive(option.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm transition-colors ${
                selected
                  ? "bg-white font-bold text-secondary shadow-sm"
                  : "text-on-primary-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{option.icon}</span>
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
