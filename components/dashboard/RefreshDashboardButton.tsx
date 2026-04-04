"use client";

import { useTransition } from "react";
import { refreshDashboard } from "@/app/actions/dashboard-actions";

export function RefreshDashboardButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await refreshDashboard();
        });
      }}
      disabled={isPending}
      style={{
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {isPending ? "Refreshing..." : "Refresh Live Data"}
    </button>
  );
}