import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  tone = "neutral",
}: {
  data: number[];
  className?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const w = 112;
  const h = 36;
  const pad = 2;
  if (data.length < 2) {
    return <div className={cn("h-9 w-28", className)} />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = `M${pts.join(" L")}`;
  const area = `M${pad},${h - pad} L${pts.join(" L")} L${w - pad},${h - pad} Z`;
  const stroke =
    tone === "up" ? "var(--color-up)" : tone === "down" ? "var(--color-down)" : "var(--color-muted)";
  const fill =
    tone === "up"
      ? "color-mix(in oklab, var(--color-up) 18%, transparent)"
      : tone === "down"
        ? "color-mix(in oklab, var(--color-down) 16%, transparent)"
        : "color-mix(in oklab, var(--color-muted) 14%, transparent)";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-9 w-28 overflow-visible", className)}
      aria-hidden="true"
    >
      <path d={area} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
