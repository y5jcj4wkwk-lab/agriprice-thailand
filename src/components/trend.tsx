import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatPct } from "@/lib/format";
import type { TrendDirection } from "@/lib/types";
import { cn } from "@/lib/utils";

export function toneFromChange(changePct: number | null): TrendDirection {
  if (changePct == null) return "stable";
  if (changePct > 0.15) return "up";
  if (changePct < -0.15) return "down";
  return "stable";
}

export function TrendIcon({
  direction,
  className,
}: {
  direction: TrendDirection;
  className?: string;
}) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  return <Icon className={cn("size-4", className)} strokeWidth={2.2} />;
}

export function ChangeBadge({
  value,
  className,
}: {
  value: number | null;
  className?: string;
}) {
  if (value == null) {
    return <span className={cn("text-xs text-faint", className)}>—</span>;
  }
  const tone = toneFromChange(value);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium tabular",
        tone === "up" && "text-up",
        tone === "down" && "text-down",
        tone === "stable" && "text-muted",
        className,
      )}
    >
      <TrendIcon direction={tone} className="size-3.5" />
      {formatPct(value)}
    </span>
  );
}
