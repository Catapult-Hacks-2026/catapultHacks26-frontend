import type { ReactNode } from "react";

type ChipVariant = "success" | "negotiating" | "neutral" | "error";

const styles: Record<ChipVariant, string> = {
  success:
    "bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-3 py-1 rounded-full",
  negotiating:
    "bg-secondary-fixed text-on-secondary-fixed text-xs font-bold px-3 py-1 rounded-full",
  neutral:
    "bg-surface-container-high text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full",
  error:
    "bg-error-container text-error text-xs font-bold px-3 py-1 rounded-full",
};

export function Chip({
  children,
  className = "",
  variant,
}: {
  children: ReactNode;
  className?: string;
  variant: ChipVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap ${styles[variant]} ${className}`.trim()}
    >
      {variant === "negotiating" ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
