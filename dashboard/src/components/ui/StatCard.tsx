import type { ReactNode } from "react";

export function StatCard({
  eyebrow,
  value,
  detail,
  className = "",
}: {
  eyebrow: string;
  value: ReactNode;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl bg-surface-container-low p-6 ${className}`.trim()}>
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
        {eyebrow}
      </p>
      <div className="mt-3 text-4xl font-black tracking-tight text-on-surface">
        {value}
      </div>
      {detail ? (
        <div className="mt-3 text-sm text-on-surface-variant">{detail}</div>
      ) : null}
    </div>
  );
}
