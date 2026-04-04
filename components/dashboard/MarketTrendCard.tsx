"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MarketIntelligenceResult, MarketDataPoint } from "@/app/actions/travel-intelligence";

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1f2937",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        fontSize: "0.75rem",
        color: "#f1f5f9",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <p
        style={{
          marginBottom: "0.5rem",
          color: "rgba(241,245,249,0.42)",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {payload
        .filter((e) => !e.name.startsWith("_"))
        .map((entry) => (
          <div
            key={entry.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1.5rem",
              marginTop: "0.25rem",
            }}
          >
            <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}</span>
            <span style={{ fontWeight: 700 }}>${entry.value.toLocaleString()}</span>
          </div>
        ))}
    </div>
  );
}

// ── Legend strip ──────────────────────────────────────────────────────────────

function LegendStrip({ publicLabel }: { publicLabel: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        justifyContent: "flex-end",
        paddingBottom: "0.75rem",
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(241,245,249,0.4)",
        fontWeight: 600,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="20" height="2" style={{ overflow: "visible" }}>
          <line x1="0" y1="1" x2="20" y2="1" stroke="#4b5563" strokeWidth="2" strokeDasharray="4 3" />
        </svg>
        {publicLabel}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="20" height="2">
          <line x1="0" y1="1" x2="20" y2="1" stroke="#10b981" strokeWidth="2" />
        </svg>
        Arbiter Rate
      </div>
    </div>
  );
}

// ── Reusable chart ────────────────────────────────────────────────────────────

function MarketChart({ dataPoints, publicLabel }: { dataPoints: MarketDataPoint[]; publicLabel: string }) {
  return (
    <>
      <LegendStrip publicLabel={publicLabel} />
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dataPoints} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(241,245,249,0.32)", fontSize: 10, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fill: "rgba(241,245,249,0.32)", fontSize: 10, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.07)", strokeWidth: 1 }} />
          {/* Public rate — dashed gray */}
          <Line
            type="monotone"
            dataKey="publicRate"
            name={publicLabel}
            stroke="#4b5563"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={{ r: 3, fill: "#4b5563", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#4b5563", strokeWidth: 0 }}
          />
          {/* Arbiter — glow outer pass */}
          <Line
            type="monotone"
            dataKey="arbiterRate"
            name="_glow"
            stroke="rgba(16,185,129,0.2)"
            strokeWidth={7}
            dot={false}
            activeDot={false}
            legendType="none"
          />
          {/* Arbiter — solid emerald */}
          <Line
            type="monotone"
            dataKey="arbiterRate"
            name="Arbiter Rate"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3.5, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

// ── KPI row ───────────────────────────────────────────────────────────────────

function KpiRow({
  avgPublic,
  avgArbiter,
  countLabel,
}: {
  avgPublic: number;
  avgArbiter: number;
  countLabel: string;
}) {
  const saving = avgPublic - avgArbiter;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.65rem",
        marginBottom: "1.5rem",
      }}
    >
      {[
        { label: "Public Rate", value: `$${avgPublic.toLocaleString()}`, sub: countLabel, accent: false },
        { label: "Arbiter Rate", value: `$${avgArbiter.toLocaleString()}`, sub: "−18.4% applied", accent: true },
        { label: "Avg Saving", value: `$${saving.toLocaleString()}`, sub: "per unit", accent: false },
      ].map((kpi) => (
        <div
          key={kpi.label}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "0.85rem",
            padding: "0.85rem 1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.36)",
              marginBottom: "0.45rem",
            }}
          >
            {kpi.label}
          </p>
          <p
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: kpi.accent ? "#10b981" : "#f1f5f9",
              lineHeight: 1,
            }}
          >
            {kpi.value}
          </p>
          <p style={{ fontSize: "0.65rem", color: "rgba(241,245,249,0.32)", marginTop: "0.28rem" }}>
            {kpi.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(241,245,249,0.35)",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "18px",
          height: "1px",
          background: "rgba(241,245,249,0.2)",
        }}
      />
      {children}
    </p>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export interface MarketTrendCardProps {
  data: MarketIntelligenceResult;
}

export function MarketTrendCard({ data }: MarketTrendCardProps) {
  const fetchedTime = new Date(data.fetchedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const hasStays = data.staysDataPoints.length > 0;
  const hasFlights = data.flightDataPoints.length > 0;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1.5rem",
        padding: "1.75rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inner highlight border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      {/* Card header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.35)",
              marginBottom: "0.5rem",
            }}
          >
            ORD Market Intelligence · Duffel
          </p>
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#f1f5f9",
            }}
          >
            Chicago Rate Index
          </p>
          <p style={{ fontSize: "0.73rem", color: "rgba(241,245,249,0.4)", marginTop: "0.3rem" }}>
            {data.totalProperties} properties · {data.totalFlightOffers} ORD→JFK offers · USD
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "9999px",
              padding: "0.35rem 0.85rem",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "9999px",
                background: "#10b981",
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#10b981",
              }}
            >
              Live Sync Active
            </span>
          </div>
          <span style={{ fontSize: "0.62rem", color: "rgba(241,245,249,0.28)", letterSpacing: "0.06em" }}>
            Synced {fetchedTime} · 60s revalidation
          </span>
        </div>
      </div>

      {/* Stays section */}
      {hasStays && (
        <div style={{ marginBottom: "2.5rem" }}>
          <SectionLabel>Chicago Stays · {data.totalProperties} Properties</SectionLabel>
          <KpiRow
            avgPublic={data.avgStaysPublicRate}
            avgArbiter={data.avgStaysArbiterRate}
            countLabel="avg nightly ADR"
          />
          <MarketChart dataPoints={data.staysDataPoints} publicLabel="Public ADR" />
        </div>
      )}

      {/* Divider */}
      {hasStays && hasFlights && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            marginBottom: "2rem",
          }}
        />
      )}

      {/* Flights section */}
      {hasFlights && (
        <div>
          <SectionLabel>ORD → JFK · {data.totalFlightOffers} Offers</SectionLabel>
          <KpiRow
            avgPublic={data.avgFlightPublicRate}
            avgArbiter={data.avgFlightArbiterRate}
            countLabel="avg fare"
          />
          <MarketChart dataPoints={data.flightDataPoints} publicLabel="Public Fare" />
        </div>
      )}

      {/* Empty state */}
      {!hasStays && !hasFlights && (
        <p style={{ color: "rgba(241,245,249,0.4)", fontSize: "0.875rem", textAlign: "center", padding: "3rem 0" }}>
          No market data returned. Check your DUFFEL_ACCESS_TOKEN.
        </p>
      )}
    </div>
  );
}
