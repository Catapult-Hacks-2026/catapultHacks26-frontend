import { useState } from "react";

export type DataPointType = "offer" | "negotiated" | "current" | "final";

export interface PricePoint {
  label: string;
  price: number;
  type: DataPointType;
}

interface Props {
  points: PricePoint[];
  marketPrice: number;
  targetPrice: number;
}

const COLORS: Record<DataPointType, string> = {
  offer: "#f97316",
  negotiated: "#3b82f6",
  current: "#0f9f6e",
  final: "#16a34a",
};

const PAD_L = 52;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 28;
const VW = 700;
const VH = 300;
const CW = VW - PAD_L - PAD_R;
const CH = VH - PAD_T - PAD_B;

export function NegotiationPricePath({ points, marketPrice, targetPrice }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const allPrices = [marketPrice, targetPrice, ...points.map((p) => p.price)];
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const spread = rawMax - rawMin || 50;
  const displayMin = rawMin - spread * 0.2;
  const displayMax = rawMax + spread * 0.2;

  const py = (price: number) =>
    PAD_T + ((displayMax - price) / (displayMax - displayMin)) * CH;

  const px = (i: number) =>
    points.length <= 1
      ? PAD_L + CW / 2
      : PAD_L + (i / (points.length - 1)) * CW;

  const marketY = py(marketPrice);
  const targetY = py(targetPrice);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(p.price).toFixed(1)}`)
    .join(" ");

  // Area fill under the line
  const areaPath = points.length > 1
    ? `${linePath} L ${px(points.length - 1).toFixed(1)} ${(VH - PAD_B).toFixed(1)} L ${px(0).toFixed(1)} ${(VH - PAD_B).toFixed(1)} Z`
    : "";

  // Y-axis tick values
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    displayMin + ((displayMax - displayMin) * i) / tickCount
  ).reverse();

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Supplier offer
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Negotiated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-600" />
          Final
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-px w-5 bg-slate-300" />
          Market
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="6" className="overflow-visible">
            <line x1="0" y1="3" x2="20" y2="3" stroke="#0f9f6e" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
          Target
        </span>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-72 w-full"
        aria-label="Negotiation Price Path"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines + Y-axis labels */}
        {ticks.map((tick) => {
          const y = py(tick);
          return (
            <g key={tick}>
              <line
                x1={PAD_L}
                y1={y}
                x2={VW - PAD_R}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD_L - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#94a3b8"
                fontWeight="500"
              >
                ${Math.round(tick)}
              </text>
            </g>
          );
        })}

        {/* Market price line */}
        <line
          x1={PAD_L}
          y1={marketY}
          x2={VW - PAD_R}
          y2={marketY}
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <text
          x={VW - PAD_R - 4}
          y={marketY - 5}
          textAnchor="end"
          fontSize="9.5"
          fill="#94a3b8"
          fontWeight="600"
          letterSpacing="0.02em"
        >
          MARKET ${marketPrice}
        </text>

        {/* Target price line */}
        <line
          x1={PAD_L}
          y1={targetY}
          x2={VW - PAD_R}
          y2={targetY}
          stroke="#0f9f6e"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          opacity="0.5"
        />
        <text
          x={VW - PAD_R - 4}
          y={targetY - 5}
          textAnchor="end"
          fontSize="9.5"
          fill="#0f9f6e"
          fontWeight="600"
          letterSpacing="0.02em"
        >
          TARGET ${targetPrice}
        </text>

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="url(#area-fill)" />
        )}

        {/* Connecting line */}
        {points.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points */}
        {points.length === 0 ? (
          <g>
            <circle cx={PAD_L} cy={marketY} r={6} fill="#cbd5e1" />
            <circle cx={PAD_L} cy={marketY} r={2.5} fill="white" />
            <text
              x={PAD_L}
              y={VH - 6}
              textAnchor="middle"
              fontSize="9.5"
              fill="#94a3b8"
              fontWeight="500"
            >
              Start
            </text>
          </g>
        ) : points.map((point, i) => {
          const x = px(i);
          const y = py(point.price);
          const color = COLORS[point.type];
          const isHov = hovered === i;
          const ttW = 72;
          const ttX = Math.max(PAD_L + ttW / 2, Math.min(x, VW - PAD_R - ttW / 2));

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Hover halo */}
              {isHov && <circle cx={x} cy={y} r={14} fill={color} opacity="0.12" />}

              {/* Dot */}
              <circle cx={x} cy={y} r={5} fill={color} />
              <circle cx={x} cy={y} r={2} fill="white" />

              {/* Tooltip */}
              {isHov && (
                <g>
                  <rect x={ttX - ttW / 2} y={y - 44} width={ttW} height={32} rx={5} fill="#0f172a" />
                  <text x={ttX} y={y - 30} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="500">
                    {point.label}
                  </text>
                  <text x={ttX} y={y - 17} textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
                    ${point.price}
                  </text>
                </g>
              )}

              {/* X-axis label */}
              <text
                x={x}
                y={VH - 6}
                textAnchor="middle"
                fontSize="9.5"
                fill="#94a3b8"
                fontWeight="500"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
