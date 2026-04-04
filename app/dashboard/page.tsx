import Link from "next/link";
import { MarketTrendCard } from "@/components/dashboard/MarketTrendCard";
import { RefreshDashboardButton } from "@/components/dashboard/RefreshDashboardButton";
import { getChicagoMarketIntelligence } from "@/app/actions/travel-intelligence";

export const revalidate = 60;

export const metadata = {
  title: "ORD Market Intelligence · Autonomous Procurement Inc.",
  description: "Live Chicago hotel rate intelligence powered by the Amadeus API.",
};

export default async function DashboardPage() {
  let data;
  let error: string | null = null;

  try {
    data = await getChicagoMarketIntelligence();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load market data.";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c1220",
        color: "#f1f5f9",
        fontFamily:
          '"Avenir Next", "Avenir", "Segoe UI", sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(12,18,32,0.9)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "1rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.5)",
                textDecoration: "none",
              }}
            >
              ← Back
            </Link>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>|</span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.85)",
              }}
            >
              Autonomous Procurement Inc.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.38)",
            }}
          >
            <span>ORD</span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
            <span>Market Intelligence</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "3rem 2.5rem 5rem",
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.35)",
                marginBottom: "0.75rem",
              }}
            >
              Live Intelligence · Chicago O&apos;Hare Corridor
            </p>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: "#f1f5f9",
                lineHeight: 1.05,
                marginBottom: "0.75rem",
              }}
            >
              ORD Rate Analysis
            </h1>
            <p style={{ fontSize: "0.95rem", color: "rgba(241,245,249,0.5)", lineHeight: 1.7, maxWidth: "600px" }}>
              Real-time public ADR benchmarks from the Amadeus Hotel Search API,
              shown alongside the Arbiter negotiated rate (−18.4% applied). Data
              refreshes every 60 seconds.
            </p>
          </div>
          <div style={{ marginLeft: "2rem" }}>
            <RefreshDashboardButton />
          </div>
        </div>

        {/* Card or error */}
        {error ? (
          <div
            style={{
              background: "#111827",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "1.5rem",
              padding: "2rem",
              color: "rgba(241,245,249,0.65)",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(239,68,68,0.7)",
                marginBottom: "0.75rem",
              }}
            >
              Data Sync Error
            </p>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7 }}>{error}</p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(241,245,249,0.35)",
                marginTop: "1rem",
              }}
            >
              Set{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.07)",
                  padding: "0.1em 0.4em",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                AMADEUS_CLIENT_ID
              </code>{" "}
              and{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.07)",
                  padding: "0.1em 0.4em",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                }}
              >
                AMADEUS_CLIENT_SECRET
              </code>{" "}
              in your environment to activate live market sync.
            </p>
          </div>
        ) : data ? (
          <MarketTrendCard data={data} />
        ) : null}
      </main>
    </div>
  );
}
