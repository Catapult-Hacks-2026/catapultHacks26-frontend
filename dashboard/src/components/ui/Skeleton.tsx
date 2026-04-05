export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-surface-container-high/70 ${className}`.trim()}
    />
  );
}
