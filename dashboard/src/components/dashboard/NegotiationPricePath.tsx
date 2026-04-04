import { useState } from "react";

export type DataPointType = "offer" | "negotiated" | "current";

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
  current: "#22c55e",
};

const PAD_L = 60;
const PAD_R = 24;
const PAD_T = 32;
const PAD_B = 36;
const VW = 640;
const VH = 256;
const CW = VW - PAD_L - PAD_R;
const CH = VH - PAD_T - PAD_B;

export function NegotiationPricePath({ points, marketPrice, targetPrice }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const allPrices = [marketPrice, targetPrice, ...points.map((p) => p.price)];
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const spread = rawMax - rawMin || 50;
  const displayMin = rawMin - spread * 0.18;
  const displayMax = rawMax + spread * 0.18;

  const py = (price: number) =>
    PAD_T + ((displayMax - price) / (displayMax - displayMin)) * CH;

  const px = (i: number) =>
    points.length <= 1
      ? PAD_L + CW / 2
      : PAD_L + (i / (points.length - 1)) * CW;

  const marketY = py(marketPrice);
  const targetY = py(targetPrice);

  const linePath = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(p.price).toFixed(1)}`,
    )
    .join(" ");

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-5 text-[11px] font-semibold text-on-surface-variant">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          Supplier Offer
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Negotiated Price
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          Current Price
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-block h-px w-6 bg-slate-400" />
          Market Price
        </span>
        <span className="flex items-center gap-2">
          <svg width="24" height="8" className="overflow-visible">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </svg>
          Target Price
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="h-60 w-full"
        aria-label="Negotiation Price Path"
      >
        <line
          x1={PAD_L}
          y1={marketY}
          x2={VW - PAD_R}
          y2={marketY}
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <rect
          x={PAD_L + 4}
          y={marketY - 11}
          width={90}
          height={14}
          rx={7}
          fill="white"
        />
        <text
          x={PAD_L + 9}
          y={marketY + 1.5}
          fontSize="9"
          fontWeight="700"
          fill="#64748b"
        >
          ${marketPrice} MARKET
        </text>

        <line
          x1={PAD_L}
          y1={targetY}
          x2={VW - PAD_R}
          y2={targetY}
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          opacity="0.65"
        />
        <rect
          x={PAD_L + 4}
          y={targetY - 11}
          width={76}
          height={14}
          rx={7}
          fill="#dcfce7"
        />
        <text
          x={PAD_L + 9}
          y={targetY + 1.5}
          fontSize="9"
          fontWeight="700"
          fill="#15803d"
        >
          ${targetPrice} TARGET
        </text>

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

        {points.map((point, i) => {
          const x = px(i);
          const y = py(point.price);
          const color = COLORS[point.type];
          const isHov = hovered === i;
          const ttX = Math.max(PAD_L + 38, Math.min(x, VW - PAD_R - 38));

          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {isHov && (
                <circle cx={x} cy={y} r={13} fill={color} opacity="0.15" />
              )}
              <circle cx={x} cy={y} r={6} fill={color} />
              <circle cx={x} cy={y} r={2.5} fill="white" />

              {isHov && (
                <g>
                  <rect
                    x={ttX - 36}
                    y={y - 40}
                    width={72}
                    height={30}
                    rx={6}
                    fill="#1e293b"
                  />
                  <text
                    x={ttX}
                    y={y - 27}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#94a3b8"
                    fontWeight="600"
                  >
                    {point.label}
                  </text>
                  <text
                    x={ttX}
                    y={y - 14}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    fontWeight="800"
                  >
                    ${point.price}
                  </text>
                </g>
              )}

              <text
                x={x}
                y={VH - 4}
                textAnchor="middle"
                fontSize="8"
                fill="#94a3b8"
                fontWeight="600"
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
