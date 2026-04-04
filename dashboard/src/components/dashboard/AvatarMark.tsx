export function AvatarMark({
  label,
  className = "",
  size = "default",
}: {
  label: string;
  className?: string;
  size?: "default" | "large" | "xl";
}) {
  const sizeClasses =
    size === "xl"
      ? "h-32 w-32 rounded-3xl text-4xl"
      : size === "large"
        ? "h-14 w-14 rounded-xl text-2xl"
        : "h-10 w-10 rounded-lg text-lg";

  return (
    <div
      className={`flex items-center justify-center bg-white font-black text-secondary shadow-sm ${sizeClasses} ${className}`.trim()}
    >
      {label}
    </div>
  );
}
